import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { MARQUEE } from '../data/portfolio';

@Component({
  selector: 'div[appMarquee]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'marquee', 'aria-hidden': 'true', '(mouseenter)': 'rate(0.25)', '(mouseleave)': 'rate(1)' },
  template: `
    <div class="track" #track>
      @for (s of items; track $index) {
        <span>{{ s }} ✦</span>
      }
    </div>
  `,
})
export class MarqueeComponent {
  /** Doubled so the -50% slide loops seamlessly. */
  protected readonly items = [...MARQUEE, ...MARQUEE];
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  /** Slow the ticker down on hover so it can be read. */
  protected rate(v: number): void {
    try {
      this.track().nativeElement.getAnimations().forEach((a) => (a.playbackRate = v));
    } catch {
      /* Web Animations API unavailable */
    }
  }
}
