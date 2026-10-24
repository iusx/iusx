type Activate = () => Promise<void>;

const sections = new Map<Element, Activate>();
const pending = new Set<Element>();
let observer: IntersectionObserver | undefined;
let frame: number | undefined;

function drain() {
  frame = undefined;
  const element = pending.values().next().value as Element | undefined;
  if (!element) return;
  pending.delete(element);
  // A restored scroll position can expose several sections at once. Yield
  // between them instead of turning deferred work into another long task.
  void sections.get(element)?.();
  if (pending.size) frame = requestAnimationFrame(drain);
}

export function registerArticleSection(element: Element, activate: Activate) {
  sections.set(element, activate);
  if (typeof IntersectionObserver === "undefined") {
    pending.add(element);
    frame ??= requestAnimationFrame(drain);
  } else {
    observer ??= new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        pending.add(entry.target);
      }
      if (pending.size) frame ??= requestAnimationFrame(drain);
    }, { rootMargin: "1200px 0px" });
    observer.observe(element);
  }
  return () => {
    sections.delete(element);
    pending.delete(element);
    observer?.unobserve(element);
    if (!sections.size) {
      observer?.disconnect();
      observer = undefined;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    }
  };
}

export async function activateArticleSection(element: Element | null) {
  const section = element?.closest(".article-section");
  if (section) await sections.get(section)?.();
}
