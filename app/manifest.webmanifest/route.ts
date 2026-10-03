import { pwaConfig } from "@/lib/pwa";

export function GET() {
  return Response.json({
    name: pwaConfig.name,
    short_name: pwaConfig.shortName,
    description: pwaConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: pwaConfig.backgroundColor,
    theme_color: pwaConfig.themeColor,
    icons: [
      {
        src: "/equinox-mark.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/equinox-logo.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  });
}