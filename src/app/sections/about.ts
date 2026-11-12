import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { ABOUT } from '../data/portfolio';
import { prefersReducedMotion } from '../core/motion';

@Component({
  selector: 'section[appAbout]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'about', 'aria-labelledby': 'about-h' },
  template: `
    <div class="sec-head"><h2 id="about-h">{{ a.heading }}</h2><p>{{ a.kicker }}</p></div>
    <div class="about">
      <p class="lead">{{ a.leadBefore }}<mark>{{ a.leadMark }}</mark>{{ a.leadAfter }}</p>
      <div class="side">
        @for (s of a.stats; track s.title; let i = $index) {
          <div class="stat">
            <span class="n">{{ shown()[i] }}</span>
            <p><b>{{ s.title }}</b>{{ s.text }}</p>
          </div>
        }
      </div>
      <div class="facts">
        @for (f of a.facts; track f) {
          <span class="chip">{{ f }}</span>
        }
      </div>
    </div>
  `,
})
export class AboutComponent {
  protected readonly a = ABOUT;
  /** Starts at the final values so the numbers read correctly even with no animation. */
  protected readonly shown = signal(ABOUT.stats.map((s) => s.value));

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
      const nodes = Array.from(host.nativeElement.querySelectorAll<HTMLElement>('.stat .n'));
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            this.countUp(nodes.indexOf(e.target as HTMLElement));
          }),
        { threshold: 0.6 },
      );
      nodes.forEach((n) => io.observe(n));
      destroyRef.onDestroy(() => io.disconnect());
    });
  }

  private countUp(i: number): void {
    const end = ABOUT.stats[i].value;
    const start = performance.now();
    const frame = (now: number) => {
      const p = Math.min((now - start) / 900, 1);
      this.shown.update((v) => v.map((x, j) => (j === i ? Math.round(end * (1 - Math.pow(1 - p, 3))) : x)));
      if (p < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
