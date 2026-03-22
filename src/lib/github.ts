export type GitHubEvent = {
  date: string;
  commits: number;
};

export type GitHubPulseData = {
  events: GitHubEvent[];
  lastActive: string;
};

interface RawGitHubEvent {
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
    const allEvents: RawGitHubEvent[] = [];

    for (let page = 1; page <= 3; page++) {
      const res = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`,
        {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 3600 },
        }
      );

      if (!res.ok) break;

      const events: RawGitHubEvent[] = await res.json();
      allEvents.push(...events);

      if (events.length < 100) break;
    }

    if (allEvents.length === 0) return null;

    const pushEvents = allEvents.filter((e) => e.type === "PushEvent");

    const events: GitHubEvent[] = pushEvents.map((e) => ({
      date: e.created_at.split("T")[0],
      commits: e.payload.commits?.length ?? e.payload.size ?? 1,
    }));

    const lastActive =
      events.length > 0 ? events[0].date : "no recent activity";

    return { events, lastActive };
  } catch {
    return null;
  }
}
