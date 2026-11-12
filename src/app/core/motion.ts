/** True when the visitor asked the OS for reduced motion. Safe outside a browser. */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True for a mouse or trackpad (hover-capable, fine pointer). */
export function hasFinePointer(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Smooth-scroll to an element id, honouring reduced motion. */
export function scrollToId(id: string, block: ScrollLogicalPosition = 'start'): void {
  document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block });
}
