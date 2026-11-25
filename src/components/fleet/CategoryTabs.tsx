import Link from 'next/link';
import type { FleetContent } from '@/content/fleet';

const TABS = [
  { value: '', copyKey: 'all' },
  { value: 'executive', copyKey: 'executive' },
  { value: 'first_class', copyKey: 'firstClass' },
  { value: 'van', copyKey: 'van' },
] as const;

export function CategoryTabs({
  active,
  basePath,
  copy,
}: {
  active: string;
  basePath: string;
  copy: Pick<FleetContent['listing'], 'categories' | 'categoriesLabel'>;
}) {
  return (
    <nav className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-full border border-[#0d1b2a]/10 bg-white/70 p-1" aria-label={copy.categoriesLabel}>
      {TABS.map((tab) => {
        const isActive = tab.value === active;
        const label = copy.categories[tab.copyKey];

        return (
          <Link
            key={tab.value || 'all'}
            href={tab.value ? `${basePath}?category=${tab.value}` : basePath}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full px-4 py-2.5 text-[11px] font-bold tracking-wide transition sm:px-5 ${
              isActive
                ? 'bg-[#0d1b2a] text-white shadow-[0_3px_10px_rgba(13,27,42,0.18)]'
                : 'text-[#506079] hover:bg-[#f8f3e9] hover:text-[#0d1b2a]'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
