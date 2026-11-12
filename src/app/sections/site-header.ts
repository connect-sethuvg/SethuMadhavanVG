import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

@Component({
  selector: 'header[appSiteHeader]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bar', '(window:scroll)': 'update()', '(window:resize)': 'update()' },
  template: `
    <div class="bar-in">
      <a class="logo" href="#top" aria-label="Sethu Madhavan V G, back to top">SETHU<span>.</span>VG</a>
      <nav class="nav" aria-label="Sections">
        @for (s of sections; track s.id) {
          <a [href]="'#' + s.id" [class.on]="active() === s.id">{{ s.label }}</a>
        }
      </nav>
      <div class="load" aria-hidden="true">
        <div class="load-track"><div class="load-fill" [style.width.%]="progress()"></div></div>
        <span class="crt">{{ progressLabel() }}</span>
      </div>
    </div>
  `,
})
export class SiteHeaderComponent {
  protected readonly sections = SECTIONS;
  protected readonly progress = signal(0);
  protected readonly active = signal<string | null>(null);

  protected readonly progressLabel = computed(() => String(this.progress()).padStart(3, '0') + '%');

  constructor() {
    queueMicrotask(() => this.update());
  }

  protected update(): void {
    const d = document.documentElement;
    const max = d.scrollHeight - d.clientHeight;
    this.progress.set(max > 0 ? Math.round((d.scrollTop / max) * 100) : 0);
    const y = window.scrollY + 120;
    const hit = SECTIONS.find((s) => {
      const el = document.getElementById(s.id);
      return el && el.offsetTop <= y && el.offsetTop + el.offsetHeight > y;
    });
    this.active.set(hit?.id ?? null);
  }
}
