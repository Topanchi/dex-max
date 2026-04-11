export class FetchError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

interface FetcherOptions extends Omit<RequestInit, 'next'> {
  revalidate?: number | false;
  tags?: string[];
}

export async function fetcher<T>(url: string, options: FetcherOptions = {}): Promise<T> {
  const { revalidate = 86400, tags, ...rest } = options;

  const nextOptions: RequestInit['next'] =
    revalidate === false ? { revalidate: 0 } : { revalidate, tags };

  const response = await fetch(url, {
    ...rest,
    next: nextOptions,
  });

  if (!response.ok) {
    throw new FetchError(
      `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      url,
    );
  }

  return response.json() as Promise<T>;
}

/** Like fetcher but returns null on error instead of throwing */
export async function fetcherSafe<T>(
  url: string,
  options: FetcherOptions = {},
): Promise<T | null> {
  try {
    return await fetcher<T>(url, options);
  } catch {
    return null;
  }
}
