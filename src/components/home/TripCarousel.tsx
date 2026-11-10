'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/primitives';

export function TripCarousel({ trips }: { trips: any }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scrollAmount = 292; 

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const displayTrips = trips?.data && trips.data.length > 0 ? trips.data : [
    { slug: 'zurich-heritage', price: 'CHF 490', title: 'Zurich Heritage & Lake Tour', location: 'Zurich', duration: '6 Hours', desc: "Explore Zurich's historic old town, landmarks and beautiful lakeside.", img: '/images/home/tour-zurich.jpg' },
    { slug: 'lucerne-titlis', price: 'CHF 590', title: 'Lucerne & Mount Titlis', location: 'Lucerne', duration: '8 Hours', desc: 'Discover Lucerne and the spectacular Mount Titlis with alpine views.', img: '/images/home/tour-lucerne.jpg' },
    { slug: 'rhine-falls', price: 'CHF 390', title: 'Rhine Falls Day Trip', location: 'Schaffhausen', duration: '5 Hours', desc: "Experience Europe's largest waterfall and the charming town of Schaffhausen.", img: '/images/home/tour-rhine-falls.jpg' },
    { slug: 'interlaken-alpine', price: 'CHF 690', title: 'Interlaken Alpine Escape', location: 'Interlaken', duration: '10 Hours', desc: 'Enjoy breathtaking alpine scenery, lakes and the charm of Interlaken.', img: '/images/home/tour-interlaken.jpg' },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0d1b2a] py-4 text-white md:py-6">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/home/picswi.jpg')` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#03192e]/70" aria-hidden="true" />
      
      <Container className="relative z-10">
        <div className="mb-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="h-[3px] w-6 bg-[#f1c75b]" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-[#f1c75b]">
                Featured Day Trips & Tours
              </p>
            </div>
            <h2 className="font-serif text-3xl font-bold text-white md:text-[32px]">
              Discover Switzerland’s Highlights
            </h2>
          </div>
          
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <p className="max-w-xs text-[10px] leading-relaxed text-gray-200">
              Fixed-price tours to Switzerland’s most iconic destinations.
            </p>
            
            {/* The "View All Tours" Link remains in the header */}
            <Link 
              href="/trips" 
              className="ml-2 flex items-center gap-1.5 rounded-full border border-white/50 bg-[#061d3155] px-4 py-2.5 text-[10px] font-bold text-white transition hover:bg-white/10"
            >
              View All Tours <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Wrapper for relative positioning of the arrows */}
        <div className="relative">
          
          {/* Backward Button - Absolute Left */}
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 -ml-4 items-center justify-center rounded-full border border-white/20 bg-[#0d1b2a]/80 text-white shadow-lg backdrop-blur-md transition hover:bg-[#0d1b2a]"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          {/* The Carousel Track */}
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {displayTrips.map((trip: any, i: number) => (
              <div 
                key={i} 
                className="group flex w-[240px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-white text-[#14202d] shadow-[0_4px_12px_rgba(0,24,33,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[260px] lg:w-[280px]"
              >
                
                <div className="relative w-full h-[112px] shrink-0 overflow-hidden">
                  <img 
                    src={trip.img || '/images/home/tour-placeholder.jpg'} 
                    alt={trip.title} 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                  />
                  <div className="absolute left-2.5 top-2.5 z-10 rounded-full bg-[linear-gradient(135deg,#ffe08a,#eab039)] px-3 py-1.5 text-[12px] font-bold text-[#14202d] shadow-sm">
                    {trip.price || `CHF ${trip.price}`}
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col px-3 py-2.5">
                  <h3 className="text-[14px] font-sans font-bold leading-tight text-black line-clamp-1">
                    {trip.title}
                  </h3>
                  
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] font-sans font-medium text-black">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#d38b12]" /> {trip.location || trip.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-[#d38b12]" /> {trip.duration}
                    </span>
                  </div>
                  
                  <p className="mt-1.5 line-clamp-2 min-h-[31px] font-sans text-[10px] leading-relaxed text-black">
                    {trip.desc || trip.description}
                  </p>

                  <div className="mt-auto flex gap-2 pt-2">
                    <Link 
                      href={`/trips/${trip.slug}`}
                      className="flex flex-1 items-center justify-center rounded-full border border-[#aab0b5] bg-white py-1.5 text-[10px] font-bold text-black transition hover:bg-gray-50"
                    >
                      Details
                    </Link>
                    <Link 
                      href={`/trips/${trip.slug}/book`}
                      className="flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(135deg,#f8d77a,#e7a91f)] py-1.5 text-[10px] font-bold text-black transition hover:bg-[#e0b54a]"
                    >
                      Book Now <ArrowRight size={12} className="ml-1" strokeWidth={2.5} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Forward Button - Absolute Right */}
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 -mr-4 items-center justify-center rounded-full border border-white/20 bg-[#0d1b2a]/80 text-white shadow-lg backdrop-blur-md transition hover:bg-[#0d1b2a]"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>

        </div>
      </Container>
    </section>
  );
}