import { ImageUpload } from 'fire-platform';

const bannerDataUri =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMTQwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNGRjREMDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDY2RkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE0MCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjIyIiB5PSI4NCIgZm9udC1mYW1pbHk9IkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmIiBmb250LXNpemU9IjI2IiBmaWxsPSIjZmZmZmZmIiBmb250LXdlaWdodD0iNzAwIj5EZWJhdGUgU29jaWV0eTwvdGV4dD48L3N2Zz4K';

export function EmptyBanner() {
  return (
    <div style={{ maxWidth: '420px' }}>
      <ImageUpload label="Club banner" value={null} onChange={() => {}} pathPrefix="club-banners" />
    </div>
  );
}

export function EmptyLogo() {
  return (
    <div style={{ maxWidth: '420px' }}>
      <ImageUpload
        label="Club logo"
        value={null}
        onChange={() => {}}
        aspect="square"
        pathPrefix="club-logos"
      />
    </div>
  );
}

export function WithBanner() {
  return (
    <div style={{ maxWidth: '420px' }}>
      <ImageUpload
        label="Competition banner"
        value={bannerDataUri}
        onChange={() => {}}
        pathPrefix="competition-banners"
      />
    </div>
  );
}
