'use client';

import { useState } from 'react';
import { Car, ChevronLeft, ChevronRight } from 'lucide-react';
import type { VehicleMedia, VehicleMediaImage } from '@/lib/types';

export function VehicleGallery({ media, legacyImages = [], name }: { media: VehicleMedia; legacyImages?: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const mediaImages = [media.cover, ...media.gallery]
    .filter((image): image is VehicleMediaImage => image !== null)
    .filter((image, i, images) => images.findIndex((candidate) => candidate.id === image.id) === i);
  const galleryImages = mediaImages.length > 0
    ? mediaImages
    : legacyImages.map((url, legacyIndex) => ({ id: -(legacyIndex + 1), url, thumbnail_url: null, alt: null }));

  if (galleryImages.length === 0) {
    return <div className="flex aspect-[5/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-slate-100 text-slate-600"><Car size={48} aria-hidden="true" /><p className="px-4 text-center text-sm">{name}</p><p className="text-xs">Photos coming soon</p></div>;
  }

  const activeIndex = Math.min(index, galleryImages.length - 1);
  const current = galleryImages[activeIndex];
  const move = (direction: number) => setIndex((activeIndex + direction + galleryImages.length) % galleryImages.length);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 bg-[#e9ebee] sm:aspect-[5/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.url} alt={current.alt ?? `${name}, photo ${activeIndex + 1}`} className="h-full w-full object-contain" />
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {galleryImages.length > 1 && <button type="button" onClick={() => move(-1)} aria-label="Previous vehicle photo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-[#0d1b2a]/70 text-white transition hover:bg-[#0d1b2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ChevronLeft size={20} /></button>}
          <span className="rounded-full bg-[#0d1b2a]/70 px-3 py-2 text-xs text-white" aria-live="polite" aria-atomic="true">{activeIndex + 1} / {galleryImages.length}</span>
          {galleryImages.length > 1 && <button type="button" onClick={() => move(1)} aria-label="Next vehicle photo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-[#0d1b2a]/70 text-white transition hover:bg-[#0d1b2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><ChevronRight size={20} /></button>}
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 sm:gap-3" aria-label="Vehicle photos">
          {galleryImages.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === activeIndex}
              className={`aspect-[2/1] w-[calc((100%-1rem)/3)] shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b2a] sm:w-[calc((100%-2.25rem)/4)] ${
                i === activeIndex ? 'border-[#d6a21c]' : 'border-gray-200 hover:border-slate-400'
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
