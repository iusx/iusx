const cacheTtl = 5 * 60 * 1000;

interface GithubRequest {
  promise: Promise<unknown>;
  controller: AbortController;
  subscribers: number;
  settled: boolean;
  expiresAt: number;
}

// Called from onMounted in git-info; the cache holds public client-side API data.
const requests = new Map<string, GithubRequest>();

export function fetchGithubJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const abortError = () => new DOMException("The request was aborted", "AbortError");
  if (signal.aborted) return Promise.reject(abortError());

  const now = Date.now();
  for (const [key, request] of requests) {
    if (request.settled && request.expiresAt <= now) requests.delete(key);
  }

  let request = requests.get(url);
  if (!request) {
    const entry: GithubRequest = {
      promise: Promise.resolve(),
      controller: new AbortController(),
      subscribers: 0,
      settled: false,
      expiresAt: Infinity,
    };
    requests.set(url, entry);
    entry.promise = (async () => {
      try {
        const response = await fetch(url, { signal: entry.controller.signal });
        if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
        const data: unknown = await response.json();
        entry.expiresAt = Date.now() + cacheTtl;
        return data;
      } catch (error) {
        // Rate limits and network failures must be retryable on the next visit.
        if (requests.get(url) === entry) requests.delete(url);
        throw error;
      } finally {
        entry.settled = true;
      }
    })();
    request = entry;
  }

  const sharedRequest = request;
  sharedRequest.subscribers++;
  return new Promise<T>((resolve, reject) => {
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      signal.removeEventListener("abort", onAbort);
      sharedRequest.subscribers--;
      if (!sharedRequest.settled && sharedRequest.subscribers === 0) {
        if (requests.get(url) === sharedRequest) requests.delete(url);
        sharedRequest.controller.abort();
      }
    };
    const onAbort = () => {
      release();
      reject(abortError());
    };

    signal.addEventListener("abort", onAbort, { once: true });
    sharedRequest.promise.then((data) => {
      if (released) return;
      release();
      resolve(data as T);
    }, (error) => {
      if (released) return;
      release();
      reject(error);
    });
  });
}
