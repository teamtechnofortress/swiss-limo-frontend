import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 lg:px-10 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-24 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] uppercase tracking-[0.4em] text-gold ${className}`}>{children}</p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}) {
  const alignClass = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      <h2 className="text-4xl leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-5 text-base leading-relaxed text-mute md:text-lg">{subtitle}</p>}
      <GoldRule className={align === 'center' ? 'mx-auto mt-8' : 'mt-8'} />
    </div>
  );
}

export function GoldRule({ className = '' }: { className?: string }) {
  return <div className={`h-px w-16 bg-gold-gradient ${className}`} aria-hidden="true" />;
}

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition duration-300 disabled:pointer-events-none disabled:opacity-50';

const buttonVariants = {
  gold: 'bg-[#f1c75b] text-[#0d1b2a] shadow-none hover:bg-[#e0b54a] hover:shadow-[0_4px_12px_rgba(241,199,91,0.4)] hover:-translate-y-0.5',
  outline: 'border border-gold/60 text-gold hover:bg-gold/10',
  ghost: 'text-ivory/80 hover:text-gold',
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClasses(variant: ButtonVariant = 'gold', extra = ''): string {
  return `${buttonBase} ${buttonVariants[variant]} ${extra}`;
}

export function ButtonLink({
  href,
  children,
  variant = 'gold',
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant = 'gold',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button className={buttonClasses(variant, className)} {...props}>
      {children}
    </button>
  );
}

export const inputClass =
  'w-full rounded-xl border border-line bg-ink-soft px-4 py-3.5 text-[15px] text-ivory placeholder:text-mute/70 transition focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/60';

export function Field({
  label,
  children,
  hint,
  error,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-mute">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-mute/80">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-line bg-ink-soft/80 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}

/** Elegant stand-in for a vehicle photo until real images are uploaded. */
export function ImagePlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink-raised via-ink-soft to-ink ${className}`}
      role="img"
      aria-label={`${label} photo placeholder`}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #c9a96e 0 1px, transparent 1px 18px)',
        }}
        aria-hidden="true"
      />
      <span className="relative font-serif text-3xl italic text-gold/70">{label}</span>
    </div>
  );
}