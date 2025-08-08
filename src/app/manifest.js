export default function manifest() {
  return {
    name: 'Flashing DEV',
    short_name: 'Flashing DEV',
    description: 'A PWA for Flashing DEV',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f9f9f9',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
