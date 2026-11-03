import { redirect } from 'next/navigation';

/** Legacy URL retained for existing links and bookmarks. */
export default function ToursPage() {
  redirect('/trips');
}
