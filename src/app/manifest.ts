import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bendly",
    short_name: "Bendly",
    description: "Flashing design application",
    start_url: "/",
    display: "standalone",
    background_color: "#1e4389",
    theme_color: "#fefefe",
    icons: [
      {
        src: "/images/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
