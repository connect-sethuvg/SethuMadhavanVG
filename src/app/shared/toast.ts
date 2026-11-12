import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: '[appToast]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'toast', role: 'status', 'aria-live': 'polite', '[class.show]': 'toast.visible()' },
  template: `{{ toast.message() }}`,
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
}
