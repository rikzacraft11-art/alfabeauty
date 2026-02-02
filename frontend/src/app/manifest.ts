import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Alfa Beauty Cosmetica',
    short_name: 'Alfa Beauty',
    description: 'Professional beauty distribution for salons & barbers in Indonesia.',
    start_url: '/id',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/images/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
