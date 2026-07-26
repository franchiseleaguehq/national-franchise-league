import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "National Franchise League",
    short_name: "NFL",
    description: "The premium broadcast home for a competitive Madden PS5 franchise league.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui", "browser"],
    background_color: "#000000",
    theme_color: "#00A3FF",
    orientation: "portrait-primary",
    categories: ["sports", "entertainment", "games"],
    icons: [
      {
        src: "/league-logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/league-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "League Rules",
        short_name: "Rules",
        description: "Open the official National Franchise League rulebook.",
        url: "/rules",
        icons: [{ src: "/league-logo.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Commissioner",
        short_name: "Commish",
        description: "Open the secure commissioner dashboard.",
        url: "/commissioner",
        icons: [{ src: "/league-logo.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
