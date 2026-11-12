import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { PROFILE } from '../data/portfolio';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'section[appContact]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contact', id: 'contact', 'aria-labelledby': 'contact-h' },
  template: `
    <h2 class="big" id="contact-h">Have an API to build? <span class="outline">Let's talk.</span></h2>
    <div class="c-grid">
      <div class="c-item">
        <span>Email</span><strong #email>{{ p.email }}</strong>
        <button type="button" class="btn" id="copy" (click)="copy()">Copy address</button>
      </div>
      <div class="c-item">
        <span>LinkedIn</span><strong>{{ p.linkedin.handle }}</strong>
        <a class="btn" [href]="p.linkedin.url" target="_blank" rel="noopener">Open profile</a>
      </div>
      <div class="c-item">
        <span>GitHub</span><strong>{{ p.github.handle }}</strong>
        <a class="btn" [href]="p.github.url" target="_blank" rel="noopener">Browse repositories</a>
      </div>
    </div>
  `,
})
export class ContactComponent {
  protected readonly p = PROFILE;
  private readonly toast = inject(ToastService);
  private readonly email = viewChild.required<ElementRef<HTMLElement>>('email');

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      this.toast.show('Email copied');
    } catch {
      // Clipboard blocked: select the text so the visitor can copy it themselves.
      const range = document.createRange();
      range.selectNodeContents(this.email().nativeElement);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      this.toast.show('Address selected. Press copy.');
    }
  }
}
