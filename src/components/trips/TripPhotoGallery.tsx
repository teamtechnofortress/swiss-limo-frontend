'use client';

import { useState } from 'react';
import { ArrowRight, Images } from 'lucide-react';

export function TripPhotoGallery({ photos, title }: { photos: { id: string; url: string }[]; title: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? photos : photos.slice(0, 5);
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {visible.map((photo, index) => (
          <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer" aria-label={`Open ${title} photo ${index + 1} in a new tab`} className={`group overflow-hidden rounded-xl bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#986b00] ${index === 0 ? 'col-span-2 row-span-2' : ''}`}>
            <img src={photo.url} alt={`${title}, photo ${index + 1}`} loading="lazy" className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transform-none ${index === 0 ? 'aspect-[4/3]' : 'aspect-[3/2]'}`} />
          </a>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span className="inline-flex items-center gap-2"><Images size={15} />{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</span>
        {photos.length > 5 && <button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} className="inline-flex items-center gap-2 rounded px-1 py-2 font-bold text-[#0d1b2a] underline underline-offset-4">{expanded ? 'Show fewer photos' : `View all photos (${photos.length})`}<ArrowRight size={15} /></button>}
      </div>
    </div>
  );
}
