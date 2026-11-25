import { CheckCircle2, Clock3, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { Container } from '@/components/ui/primitives';
import type { ContactContent } from '@/content/contact';
import type { PublicConfig } from '@/lib/public-config';

type ContactContext = {
  trip?: { slug: string; title: string } | null;
  vehicle?: { slug: string; name: string } | null;
  customTrip?: boolean;
};

function fill(template: string, name: string): string {
  return template.replace('{name}', name);
}

export function ContactPage({
  content,
  publicConfig,
  trip,
  vehicle,
  customTrip = false,
}: {
  content: ContactContent;
  publicConfig: PublicConfig;
} & ContactContext) {
  const subject = trip
    ? fill(content.enquiry.subject.tripTemplate, trip.title)
    : vehicle
      ? fill(content.enquiry.subject.vehicleTemplate, vehicle.name)
      : customTrip
        ? content.enquiry.subject.customTrip
        : content.enquiry.subject.general;
  const contextLabel = trip?.title ?? vehicle?.name;
  const { email, phone, address } = publicConfig.site.contact;
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : undefined;
  const benefitIcons = [Clock3, ShieldCheck, CheckCircle2];

  return (
    <div className="min-h-screen bg-white text-[#0d1b2a]">
      <section className="bg-white">
        <Container className="pb-4 pt-10 md:pb-6 md:pt-12">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3"><span className="h-[3px] w-8 bg-[#f1c75b]" /></div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-[#0d1b2a] md:text-5xl">{content.hero.titleBefore} <span className="text-[#b6780c]">{content.hero.titleHighlight}</span></h1>
          </div>
        </Container>
      </section>

      <Container className="pb-16 pt-4 md:pb-24 md:pt-6">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_-18px_rgba(15,31,56,0.35)] md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1c9] text-[#9c6c14]"><Phone size={19} /></span>
                <div><p className="font-serif text-2xl font-bold text-[#0d1b2a]">{content.details.title}</p><p className="text-[11px] text-slate-500">{content.details.description}</p></div>
              </div>
              <ul className="space-y-4">
                {email && <li className="flex gap-3"><Mail className="mt-0.5 shrink-0 text-[#d7961e]" size={17} /><a href={mailto} className="break-all text-sm font-semibold text-[#0d1b2a] transition hover:text-[#b6780c]">{email}</a></li>}
                {phone && <li className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-[#d7961e]" size={17} /><a href={`tel:${phone}`} className="text-sm font-semibold text-[#0d1b2a] transition hover:text-[#b6780c]">{phone}</a></li>}
                {address && <li className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#d7961e]" size={17} /><span className="text-sm leading-relaxed text-slate-600">{address}</span></li>}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl bg-[#0d1b2a] p-6 text-white shadow-[0_15px_35px_-18px_rgba(15,31,56,0.6)] md:p-7">
              <p className="font-serif text-2xl font-bold">{content.benefits.title}</p>
              <div className="mt-5 space-y-4">
                {content.benefits.items.map(({ title, text }, index) => {
                  const Icon = benefitIcons[index] ?? CheckCircle2;
                  return <div key={title} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f1c75b]/40 bg-white/5 text-[#f1c75b]"><Icon size={15} /></span><div><p className="text-sm font-bold">{title}</p><p className="mt-0.5 text-[11px] leading-relaxed text-slate-300">{text}</p></div></div>;
                })}
              </div>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-24px_rgba(15,31,56,0.38)] sm:p-7 lg:col-span-8 lg:p-9">
            <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3"><span className="h-[3px] w-7 bg-[#f1c75b]" /><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#40516b]">{content.enquiry.eyebrow}</p></div>
                <h2 className="font-serif text-3xl font-bold text-[#0d1b2a] md:text-4xl">{subject}</h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-slate-500">{content.enquiry.intro}</p>
            </div>
            <EnquiryForm
              tripSlug={trip?.slug}
              vehicleSlug={vehicle?.slug}
              sourcePath={trip ? `/trips/${trip.slug}` : vehicle ? `/fleet/${vehicle.slug}` : undefined}
              contextLabel={contextLabel}
              copy={content.enquiry.form}
              turnstileEnabled={publicConfig.turnstileEnabled}
              turnstileSiteKey={publicConfig.turnstileSiteKey}
            />
          </section>
        </div>
      </Container>
    </div>
  );
}
