import type { BookingContent } from '@/content/booking';
import { BookingFlow } from '@/components/booking/BookingFlow';

type BookingPageProps = {
  content: BookingContent;
  locale: string;
  searchParams: Record<string, string | undefined>;
};

export function BookingPage({ content, locale, searchParams }: BookingPageProps) {
  const passengers = Number(searchParams.passengers);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <div className="relative flex min-h-[164px] w-full shrink-0 items-center overflow-hidden bg-[#0f172a] pt-16 sm:pt-20 xl:pt-24 md:h-[184px] xl:h-[216px]">
        <img
          src="/images/home/step1.png"
          alt={content.hero.imageAlt}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/20 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl -translate-y-3 px-4 sm:px-6 lg:px-8">
          <h1 data-header-solid-trigger className="mb-0 font-serif text-2xl font-bold text-white md:text-4xl" style={{ textShadow: '0.5px 0 0 currentColor, -0.5px 0 0 currentColor, 0 0.5px 0 currentColor, 0 -0.5px 0 currentColor' }}>
            {content.hero.titleBefore} <span className="text-[#eab308]">{content.hero.titleHighlight}</span>
          </h1>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-10 w-full max-w-7xl flex-1 px-4 pb-12 sm:px-6 lg:px-8">
        <BookingFlow
          from={searchParams.from}
          to={searchParams.to}
          date={searchParams.date}
          time={searchParams.time}
          passengers={Number.isInteger(passengers) && passengers > 0 ? passengers : undefined}
          vehicle={searchParams.vehicle}
          roundTrip={searchParams.roundTrip === 'true'}
          content={content}
          locale={locale}
        />
      </div>
    </div>
  );
}
