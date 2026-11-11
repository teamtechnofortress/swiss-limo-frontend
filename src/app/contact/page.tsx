import type { Metadata } from 'next';
import { CheckCircle2, Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { Container } from '@/components/ui/primitives';
import { getTripDetail } from '@/lib/trips';
import { getVehicle } from '@/lib/fleet';
import { fallbackPublicConfig, getPublicConfig } from '@/lib/public-config';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact our team for enquiries, custom tours and bespoke journeys.',
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; trip?: string; vehicle?: string }>;
}) {
  const { trip: tripSlug, vehicle: vehicleSlug } = await searchParams;

  const [trip, vehicle, publicConfig] = await Promise.all([
    tripSlug && tripSlug !== 'custom' ? getTripDetail(tripSlug).catch(() => null) : null,
    vehicleSlug ? getVehicle(vehicleSlug) : null,
    getPublicConfig().catch(() => fallbackPublicConfig()),
  ]);

  const subject = trip
    ? `Enquiry: ${trip.title}`
    : vehicle
      ? `Price request: ${vehicle.name}`
      : tripSlug === 'custom'
        ? 'Custom trip enquiry'
        : 'Enquiry';

  const { email, phone, address } = publicConfig.site.contact;
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : null;

  const contextLabel = trip?.title ?? vehicle?.name;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#0d1b2a]">
      <section className="relative flex min-h-[235px] items-center overflow-hidden bg-[#0d1b2a] py-12 md:min-h-[265px]">
        <img src="/images/home/step1.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,42,0.95)_0%,rgba(13,27,42,0.82)_44%,rgba(13,27,42,0.26)_100%)]" />
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[3px] w-8 bg-[#f1c75b]" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">Swiss premium chauffeur service</p>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl">Let&apos;s plan your <span className="text-[#f1c75b]">journey.</span></h1>
            <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-slate-100 md:text-base">Send us your request and our travel team will prepare every detail with Swiss precision.</p>
          </div>
        </Container>
      </section>

      <Container className="relative z-10 -mt-9 pb-16 md:-mt-12 md:pb-24">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_-18px_rgba(15,31,56,0.35)] md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1c9] text-[#9c6c14]"><Phone size={19} /></span>
                <div><p className="font-serif text-2xl font-bold text-[#0d1b2a]">Contact us</p><p className="text-[11px] text-slate-500">Our team is here to help.</p></div>
              </div>
              <ul className="space-y-4">
                {email && <li className="flex gap-3"><Mail className="mt-0.5 shrink-0 text-[#d7961e]" size={17} /><a href={mailto ?? undefined} className="break-all text-sm font-semibold text-[#0d1b2a] transition hover:text-[#b6780c]">{email}</a></li>}
                {phone && <li className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-[#d7961e]" size={17} /><a href={`tel:${phone}`} className="text-sm font-semibold text-[#0d1b2a] transition hover:text-[#b6780c]">{phone}</a></li>}
                {address && <li className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#d7961e]" size={17} /><span className="text-sm leading-relaxed text-slate-600">{address}</span></li>}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#0d1b2a] p-6 text-white shadow-[0_15px_35px_-18px_rgba(15,31,56,0.6)] md:p-7">
              <p className="font-serif text-2xl font-bold">Why enquire with us?</p>
              <div className="mt-5 space-y-4">
                {[
                  { icon: Clock3, title: 'Fast response', text: 'A personal reply within one working day.' },
                  { icon: ShieldCheck, title: 'Tailored service', text: 'Every itinerary is planned around your needs.' },
                  { icon: CheckCircle2, title: 'No obligation', text: 'Receive a clear, considered quote before booking.' },
                ].map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f1c75b]/40 bg-white/5 text-[#f1c75b]"><Icon size={15} /></span><div><p className="text-sm font-bold">{title}</p><p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">{text}</p></div></div>)}
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-24px_rgba(15,31,56,0.38)] sm:p-7 lg:col-span-8 lg:p-9">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#40516b]">Enquiry form</p></div>
                <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl">{subject}</h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">Tell us a little about your plans and we&apos;ll take care of the rest.</p>
            </div>
            <EnquiryForm
              tripSlug={trip?.slug}
              vehicleSlug={vehicle?.slug}
              sourcePath={trip ? `/trips/${trip.slug}` : vehicle ? `/fleet/${vehicle.slug}` : undefined}
              contextLabel={contextLabel}
              turnstileEnabled={publicConfig.turnstileEnabled}
              turnstileSiteKey={publicConfig.turnstileSiteKey}
            />
          </section>
        </div>
      </Container>
    </div>
  );
}
