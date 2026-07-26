export type TwitchBroadcastState = {
  channel: string;
  isLive: boolean;
  currentOwner?: string;
  viewerCount?: number;
  recentTitle?: string;
  embedUrl: string;
};

export type YouTubeShort = {
  id: string;
  title: string;
  url: string;
  publishedAt?: string;
};

export interface MediaFeedProvider {
  getFeaturedTwitchBroadcast(channel: string): Promise<TwitchBroadcastState>;
  getLatestYouTubeShorts(channelUrl: string, limit: number): Promise<YouTubeShort[]>;
}

export class MockMediaFeedProvider implements MediaFeedProvider {
  async getFeaturedTwitchBroadcast(channel: string): Promise<TwitchBroadcastState> {
    return {
      channel,
      isLive: false,
      viewerCount: 0,
      recentTitle: "National Franchise League broadcast window",
      embedUrl: `https://player.twitch.tv/?channel=${channel}&parent=localhost&muted=true`,
    };
  }

  async getLatestYouTubeShorts(channelUrl: string, limit: number): Promise<YouTubeShort[]> {
    return Array.from({ length: limit }, (_, index) => ({
      id: `mock-short-${index + 1}`,
      title: ["Week 1 Logo Reveal", "Giants vs Cowboys Preview", "Top Plays"][index] ?? "League Short",
      url: channelUrl,
    }));
  }
}
