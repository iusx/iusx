/** Preload each source once and release listeners when the caller leaves. */
export function preloadImages(sources: string[], onComplete: () => void) {
  const uniqueSources = [...new Set(sources.filter(Boolean))];
  const pending = new Set<HTMLImageElement>();
  let remaining = uniqueSources.length;
  let stopped = false;

  if (remaining === 0) onComplete();

  for (const source of uniqueSources) {
    const image = new Image();
    let settled = false;
    const settle = () => {
      if (stopped || settled) return;
      settled = true;
      image.onload = image.onerror = null;
      pending.delete(image);
      if (--remaining === 0) onComplete();
    };

    pending.add(image);
    image.onload = image.onerror = settle;
    image.src = source;
    // Cached images can finish before the browser dispatches a load event.
    if (image.complete) settle();
  }

  return () => {
    stopped = true;
    for (const image of pending) image.onload = image.onerror = null;
    pending.clear();
  };
}
