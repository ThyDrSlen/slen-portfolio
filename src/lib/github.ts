export type GitHubPulseData = {
  totalCommits7d: number;
  commitsByDay: { date: string; count: number }[];
  lastActive: string;
  streak: number;
};

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits?: { sha: string }[];
    size?: number;
  };
}

export async function fetchGitHubPulse(
  username: string
): Promise<GitHubPulseData | null> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;

    const events: GitHubEvent[] = await res.json();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const pushEvents = events.filter(
      (e) => e.type === "PushEvent" && new Date(e.created_at) >= sevenDaysAgo
    );

    const dayMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dayMap.set(d.toISOString().split("T")[0], 0);
    }

    let totalCommits7d = 0;
    for (const event of pushEvents) {
      const day = event.created_at.split("T")[0];
      const count = event.payload.commits?.length ?? event.payload.size ?? 1;
      totalCommits7d += count;
      dayMap.set(day, (dayMap.get(day) ?? 0) + count);
    }

    const commitsByDay = Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    const lastActive =
      pushEvents.length > 0
        ? pushEvents[0].created_at.split("T")[0]
        : "no recent activity";

    let streak = 0;
    const sortedDays = [...commitsByDay].reverse();
    let foundActive = false;
    for (const day of sortedDays) {
      if (day.count > 0) {
        foundActive = true;
        streak++;
      } else if (foundActive) {
        break;
      }
    }

    return { totalCommits7d, commitsByDay, lastActive, streak };
  } catch {
    return null;
  }
}
