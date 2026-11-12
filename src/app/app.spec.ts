import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ProjectsStore } from './core/projects.store';
import { TerminalService } from './core/terminal.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('renders the name in the hero', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Sethu');
    expect(el.querySelectorAll('details.proj').length).toBe(5);
  });

  it('filters projects by stack', async () => {
    const fixture = TestBed.createComponent(App);
    const store = TestBed.inject(ProjectsStore);
    store.setFilter('angular');
    await fixture.whenStable();
    const titles = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('details.proj h3')).map(
      (h) => h.firstChild?.textContent,
    );
    expect(titles).toEqual(['Contact Manager', 'Kerala Property']);
  });

  it('runs terminal commands', () => {
    const term = TestBed.inject(TerminalService);
    term.run('whoami');
    expect(term.lines().at(-1)?.segs[0].text).toContain('.NET developer');
    term.run('nope');
    expect(term.lines().at(-1)?.segs[0].text).toContain('Command not found');
    term.run('clear');
    expect(term.lines().length).toBe(0);
  });
});
