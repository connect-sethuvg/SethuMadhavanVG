import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EDUCATION, PROFILE, ROLES } from '../data/portfolio';

@Component({
  selector: 'section[appExperience]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { id: 'experience', 'aria-labelledby': 'xp-h' },
  template: `
    <div class="sec-head">
      <h2 id="xp-h">The path so far</h2>
      <p>From support desk to production microservices, newest first</p>
    </div>
    <div class="xp">
      <div class="roles">
        @for (r of roles; track r.title) {
          <article class="xp-card" [class.small]="!r.featured">
            <div class="xp-top">
              <div><h3>{{ r.title }}</h3><p>{{ r.company }}</p></div>
              <p class="crt">{{ r.period }}</p>
            </div>
            @if (r.projectLine) {<p class="proj-line">{{ r.projectLine }}</p>}
            @if (r.log) {
              <ul class="log">
                @for (l of r.log; track l.area) {
                  <li><span class="area">{{ l.area }}</span><span>{{ l.text }}</span></li>
                }
              </ul>
            }
            @if (r.gauges) {
              <div class="gauge">
                @for (g of r.gauges; track g.label) {
                  <div><b>{{ g.value }}</b><small>{{ g.label }}</small></div>
                }
              </div>
            }
            @if (r.note) {<p class="note">{{ r.note }}</p>}
          </article>
        }
      </div>
      <div class="edu">
        @for (e of education; track e.title) {
          <div><h3>{{ e.title }}</h3><p>{{ e.text }}</p></div>
        }
        <a class="btn primary" [href]="resumeUrl" target="_blank" rel="noopener">Open the full résumé</a>
      </div>
    </div>
  `,
})
export class ExperienceComponent {
  protected readonly roles = ROLES;
  protected readonly education = EDUCATION;
  protected readonly resumeUrl = PROFILE.resumeUrl;
}
