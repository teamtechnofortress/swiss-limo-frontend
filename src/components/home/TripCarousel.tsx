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
import type { HomeContent } from '@/content/home';
import { money } from '@/lib/format';
import type { FeaturedTrip } from '@/lib/trips';

/* ------------------------------------------------------------------ */
/*  Timing                                                             */
/* ------------------------------------------------------------------ */

const SLIDE_MS = 6500; // time each trip stays on screen
const STEP_MS = 850; // rail slide duration (must match the .tc-track transition)
const SETTLE_PAD_MS = 50; // safety margin after a slide before snapping back
const FADE_OUT_MS = 160; // rail fade that hides the off-screen re-sequencing
const RESEQUENCE_GAP_MS = 60; // lets the browser paint the re-sequenced rail before it moves
const HERO_WAIT_MS = 350; // max time we wait for a hero image before switching anyway
const BACKGROUND_EXIT_MS = 1150;
const VISIBLE_MAX = 5; // cards visible in the rail on desktop

/**
 * A "hop" is how we jump to a card that is NOT the next one:
 *  out  -> rail fades out (natural order, still on screen)
 *  swap -> rail is invisible; forward sequence is rebuilt as [from, target, target+1, ...]
 *  in   -> rail fades in and slides exactly ONE step, so the target lands first
 * Afterwards we snap back to the natural order (identical visible window = no flicker).
 */
type Hop = { target: number; from: number; stage: 'out' | 'swap' | 'in' };

const mod = (v: number, m: number) => ((v % m) + m) % m;
const pad = (v: number) => String(v).padStart(2, '0');
const stagger = (i: number) => ({ '--i': i }) as CSSProperties;

function largeImage(trip: FeaturedTrip): string {
  return trip.originalCoverUrl ?? trip.coverUrl ?? trip.thumbnailUrl ?? '/images/home/tour-lucerne.jpg';
}

function thumbnailImage(trip: FeaturedTrip): string {
  return trip.thumbnailUrl ?? largeImage(trip);
}

function priceDetails(trip: FeaturedTrip, content: HomeContent['trips']): { label: string; value: string } {
  if (trip.pricingMode === 'fixed' && trip.startingFromPriceMinor !== null) {
    return { label: content.priceFrom, value: money(trip.startingFromPriceMinor) };
  }

  return trip.pricingMode === 'enquiry'
    ? { label: content.priceLabel, value: content.priceOnRequest }
    : { label: content.priceLabel, value: content.routeBased };
}

/* ------------------------------------------------------------------ */
/*  Image loading helpers                                              */
/* ------------------------------------------------------------------ */

/** Module-level cache: each hero is requested + decoded once, even across remounts. */
const heroLoads = new Map<string, Promise<void>>();

function loadHero(src: string): Promise<void> {
  let pending = heroLoads.get(src);
  if (!pending) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    const decoded = typeof img.decode === 'function' ? img.decode() : Promise.resolve();
    pending = decoded.then(
      () => undefined,
      () => undefined, // a failed image must never block navigation
    );
    heroLoads.set(src, pending);
  }
  return pending;
}

function whenIdle(fn: () => void, timeout = 1200): () => void {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 300);
  return () => window.clearTimeout(id);
}

/* ------------------------------------------------------------------ */
/*  Styles (keyframe-free except the progress bar)                     */
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

/* Rail */
.tc-rail{--tc-gap:10px;--tc-w:calc(50% - 5px)}
@media (min-width:768px){.tc-rail{--tc-gap:12px;--tc-w:calc(20% - 9.6px)}}
.tc-track{display:flex;gap:var(--tc-gap);
  transform:translate3d(calc(var(--tc-idx,0) * -1 * (var(--tc-w) + var(--tc-gap))),0,0);
  transition:transform ${STEP_MS}ms var(--tc-ease),opacity 450ms ease}
.tc-item{width:var(--tc-w);flex:none}

/* Hop: the rail is hidden while its forward sequence is rebuilt */
.tc-track[data-fade="true"]{opacity:0;transition:opacity ${FADE_OUT_MS}ms ease}

/* Snap: reposition instantly, including the highlight ring on the cards */
.tc-track[data-snap="true"],
.tc-track[data-snap="true"] .tc-item,
.tc-track[data-snap="true"] .tc-item *{transition:none!important}

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

export function TripCarousel({
  trips,
  content,
  listingHref = '/trips',
}: {
  trips: FeaturedTrip[];
  content: HomeContent['trips'];
  listingHref?: string;
}) {
  const list = trips;
  const n = list.length;
  const multi = n > 1;

  // Enough cloned cards to fill a wide rail at the loop boundary, but no more.
  const sets = 2 + Math.ceil(VISIBLE_MAX / n);
  const total = n * sets;

  // `idx` is the rail position of the lead card. The middle copy starts at `n`.
  const [idx, setIdx] = useState(n);
  const [snap, setSnap] = useState(false);
  const [hop, setHop] = useState<Hop | null>(null);
  const [locked, setLocked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [inView, setInView] = useState(false);
  const [leavingBackground, setLeavingBackground] = useState<number | null>(null);

  const root = useRef<HTMLElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const busy = useRef(false);
  const alive = useRef(true);
  const timers = useRef<number[]>([]);

  // The detail card follows the *target* immediately, even while the rail is still staging.
  const active = hop ? hop.target : mod(idx, n);
  const fade = hop !== null && hop.stage !== 'in';

  // Trip index shown at every rail position. Natural order unless a hop is staging.
  const sequence = useMemo(() => {
    const seq = Array.from({ length: total }, (_, v) => v % n);
    if (hop && hop.stage !== 'out') {
      // Rebuild everything after the lead card so the target comes right next to it.
      for (let v = hop.from + 1; v < total; v++) {
        seq[v] = (hop.target + (v - hop.from - 1)) % n;
      }
    }
    return seq;
  }, [hop, n, total]);

  const canPlay = multi && inView && !hovered && !focused && !userPaused && !reduced && !hidden && !hop;

  /* ---------------------------- scheduling ---------------------------- */

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      fn();
    }, ms);
    timers.current.push(id);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const afterPaint = useCallback((fn: () => void) => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (alive.current) fn();
      }),
    );
  }, []);

  const lock = useCallback(() => {
    busy.current = true;
    setLocked(true);
  }, []);

  const unlock = useCallback(() => {
    busy.current = false;
    setLocked(false);
  }, []);

  /** Resolves when the hero is decoded, or after HERO_WAIT_MS, whichever comes first. */
  const heroReady = useCallback(
    (trip: FeaturedTrip) =>
      new Promise<void>((resolve) => {
        later(resolve, HERO_WAIT_MS);
        void loadHero(largeImage(trip)).then(resolve);
      }),
    [later],
  );

  /* ---------------------------- navigation ---------------------------- */

  /** Snap the rail back to the natural order, centred on `trip`. Visually identical, so no flicker. */
  const settle = useCallback(
    (trip: number) => {
      setSnap(true);
      setHop(null);
      setIdx(n + trip);
      afterPaint(() => {
        setSnap(false);
        unlock();
      });
    },
    [afterPaint, n, unlock],
  );

  /** Natural one-card move (Next, Prev, autoplay, or selecting the card right after the current one). */
  const step = useCallback(
    (dir: 1 | -1) => {
      if (!multi || busy.current) return;
      const target = mod(active + dir, n);
      lock();
      void heroReady(list[target]).then(() => {
        if (!alive.current) return;
        setLeavingBackground(active);
        if (reduced) {
          settle(target);
          return;
        }
        setIdx((i) => i + dir);
        later(() => settle(target), STEP_MS + SETTLE_PAD_MS);
      });
    },
    [active, heroReady, later, list, lock, multi, n, reduced, settle],
  );

  /** Jump to any other card: rebuild the forward sequence off-screen, then slide ONE step. */
  const hopTo = useCallback(
    (target: number) => {
      if (!multi || busy.current || target === active) return;
      const from = idx;
      lock();
      void heroReady(list[target]).then(() => {
        if (!alive.current) return;
        setLeavingBackground(active);

        if (reduced) {
          settle(target);
          return;
        }

        // 1) Top area updates now (active follows hop.target); the rail fades out.
        setHop({ target, from, stage: 'out' });

        // 2) Rail is invisible: rebuild the forward sequence without any transition.
        later(() => {
          setSnap(true);
          setHop({ target, from, stage: 'swap' });
        }, FADE_OUT_MS);

        // 3) Fade back in while sliding exactly one step; the target lands first.
        later(() => {
          setSnap(false);
          setIdx(from + 1);
          setHop({ target, from, stage: 'in' });
        }, FADE_OUT_MS + RESEQUENCE_GAP_MS);

        // 4) Back to the natural order (same visible window).
        later(() => settle(target), FADE_OUT_MS + RESEQUENCE_GAP_MS + STEP_MS + SETTLE_PAD_MS);
      });
    },
    [active, heroReady, idx, later, list, lock, multi, reduced, settle],
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  const select = useCallback(
    (target: number) => {
      if (target === active) return;
      if (mod(target - active, n) === 1) step(1);
      else hopTo(target);
    },
    [active, hopTo, n, step],
  );

  const warm = useCallback((trip: FeaturedTrip) => {
    void loadHero(largeImage(trip));
  }, []);

  /* ------------------------------ effects ----------------------------- */

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  /* Reset when the data length changes */
  useEffect(() => {
    clearTimers();
    setIdx(n);
    setSnap(false);
    setHop(null);
    setLeavingBackground(null);
    busy.current = false;
    setLocked(false);
  }, [n, clearTimers]);

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

  /* Warm every (small) thumbnail once, so re-sequencing the rail never shows a blank card. */
  useEffect(() => {
    if (!inView || !multi) return;
    return whenIdle(() => {
      list.forEach((trip) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = thumbnailImage(trip);
      });
    });
  }, [inView, list, multi]);

  /* Preload only the next likely hero; others are warmed on hover/focus. */
  useEffect(() => {
    if (!inView || !multi) return;
    const upNext = list[(active + 1) % n];
    return whenIdle(() => {
      void loadHero(largeImage(upNext));
    });
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

  /* ------------------------------ input ------------------------------- */

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
    'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-95 aria-disabled:pointer-events-none aria-disabled:opacity-45';
  const backgroundIndexes =
    leavingBackground === null || leavingBackground === active ? [active] : [leavingBackground, active];

  return (
    <section
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={content.regionLabel}
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
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f1c75b]">{content.eyebrow}</p>
              </div>
              <h2 className="font-serif text-[28px] font-bold tracking-[-0.02em] text-white md:text-[34px]">
                {content.title}
              </h2>
              <p className="mt-1.5 text-[13px] font-medium text-gray-200 md:text-sm">
                {content.description}
              </p>
            </div>

            <Link
              href={listingHref}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/50 bg-black/20 px-5 py-2.5 text-[12px] font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              {content.viewAll} <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-7 flex flex-col gap-6 md:mt-8 md:gap-7">
            {/* Big detail card — all slides share one grid cell, so height never jumps */}
            <div
              className="grid w-full max-w-[530px] rounded-[22px] border border-white/20 bg-[linear-gradient(135deg,#b48b22,hsla(0,0%,100%,.06))] p-5 shadow-[0_20px_55px_rgba(0,0,0,.42),inset_0_1px_0_rgba(255,255,255,.14)] backdrop-blur-md md:p-6"
              aria-live={canPlay ? 'off' : 'polite'}
            >
              {list.map((t, i) => {
                const on = i === active;
                const price = priceDetails(t, content);
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
                        <MapPin size={12} className="text-white" /> {t.region}
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
                          {content.details}
                        </Link>
                        <Link
                          href={`/trips/${t.slug}/book`}
                          tabIndex={on ? 0 : -1}
                          className="inline-flex items-center rounded-full bg-[#f1c75b] px-4 py-2.5 text-[12px] font-bold text-[#0d1b2a] shadow-sm transition hover:bg-[#e0b54a] hover:shadow-[0_4px_12px_rgba(241,199,91,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 active:scale-[.98]"
                        >
                          {content.bookNow} <ArrowRight size={14} className="ml-1.5" strokeWidth={2.5} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Rail: always moves exactly one step, whatever card was selected */}
            {multi && (
              <div className="tc-rail relative left-1/2 w-screen -translate-x-1/2 px-6 lg:px-10">
                <div className="mb-2.5 flex items-center justify-between">
                  <p className="text-[11px] font-medium text-white/60">{content.upNext}</p>
                  <div className="flex items-center gap-2">
                    <span className="mr-1 text-xs tabular-nums text-white/55">
                      {pad(active + 1)} / {pad(n)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUserPaused((p) => !p)}
                      className={ctrl}
                      aria-label={userPaused ? content.playSlideshow : content.pauseSlideshow}
                    >
                      {userPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                    </button>
                    <button type="button" onClick={prev} className={ctrl} aria-label={content.previousTrip} aria-disabled={locked || undefined}>
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" onClick={next} className={ctrl} aria-label={content.nextTrip} aria-disabled={locked || undefined}>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="relative overflow-hidden px-1 py-1">
                  <div
                    className="tc-track"
                    data-snap={snap}
                    data-fade={fade}
                    style={{ '--tc-idx': idx } as CSSProperties}
                  >
                    {sequence.map((tripIndex, v) => {
                      const t = list[tripIndex];
                      const isActive = v === idx;
                      const primary = v >= n && v < 2 * n; // only the middle copy is exposed to assistive tech
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => select(tripIndex)}
                          onPointerEnter={() => tripIndex !== active && warm(t)}
                          onFocus={() => tripIndex !== active && warm(t)}
                          aria-label={`Show ${t.title}`}
                          aria-current={isActive || undefined}
                          aria-hidden={!primary || undefined}
                          tabIndex={primary ? 0 : -1}
                          className={`tc-item group relative aspect-[16/9] overflow-hidden rounded-[14px] text-left transition-[opacity,transform,box-shadow] duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                            isActive
                              ? 'scale-100 opacity-100 ring-2 ring-[#f1c75b] shadow-[0_12px_32px_rgba(0,0,0,.45)]'
                              : 'scale-[.97] opacity-100 ring-1 ring-white/15'
                          }`}
                        >
                          <img
                            src={thumbnailImage(t)}
                            alt=""
                            draggable={false}
                            loading="eager"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute inset-x-0 bottom-0 block bg-[#082238]/80 px-3 py-2 backdrop-blur-[2px]">
                            <span className="line-clamp-2 block text-[13px] font-semibold leading-tight text-white">
                              {t.title}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* One progress bar pinned to the lead slot, so it never remounts when the track re-sequences */}
                  {!reduced && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-1 left-1 z-10 w-[var(--tc-w)] overflow-hidden rounded-[14px]"
                    >
                      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
                        <span key={active} data-playing={canPlay} className="tc-progress block h-full w-full bg-[#f1c75b]" />
                      </span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
