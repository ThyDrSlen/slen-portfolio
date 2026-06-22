import { fetchGitHubPulse } from "@/lib/github";
import { PulseDashboard } from "./PulseDashboard";

export async function GitHubCommitPulse() {
  const data = await fetchGitHubPulse("ThyDrSlen");

  if (!data) {
    return <PulseDashboard events={[]} lastActive="no recent activity" />;
  }

  return <PulseDashboard events={data.events} lastActive={data.lastActive} />;
}
