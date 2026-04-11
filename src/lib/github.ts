export type GitHubEvent = {
  date: string;
  commits: number;
};

export type GitHubPulseData = {
  events: GitHubEvent[];
  lastActive: string;
};

const RETRY_DELAYS_MS = [1000, 2000, 4000] as const;

declare const process:
  | {
      env?: {
        GITHUB_TOKEN?: string;
      };
    }
  | undefined;

interface RawGitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits?: { sha: string }[];
    size?: number;
  };
}

async function fetchGitHubEventsPage(url: string): Promise<Response | null> {
  const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
  const githubToken = process?.env?.GITHUB_TOKEN;

  if (githubToken) {
    headers.Authorization = `token ${githubToken}`;
  }

  for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
    try {
      const response = await fetch(url, {
        headers,
        next: { revalidate: 3600 },
      } as RequestInit & { next: { revalidate: number } });

      if (!response.ok) {
        console.warn(`GitHub API request failed with status ${response.status}: ${url}`);

        if (response.status < 500) {
          return null;
        }
      } else {
        return response;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown network error";
      console.warn(`GitHub API network error for ${url}: ${message}`);
    }

    if (attempt < RETRY_DELAYS_MS.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]));
    }
  }

  return null;
}

export async function fetchGitHubPulse(
  username: string
): Promise<GitHubPulseData | null> {
  try {
    const allEvents: RawGitHubEvent[] = [];

    for (let page = 1; page <= 3; page++) {
      const url = `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`;
      const res = await fetchGitHubEventsPage(url);

      if (!res) return null;

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
  } catch (error) {
    console.error('[GitHub pulse] fetch failed:', error instanceof Error ? error.message : String(error));
    return null;
  }
}
