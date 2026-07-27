import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "National Franchise League",
    short_name: "NFL",
    description: "The official premium app for the National Franchise League Madden franchise.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["fullscreen", "standalone", "minimal-ui", "browser"],
    background_color: "#000000",
    theme_color: "#00A3FF",
    orientation: "portrait-primary",
    categories: ["sports", "entertainment", "games"],
    lang: "en-US",
    dir: "ltr",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/splash/iphone-1170x2532.png",
        sizes: "1170x2532",
        type: "image/png",
        form_factor: "narrow",
        label: "National Franchise League mobile app experience",
      },
      {
        src: "/screenshots/desktop-1920x1080.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "National Franchise League desktop app experience",
      },
    ],
    shortcuts: [
      {
        name: "League Rules",
        short_name: "Rules",
        description: "Open the official National Franchise League rulebook.",
        url: "/rules",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Teams",
        short_name: "Teams",
        description: "Open the National Franchise League team hub.",
        url: "/teams/nyg",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Commissioner",
        short_name: "Commish",
        description: "Open the secure commissioner dashboard.",
        url: "/commissioner",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
