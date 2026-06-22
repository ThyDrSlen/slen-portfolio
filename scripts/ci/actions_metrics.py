#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import json
import math
import statistics
import subprocess
import sys
from collections import defaultdict
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
FAILURE_CONCLUSIONS = {"failure", "cancelled", "timed_out", "startup_failure", "action_required"}


@dataclass
class JobMetric:
    run_id: int
    workflow: str
    branch: str
    event: str
    sha: str
    conclusion: str
    status: str
    runner_os: str
    created_at: datetime | None
    started_at: datetime | None
    completed_at: datetime | None
    duration_seconds: float
    queue_seconds: float
    rounded_minutes: int
    raw_minutes: float
    url: str


@dataclass
class PullRequestMetric:
    number: int
    title: str
    url: str
    state: str
    head_ref: str
    additions: int
    deletions: int
    changed_files: int
    commits: int

    @property
    def churn(self) -> int:
        return self.additions + self.deletions


def parse_args() -> argparse.Namespace:
    now = datetime.now(UTC)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    parser = argparse.ArgumentParser(
        description="Correlate GitHub Actions runtime with PR size and LOC churn."
    )
    parser.add_argument("--repo", help="owner/repo (defaults to current gh repo)")
    parser.add_argument(
        "--since",
        default=month_start.date().isoformat(),
        help="Inclusive UTC date YYYY-MM-DD (default: first day of current month)",
    )
    parser.add_argument(
        "--until",
        default=(now.date() + timedelta(days=1)).isoformat(),
        help="Exclusive UTC date YYYY-MM-DD (default: tomorrow UTC)",
    )
    parser.add_argument(
        "--max-runs",
        type=int,
        default=500,
        help="How many recent runs to inspect via gh run list (default: 500)",
    )
    parser.add_argument("--workflow", help="Filter to a workflow name")
    parser.add_argument("--run-id", type=int, help="Restrict to a single workflow run id")
    parser.add_argument(
        "--event",
        choices=["all", "pull_request", "push", "workflow_dispatch", "schedule"],
        default="all",
        help="Restrict runs by event type (default: all)",
    )
    parser.add_argument("--branch", help="Restrict to a branch/head ref")
    parser.add_argument("--pr", type=int, help="Restrict PR correlation output to one PR number")
    parser.add_argument(
        "--csv-prefix",
        help="Write workflow/branch/PR CSV files using this file prefix",
    )
    parser.add_argument(
        "--top-prs",
        type=int,
        default=15,
        help="How many PR rows to print in table/markdown modes (default: 15)",
    )
    parser.add_argument(
        "--format",
        choices=["table", "json", "markdown"],
        default="table",
        help="Output format (default: table)",
    )
    return parser.parse_args()


def run_gh(command: list[str]) -> str:
    result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "gh command failed")
    return result.stdout


def gh_json(command: list[str]) -> Any:
    return json.loads(run_gh(command))


def resolve_repo(explicit_repo: str | None) -> str:
    if explicit_repo:
        return explicit_repo
    payload = gh_json(["gh", "repo", "view", "--json", "nameWithOwner"])
    return payload["nameWithOwner"]


def load_run(repo: str, run_id: int) -> dict[str, Any]:
    payload = gh_json(["gh", "api", f"repos/{repo}/actions/runs/{run_id}"])
    return {
        "databaseId": payload["id"],
        "workflowName": payload.get("name") or "unknown",
        "headBranch": payload.get("head_branch") or "",
        "event": payload.get("event") or "",
        "status": payload.get("status") or "",
        "conclusion": payload.get("conclusion") or "",
        "createdAt": payload.get("created_at"),
        "updatedAt": payload.get("updated_at"),
        "headSha": payload.get("head_sha") or "",
        "url": payload.get("html_url") or payload.get("url") or "",
        "displayTitle": payload.get("display_title") or payload.get("name") or "",
    }


def parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(UTC)


def runner_os(labels: list[str]) -> str:
    joined = " ".join(labels).lower()
    if "macos" in joined:
        return "macos"
    if "windows" in joined:
        return "windows"
    if "ubuntu" in joined or "linux" in joined:
        return "linux"
    return "unknown"


def minutes_rounded(duration_seconds: float) -> int:
    if duration_seconds <= 0:
        return 0
    return math.ceil(duration_seconds / 60)


def load_runs(repo: str, args: argparse.Namespace) -> list[dict[str, Any]]:
    if args.run_id:
        run = load_run(repo, args.run_id)
        if args.workflow and run.get("workflowName") != args.workflow:
            return []
        if args.event != "all" and run.get("event") != args.event:
            return []
        if args.branch and run.get("headBranch") != args.branch:
            return []
        return [run]

    runs = gh_json(
        [
            "gh",
            "run",
            "list",
            "--repo",
            repo,
            "--limit",
            str(args.max_runs),
            "--json",
            "databaseId,workflowName,headBranch,event,status,conclusion,createdAt,updatedAt,headSha,url,displayTitle",
        ]
    )
    since = parse_dt(args.since + "T00:00:00Z")
    until = parse_dt(args.until + "T00:00:00Z")
    filtered: list[dict[str, Any]] = []
    for run in runs:
        created = parse_dt(run.get("createdAt"))
        if created is None:
            continue
        if since and created < since:
            continue
        if until and created >= until:
            continue
        if args.workflow and run.get("workflowName") != args.workflow:
            continue
        if args.event != "all" and run.get("event") != args.event:
            continue
        if args.branch and run.get("headBranch") != args.branch:
            continue
        filtered.append(run)
    return filtered


def load_jobs(repo: str, run: dict[str, Any]) -> list[JobMetric]:
    payload = gh_json(["gh", "api", f"repos/{repo}/actions/runs/{run['databaseId']}/jobs?per_page=100"])
    jobs: list[JobMetric] = []
    for job in payload.get("jobs", []):
        created = parse_dt(job.get("created_at"))
        started = parse_dt(job.get("started_at"))
        completed = parse_dt(job.get("completed_at"))
        duration = 0.0
        queue = 0.0
        if started and completed:
            duration = max(0.0, (completed - started).total_seconds())
        if created and started:
            queue = max(0.0, (started - created).total_seconds())
        jobs.append(
            JobMetric(
                run_id=run["databaseId"],
                workflow=run.get("workflowName") or "unknown",
                branch=run.get("headBranch") or "",
                event=run.get("event") or "",
                sha=run.get("headSha") or "",
                conclusion=job.get("conclusion") or "",
                status=job.get("status") or "",
                runner_os=runner_os(job.get("labels") or []),
                created_at=created,
                started_at=started,
                completed_at=completed,
                duration_seconds=duration,
                queue_seconds=queue,
                rounded_minutes=minutes_rounded(duration),
                raw_minutes=duration / 60,
                url=job.get("html_url") or run.get("url") or "",
            )
        )
    return jobs


def resolve_pr_for_sha(repo: str, sha: str, head_branch: str) -> int | None:
    pulls = gh_json(["gh", "api", f"repos/{repo}/commits/{sha}/pulls"])
    if not pulls:
        return None
    for pr in pulls:
        if pr.get("head", {}).get("ref") == head_branch:
            return pr.get("number")
    return pulls[0].get("number")


def load_pr(repo: str, pr_number: int) -> PullRequestMetric:
    pr = gh_json(["gh", "api", f"repos/{repo}/pulls/{pr_number}"])
    return PullRequestMetric(
        number=pr["number"],
        title=pr["title"],
        url=pr["html_url"],
        state=pr["state"],
        head_ref=pr["head"]["ref"],
        additions=pr.get("additions", 0),
        deletions=pr.get("deletions", 0),
        changed_files=pr.get("changed_files", 0),
        commits=pr.get("commits", 0),
    )


def failure_rate(jobs: list[JobMetric]) -> float:
    completed = [j for j in jobs if j.status == "completed"]
    if not completed:
        return 0.0
    failures = [j for j in completed if j.conclusion in FAILURE_CONCLUSIONS]
    return len(failures) / len(completed)


def median(values: list[float]) -> float:
    return statistics.median(values) if values else 0.0


def size_bucket(churn: int) -> str:
    if churn <= 50:
        return "tiny"
    if churn <= 200:
        return "small"
    if churn <= 600:
        return "medium"
    if churn <= 1200:
        return "large"
    return "xl"


def init_aggregate_row() -> dict[str, Any]:
    return {
        "name": "",
        "runs": set(),
        "jobs": 0,
        "raw_minutes": 0.0,
        "rounded_minutes": 0,
        "failed_minutes": 0,
        "queue_seconds": [],
        "durations": [],
        "failures": 0,
        "linux_jobs": 0,
        "macos_jobs": 0,
        "windows_jobs": 0,
    }


def accumulate_row(row: dict[str, Any], key_name: str, key_value: str, job: JobMetric) -> None:
    row[key_name] = key_value
    row["runs"].add(job.run_id)
    row["jobs"] += 1
    row["raw_minutes"] += job.raw_minutes
    row["rounded_minutes"] += job.rounded_minutes
    row["durations"].append(job.duration_seconds)
    row["queue_seconds"].append(job.queue_seconds)
    if job.conclusion in FAILURE_CONCLUSIONS:
        row["failures"] += 1
        row["failed_minutes"] += job.rounded_minutes
    if job.runner_os == "linux":
        row["linux_jobs"] += 1
    elif job.runner_os == "macos":
        row["macos_jobs"] += 1
    elif job.runner_os == "windows":
        row["windows_jobs"] += 1


def finalize_aggregate_table(rows: dict[str, dict[str, Any]], key_name: str) -> list[dict[str, Any]]:
    table: list[dict[str, Any]] = []
    for row in rows.values():
        table.append(
            {
                key_name: row[key_name],
                "runs": len(row["runs"]),
                "jobs": row["jobs"],
                "raw_minutes": round(row["raw_minutes"], 2),
                "rounded_minutes": row["rounded_minutes"],
                "failed_minutes": row["failed_minutes"],
                "avg_job_seconds": round(sum(row["durations"]) / row["jobs"], 2) if row["jobs"] else 0.0,
                "avg_queue_seconds": round(sum(row["queue_seconds"]) / row["jobs"], 2) if row["jobs"] else 0.0,
                "job_failure_rate": round(row["failures"] / row["jobs"], 4) if row["jobs"] else 0.0,
                "runner_mix": {
                    "linux": row["linux_jobs"],
                    "macos": row["macos_jobs"],
                    "windows": row["windows_jobs"],
                },
            }
        )
    table.sort(key=lambda item: item["rounded_minutes"], reverse=True)
    return table


def build_report(repo: str, args: argparse.Namespace) -> dict[str, Any]:
    runs = load_runs(repo, args)
    pr_cache: dict[int, PullRequestMetric] = {}
    sha_to_pr: dict[str, int | None] = {}
    jobs: list[JobMetric] = []

    for run in runs:
        jobs.extend(load_jobs(repo, run))
        sha = run.get("headSha") or ""
        if sha and sha not in sha_to_pr and run.get("event") == "pull_request":
            sha_to_pr[sha] = resolve_pr_for_sha(repo, sha, run.get("headBranch") or "")

    completed_jobs = [job for job in jobs if job.completed_at is not None]

    pr_rows: dict[int, dict[str, Any]] = {}
    workflow_rows: dict[str, dict[str, Any]] = defaultdict(init_aggregate_row)
    branch_rows: dict[str, dict[str, Any]] = defaultdict(lambda: {**init_aggregate_row(), "branch": "", "prs": set()})

    selected_jobs: list[JobMetric] = []

    for job in completed_jobs:
        row = workflow_rows[job.workflow]
        accumulate_row(row, "workflow", job.workflow, job)

        branch_name = job.branch or "(unknown)"
        branch_row = branch_rows[branch_name]
        accumulate_row(branch_row, "branch", branch_name, job)

        pr_number = sha_to_pr.get(job.sha)
        if pr_number is not None:
            branch_row["prs"].add(pr_number)
            if pr_number not in pr_cache:
                pr_cache[pr_number] = load_pr(repo, pr_number)

        if pr_number is None or (args.pr and pr_number != args.pr):
            continue

        pr = pr_cache[pr_number]
        bucket = pr_rows.setdefault(
            pr_number,
            {
                "number": pr.number,
                "title": pr.title,
                "url": pr.url,
                "state": pr.state,
                "head_ref": pr.head_ref,
                "additions": pr.additions,
                "deletions": pr.deletions,
                "changed_files": pr.changed_files,
                "commits": pr.commits,
                "churn": pr.churn,
                "size_bucket": size_bucket(pr.churn),
                "runs": set(),
                "jobs": 0,
                "raw_minutes": 0.0,
                "rounded_minutes": 0,
                "failed_minutes": 0,
                "queue_seconds": [],
            },
        )
        bucket["runs"].add(job.run_id)
        bucket["jobs"] += 1
        bucket["raw_minutes"] += job.raw_minutes
        bucket["rounded_minutes"] += job.rounded_minutes
        bucket["queue_seconds"].append(job.queue_seconds)
        if job.conclusion in FAILURE_CONCLUSIONS:
            bucket["failed_minutes"] += job.rounded_minutes
        if args.pr and pr_number == args.pr:
            selected_jobs.append(job)

    pr_table = []
    for row in pr_rows.values():
        churn = row["churn"]
        rounded_minutes = row["rounded_minutes"]
        raw_minutes = row["raw_minutes"]
        pr_table.append(
            {
                **{k: v for k, v in row.items() if k not in {"runs", "queue_seconds"}},
                "runs": len(row["runs"]),
                "avg_queue_seconds": round(sum(row["queue_seconds"]) / row["jobs"], 2) if row["jobs"] else 0.0,
                "minutes_per_100_loc": round((rounded_minutes / max(churn, 1)) * 100, 2),
                "minutes_per_run": round(rounded_minutes / max(len(row["runs"]), 1), 2),
                "minutes_per_commit": round(rounded_minutes / max(row["commits"], 1), 2),
                "raw_minutes": round(raw_minutes, 2),
            }
        )
    pr_table.sort(key=lambda item: item["rounded_minutes"], reverse=True)

    jobs_for_summary = selected_jobs if args.pr else completed_jobs
    if args.pr:
        workflow_rows_for_summary: dict[str, dict[str, Any]] = defaultdict(init_aggregate_row)
        branch_rows_for_summary: dict[str, dict[str, Any]] = defaultdict(lambda: {**init_aggregate_row(), "branch": "", "prs": set()})
        for job in jobs_for_summary:
            row = workflow_rows_for_summary[job.workflow]
            accumulate_row(row, "workflow", job.workflow, job)
            branch_name = job.branch or "(unknown)"
            branch_row = branch_rows_for_summary[branch_name]
            accumulate_row(branch_row, "branch", branch_name, job)
            pr_number = sha_to_pr.get(job.sha)
            if pr_number is not None:
                branch_row["prs"].add(pr_number)
    else:
        workflow_rows_for_summary = workflow_rows
        branch_rows_for_summary = branch_rows

    bucket_rows = []
    for bucket_name in ["tiny", "small", "medium", "large", "xl"]:
        group = [row for row in pr_table if row["size_bucket"] == bucket_name]
        if not group:
            continue
        bucket_rows.append(
            {
                "bucket": bucket_name,
                "prs": len(group),
                "median_minutes": round(median([row["rounded_minutes"] for row in group]), 2),
                "median_minutes_per_100_loc": round(median([row["minutes_per_100_loc"] for row in group]), 2),
                "median_runs": round(median([row["runs"] for row in group]), 2),
            }
        )

    workflow_table = finalize_aggregate_table(workflow_rows_for_summary, "workflow")

    branch_table = []
    for branch_name, row in branch_rows_for_summary.items():
        pr_numbers = sorted(row["prs"])
        loc_churn = sum(pr_cache[num].churn for num in pr_numbers if num in pr_cache)
        branch_table.append(
            {
                "branch": branch_name,
                "runs": len(row["runs"]),
                "jobs": row["jobs"],
                "raw_minutes": round(row["raw_minutes"], 2),
                "rounded_minutes": row["rounded_minutes"],
                "failed_minutes": row["failed_minutes"],
                "avg_job_seconds": round(sum(row["durations"]) / row["jobs"], 2) if row["jobs"] else 0.0,
                "avg_queue_seconds": round(sum(row["queue_seconds"]) / row["jobs"], 2) if row["jobs"] else 0.0,
                "linked_prs": pr_numbers,
                "pr_count": len(pr_numbers),
                "loc_churn": loc_churn,
                "minutes_per_100_loc": round((row["rounded_minutes"] / max(loc_churn, 1)) * 100, 2) if loc_churn else None,
                "minutes_per_pr": round(row["rounded_minutes"] / max(len(pr_numbers), 1), 2),
            }
        )
    branch_table.sort(key=lambda item: item["rounded_minutes"], reverse=True)

    raw_minutes_total = round(sum(job.raw_minutes for job in jobs_for_summary), 2)
    rounded_minutes_total = sum(job.rounded_minutes for job in jobs_for_summary)
    failed_minutes_total = sum(job.rounded_minutes for job in jobs_for_summary if job.conclusion in FAILURE_CONCLUSIONS)

    return {
        "repo": repo,
        "period": {"since": args.since, "until": args.until},
        "filters": {
            "workflow": args.workflow,
            "event": args.event,
            "branch": args.branch,
            "pr": args.pr,
            "max_runs": args.max_runs,
        },
        "summary": {
            "runs": len({job.run_id for job in jobs_for_summary}),
            "jobs": len(jobs_for_summary),
            "raw_minutes": raw_minutes_total,
            "rounded_minutes": rounded_minutes_total,
            "failed_minutes": failed_minutes_total,
            "avg_job_seconds": round(sum(job.duration_seconds for job in jobs_for_summary) / len(jobs_for_summary), 2)
            if jobs_for_summary
            else 0.0,
            "avg_queue_seconds": round(sum(job.queue_seconds for job in jobs_for_summary) / len(jobs_for_summary), 2)
            if jobs_for_summary
            else 0.0,
            "job_failure_rate": round(failure_rate(jobs_for_summary), 4),
        },
        "workflow_summary": workflow_table,
        "branch_summary": branch_table,
        "pr_summary": pr_table,
        "size_buckets": bucket_rows,
        "notes": [
            "rounded_minutes estimates the GitHub usage-style total by rounding each completed job up to the next minute.",
            "raw_minutes is the exact wall-clock sum from job started_at/completed_at timestamps.",
            "PR linkage is resolved through commit->pull requests, which is more reliable than run.pull_requests for this repo.",
            "High minutes_per_100_loc often signals retries, flaky failures, or expensive validation on small diffs.",
            "Use --run-id with --pr inside GitHub Actions to summarize the current PR run without counting the summary job itself.",
        ],
    }


def fmt_duration(seconds: float) -> str:
    minutes = int(seconds // 60)
    secs = int(round(seconds % 60))
    return f"{minutes}m {secs:02d}s"


def recommendation_for_pr(row: dict[str, Any]) -> str:
    if row["failed_minutes"] > 0:
        return "Failed or cancelled job minutes were burned on this PR; fix flake/retry waste before optimizing bundle size."
    if row["size_bucket"] == "tiny" and row["rounded_minutes"] >= 5:
        return "Tiny PR paid the full CI fan-out tax; bundle nearby low-risk changes when they share the same review context."
    if row["size_bucket"] == "small" and row["minutes_per_100_loc"] > 5:
        return "Small PR is expensive for its churn; consider bundling adjacent changes or tightening path-based job triggers."
    if row["size_bucket"] in {"large", "xl"} and row["minutes_per_100_loc"] < 1.5:
        return "This larger PR is relatively efficient for its churn; bundling appears to be paying off."
    return "CI cost is within a normal range for this PR size bucket."


def write_csvs(report: dict[str, Any], prefix: str) -> None:
    base = Path(prefix)
    base.parent.mkdir(parents=True, exist_ok=True)

    workflow_path = base.parent / f"{base.name}-workflows.csv"
    branch_path = base.parent / f"{base.name}-branches.csv"
    pr_path = base.parent / f"{base.name}-prs.csv"

    workflow_rows = []
    for row in report["workflow_summary"]:
        workflow_rows.append(
            {
                "workflow": row["workflow"],
                "runs": row["runs"],
                "jobs": row["jobs"],
                "raw_minutes": row["raw_minutes"],
                "rounded_minutes": row["rounded_minutes"],
                "failed_minutes": row["failed_minutes"],
                "avg_job_seconds": row["avg_job_seconds"],
                "avg_queue_seconds": row["avg_queue_seconds"],
                "job_failure_rate": row["job_failure_rate"],
                "linux_jobs": row["runner_mix"]["linux"],
                "macos_jobs": row["runner_mix"]["macos"],
                "windows_jobs": row["runner_mix"]["windows"],
            }
        )
    branch_rows = []
    for row in report["branch_summary"]:
        branch_rows.append(
            {
                "branch": row["branch"],
                "runs": row["runs"],
                "jobs": row["jobs"],
                "raw_minutes": row["raw_minutes"],
                "rounded_minutes": row["rounded_minutes"],
                "failed_minutes": row["failed_minutes"],
                "avg_job_seconds": row["avg_job_seconds"],
                "avg_queue_seconds": row["avg_queue_seconds"],
                "linked_prs": ",".join(str(num) for num in row["linked_prs"]),
                "pr_count": row["pr_count"],
                "loc_churn": row["loc_churn"],
                "minutes_per_100_loc": row["minutes_per_100_loc"],
                "minutes_per_pr": row["minutes_per_pr"],
            }
        )
    pr_rows = list(report["pr_summary"])

    for path, rows in ((workflow_path, workflow_rows), (branch_path, branch_rows), (pr_path, pr_rows)):
        if not rows:
            path.write_text("", encoding="utf-8")
            continue
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
            writer.writeheader()
            writer.writerows(rows)


def print_table(report: dict[str, Any], top_prs: int) -> None:
    summary = report["summary"]
    print("\nActions Metrics\n")
    print(f"Repo:            {report['repo']}")
    print(f"Period:          {report['period']['since']} → {report['period']['until']} (UTC, until exclusive)")
    print(f"Runs inspected:  {summary['runs']}")
    print(f"Jobs inspected:  {summary['jobs']}")
    print(f"Raw minutes:     {summary['raw_minutes']}")
    print(f"Rounded minutes: {summary['rounded_minutes']}")
    print(f"Failed minutes:  {summary['failed_minutes']}")
    print(f"Avg job runtime: {fmt_duration(summary['avg_job_seconds'])}")
    print(f"Avg queue time:  {round(summary['avg_queue_seconds'], 1)}s")
    print(f"Job failure rate:{round(summary['job_failure_rate'] * 100, 1)}%")

    print("\nWorkflow summary")
    print("-" * 106)
    print(f"{'Workflow':34} {'Runs':>5} {'Jobs':>5} {'Min':>7} {'Raw':>7} {'FailMin':>8} {'AvgJob':>9} {'Fail%':>7}")
    for row in report["workflow_summary"]:
        print(
            f"{row['workflow'][:34]:34} {row['runs']:>5} {row['jobs']:>5} {row['rounded_minutes']:>7} "
            f"{row['raw_minutes']:>7.1f} {row['failed_minutes']:>8} {fmt_duration(row['avg_job_seconds']):>9} "
            f"{row['job_failure_rate'] * 100:>6.1f}%"
        )

    if report["branch_summary"]:
        print("\nBranch summary")
        print("-" * 144)
        print(
            f"{'Branch':32} {'PRs':>4} {'LOC':>6} {'Runs':>5} {'Jobs':>5} {'Min':>7} {'FailMin':>8} {'Min/100LOC':>11} {'Min/PR':>8}"
        )
        for row in report["branch_summary"][:top_prs]:
            loc_display = row["loc_churn"] if row["loc_churn"] else "-"
            m100_display = f"{row['minutes_per_100_loc']:.2f}" if row["minutes_per_100_loc"] is not None else "-"
            print(
                f"{row['branch'][:32]:32} {row['pr_count']:>4} {str(loc_display):>6} {row['runs']:>5} {row['jobs']:>5} "
                f"{row['rounded_minutes']:>7} {row['failed_minutes']:>8} {m100_display:>11} {row['minutes_per_pr']:>8.2f}"
            )

    if report["pr_summary"]:
        print("\nPR correlation (top by rounded minutes)")
        print("-" * 150)
        print(
            f"{'PR':>5} {'Branch':28} {'State':8} {'LOC':>6} {'Files':>5} {'Runs':>5} {'Jobs':>5} "
            f"{'Min':>7} {'FailMin':>8} {'Min/100LOC':>11} {'Min/Run':>8} {'Title'}"
        )
        for row in report["pr_summary"][:top_prs]:
            print(
                f"#{row['number']:<4} {row['head_ref'][:28]:28} {row['state'][:8]:8} {row['churn']:>6} {row['changed_files']:>5} "
                f"{row['runs']:>5} {row['jobs']:>5} {row['rounded_minutes']:>7} {row['failed_minutes']:>8} "
                f"{row['minutes_per_100_loc']:>11.2f} {row['minutes_per_run']:>8.2f} {row['title'][:60]}"
            )

        print("\nPR size buckets")
        print("-" * 76)
        print(f"{'Bucket':10} {'PRs':>5} {'MedianMin':>10} {'MedianMin/100LOC':>18} {'MedianRuns':>11}")
        for row in report["size_buckets"]:
            print(
                f"{row['bucket']:10} {row['prs']:>5} {row['median_minutes']:>10.2f} "
                f"{row['median_minutes_per_100_loc']:>18.2f} {row['median_runs']:>11.2f}"
            )

    print("\nNotes")
    for note in report["notes"]:
        print(f"- {note}")
    print("")


def print_markdown(report: dict[str, Any], top_prs: int) -> None:
    summary = report["summary"]
    print("## Actions metrics")
    print("")
    print(f"- **Repo:** `{report['repo']}`")
    print(f"- **Period:** `{report['period']['since']}` → `{report['period']['until']}` (UTC, until exclusive)")
    print(f"- **Runs inspected:** {summary['runs']}")
    print(f"- **Jobs inspected:** {summary['jobs']}")
    print(f"- **Raw minutes:** {summary['raw_minutes']}")
    print(f"- **Rounded minutes:** {summary['rounded_minutes']}")
    print(f"- **Failed minutes:** {summary['failed_minutes']}")
    print(f"- **Avg job runtime:** {fmt_duration(summary['avg_job_seconds'])}")
    print(f"- **Avg queue time:** {round(summary['avg_queue_seconds'], 1)}s")
    print(f"- **Job failure rate:** {round(summary['job_failure_rate'] * 100, 1)}%")
    print("")
    print("### Workflow summary")
    print("")
    print("| Workflow | Runs | Jobs | Rounded min | Raw min | Failed min | Avg job | Fail % |")
    print("|---|---:|---:|---:|---:|---:|---:|---:|")
    for row in report["workflow_summary"]:
        print(
            f"| {row['workflow']} | {row['runs']} | {row['jobs']} | {row['rounded_minutes']} | {row['raw_minutes']} | "
            f"{row['failed_minutes']} | {fmt_duration(row['avg_job_seconds'])} | {row['job_failure_rate'] * 100:.1f}% |"
        )
    if report["branch_summary"]:
        print("")
        print("### Branch summary")
        print("")
        print("| Branch | PRs | LOC churn | Runs | Jobs | Rounded min | Failed min | Min / 100 LOC | Min / PR |")
        print("|---|---:|---:|---:|---:|---:|---:|---:|---:|")
        for row in report["branch_summary"][:top_prs]:
            loc_display = row["loc_churn"] if row["loc_churn"] else "-"
            m100_display = f"{row['minutes_per_100_loc']:.2f}" if row["minutes_per_100_loc"] is not None else "-"
            print(
                f"| `{row['branch']}` | {row['pr_count']} | {loc_display} | {row['runs']} | {row['jobs']} | {row['rounded_minutes']} | "
                f"{row['failed_minutes']} | {m100_display} | {row['minutes_per_pr']:.2f} |"
            )
    if report["pr_summary"]:
        print("")
        print("### PR correlation")
        print("")
        print("| PR | Branch | State | LOC churn | Files | Runs | Jobs | Rounded min | Failed min | Min / 100 LOC | Min / run |")
        print("|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|")
        for row in report["pr_summary"][:top_prs]:
            print(
                f"| #{row['number']} | `{row['head_ref']}` | {row['state']} | {row['churn']} | {row['changed_files']} | {row['runs']} | "
                f"{row['jobs']} | {row['rounded_minutes']} | {row['failed_minutes']} | {row['minutes_per_100_loc']:.2f} | {row['minutes_per_run']:.2f} |"
            )
        if len(report["pr_summary"]) == 1:
            print("")
            print("### Recommendation")
            print("")
            print(f"- {recommendation_for_pr(report['pr_summary'][0])}")


def main() -> int:
    args = parse_args()
    repo = resolve_repo(args.repo)
    report = build_report(repo, args)
    if args.csv_prefix:
        write_csvs(report, args.csv_prefix)
    if args.format == "json":
        print(json.dumps(report, indent=2))
    elif args.format == "markdown":
        print_markdown(report, args.top_prs)
    else:
        print_table(report, args.top_prs)
    return 0


if __name__ == "__main__":
    sys.exit(main())
