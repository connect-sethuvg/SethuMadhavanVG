import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { ProjectVisual } from '../data/portfolio';
import { prefersReducedMotion } from '../core/motion';

/** The small illustration beside each project (also reused by the hover peek). */
@Component({
  selector: 'app-project-visual',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:block' },
  template: `
    @let v = visual();
    @switch (v.kind) {
      @case ('pipeline') {
        <div class="pipe" role="img" aria-label="Pipeline stages">
          @for (s of v.steps; track s.title; let i = $index) {
            <div class="step" [class.live]="reduce || i === live()">
              <span class="no">{{ i + 1 }}</span>
              <div><b>{{ s.title }}</b><small>{{ s.detail }}</small></div>
            </div>
          }
          <div class="race">
            @for (r of v.race; track r.label) {
              <div [class]="r.speed"><small>{{ r.label }}</small><i></i><span>{{ r.value }}</span></div>
            }
          </div>
        </div>
      }
      @default {
        <div class="screen" aria-hidden="true">
          <div class="chrome"><i></i><i></i><i></i><span>{{ v.url }}</span></div>
          <div class="body">
            @switch (v.kind) {
              @case ('list') {
                @for (r of v.rows; track r.name) {
                  <div class="row">
                    <span class="av">{{ r.initials }}</span><span>{{ r.name }}<br /><em>{{ r.meta }}</em></span><em>Edit</em>
                  </div>
                }
              }
              @case ('cards') {
                <div class="cards3">
                  @for (c of v.cards; track c.title) {
                    <div><i></i><b>{{ c.title }}</b>{{ c.detail }}</div>
                  }
                </div>
              }
              @case ('table') {
                <table class="inv">
                  <thead><tr>@for (h of v.head; track h) {<th>{{ h }}</th>}</tr></thead>
                  <tbody>
                    @for (r of v.rows; track r.cells[0]) {
                      <tr>
                        @for (c of r.cells; track $index; let last = $last) {
                          <td [class.low]="last && r.low">{{ c }}</td>
                        }
                      </tr>
                    }
                  </tbody>
                </table>
              }
            }
          </div>
        </div>
      }
    }
  `,
})
export class ProjectVisualComponent {
  readonly visual = input.required<ProjectVisual>();
  /** Animate the pipeline steps. Off for the hover peek copy. */
  readonly animate = input(true);

  protected readonly reduce = prefersReducedMotion();
  protected readonly live = signal(0);

  constructor() {
    if (this.reduce) return;
    const id = setInterval(() => {
      const v = this.visual();
      if (v.kind === 'pipeline' && this.animate()) this.live.update((i) => (i + 1) % v.steps.length);
    }, 900);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
