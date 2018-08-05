/**
 * Detect whether we're in a browser-like environment
 */
export function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof (window as any).HTMLImageElement === 'function'
  );
}

/**
 * Detect whether we're in a Node.js-like environment
 */
export function isNode(): boolean {
  return !isBrowser();
}
