import { fallbackPublicConfig, getPublicConfig, type PublicConfig } from './public-config';

export interface PlaceSuggestion {
  placeId: string;
  text: string;
}

interface AutocompleteResponse {
  suggestions?: Array<{
    placePrediction?: { placeId: string; text?: { text: string } };
  }>;
}

// Share config requests across address fields and refresh after one minute.
let serviceAreaRequest: Promise<PublicConfig['serviceArea']> | undefined;
let serviceAreaExpiresAt = 0;

function getServiceArea(): Promise<PublicConfig['serviceArea']> {
  if (!serviceAreaRequest || Date.now() >= serviceAreaExpiresAt) {
    serviceAreaExpiresAt = Date.now() + 60_000;
    serviceAreaRequest = getPublicConfig()
      .then((publicConfig) => publicConfig.serviceArea)
      .catch(() => fallbackPublicConfig().serviceArea);
  }
  return serviceAreaRequest;
}

/**
 * Address suggestions from Google Places API (New), restricted by the public service-area config, with local fallback countries.
 * Returns an empty list when no browser key is set, so the form can still show a clear message.
 */
export async function autocompletePlaces(
  input: string,
  sessionToken: string,
  googleBrowserKey: string,
  signal?: AbortSignal,
): Promise<PlaceSuggestion[]> {
  if (!googleBrowserKey || input.trim().length < 3) {
    if (input.trim().length >= 3) {
      console.warn('[Places autocomplete] No Google Maps browser key is available.');
    }
    return [];
  }

  const serviceArea = await getServiceArea();
  signal?.throwIfAborted();

  const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': googleBrowserKey,
    },
    body: JSON.stringify({
      input,
      ...(serviceArea.enforced ? { includedRegionCodes: serviceArea.allowedCountries } : {}),
      sessionToken,
    }),
  });

  if (!res.ok) {
    console.error('[Places autocomplete] Google Places request failed:', res.status, await res.text());
    return [];
  }

  const json = (await res.json()) as AutocompleteResponse;

  const suggestions = (json.suggestions ?? []).flatMap((s) =>
    s.placePrediction
      ? [{ placeId: s.placePrediction.placeId, text: s.placePrediction.text?.text ?? '' }]
      : [],
  );

  console.log('[Places autocomplete] Suggestions returned:', suggestions);
  return suggestions;
}
