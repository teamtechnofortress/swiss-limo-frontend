import type { Metadata } from 'next';
import { BookingFlow } from '@/components/booking/BookingFlow';
import { Container } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Book a journey',
  description: 'Plan your private chauffeur journey: choose your route, your vehicle and pay securely.',
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const passengers = Number(params.passengers);

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
      
      <div className="relative w-full h-[200px] bg-[#0f172a] flex items-center overflow-hidden shrink-0">
        <img 
          src="/images/home/hero.png" 
          alt="Swiss Alps Transfer" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">
            Book Your <span className="text-[#eab308]">Transfer</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-xl">
            Airport transfers, city rides and private tours across Switzerland.
          </p>
        </div>
      </div>

      {/* Negative margin pulls the form up over the banner. flex-1 pushes footer down. */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-12">
        <BookingFlow
          from={params.from}
          to={params.to}
          date={params.date}
          time={params.time}
          passengers={Number.isInteger(passengers) && passengers > 0 ? passengers : undefined}
          vehicle={params.vehicle}
        />
      </div>
    </div>
  );
}