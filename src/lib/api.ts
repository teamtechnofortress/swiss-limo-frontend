import { config } from './config';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

type ApiOptions = Omit<RequestInit, 'headers'> & {
  headers?: Record<string, string>;
  /** Access token for booking routes, sent as X-Access-Token. */
  token?: string;
  next?: { revalidate?: number };
};

/** Calls the Laravel API and turns error responses into ApiError with the backend's message. */
export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const hasBody = rest.body !== undefined;

  const res = await fetch(`${config.apiUrl}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { 'X-Access-Token': token } : {}),
      ...headers,
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const code = json?.error?.code ?? 'error';
    const message =
      json?.error?.message ?? json?.message ?? 'Something went wrong. Please try again.';
    throw new ApiError(res.status, code, message);
  }

  return json as T;
}
