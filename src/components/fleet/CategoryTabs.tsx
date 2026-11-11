import Link from 'next/link';

const TABS = [
  { value: '', label: 'All vehicles' },
  { value: 'executive', label: 'Executive' },
  { value: 'first_class', label: 'First class' },
  { value: 'van', label: 'Vans' },
];

export function CategoryTabs({ active }: { active: string }) {
  return (
    <nav className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full bg-[#edf0f4] p-1" aria-label="Vehicle categories">
      {TABS.map((tab) => {
        const isActive = tab.value === active;

        return (
          <Link
            key={tab.label}
            href={tab.value ? `/fleet?category=${tab.value}` : '/fleet'}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full px-4 py-2.5 text-[11px] font-bold tracking-wide transition sm:px-5 ${
              isActive
                ? 'bg-[#0d1b2a] text-white shadow-[0_3px_10px_rgba(13,27,42,0.18)]'
                : 'text-[#506079] hover:bg-white hover:text-[#0d1b2a]'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
