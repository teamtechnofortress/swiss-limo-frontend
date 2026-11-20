'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CalendarDays, Car, Clock3, MapPin, Plane, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceField } from '@/components/booking/PlaceField';
import { getPublicConfig } from '@/lib/public-config';
import type { PlaceValue } from '@/lib/types';

const AIRPORT = 'Zurich Airport (ZRH)';

type JourneyType = 'arrival' | 'departure';

export function AirportQuoteForm() {
  const router = useRouter();
  const [journeyType, setJourneyType] = useState<JourneyType>('arrival');
  const [location, setLocation] = useState<PlaceValue | null>(null);
  const [googleBrowserKey, setGoogleBrowserKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [passengers, setPassengers] = useState('1');

  const isDeparture = journeyType === 'departure';
  const locationLabel = isDeparture ? 'Pickup location' : 'Destination';
  const locationPlaceholder = isDeparture ? 'Hotel / City / Address' : 'Hotel / City / Address';

  useEffect(() => {
    getPublicConfig()
      .then((config) => setGoogleBrowserKey(config.googleMapsBrowserKey))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    setLocation(null);
    setError(null);
  }, [journeyType]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!location) {
      setError('Please choose an address from the suggestions.');
      return;
    }

    const params = new URLSearchParams({
      from: isDeparture ? location.text : AIRPORT,
      to: isDeparture ? AIRPORT : location.text,
      ...(date ? { date } : {}),
      ...(time ? { time } : {}),
      passengers,
    });

    router.push(`/book?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="relative z-10 flex w-full flex-wrap items-center gap-1 rounded-t-[24px] rounded-tr-[24px] border border-b-0 border-gray-100 bg-white p-1 shadow-[0_-8px_20px_rgba(13,27,42,0.05)] sm:w-fit">
          {[
            { value: 'arrival' as const, label: 'Airport transfer', icon: Plane },
            { value: 'departure' as const, label: 'To airport', icon: Car },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setJourneyType(value)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold transition sm:px-4 sm:text-[11px] ${
                journeyType === value ? 'bg-[#0d1b2a] text-white shadow-sm' : 'text-[#0d1b2a] hover:bg-[#f8f3e9]'
              }`}
            >
              <Icon size={14} strokeWidth={2.25} />
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="-mt-px rounded-[24px] rounded-tl-none border border-gray-100 bg-white p-4 pb-5 shadow-[0_20px_50px_rgba(13,27,42,0.13)] md:p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.2fr_1.45fr_.85fr_.8fr_.85fr_1fr] xl:items-end">
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-[#0d1b2a]">{isDeparture ? 'Destination' : 'Pickup location'}</span>
              <span className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[12px] font-semibold text-[#0d1b2a]">
                <Plane size={16} className="shrink-0 text-[#a76e00]" />
                {AIRPORT}
              </span>
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-[#0d1b2a]">{locationLabel}</span>
              <PlaceField
                key={journeyType}
                id={`airport-${journeyType}-location`}
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  if (value) setError(null);
                }}
                placeholder={locationPlaceholder}
                googleBrowserKey={googleBrowserKey}
                statusPosition="overlay"
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12px] font-medium text-[#0d1b2a] outline-none transition placeholder:text-slate-400 focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20"
                icon={<MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#a76e00]" />}
              />
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-[#0d1b2a]">Date</span>
              <span className="relative flex h-11 items-center">
                <CalendarDays size={16} className="pointer-events-none absolute left-3 text-[#a76e00]" />
                <input aria-label="Pickup date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-full w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[12px] font-medium text-[#0d1b2a] outline-none transition focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20" />
              </span>
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-[#0d1b2a]">Time</span>
              <span className="relative flex h-11 items-center">
                <Clock3 size={16} className="pointer-events-none absolute left-3 text-[#a76e00]" />
                <input aria-label="Pickup time" type="time" value={time} onChange={(event) => setTime(event.target.value)} className="h-full w-full rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[12px] font-medium text-[#0d1b2a] outline-none transition focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20" />
              </span>
            </label>
            <label className="min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-[#0d1b2a]">Passengers</span>
              <span className="relative flex h-11 items-center">
                <Users size={16} className="pointer-events-none absolute left-3 text-[#a76e00]" />
                <select value={passengers} onChange={(event) => setPassengers(event.target.value)} className="h-full w-full appearance-none rounded-lg border border-slate-200 bg-white pl-9 pr-2 text-[12px] font-medium text-[#0d1b2a] outline-none transition focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/20">
                  {[1, 2, 3, 4, 5, 6, 7].map((number) => <option key={number} value={number}>{number} {number === 1 ? 'Passenger' : 'Passengers'}</option>)}
                </select>
              </span>
            </label>
            <button type="submit" className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-4 text-[12px] font-bold text-[#0d1b2a] transition hover:bg-[#e0b54a]">
              Get a quote <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
          {error && <p role="alert" className="mt-3 text-[11px] font-semibold text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
}
