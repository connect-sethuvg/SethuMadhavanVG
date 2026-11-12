import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { PROFILE } from '../data/portfolio';
import { prefersReducedMotion } from '../core/motion';

@Component({
  selector: 'section[appHero]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'hero', 'aria-labelledby': 'hello' },
  template: `
    <div class="meta-row crt">
      <span>{{ p.edition }}</span><span>{{ p.location }} <span>{{ clock() }}</span> IST</span>
    </div>
    <h1 class="name" id="hello"><span>{{ p.firstName }}</span><span class="outline">{{ p.lastName }}</span></h1>
    <p class="role">
      .NET developer building <b>ASP.NET Core microservices</b> on Azure, <b>Angular</b> front ends and
      <span class="typed">{{ typed() || '​' }}</span>
    </p>
    <div class="cta">
      <a class="btn primary" href="#work">See the projects</a>
      <a class="btn" [href]="p.resumeUrl" target="_blank" rel="noopener">Open résumé (PDF)</a>
    </div>
    <aside class="win" aria-label="Current status">
      <div class="win-top"><i></i><b>status.sys</b><i></i></div>
      <dl class="win-body">
        @for (s of p.status; track s.label) {
          <div class="kv"><dt>{{ s.label }}</dt><dd>@if (s.live) {<span class="dot"></span>}{{ s.value }}</dd></div>
        }
        <div class="kv"><dt>Uptime</dt><dd><span class="crt">{{ p.uptime }}</span> in software development</dd></div>
      </dl>
    </aside>
  `,
})
export class HeroComponent {
  protected readonly p = PROFILE;
  protected readonly clock = signal('--:--');
  protected readonly typed = signal(PROFILE.typedRoles[0]);

  constructor() {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const destroyRef = inject(DestroyRef);

    const tickClock = () => {
      try {
        this.clock.set(
          new Date().toLocaleTimeString('en-IN', { timeZone: PROFILE.timeZone, hour: '2-digit', minute: '2-digit', hour12: false }),
        );
      } catch {
        /* keep placeholder */
      }
    };
    tickClock();
    const clockId = setInterval(tickClock, 30_000);

    let alive = true;
    destroyRef.onDestroy(() => {
      alive = false;
      clearInterval(clockId);
      timers.forEach(clearTimeout);
    });

    if (prefersReducedMotion()) return;

    // Type-and-delete through the role list.
    const roles = PROFILE.typedRoles;
    let ri = 0;
    let txt = roles[0];
    let ci = txt.length;
    let deleting = true;
    const tick = () => {
      if (!alive) return;
      if (deleting) {
        ci--;
        if (ci <= 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          txt = roles[ri];
        }
      } else {
        ci++;
        if (ci >= txt.length) {
          deleting = true;
          this.typed.set(txt);
          timers.push(setTimeout(tick, 2200));
          return;
        }
      }
      this.typed.set(txt.slice(0, ci));
      timers.push(setTimeout(tick, deleting ? 35 : 70));
    };
    timers.push(setTimeout(tick, 2400));
  }
}
