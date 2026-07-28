export type CommissionerReportEpisode = {
  id: string;
  title: string;
  subtitle: string;
  label: string;
  description: string;
  publishDate: string;
  duration: string;
  audioUrl?: string;
  audioType?: string;
  youtubeUrl?: string;
  hosts: string[];
  topics: string[];
};

export const commissionerReport = {
  title: "The Commissioner Report",
  tagline: "Official audio coverage from the National Franchise League desk.",
  description:
    "A future weekly show covering scores, biggest upsets, players of the week, power rankings, trades, playoff races, owner storylines, and next-week previews.",
  status: "Coming Soon",
  cadence: "Weekly during the Madden season",
  hosts: ["Casey Jones", "Bobby B."],
  officialOpening: [
    "Every league has rules… but not every league has standards.",
    "You’re now tuned in to The Commissioner Report, the official broadcast of the National Franchise League.",
  ],
  version: "v2026.07.28",
  lastUpdated: "July 28, 2026",
  topics: ["Weekly Scores", "Biggest Upsets", "Players of the Week", "Power Rankings", "Trades", "Next-Week Previews"],
  episodes: [
    {
      id: "episode-zero-welcome",
      title: "Episode Zero — Welcome to the National Franchise League",
      subtitle: "The official introduction to The Commissioner Report",
      label: "Demo",
      description:
        "A temporary playable demo for the welcome broadcast slot. The final Episode Zero audio will introduce the league, the hosts, the rulebook, and the media experience once production is complete.",
      publishDate: "Coming Soon",
      duration: "Demo audio",
      audioUrl: "/audio/commissioner-report-demo.wav",
      audioType: "audio/wav",
      hosts: ["Casey Jones", "Bobby B."],
      topics: ["Welcome Broadcast", "League Standards", "Rulebook", "Owner Culture", "Future Media"],
    },
  ] as CommissionerReportEpisode[],
};
