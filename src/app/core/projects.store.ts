import { Injectable, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { FILTER_MATCH, FilterKey, PROJECTS, Project } from '../data/portfolio';
import { scrollToId } from './motion';

/** Shared state for the project list: active filter and which cards are open. */
@Injectable({ providedIn: 'root' })
export class ProjectsStore {
  private readonly injector = inject(Injector);

  readonly all = PROJECTS;
  readonly filter = signal<FilterKey>('all');
  private readonly openIds = signal<ReadonlySet<string>>(new Set([PROJECTS[0]?.id]));

  readonly visible = computed(() => {
    const f = this.filter();
    if (f === 'all') return this.all;
    const match = FILTER_MATCH[f];
    return this.all.filter((p) => p.filterTags.some((t) => match.includes(t)));
  });

  setFilter(f: FilterKey): void {
    this.filter.set(f);
  }

  isOpen(p: Project): boolean {
    return this.openIds().has(p.id);
  }

  setOpen(p: Project, open: boolean): void {
    if (this.isOpen(p) === open) return;
    this.openIds.update((s) => {
      const next = new Set(s);
      if (open) next.add(p.id);
      else next.delete(p.id);
      return next;
    });
  }

  /** Clear the filter, open project n (1-based) and scroll to it. Returns the project or undefined. */
  reveal(n: number): Project | undefined {
    const p = this.all[n - 1];
    if (!p) return undefined;
    this.setFilter('all');
    this.setOpen(p, true);
    afterNextRender(() => scrollToId('project-' + p.id), { injector: this.injector });
    return p;
  }
}
