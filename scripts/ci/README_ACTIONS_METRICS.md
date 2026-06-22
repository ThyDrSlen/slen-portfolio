# Actions Metrics CLI

`python3 scripts/ci/actions_metrics.py` correlates GitHub Actions runtime with workflow fan-out and PR size.

## Why this exists

The repository's Actions usage page exposes totals like:

- total minutes
- total job runs
- average job runtime
- failed job usage

Those numbers are useful, but they do not directly answer:

- which PRs are burning the most CI time?
- which workflows dominate spend?
- how many rounded job-minutes are being wasted on flaky failures?
- what does CI cost look like relative to PR LOC churn?

This CLI answers those by joining:

1. `gh run list` recent workflow runs
2. `gh api repos/:owner/:repo/actions/runs/:id/jobs` job timestamps
3. `gh api repos/:owner/:repo/commits/:sha/pulls` PR linkage
4. `gh api repos/:owner/:repo/pulls/:number` additions/deletions/files/commits

## Usage

```bash
python3 scripts/ci/actions_metrics.py
python3 scripts/ci/actions_metrics.py --workflow "CI"
python3 scripts/ci/actions_metrics.py --since 2026-04-01 --until 2026-05-01
python3 scripts/ci/actions_metrics.py --format markdown
python3 scripts/ci/actions_metrics.py --pr 210
python3 scripts/ci/actions_metrics.py --run-id 25121442097 --pr 210
python3 scripts/ci/actions_metrics.py --csv-prefix .artifacts/actions-metrics/current
```

## Useful modes

- `--pr <number>`: aggregate all completed CI jobs tied to that PR over the selected time range
- `--run-id <id>`: restrict to a single workflow run; best for `GITHUB_STEP_SUMMARY` inside CI
- `--branch <ref>`: aggregate cost by branch when a branch spans multiple pushes/reruns
- `--csv-prefix <prefix>`: emit `-workflows.csv`, `-branches.csv`, and `-prs.csv` files for spreadsheet analysis

## Key metrics

- **raw_minutes**: exact wall-clock sum from job start/end timestamps
- **rounded_minutes**: `ceil(job_duration / 60)` per completed job, which better approximates the usage-style totals shown in GitHub's UI
- **failed_minutes**: rounded minutes spent on failed/cancelled/timed-out jobs
- **minutes_per_100_loc**: rounded minutes normalized by PR churn (`additions + deletions`)
- **minutes_per_pr** / **minutes_per_run**: useful for spotting repeated rerun tax

## Interpretation

- High **rounded_minutes** with low LOC usually means CI fan-out is too expensive for the PR size.
- High **failed_minutes** signals reruns/flaky jobs are burning budget.
- High **minutes_per_100_loc** is a good review-bundling smell: tiny PRs are paying the full CI tax.
- Use the size-bucket medians to compare small PRs against other small PRs rather than against large feature waves.

## CI integration

`ci.yml` can call the script with both `--run-id` and `--pr` to summarize the **current** PR run without counting the summary job itself.

That integration can:
- append a markdown summary to `GITHUB_STEP_SUMMARY`
- upsert a single sticky PR comment marked with `<!-- actions-metrics-comment -->`
- upload workflow/branch/PR CSVs as an artifact for offline analysis
