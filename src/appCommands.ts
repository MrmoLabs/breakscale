import type { Command } from './commands';
import type { FailureKind, NodeKind } from './sim/types';
import type { ThemeChoice } from './content/preferences';
import { SPEEDS, formatSpeed, type Speed } from './speed';
import { shortcutLabel } from './modKey';
import { t } from './i18n';

/* ------------------------------------------------------------------ *
 * Everything the command palette can do, built from what the shell knows.
 *
 * Pure: the shell passes the facts and the handlers it already uses for the
 * bar, the menu, the rail and the inspector, and gets the rows back. Every
 * row runs one of those handlers, so the palette has no undo story or
 * validation of its own to drift from the real one.
 * ------------------------------------------------------------------ */

export interface CommandPart {
  id: string;
  label: string;
  /** The fault in force on it now, or null. */
  fault: FailureKind | null;
  /** False for a kind with no service time, where Slow changes nothing. */
  canSlow: boolean;
}

export interface CommandFacts {
  running: boolean;
  speed: Speed;
  canUndo: boolean;
  canRedo: boolean;
  /** The design has no parts at all. */
  empty: boolean;
  /** Inside a challenge brief. */
  inChallenge: boolean;
  /** Why Can you break it? cannot run, or null. */
  breakBlocked: string | null;
  /** Something has been measured, so a pin would hold real samples. */
  canPin: boolean;
  pinned: boolean;
  libraryOpen: boolean;
  metricsOpen: boolean;
  snapToGrid: boolean;
  theme: ThemeChoice;
  presenting: boolean;
  /** The Fullscreen API exists here. iPhone Safari has none. */
  canFullscreen: boolean;
  fullscreen: boolean;
  /** The selected part first, then the rest in diagram order. */
  parts: readonly CommandPart[];
  /** The one selected part, whose faults show before anything is typed. */
  selectedId: string | null;
  kinds: readonly { kind: NodeKind; name: string; group: string }[];
  examples: readonly { id: string; name: string; tagline: string }[];
  challenges: readonly { id: string; name: string }[];
  incidents: readonly { id: string; name: string }[];
  glossary: readonly { id: string; term: string; aliases?: readonly string[] }[];
  mac: boolean;
  /** No keys to print on a touch screen. */
  coarse: boolean;
}

export interface CommandActions {
  toggleRun: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (s: Speed) => void;
  undo: () => void;
  redo: () => void;
  add: (kind: NodeKind) => void;
  openExample: (id: string) => void;
  startChallenge: (id: string) => void;
  openIncident: (id: string) => void;
  crash: (id: string) => void;
  slow: (id: string) => void;
  fix: (id: string) => void;
  pin: () => void;
  clearPin: () => void;
  toggleLibrary: () => void;
  toggleMetrics: () => void;
  toggleSnap: () => void;
  setTheme: (t: ThemeChoice) => void;
  togglePresenting: () => void;
  toggleFullscreen: () => void;
  fit: () => void;
  share: () => void;
  breakIt: () => void;
  glossary: (id?: string) => void;
  examples: () => void;
  challenges: () => void;
  path: () => void;
  designs: () => void;
  shortcuts: () => void;
  settings: () => void;
}

const FAULT_WORD: Record<FailureKind, string> = {
  crash: 'crashed',
  'crash-instance': 'one instance down',
  slow: 'slowed',
  errors: 'glitching',
  partition: 'cut off',
  restart: 'restarting',
  pause: 'paused',
};

export function buildCommands(
  f: CommandFacts,
  a: CommandActions,
  slowFactor: string,
): Command[] {
  const key = (k: string): string | undefined =>
    f.coarse ? undefined : shortcutLabel(k, f.mac);
  const out: Command[] = [];
  const push = (c: Command) => out.push(c);

  /* ---- run ---- */
  push({
    id: 'run.toggle',
    label: f.running ? t('Pause') : t('Play'),
    group: 'Run',
    keywords: ['play', 'pause', 'start', 'stop', 'resume'],
    hint: key('Space'),
    run: a.toggleRun,
  });
  push({
    id: 'run.step',
    label: t('Step one tick'),
    group: 'Run',
    keywords: ['advance', 'Step one tick'],
    hint: key('S'),
    run: a.step,
  });
  push({
    id: 'run.reset',
    label: t('Reset the run'),
    group: 'Run',
    keywords: ['restart', 'clock', 'zero', 'Reset the run'],
    run: a.reset,
  });
  for (const s of SPEEDS) {
    push({
      id: `run.speed.${s}`,
      label: t('Play at {speed}', { speed: formatSpeed(s) }),
      group: 'Run',
      keywords: ['speed', 'faster', 'slower', 'fast', 'slow motion', 'Play at'],
      hint: s === f.speed ? t('Now') : undefined,
      run: () => a.setSpeed(s),
    });
  }
  push({
    id: 'run.pin',
    label: f.pinned ? t('Pin this run again') : t('Pin this run'),
    group: 'Run',
    keywords: [
      'compare',
      'before',
      'after',
      'baseline',
      'snapshot',
      'Pin this run',
      'Pin this run again',
    ],
    ...(f.canPin ? {} : { disabled: t('Nothing measured yet. Let some traffic run.') }),
    run: a.pin,
  });
  if (f.pinned) {
    push({
      id: 'run.unpin',
      label: t('Clear the pinned run'),
      group: 'Run',
      keywords: ['unpin', 'remove'],
      run: a.clearPin,
    });
  }

  /* ---- faults, the selected part first ---- */
  for (const p of f.parts) {
    // Every other part's faults wait for a search: a forty-part design
    // would otherwise fill the list with them.
    const searchOnly = p.id !== f.selectedId;
    if (p.fault !== 'crash') {
      push({
        id: `fault.crash.${p.id}`,
        label: t('Crash {name}', { name: p.label }),
        group: 'Faults',
        keywords: ['break', 'kill', 'fail', 'down', 'Crash'],
        searchOnly,
        run: () => a.crash(p.id),
      });
    }
    if (p.fault === null && p.canSlow) {
      push({
        id: `fault.slow.${p.id}`,
        label: t('Slow down {name} {factor}', { name: p.label, factor: slowFactor }),
        group: 'Faults',
        keywords: ['slow', 'latency', 'lag', 'degrade', 'Slow down'],
        searchOnly,
        run: () => a.slow(p.id),
      });
    }
    if (p.fault !== null) {
      push({
        id: `fault.fix.${p.id}`,
        label: t('Fix {name}', { name: p.label }),
        group: 'Faults',
        keywords: ['repair', 'heal', 'recover', 'restore', FAULT_WORD[p.fault], 'Fix'],
        searchOnly,
        run: () => a.fix(p.id),
      });
    }
  }

  /* ---- view ---- */
  if (f.canUndo) {
    push({
      id: 'edit.undo',
      label: t('Undo'),
      group: 'View',
      keywords: ['Undo'],
      hint: key('Ctrl+Z'),
      run: a.undo,
    });
  }
  if (f.canRedo) {
    push({
      id: 'edit.redo',
      label: t('Redo'),
      group: 'View',
      keywords: ['Redo'],
      hint: key('Ctrl+Shift+Z'),
      run: a.redo,
    });
  }
  push({
    id: 'view.present',
    label: f.presenting ? t('Stop presenting') : t('Start presenting'),
    group: 'View',
    keywords: ['present', 'teach', 'projector', 'class', 'big', 'lecture'],
    hint: key('Shift+P'),
    run: a.togglePresenting,
  });
  if (f.canFullscreen) {
    push({
      id: 'view.fullscreen',
      label: f.fullscreen ? t('Leave full screen') : t('Full screen'),
      group: 'View',
      keywords: ['fullscreen', 'projector', 'present'],
      run: a.toggleFullscreen,
    });
  }
  push({
    id: 'view.fit',
    label: t('Fit the diagram'),
    group: 'View',
    keywords: ['zoom', 'whole', 'everything', 'center', 'Fit the diagram'],
    hint: key('Shift+1'),
    ...(f.empty ? { disabled: t('The diagram is empty.') } : {}),
    run: a.fit,
  });
  push({
    id: 'view.library',
    label: f.libraryOpen ? t('Hide components') : t('Show components'),
    group: 'View',
    keywords: [
      'rail',
      'palette',
      'panel',
      'library',
      'Hide components',
      'Show components',
    ],
    hint: key('C'),
    ...(f.presenting ? { disabled: t('Hidden while presenting.') } : {}),
    run: a.toggleLibrary,
  });
  push({
    id: 'view.metrics',
    label: f.metricsOpen ? t('Hide charts') : t('Show charts'),
    group: 'View',
    keywords: ['metrics', 'graphs', 'strip', 'panel', 'Hide charts', 'Show charts'],
    hint: key('M'),
    run: a.toggleMetrics,
  });
  push({
    id: 'view.snap',
    label: f.snapToGrid ? t('Turn grid snap off') : t('Turn grid snap on'),
    group: 'View',
    keywords: ['grid', 'align', 'snap'],
    hint: key('G'),
    run: a.toggleSnap,
  });
  // The English label stays in scope so it can double as a search keyword:
  // a Chinese interface must still find the row when the reader types the
  // English they know.
  const themes: [ThemeChoice, string][] = [
    ['light', 'Use the light theme'],
    ['dark', 'Use the dark theme'],
    ['system', 'Match the system theme'],
  ];
  for (const [theme, en] of themes) {
    push({
      id: `view.theme.${theme}`,
      label: t(en),
      group: 'View',
      keywords: ['theme', 'colour', 'color', 'mode', 'appearance', en],
      hint: f.theme === theme ? t('Now') : undefined,
      run: () => a.setTheme(theme),
    });
  }

  /* ---- share and test ---- */
  push({
    id: 'share.link',
    label: t('Share a link to this design'),
    group: 'Share',
    keywords: ['share', 'url', 'copy', 'send'],
    run: a.share,
  });
  push({
    id: 'share.break',
    label: t('Can you break it?'),
    group: 'Share',
    keywords: ['break', 'fault', 'test', 'attack', 'chaos'],
    hint: key('F'),
    ...(f.inChallenge
      ? { disabled: t('Off during a challenge.') }
      : f.breakBlocked
        ? { disabled: f.breakBlocked }
        : {}),
    run: a.breakIt,
  });

  /* ---- help ---- */
  push({
    id: 'help.examples',
    label: t('Browse examples'),
    group: 'Help',
    keywords: ['Browse examples'],
    run: a.examples,
  });
  push({
    id: 'help.challenges',
    label: t('Browse challenges'),
    group: 'Help',
    keywords: ['Browse challenges'],
    run: a.challenges,
  });
  push({
    id: 'help.path',
    label: t('Learning path'),
    group: 'Help',
    keywords: ['Learning path'],
    run: a.path,
  });
  push({
    id: 'help.designs',
    label: t('Your designs'),
    group: 'Help',
    keywords: ['saved', 'open', 'files', 'Your designs'],
    run: a.designs,
  });
  push({
    id: 'help.glossary',
    label: t('Open the glossary'),
    group: 'Help',
    keywords: ['terms', 'definitions', 'words', 'Open the glossary'],
    hint: key('?'),
    run: () => a.glossary(),
  });
  if (!f.coarse) {
    push({
      id: 'help.shortcuts',
      label: t('Keyboard shortcuts'),
      group: 'Help',
      keywords: ['keys', 'bindings', 'Keyboard shortcuts'],
      hint: key('Ctrl+/'),
      run: a.shortcuts,
    });
  }
  push({
    id: 'help.settings',
    label: t('Settings'),
    group: 'Help',
    keywords: ['preferences', 'options', 'tooltips', 'vendor', 'minimap', 'Settings'],
    run: a.settings,
  });
  /* ---- build and open ---- */
  for (const k of f.kinds) {
    push({
      id: `add.${k.kind}`,
      label: t('Add {name}', { name: inSentence(k.name) }),
      group: 'Add',
      keywords: [k.kind, k.group, 'component', 'new', 'Add'],
      run: () => a.add(k.kind),
    });
  }

  /* ---- open something ---- */
  for (const e of f.examples) {
    push({
      id: `example.${e.id}`,
      label: e.name,
      group: 'Example',
      keywords: ['example', 'open', e.tagline],
      run: () => a.openExample(e.id),
    });
  }
  for (const c of f.challenges) {
    push({
      id: `challenge.${c.id}`,
      label: c.name,
      group: 'Challenge',
      keywords: ['challenge', 'start', 'brief'],
      run: () => a.startChallenge(c.id),
    });
  }
  for (const i of f.incidents) {
    push({
      id: `incident.${i.id}`,
      label: i.name,
      group: 'Incident',
      keywords: ['incident', 'outage', 'postmortem', 'real'],
      ...(f.inChallenge ? { disabled: t('Leave the challenge first.') } : {}),
      run: () => a.openIncident(i.id),
    });
  }

  for (const g of f.glossary) {
    push({
      id: `glossary.${g.id}`,
      // The term alone: many are not nouns ("Crashed", "Waiting on its
      // calls"), so "What is" around them reads wrong. The group says what
      // the row is.
      label: g.term,
      group: 'Glossary',
      keywords: [...(g.aliases ?? []), 'what is', 'meaning', 'define'],
      searchOnly: true,
      run: () => a.glossary(g.id),
    });
  }
  return out;
}

/**
 * A component name inside a sentence: "Load balancer" becomes "load
 * balancer", while a first word with capitals of its own ("CDN", "API",
 * "WebSocket") keeps them.
 */
export function inSentence(name: string): string {
  const first = name.split(' ', 1)[0] ?? '';
  if (/[A-Z]/.test(first.slice(1))) return name;
  return name.charAt(0).toLowerCase() + name.slice(1);
}
