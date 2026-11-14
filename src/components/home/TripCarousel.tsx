'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type TouchEvent,
} from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Container } from '@/components/ui/primitives';
import { money } from '@/lib/format';
import type { FeaturedTrip } from '@/lib/trips';

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

const FALLBACK: FeaturedTrip[] = [
  { slug: 'zurich-heritage', title: 'Zurich Heritage & Lake Tour', subtitle: 'A private city and lakeside escape', summary: "Explore Zurich's historic old town, landmarks and beautiful lakeside.", descriptionHtml: null, region: 'Zurich', pricingMode: 'fixed', startingFromPriceMinor: 49000, thumbnailUrl: '/images/home/tour-zurich.jpg', originalCoverUrl: '/images/home/tour-zurich.jpg', coverUrl: '/images/home/tour-zurich.jpg' },
  { slug: 'lucerne-titlis', title: 'Lucerne & Mount Titlis', subtitle: 'A classic alpine day trip', summary: 'Discover Lucerne and the spectacular Mount Titlis with alpine views.', descriptionHtml: null, region: 'Lucerne', pricingMode: 'fixed', startingFromPriceMinor: 59000, thumbnailUrl: '/images/home/tour-lucerne.jpg', originalCoverUrl: '/images/home/tour-lucerne.jpg', coverUrl: '/images/home/tour-lucerne.jpg' },
  { slug: 'rhine-falls', title: 'Rhine Falls Day Trip', subtitle: 'Waterfalls and historic towns', summary: "Experience Europe's largest waterfall and the charming town of Schaffhausen.", descriptionHtml: null, region: 'Schaffhausen', pricingMode: 'fixed', startingFromPriceMinor: 39000, thumbnailUrl: '/images/home/tour-rhine-falls.jpg', originalCoverUrl: '/images/home/tour-rhine-falls.jpg', coverUrl: '/images/home/tour-rhine-falls.jpg' },
  { slug: 'interlaken-alpine', title: 'Interlaken Alpine Escape', subtitle: 'Lakes, peaks and fresh alpine air', summary: 'Enjoy breathtaking alpine scenery, lakes and the charm of Interlaken.', descriptionHtml: null, region: 'Interlaken', pricingMode: 'fixed', startingFromPriceMinor: 69000, thumbnailUrl: '/images/home/tour-interlaken.jpg', originalCoverUrl: '/images/home/tour-interlaken.jpg', coverUrl: '/images/home/tour-interlaken.jpg' },
];

const SLIDE_MS = 6500; // time each trip stays on screen
const SETTLE_MS = 880; // slightly longer than the rail's transition
const BACKGROUND_EXIT_MS = 1150;
const NAVIGATION_LOCK_MS = 950;

function largeImage(trip: FeaturedTrip): string {
  return trip.originalCoverUrl ?? trip.coverUrl ?? trip.thumbnailUrl ?? '/images/home/tour-lucerne.jpg';
}

function thumbnailImage(trip: FeaturedTrip): string {
  return trip.thumbnailUrl ?? largeImage(trip);
}

function priceDetails(trip: FeaturedTrip): { label: string; value: string } {
  if (trip.pricingMode === 'fixed' && trip.startingFromPriceMinor !== null) {
    return { label: 'From', value: money(trip.startingFromPriceMinor) };
  }

  return trip.pricingMode === 'enquiry'
    ? { label: 'Pricing', value: 'On request' }
    : { label: 'Pricing', value: 'Route based' };
}

const pad = (v: number) => String(v).padStart(2, '0');
const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

/* ------------------------------------------------------------------ */
/*  Styles (keyframe-free: everything is a transition)                 */
/* ------------------------------------------------------------------ */

const STYLES = `
.tc-root{--tc-ease:cubic-bezier(.22,1,.36,1)}

/* Only the current and outgoing backdrop exist in the DOM at once. */
.tc-bg{position:absolute;inset:0;z-index:0;opacity:0;transform:scale(1.12);
  transition:opacity 850ms ease,transform 850ms ease}
.tc-bg[data-active="true"]{z-index:1;opacity:1;transform:scale(1);
  transition:opacity 1100ms ease,transform 9000ms cubic-bezier(.2,.6,.2,1)}

/* Detail card: opacity and transforms remain on the compositor. */
.tc-slide[data-active="false"]{pointer-events:none}
.tc-rise{opacity:0;transform:translate3d(0,16px,0);
  transition:opacity 300ms ease,transform 300ms ease}
.tc-slide[data-active="true"] .tc-rise{opacity:1;transform:none;
  transition:opacity 800ms var(--tc-ease) calc(200ms + var(--i,0) * 80ms),
             transform 800ms var(--tc-ease) calc(200ms + var(--i,0) * 80ms)}

/* Rail: the active trip always slides to the left edge, list loops forever */
.tc-rail{--tc-w:162px;--tc-gap:10px}
@media (min-width:768px){.tc-rail{--tc-w:188px;--tc-gap:12px}}
.tc-track{display:flex;gap:var(--tc-gap);
  transform:translate3d(calc(var(--tc-idx,0) * -1 * (var(--tc-w) + var(--tc-gap))),0,0);
  transition:transform 850ms var(--tc-ease)}
.tc-track[data-snap="true"]{transition:none}
.tc-item{width:var(--tc-w);flex:none}
.tc-fade{-webkit-mask-image:linear-gradient(to right,#000 80%,transparent);
  mask-image:linear-gradient(to right,#000 80%,transparent)}

/* CSS owns progress, avoiding a requestAnimationFrame loop while idle. */
@keyframes tc-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.tc-progress{transform:scaleX(0);transform-origin:left center}
.tc-progress[data-playing="true"]{animation:tc-progress ${SLIDE_MS}ms linear both}

@media (prefers-reduced-motion:reduce){
  .tc-bg,.tc-bg[data-active="true"]{transform:none;transition:opacity 300ms ease}
  .tc-rise,.tc-slide[data-active="true"] .tc-rise{transform:none;transition:opacity 200ms ease}
  .tc-track{transition:none}
  .tc-progress[data-playing="true"]{animation:none}
}
`;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function TripCarousel({ trips }: { trips?: FeaturedTrip[] }) {
  const list = useMemo<FeaturedTrip[]>(() => trips && trips.length > 0 ? trips : FALLBACK, [trips]);

  const n = list.length;

  // Keep enough cloned cards to fill a wide rail at the loop boundary, but no more.
  const track = useMemo(() => {
    const sets = 2 + Math.ceil(5 / n);
    return Array.from({ length: n * sets }, (_, v) => list[v % n]);
  }, [list, n]);

  // `idx` is the position inside the (looping) rail. The middle copy starts at `n`.
  const [idx, setIdx] = useState(n);
  const [snap, setSnap] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [inView, setInView] = useState(false);
  const [leavingBackground, setLeavingBackground] = useState<number | null>(null);
  const [navigationLocked, setNavigationLocked] = useState(false);

  const root = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const navigationLock = useRef(false);
  const navigationTimer = useRef<number | null>(null);

  const active = ((idx % n) + n) % n;
  const multi = n > 1;
  const canPlay = multi && inView && !hovered && !focused && !userPaused && !reduced && !hidden;

  const changeSlide = useCallback((change: (current: number) => number) => {
    if (!multi || navigationLock.current) return;

    navigationLock.current = true;
    setNavigationLocked(true);
    setLeavingBackground(active);
    setIdx(change);

    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current);
    navigationTimer.current = window.setTimeout(() => {
      navigationLock.current = false;
      navigationTimer.current = null;
      setNavigationLocked(false);
    }, NAVIGATION_LOCK_MS);
  }, [active, multi]);
  const next = useCallback(() => changeSlide((i) => i + 1), [changeSlide]);
  const prev = useCallback(() => changeSlide((i) => i - 1), [changeSlide]);
  const select = useCallback((nextIndex: number) => changeSlide(() => nextIndex), [changeSlide]);

  /* Reset when the data length changes */
  useEffect(() => {
    setIdx(n);
    setLeavingBackground(null);
    navigationLock.current = false;
    setNavigationLocked(false);
  }, [n]);

  useEffect(() => () => {
    if (navigationTimer.current !== null) window.clearTimeout(navigationTimer.current);
  }, []);

  /* Environment: reduced motion, tab visibility, and viewport visibility. */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    const vis = () => setHidden(document.hidden);
    sync();
    mq.addEventListener('change', sync);
    document.addEventListener('visibilitychange', vis);
    return () => {
      mq.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /* Preload only the next likely hero image once the browser has spare time. */
  useEffect(() => {
    if (!inView || !multi) return;
    const nextTrip = list[(active + 1) % n];
    const source = nextTrip ? largeImage(nextTrip) : null;
    if (!source) return;
    const preload = () => {
      const image = new Image();
      image.decoding = 'async';
      image.src = source;
    };
    const idleWindow = window as unknown as {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idleWindow.requestIdleCallback) {
      const idle = idleWindow.requestIdleCallback(preload, { timeout: 1200 });
      return () => idleWindow.cancelIdleCallback?.(idle);
    }
    const timer = window.setTimeout(preload, 300);
    return () => window.clearTimeout(timer);
  }, [active, inView, list, multi, n]);

  /* Autoplay does no per-frame JavaScript and stops entirely outside the viewport. */
  useEffect(() => {
    if (!canPlay) return;
    const timer = window.setTimeout(next, SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, canPlay, next]);

  /* Remove the old full-bleed image after the cross-fade completes. */
  useEffect(() => {
    if (leavingBackground === null || leavingBackground === active) return;
    const timer = window.setTimeout(() => setLeavingBackground(null), BACKGROUND_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [active, leavingBackground]);

  /* Once the rail has slid into a copy, jump back to the middle copy without animation */
  useEffect(() => {
    if (!multi || (idx >= n && idx < 2 * n)) return;
    const t = window.setTimeout(() => {
      setSnap(true);
      setIdx((i) => n + (((i % n) + n) % n));
      requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
    }, reduced ? 0 : SETTLE_MS);
    return () => window.clearTimeout(t);
  }, [idx, n, multi, reduced]);

  /* Input: keyboard + touch swipe */
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };
  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: TouchEvent) => {
    const s = touch.current;
    touch.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
  };

  const ctrl =
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 disabled:pointer-events-none disabled:opacity-45';
  const backgroundIndexes = leavingBackground === null || leavingBackground === active
    ? [active]
    : [leavingBackground, active];

  return (
    <section
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured day trips and tours"
      className="tc-root relative isolate overflow-hidden bg-[#061423] py-8 text-white antialiased md:py-10"
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onPointerEnter={(e: PointerEvent) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={(e: PointerEvent) => e.pointerType === 'mouse' && setHovered(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <style>{STYLES}</style>

      {/* Full-bleed backdrop: current plus one outgoing image, never the full catalogue. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {backgroundIndexes.map((i) => {
          const t = list[i];
          return (
          <img
            key={`${t.slug}-${i}`}
            src={largeImage(t)}
            alt=""
            draggable={false}
            data-active={i === active}
            className="tc-bg h-full w-full object-cover"
            decoding="async"
            loading={i === active ? 'eager' : 'lazy'}
          />
          );
        })}
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(90deg,rgba(3,25,46,.9)_0%,rgba(3,25,46,.55)_48%,rgba(3,25,46,.12)_100%)]" />
        <div className="absolute inset-y-0 left-0 z-[2] w-[72%] bg-[radial-gradient(ellipse_at_28%_50%,rgba(0,0,0,.28)_0%,rgba(0,0,0,.1)_42%,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-gradient-to-t from-[#03192e] via-[#03192e]/70 to-transparent" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col">
          {/* Section header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[2px] w-6 rounded-full bg-[#f1c75b]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1c75b]">Featured private journeys</p>
              </div>
              <h2 className="font-serif text-[28px] font-bold tracking-[-0.02em] text-white md:text-[34px]">
                Explore more, your way.
              </h2>
              <p className="mt-1.5 text-[13px] font-medium text-gray-200 md:text-sm">
                Private day trips and tours designed around the places you want to see.
              </p>
            </div>

            <Link
              href="/trips"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/50 bg-black/20 px-5 py-2.5 text-[12px] font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              View all tours <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-7 flex flex-col gap-6 md:mt-8 md:gap-7">
            {/* Big detail card — all slides share one grid cell, so height never jumps */}
            <div
              className="grid w-full max-w-[530px] rounded-[22px] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.06))] p-5 shadow-[0_20px_55px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.14)] backdrop-blur-md md:p-6"
              aria-live={canPlay ? 'off' : 'polite'}
            >
              {list.map((t, i) => {
                const on = i === active;
                const price = priceDetails(t);
                return (
                  <article
                    key={`${t.slug}-${i}`}
                    data-active={on}
                    aria-hidden={!on}
                    aria-label={`${i + 1} of ${n}`}
                    className="tc-slide col-start-1 row-start-1 flex flex-col"
                  >
                    <div className="tc-rise flex flex-wrap items-center gap-2" style={stagger(0)}>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/10">
                        <MapPin size={12} className="text-[#f1c75b]" /> {t.region}
                      </span>
                    </div>

                    <h3
                      className="tc-rise mt-4 text-[30px] font-semibold leading-[1.04] tracking-[-0.03em] sm:text-[38px]"
                      style={stagger(1)}
                    >
                      {t.title}
                    </h3>

                    <p className="tc-rise mt-1.5 text-[12px] font-semibold text-[#f1c75b]" style={stagger(2)}>{t.subtitle}</p>

                    <p
                      className="tc-rise mt-2 line-clamp-2 max-w-md text-[13px] leading-relaxed text-white/70 md:text-sm"
                      style={stagger(3)}
                    >
                      {t.summary}
                    </p>

                    <div
                      className="tc-rise mt-5 flex flex-wrap items-end justify-between gap-x-5 gap-y-4"
                      style={stagger(4)}
                    >
                      <div>
                        <p className="text-[11px] text-white/55">{price.label}</p>
                        <p className="text-[23px] font-semibold leading-tight tracking-tight">{price.value}</p>
                      </div>
                      <div className="flex gap-2.5">
                        <Link
                          href={`/trips/${t.slug}`}
                          tabIndex={on ? 0 : -1}
                          className="inline-flex items-center rounded-full border border-white/50 bg-black/20 px-4 py-2.5 text-[12px] font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                        >
                          Details
                        </Link>
                        <Link
                          href={`/trips/${t.slug}/book`}
                          tabIndex={on ? 0 : -1}
                          className="inline-flex items-center rounded-full bg-[#f1c75b] px-4 py-2.5 text-[12px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a] hover:shadow-[0_4px_12px_rgba(241,199,91,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[.98]"
                        >
                          Book now <ArrowRight size={14} className="ml-1.5" strokeWidth={2.5} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Rail: slides in sync with the card above */}
            {multi && (
              <div className="tc-rail">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-white/60">Up next</p>
                  <div className="flex items-center gap-2">
                    <span className="mr-1 text-xs tabular-nums text-white/55">
                      {pad(active + 1)} / {pad(n)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUserPaused((p) => !p)}
                      className={ctrl}
                      aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                    >
                      {userPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                    </button>
                    <button type="button" onClick={prev} className={ctrl} aria-label="Previous trip" disabled={navigationLocked}>
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={next} className={ctrl} aria-label="Next trip" disabled={navigationLocked}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="tc-fade -mx-1 overflow-hidden p-1">
                  <div className="tc-track" data-snap={snap} style={{ '--tc-idx': idx } as CSSProperties}>
                    {track.map((t, v) => {
                      const isActive = v === idx;
                      const primary = v >= n && v < 2 * n; // only the middle copy is exposed to assistive tech
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => select(v)}
                          disabled={navigationLocked}
                          aria-label={`Show ${t.title}`}
                          aria-current={isActive || undefined}
                          aria-hidden={!primary || undefined}
                          tabIndex={primary ? 0 : -1}
                          className={`tc-item group relative aspect-[16/9] overflow-hidden rounded-[14px] text-left transition-[opacity,transform,box-shadow] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                            isActive
                              ? 'scale-100 opacity-100 ring-2 ring-[#f1c75b] shadow-[0_12px_32px_rgba(0,0,0,.45)]'
                              : 'scale-[.97] opacity-60 ring-1 ring-white/15 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={thumbnailImage(t)}
                            alt=""
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          <span className="absolute inset-x-3 bottom-3 block">
                            <span className="block text-[10px] font-medium text-[#f1c75b]">{t.region}</span>
                            <span className="mt-0.5 block truncate text-[12px] font-semibold leading-tight">
                              {t.title}
                            </span>
                          </span>
                          {isActive && !reduced && (
                            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
                              <span key={active} data-playing={canPlay} className="tc-progress block h-full w-full bg-[#f1c75b]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
