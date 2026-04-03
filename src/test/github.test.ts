import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "../../node_modules/vitest/dist/index.js";
import { fetchGitHubPulse } from "@/lib/github";

function createPushEvent(overrides?: {
  created_at?: string;
  commits?: { sha: string }[];
  size?: number;
}) {
  return {
    type: "PushEvent",
    created_at: overrides?.created_at ?? "2026-04-01T12:00:00Z",
    payload: {
      commits: overrides?.commits,
      size: overrides?.size,
    },
  };
}

describe("fetchGitHubPulse", () => {
  const fetchMock = vi.fn<typeof fetch>();
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns pulse data for a successful fetch with push events", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          createPushEvent({ created_at: "2026-04-02T12:00:00Z", commits: [{ sha: "a" }, { sha: "b" }] }),
          { type: "WatchEvent", created_at: "2026-04-01T12:00:00Z", payload: {} },
        ]),
        { status: 200 }
      )
    );

    await expect(fetchGitHubPulse("slenthekid")).resolves.toEqual({
      events: [{ date: "2026-04-02", commits: 2 }],
      lastActive: "2026-04-02",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/slenthekid/events/public?per_page=100&page=1",
      {
        headers: { Accept: "application/vnd.github.v3+json" },
        next: { revalidate: 3600 },
      }
    );
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns null for a non-200 response", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: "rate limited" }), { status: 403 }));

    await expect(fetchGitHubPulse("slenthekid")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns null when the API returns an empty events array", async () => {
    fetchMock.mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));

    await expect(fetchGitHubPulse("slenthekid")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns null when fetch throws a network error", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    await expect(fetchGitHubPulse("slenthekid")).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("fetches a second page when the first page has 100 events", async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) =>
      createPushEvent({
        created_at: `2026-04-${String((index % 9) + 1).padStart(2, "0")}T12:00:00Z`,
        commits: [{ sha: `sha-${index}` }],
      })
    );
    const secondPage = [createPushEvent({ created_at: "2026-03-20T12:00:00Z", commits: [{ sha: "later" }] })];

    fetchMock
      .mockResolvedValueOnce(new Response(JSON.stringify(firstPage), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(secondPage), { status: 200 }));

    const result = await fetchGitHubPulse("slenthekid");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      "https://api.github.com/users/slenthekid/events/public?per_page=100&page=2"
    );
    expect(result).not.toBeNull();
    expect(result?.events).toHaveLength(101);
  });

  it("uses payload.commits length and falls back to payload.size", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify([
          createPushEvent({ created_at: "2026-04-02T12:00:00Z", commits: [{ sha: "a" }, { sha: "b" }, { sha: "c" }], size: 9 }),
          createPushEvent({ created_at: "2026-04-01T12:00:00Z", size: 4 }),
        ]),
        { status: 200 }
      )
    );

    await expect(fetchGitHubPulse("slenthekid")).resolves.toEqual({
      events: [
        { date: "2026-04-02", commits: 3 },
        { date: "2026-04-01", commits: 4 },
      ],
      lastActive: "2026-04-02",
    });
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
