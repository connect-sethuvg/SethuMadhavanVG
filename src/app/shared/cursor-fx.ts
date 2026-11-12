import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild,
} from '@angular/core';
import { ProjectsStore } from '../core/projects.store';
import { Project } from '../data/portfolio';
import { hasFinePointer, prefersReducedMotion } from '../core/motion';
import { ProjectVisualComponent } from './project-visual';

/**
 * Decorative pointer effects:
 * 1. a grid-snapped pixel trail on a canvas behind the content,
 * 2. a context label that follows the mouse,
 * 3. a peek of a closed project's visual while hovering its row.
 */
@Component({
  selector: 'app-cursor-fx',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectVisualComponent],
  template: `
    <canvas class="pixels" #canvas aria-hidden="true"></canvas>
    <div class="ctx" aria-hidden="true" [style.--x.px]="pos().x + 16" [style.--y.px]="pos().y + 18" [style.--s]="label() ? 1 : 0">{{ label() }}</div>
    <div class="peek" #peek aria-hidden="true" [class.on]="peekProject()" [style.--x.px]="peekPos().x" [style.--y.px]="peekPos().y">
      @if (peekProject(); as p) {
        <app-project-visual [visual]="p.visual" [animate]="false" />
      }
    </div>
  `,
})
export class CursorFxComponent {
  private readonly store = inject(ProjectsStore);
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly peekEl = viewChild.required<ElementRef<HTMLElement>>('peek');

  protected readonly label = signal('');
  protected readonly pos = signal({ x: -200, y: -200 });
  protected readonly peekProject = signal<Project | null>(null);
  protected readonly peekPos = signal({ x: -400, y: -400 });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const off: (() => void)[] = [];
      const on = <K extends keyof WindowEventMap>(t: EventTarget, type: K, fn: (e: WindowEventMap[K]) => void) => {
        t.addEventListener(type, fn as EventListener, { passive: true });
        off.push(() => t.removeEventListener(type, fn as EventListener));
      };
      if (!prefersReducedMotion()) this.startTrail(on, off);
      if (hasFinePointer()) this.startContext(on);
      destroyRef.onDestroy(() => off.forEach((f) => f()));
    });
  }

  private startTrail(on: Listen, off: (() => void)[]): void {
    const c = this.canvas().nativeElement;
    const x = c.getContext('2d');
    if (!x) return;
    const css = getComputedStyle(document.documentElement);
    const inks = [1, 2, 3, 4, 5, 6].map((i) => css.getPropertyValue('--glow-' + i).trim() || '#5B7BFF');
    const CELL = 14;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const cells = new Map<string, { i: number; j: number; col: string; born: number; life: number }>();
    let W = 0, H = 0, hue = 0, running = false, alive = true;
    let last: [number, number] | null = null;
    off.push(() => (alive = false));

    const size = () => {
      W = innerWidth;
      H = innerHeight;
      c.width = W * dpr;
      c.height = H * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const light = (i: number, j: number, now: number) => {
      cells.set(i + ',' + j, { i, j, col: inks[(hue++ >> 2) % inks.length], born: now, life: 2000 + Math.random() * 2000 });
      if (cells.size > 500) cells.delete(cells.keys().next().value!);
    };
    const draw = (now: number) => {
      x.clearRect(0, 0, W, H);
      cells.forEach((p, k) => {
        const t = (now - p.born) / p.life;
        if (t >= 1) return void cells.delete(k);
        x.globalAlpha = (Math.ceil((1 - t) * 4) / 4) * 0.75; // stepped fade, like an old screen
        x.fillStyle = p.col;
        x.fillRect(p.i * CELL + 1, p.j * CELL + 1, CELL - 2, CELL - 2);
      });
      x.globalAlpha = 1;
      if (cells.size && alive) requestAnimationFrame(draw);
      else running = false;
    };
    const kick = () => {
      if (!running) {
        running = true;
        requestAnimationFrame(draw);
      }
    };
    const trail = (px: number, py: number) => {
      const now = performance.now(), ci = Math.floor(px / CELL), cj = Math.floor(py / CELL);
      if (last) {
        const di = ci - last[0], dj = cj - last[1], n = Math.max(Math.abs(di), Math.abs(dj));
        for (let s = 1; s <= n; s++) light(last[0] + Math.round((di * s) / n), last[1] + Math.round((dj * s) / n), now);
      }
      light(ci, cj, now);
      for (let r = 0; r < 2; r++)
        if (Math.random() < 0.5) light(ci + Math.round((Math.random() - 0.5) * 4), cj + Math.round((Math.random() - 0.5) * 4), now);
      last = [ci, cj];
      kick();
    };

    size();
    on(window, 'resize', size);
    on(window, 'pointermove', (e) => trail(e.clientX, e.clientY));
    on(document, 'mouseleave', () => (last = null));
    on(window, 'scroll', () => (last = null));
    on(window, 'pointerdown', (e) => {
      const now = performance.now(), ci = Math.floor(e.clientX / CELL), cj = Math.floor(e.clientY / CELL);
      for (let a = 0; a < 24; a++) {
        const ang = (a / 24) * 6.283, rr = 3 + Math.random() * 2;
        light(ci + Math.round(Math.cos(ang) * rr), cj + Math.round(Math.sin(ang) * rr), now);
      }
      kick();
    });
  }

  private startContext(on: Listen): void {
    let mx = -200, my = -200;
    const refresh = (el: Element | null) => {
      this.label.set(labelFor(el));
      const sum = el?.closest?.('.proj summary') as HTMLElement | null;
      const open = (sum?.parentElement as HTMLDetailsElement | null)?.open;
      this.peekProject.set(sum && !open ? (this.store.all.find((p) => p.id === sum.dataset['project']) ?? null) : null);
      this.pos.set({ x: mx, y: my });
      if (this.peekProject()) {
        const h = this.peekEl().nativeElement.offsetHeight;
        let px = mx + 24, py = my + 46;
        if (px + 310 > innerWidth) px = mx - 324;
        if (py + h + 10 > innerHeight) py = Math.max(8, my - h - 20);
        this.peekPos.set({ x: px, y: py });
      }
    };
    on(window, 'pointermove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      refresh(e.target as Element);
    });
    on(document, 'click', (e) => setTimeout(() => refresh(e.target as Element), 0));
    on(document, 'mouseleave', () => {
      this.label.set('');
      this.peekProject.set(null);
    });
    on(window, 'scroll', () => refresh(document.elementFromPoint(mx, my)));
  }
}

type Listen = <K extends keyof WindowEventMap>(t: EventTarget, type: K, fn: (e: WindowEventMap[K]) => void) => void;

function labelFor(el: Element | null): string {
  if (!el?.closest) return '';
  const sum = el.closest('.proj summary');
  if (sum) return (sum.parentElement as HTMLDetailsElement).open ? 'Close' : 'Open';
  if (el.closest('#copy')) return 'Copy';
  if (el.closest('.key')) return 'Press';
  if (el.closest('.f')) return 'Filter';
  if (el.closest('.term')) return 'Type';
  const a = el.closest('a');
  if (!a) return '';
  const h = a.getAttribute('href') ?? '';
  if (h.startsWith('#')) return 'Jump';
  if (/github\.io/.test(h)) return 'Visit live';
  if (/drive\.google/.test(h)) return 'Résumé';
  if (/github\.com/.test(h)) return 'Code';
  if (/linkedin/.test(h)) return 'Profile';
  return 'Visit';
}
