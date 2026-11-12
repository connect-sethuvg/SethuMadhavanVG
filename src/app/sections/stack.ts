import {
  ChangeDetectionStrategy, Component, ElementRef, afterRenderEffect, inject, signal, viewChild,
} from '@angular/core';
import { STACK_GROUPS, StackKey } from '../data/portfolio';
import { ProjectsStore } from '../core/projects.store';
import { TerminalService } from '../core/terminal.service';

@Component({
  selector: 'section[appStack]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'stack', 'aria-labelledby': 'stack-h', '(document:keydown)': 'onKey($event)' },
  template: `
    <div class="sec-head"><h2 id="stack-h">The stack, as a keyboard</h2><p>Press a key, or type a command in the terminal</p></div>
    <div class="kb">
      <div class="keys">
        @for (g of groups; track g.name) {
          <div class="keygroup">
            <h3>{{ g.name }}</h3>
            <div class="keyrow">
              @for (k of g.keys; track k.label) {
                <button type="button" class="key" [class.wide]="k.wide" [class.hit]="hit() === k" (click)="press(k)">
                  {{ k.label }}
                </button>
              }
            </div>
          </div>
        }
      </div>
      <div class="keyout term" (click)="focusInput($event)">
        <div class="term-log" #log role="log" aria-live="polite">
          @for (l of term.lines(); track l.id) {
            <!-- kept on one line so no template whitespace leaks between segments -->
            <div [class.dim]="l.dim">@for (s of l.segs; track $index) {@if (s.href) {<a [href]="s.href" target="_blank" rel="noopener">{{ s.text }}</a>} @else if (s.style) {<span [class]="s.style">{{ s.text }}</span>} @else {{{ s.text }}}}</div>
          }
        </div>
        <form class="term-in" autocomplete="off" (submit)="submit($event)">
          <label class="p" for="termin">sethu&#64;vg:~$</label>
          <input #input id="termin" spellcheck="false" autocapitalize="off" placeholder="help"
                 (keydown.arrowup)="recall($event, -1)" (keydown.arrowdown)="recall($event, 1)" />
        </form>
      </div>
    </div>
  `,
})
export class StackComponent {
  protected readonly groups = STACK_GROUPS;
  protected readonly term = inject(TerminalService);
  protected readonly hit = signal<StackKey | null>(null);

  private readonly store = inject(ProjectsStore);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly log = viewChild.required<ElementRef<HTMLElement>>('log');
  private readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
  private readonly allKeys = STACK_GROUPS.flatMap((g) => g.keys);
  private history: string[] = [];
  private hp = 0;

  constructor() {
    // Keep the newest terminal line in view.
    afterRenderEffect(() => {
      this.term.lines();
      const el = this.log().nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }

  protected press(k: StackKey): void {
    this.term.echo('which ' + k.label.toLowerCase());
    this.term.print([{ text: k.note + ' ' }, { text: 'Projects filtered to match.', style: 'dim' }]);
    this.store.setFilter(k.filter);
  }

  /** Typing a letter while the section is on screen presses the first key with that initial. */
  protected onKey(e: KeyboardEvent): void {
    const t = e.target as HTMLElement | null;
    if (t?.matches?.('input,textarea,button,select,[contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key.length !== 1) return;
    const k = this.allKeys.find((x) => x.label[0].toLowerCase() === e.key.toLowerCase());
    if (!k) return;
    const r = this.host.nativeElement.getBoundingClientRect();
    if (r.top >= innerHeight || r.bottom <= 0) return;
    this.hit.set(k);
    this.press(k);
    setTimeout(() => this.hit.set(null), 120);
  }

  protected submit(e: Event): void {
    e.preventDefault();
    const el = this.input().nativeElement;
    const v = el.value;
    if (v.trim()) {
      this.history.push(v);
      this.hp = this.history.length;
    }
    this.term.run(v);
    el.value = '';
  }

  protected recall(e: Event, dir: -1 | 1): void {
    if (!this.history.length) return;
    e.preventDefault();
    this.hp = Math.max(0, Math.min(this.history.length, this.hp + dir));
    this.input().nativeElement.value = this.history[this.hp] ?? '';
  }

  protected focusInput(e: MouseEvent): void {
    if (!(e.target as HTMLElement).closest('a')) this.input().nativeElement.focus({ preventScroll: true });
  }
}
