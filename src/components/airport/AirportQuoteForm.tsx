'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, CalendarDays, Clock3, MapPin, Plane, PlaneLanding, PlaneTakeoff, Repeat, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PlaceField } from '@/components/booking/PlaceField';
import { getPublicConfig } from '@/lib/public-config';
import type { PlaceValue } from '@/lib/types';

const AIRPORT = 'Zurich Airport (ZRH)';

type JourneyType = 'arrival' | 'departure' | 'round-trip';

const TABS = [
  { value: 'arrival' as const, label: 'Airport Transfer', icon: PlaneLanding },
  { value: 'departure' as const, label: 'To Airport (Departure)', icon: PlaneTakeoff },
  { value: 'round-trip' as const, label: 'Round Trip', icon: Repeat },
];

const fieldBase =
  'h-11 w-full rounded-lg border border-slate-200 bg-white text-[13px] font-medium text-[#0d1b2a] outline-none transition focus:border-[#f1c75b] focus:ring-2 focus:ring-[#f1c75b]/30';
const labelBase = 'mb-1.5 block text-[11px] font-bold text-[#0d1b2a]';

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
  const isRoundTrip = journeyType === 'round-trip';

  useEffect(() => {
    getPublicConfig()
      .then((config) => setGoogleBrowserKey(config.googleMapsBrowserKey))
      .catch(() => undefined);
  }, []);

  // Arrival and round trip both start at the airport, so the chosen address survives switching between them.
  useEffect(() => {
    setLocation(null);
    setError(null);
  }, [isDeparture]);

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
      ...(isRoundTrip ? { roundTrip: 'true' } : {}),
    });

    router.push(`/book?${params.toString()}`);
  }

  return (
    <div className="mx-auto w-full max-w-[1150px] px-4 sm:px-6 lg:px-8">
      <div role="tablist" aria-label="Journey type" className="relative z-10 flex w-full flex-wrap gap-1 rounded-t-[22px] bg-white px-2 pt-2 sm:w-fit">
        {TABS.map(({ value, label, icon: Icon }) => {
          const active = journeyType === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setJourneyType(value)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-bold transition sm:text-[12px] ${
                active ? 'bg-[#071e32] text-white' : 'text-[#0d1b2a] hover:bg-[#f8f3e9]'
              }`}
            >
              <Icon size={15} strokeWidth={2.2} className={active ? 'text-[#f1c75b]' : ''} />
              {label}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={submit}
        className="rounded-[22px] rounded-tl-none bg-white p-4 pb-5 shadow-[0_24px_60px_-18px_rgba(7,30,50,0.45)] md:p-5"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.15fr_1.4fr_.9fr_.8fr_.9fr_auto] xl:items-end">
          <label className="min-w-0">
            <span className={labelBase}>{isDeparture ? 'Destination' : 'Pickup Location'}</span>
            <span className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] font-semibold text-[#0d1b2a]">
              <Plane size={16} className="shrink-0 text-[#a76e00]" />
              {AIRPORT}
            </span>
          </label>

          <label className="min-w-0">
            <span className={labelBase}>{isDeparture ? 'Pickup Location' : 'Destination'}</span>
            <PlaceField
              key={isDeparture ? 'departure' : 'arrival'}
              id={`airport-${isDeparture ? 'departure' : 'arrival'}-location`}
              value={location}
              onChange={(value) => {
                setLocation(value);
                if (value) setError(null);
              }}
              placeholder="Hotel / City / Address"
              googleBrowserKey={googleBrowserKey}
              statusPosition="overlay"
              className={`${fieldBase} pl-9 pr-3 placeholder:text-slate-400`}
              icon={<MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#a76e00]" />}
            />
          </label>

          <label className="min-w-0">
            <span className={labelBase}>Date</span>
            <span className="relative flex h-11 items-center">
              <CalendarDays size={16} className="pointer-events-none absolute left-3 text-[#a76e00]" />
              <input aria-label="Pickup date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`${fieldBase} pl-9 pr-2`} />
            </span>
          </label>

          <label className="min-w-0">
            <span className={labelBase}>Time</span>
            <span className="relative flex h-11 items-center">
              <Clock3 size={16} className="pointer-events-none absolute left-3 text-[#a76e00]" />
              <input aria-label="Pickup time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className={`${fieldBase} pl-9 pr-2`} />
            </span>
          </label>

          <label className="min-w-0">
            <span className={labelBase}>Passengers</span>
            <span className="relative flex h-11 items-center">
              <Users size={16} className="pointer-events-none absolute left-3 text-[#a76e00]" />
              <select value={passengers} onChange={(e) => setPassengers(e.target.value)} className={`${fieldBase} appearance-none pl-9 pr-2`}>
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
            </span>
          </label>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#f1c75b] px-6 text-[13px] font-bold text-[#0d1b2a] shadow-[0_8px_18px_-10px_rgba(176,125,10,.9)] transition hover:bg-[#e6b941] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0d1b2a] sm:col-span-2 xl:col-span-1"
          >
            Get a Quote <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
        {error && <p role="alert" className="mt-3 text-[12px] font-semibold text-red-600">{error}</p>}
      </form>
    </div>
  );
}