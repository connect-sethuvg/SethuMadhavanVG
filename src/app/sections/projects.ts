import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FILTERS, Project } from '../data/portfolio';
import { ProjectsStore } from '../core/projects.store';
import { ProjectVisualComponent } from '../shared/project-visual';

@Component({
  selector: 'section[appProjects]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectVisualComponent],
  host: { id: 'work', 'aria-labelledby': 'work-h' },
  template: `
    <div class="sec-head">
      <h2 id="work-h">Selected work from GitHub</h2>
      <p>Open any project for the build notes. Filter by stack, or press a key in the Stack section.</p>
    </div>
    <div class="filters" role="group" aria-label="Filter projects">
      <span class="lbl">Show</span>
      @for (f of filters; track f.key) {
        <button type="button" class="f" [attr.aria-pressed]="store.filter() === f.key" (click)="store.setFilter(f.key)">
          {{ f.label }}
        </button>
      }
    </div>
    <div>
      @for (p of store.visible(); track p.id) {
        <details class="proj" [id]="'project-' + p.id" [open]="store.isOpen(p)" (toggle)="onToggle(p, $event)">
          <summary [attr.data-project]="p.id">
            <span class="idx">{{ number(p) }}</span>
            <h3>{{ p.title }}<span class="sub">{{ p.subtitle }}</span></h3>
            <span class="tags">
              @for (t of p.tags; track t) {<span class="tag">{{ t }}</span>}
            </span>
            <span class="plus" aria-hidden="true">+</span>
          </summary>
          <div class="case">
            <div class="txt">
              @for (para of p.paragraphs; track $index) {<p>{{ para }}</p>}
              <ul>
                @for (b of p.bullets; track $index) {<li>{{ b }}</li>}
              </ul>
              @if (p.callout; as c) {<p><b>{{ c.strong }}</b> {{ c.text }}</p>}
              <div class="links">
                @for (l of p.links; track l.url) {
                  <a [href]="l.url" target="_blank" rel="noopener">{{ l.label }}</a>
                }
              </div>
            </div>
            <div class="vis"><app-project-visual [visual]="p.visual" /></div>
          </div>
        </details>
      } @empty {
        <p class="empty">
          Nothing in this stack yet. Pick another filter or
          <button type="button" class="f" (click)="store.setFilter('all')">show all</button>
        </p>
      }
    </div>
  `,
})
export class ProjectsComponent {
  protected readonly store = inject(ProjectsStore);
  protected readonly filters = FILTERS;

  protected number(p: Project): string {
    return String(this.store.all.indexOf(p) + 1).padStart(2, '0');
  }

  protected onToggle(p: Project, e: Event): void {
    this.store.setOpen(p, (e.target as HTMLDetailsElement).open);
  }
}
