import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { BookingView } from '@/components/booking/BookingView';

export const metadata: Metadata = {
  title: 'Your booking',
  robots: { index: false, follow: false },
};

export default async function BookingPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  if (!/^LX-[A-Z0-9]{5}$/.test(reference)) {
    notFound();
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen flex flex-col">
      
      {/* THE BANNER */}
      <div className="relative w-full h-[200px] bg-[#0f172a] flex items-center overflow-hidden shrink-0">
        <img 
          src="/images/home/step1.png" 
          alt="Swiss Alps Transfer" 
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/20 to-transparent"></div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}>
            Booking <span className="text-[#eab308]">Confirmed</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-xl">
            Your booking has been successfully confirmed!
          </p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-12">
        <Suspense fallback={null}>
          <BookingView reference={reference} />
        </Suspense>
      </div>
    </div>
  );
}