/** Sections from the narrowly sanitized CMS HTML; the API contract is unchanged. */
export function tripContentSections(html: string) {
  const sections: Record<string, string> = {};
  for (const match of html.matchAll(/<section class="(tour-[a-z-]+)">([\s\S]*?)<\/section>/g)) {
    sections[match[1]] = match[2];
  }
  const body = (key: string) => (sections[key] ?? '').replace(/<h2\b[^>]*>[\s\S]*?<\/h2>/, '');
  return {
    overview: body('tour-overview-section'),
    countries: body('tour-countries-section'),
    stops: body('tour-stops-section'),
    itinerary: body('tour-itinerary-section'),
    inclusions: body('tour-inclusions-section'),
    stopCount: (sections['tour-stops-section']?.match(/class="stop-card"/g) ?? []).length,
    countryCount: (sections['tour-countries-section']?.match(/class="country-pill"/g) ?? []).length,
    // Keep older unstructured rich text visible, but omit Travel Comfort as requested.
    fallback: Object.keys(sections).length ? '' : html,
  };
}
