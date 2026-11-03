import Link from 'next/link';

const TABS = [
  { value: '', label: 'All vehicles' },
  { value: 'executive', label: 'Executive' },
  { value: 'first_class', label: 'First class' },
  { value: 'van', label: 'Vans' },
];

export function CategoryTabs({ active }: { active: string }) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Vehicle categories">
      {TABS.map((tab) => {
        const isActive = tab.value === active;

        return (
          <Link
            key={tab.label}
            href={tab.value ? `/fleet?category=${tab.value}` : '/fleet'}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full border px-5 py-2.5 text-sm tracking-wide transition ${
              isActive
                ? 'border-gold bg-gold-gradient text-ink'
                : 'border-line text-ivory/70 hover:border-gold/60 hover:text-gold'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
