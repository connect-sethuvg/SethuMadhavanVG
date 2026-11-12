import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SiteHeaderComponent } from './sections/site-header';
import { HeroComponent } from './sections/hero';
import { MarqueeComponent } from './sections/marquee';
import { AboutComponent } from './sections/about';
import { ProjectsComponent } from './sections/projects';
import { StackComponent } from './sections/stack';
import { ExperienceComponent } from './sections/experience';
import { ContactComponent } from './sections/contact';
import { ToastComponent } from './shared/toast';
import { CursorFxComponent } from './shared/cursor-fx';
import { PROFILE } from './data/portfolio';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeaderComponent, HeroComponent, MarqueeComponent, AboutComponent, ProjectsComponent,
    StackComponent, ExperienceComponent, ContactComponent, ToastComponent, CursorFxComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly footerName = `${PROFILE.fullName}, ${PROFILE.location}`;
  protected readonly year = new Date().getFullYear();
}
