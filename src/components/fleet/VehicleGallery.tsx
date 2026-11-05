'use client';

import { useState } from 'react';
import { ImagePlaceholder } from '@/components/ui/primitives';
import type { VehicleMedia, VehicleMediaImage } from '@/lib/types';

export function VehicleGallery({ media, legacyImages = [], name }: { media: VehicleMedia; legacyImages?: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const mediaImages = [media.cover, ...media.gallery].filter((image): image is VehicleMediaImage => image !== null);
  const galleryImages = mediaImages.length > 0
    ? mediaImages
    : legacyImages.map((url, legacyIndex) => ({ id: -(legacyIndex + 1), url, thumbnail_url: null, alt: null }));

  if (galleryImages.length === 0) {
    return <ImagePlaceholder label={name} className="aspect-[16/10] w-full rounded-3xl border border-line" />;
  }

  const current = galleryImages[index];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-ink-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.url} alt={current.alt ?? `${name}, photo ${index + 1}`} className="h-full w-full object-cover" />
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {galleryImages.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`aspect-[4/3] overflow-hidden rounded-xl border transition ${
                i === index ? 'border-gold' : 'border-line opacity-60 hover:opacity-100'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.thumbnail_url ?? image.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
