'use client';

import { useState } from 'react';
import { ImagePlaceholder } from '@/components/ui/primitives';

export function VehicleGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const galleryImages = Array.isArray(images) ? images : [];

  if (galleryImages.length === 0) {
    return <ImagePlaceholder label={name} className="aspect-[16/10] w-full rounded-3xl border border-line" />;
  }

  const current = galleryImages[index];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-ink-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current} alt={`${name}, photo ${index + 1}`} className="h-full w-full object-cover" />
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {galleryImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`aspect-[4/3] overflow-hidden rounded-xl border transition ${
                i === index ? 'border-gold' : 'border-line opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
