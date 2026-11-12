import { Injectable, inject, signal } from '@angular/core';
import { PROFILE, STACK_SUMMARY } from '../data/portfolio';
import { ProjectsStore } from './projects.store';
import { scrollToId } from './motion';

/** One styled run of text in a terminal line. */
export interface Seg {
  text: string;
  /** b: bright, dim: muted blue, p: prompt colour */
  style?: 'b' | 'dim' | 'p';
  href?: string;
}
export interface Line {
  id: number;
  segs: Seg[];
  dim?: boolean;
}

const PROMPT = 'sethu@vg:~$';

/** The little shell in the Stack section. Lines are data, rendered without innerHTML. */
@Injectable({ providedIn: 'root' })
export class TerminalService {
  private readonly projects = inject(ProjectsStore);
  private nextId = 0;

  readonly lines = signal<Line[]>([]);

  constructor() {
    this.print([{ text: 'SETHU-OS 2.6, ready.' }], true);
    this.print([{ text: 'Press a key on the left, or type ' }, { text: 'help', style: 'b' }, { text: ' and press Enter.' }]);
  }

  print(segs: Seg[] | string, dim = false): void {
    const s = typeof segs === 'string' ? [{ text: segs }] : segs;
    this.lines.update((l) => [...l, { id: this.nextId++, segs: s, dim }]);
  }

  echo(command: string): void {
    this.print([{ text: PROMPT, style: 'p' }, { text: ' ' + command }]);
  }

  clear(): void {
    this.lines.set([]);
  }

  run(input: string): void {
    const t = input.trim();
    if (!t) return;
    this.echo(t);
    const [cmd, ...rest] = t.split(/\s+/);
    const fn = this.commands[cmd.toLowerCase()];
    if (fn) fn(rest.join(' '));
    else this.print(`Command not found: ${cmd.toLowerCase()}. Type help to see what works.`);
  }

  private readonly link = (text: string, href: string): Seg => ({ text, href });

  private readonly commands: Record<string, (arg: string) => void> = (() => {
    const projects = () => {
      this.projects.all.forEach((p, i) => this.print([{ text: String(i + 1), style: 'b' }, { text: ' ' + p.title }]));
      this.print('Type open and a number, for example open 1', true);
    };
    const resume = () => this.print([{ text: 'Résumé: ' }, this.link('open on Google Drive', PROFILE.resumeUrl)]);
    const contact = () => {
      this.print([{ text: 'Email: ' }, { text: PROFILE.email, style: 'b' }]);
      this.print([{ text: 'LinkedIn: ' }, this.link(PROFILE.linkedin.handle, PROFILE.linkedin.url)]);
    };
    const names = ['whoami', 'projects', 'open 1-5', 'stack', 'experience', 'resume', 'contact', 'github', 'date', 'clear'];
    return {
      help: () => {
        const segs: Seg[] = [{ text: 'Commands: ' }];
        names.forEach((n, i) => segs.push({ text: n, style: 'b' }, { text: i < names.length - 1 ? ', ' : '' }));
        this.print(segs);
      },
      whoami: () => this.print(PROFILE.whoami),
      projects,
      ls: projects,
      work: projects,
      open: (a) => {
        const p = this.projects.reveal(parseInt(a, 10));
        this.print(p ? `Opening ${p.title}.` : `Pick a project from 1 to ${this.projects.all.length}.`);
      },
      stack: () => this.print(STACK_SUMMARY),
      experience: () => {
        scrollToId('experience');
        this.print('Jumping to experience.');
      },
      about: () => {
        scrollToId('about');
        this.print('Jumping to about.');
      },
      resume,
      cv: resume,
      contact,
      email: contact,
      github: () => this.print([this.link('github.com/' + PROFILE.github.handle, PROFILE.github.url)]),
      date: () => {
        let t: string;
        try {
          t = new Date().toLocaleString('en-IN', { timeZone: PROFILE.timeZone, dateStyle: 'medium', timeStyle: 'short' });
        } catch {
          t = new Date().toString();
        }
        this.print(`${t} in Palakkad`);
      },
      clear: () => this.clear(),
      sudo: (a) =>
        /hire/i.test(a)
          ? this.print([{ text: 'Permission granted. Write to ' }, { text: PROFILE.email, style: 'b' }, { text: ' and I will reply within a day.' }])
          : this.print('Try sudo hire sethu'),
    };
  })();
}
