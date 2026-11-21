import { useEffect, useRef } from 'react';
import { ScanSearch, X } from 'lucide-react';
import type { SimSnapshot, Topology } from '../sim/types';
import { t } from '../i18n';
import { displayLabel } from '../i18n/display';
import { findBottleneck, type Verdict } from './bottleneck';
import type { Finding } from './finding';
import './FindProblem.css';

interface FindProblemProps {
  topology: Topology;
  snapshot: SimSnapshot | null;
  /** The answer on show, already passed through `currentFinding`. */
  finding: Finding | null;
  onChange: (finding: Finding | null) => void;
  /** Select the named part, which opens the inspector on it. */
  onSelect: (nodeId: string) => void;
}

/** The answer in a few words, above the sentence that backs it up. */
function headline(v: Verdict, topology: Topology): string {
  switch (v.kind) {
    case 'problem':
      return t('{name} is holding things back', {
        name: shownName(topology, v.nodeId),
      });
    case 'on-purpose':
      return t('Working as designed');
    case 'healthy':
      return t('Running fine');
    case 'idle':
      return t('No traffic yet');
  }
}

function nameOf(topology: Topology, id: string): string {
  return topology.nodes.find((n) => n.id === id)?.label ?? 'it';
}

/**
 * The name as a sentence shows it: the stored label is design data and stays
 * English; the name inside '{name} is holding things back' and friends is
 * rendered text. (withoutName strips the RAW name's prefix from the verdict's
 * own text, so that one stays raw on purpose.)
 */
function shownName(topology: Topology, id: string): string {
  return displayLabel(nameOf(topology, id));
}

/**
 * The verdict without the part's name in front when the status line and the
 * button already carry it: "Database: all 6 slots busy" reads "All 6 slots
 * busy". Everything after the name is the verdict's own words.
 */
function withoutName(v: Verdict, topology: Topology): string {
  if (v.kind !== 'problem') return v.text;
  const raw = nameOf(topology, v.nodeId);
  const prefix = `${raw}: `;
  if (v.text.startsWith(prefix)) {
    const rest = v.text.slice(prefix.length);
    return rest.charAt(0).toUpperCase() + rest.slice(1);
  }
  // In Chinese the verdict names the part through displayLabel with a
  // full-width colon; strip that form the same way.
  const zhPrefix = `${displayLabel(raw)}：`;
  if (v.text.startsWith(zhPrefix)) return v.text.slice(zhPrefix.length);
  return v.text;
}

/** Split after a full stop and a space, so "1.5 a second" stays whole. */
function sentences(text: string): string[] {
  // Chinese sentences end with '。' and carry no space after, so they split
  // on the full stop alone. English text never holds a '。'.
  return text.split(/(?<=\.)\s+|(?<=。)\s*/).filter((s) => s.length > 0);
}

/**
 * "Find the problem": one press reads the latest snapshot and says which part
 * is holding the system back, and why, in a sentence; the canvas rings it.
 *
 * Read once per press, not live. A sentence whose numbers changed ten times a
 * second could not be read, and pressing again is how to check after a fix.
 */
export function FindProblem({
  topology,
  snapshot,
  finding,
  onChange,
  onSelect,
}: FindProblemProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  /* Putting the answer away unmounts whatever in it had focus, which would
     drop a keyboard user back at the top of the page. The trigger takes it. */
  const close = () => {
    const active = document.activeElement;
    if (active && answerRef.current?.contains(active)) triggerRef.current?.focus();
    onChange(null);
  };
  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = close;
  });

  const open = finding !== null;

  /* Escape, or a press on the bare canvas, puts the answer away: the same
     ways out every other temporary layer here has. Pointerdown in the
     capture phase, so the canvas's own handlers cannot hide it. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element) || !t.closest('.cv-surface')) return;
      if (t.closest('button, input, select, textarea, a, [data-chrome]')) return;
      closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown, true);
    };
  }, [open]);

  const find = () => {
    if (!snapshot) return;
    onChange({
      verdict: findBottleneck(topology, snapshot),
      atMs: snapshot.system.timeMs,
    });
  };

  const v = finding?.verdict;
  const target = v && v.kind !== 'idle' ? v.nodeId : null;
  // The first sentence is the answer; what follows is why, set quieter.
  const [lead, ...rest] = v ? sentences(withoutName(v, topology)) : [];

  return (
    <div className="fp" data-chrome="find-problem">
      <button
        ref={triggerRef}
        type="button"
        className="btn btn-sm fp-trigger"
        onClick={find}
        disabled={!snapshot}
        title={t('Find what is holding the system back')}
      >
        <ScanSearch size={16} strokeWidth={2} aria-hidden="true" />
        {t('Find the problem')}
      </button>
      {/* Always in the accessibility tree, so a screen reader hears each new
          answer. Keyed by the time it was read, so a second press with the
          same words is announced again. The visible copy is hidden from it. */}
      <div className="sr-only" role="status">
        {finding ? <span key={finding.atMs}>{finding.verdict.text}</span> : null}
      </div>
      {v ? (
        <div
          className="card-float fp-answer"
          ref={answerRef}
          data-verdict={v.kind}
          data-spot-avoid
          data-titles-clear
        >
          <header className="fp-head">
            <p className="card-float-title fp-title" aria-hidden="true">
              <span className="fp-dot" aria-hidden="true" />
              {headline(v, topology)}
            </p>
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-icon fp-close"
              aria-label={t('Close')}
              title={t('Close (Esc)')}
              onClick={close}
            >
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </header>
          <div className="fp-text" aria-hidden="true">
            <p className="fp-lead">{lead}</p>
            {rest.length > 0 ? <p className="fp-more">{rest.join(' ')}</p> : null}
          </div>
          {target ? (
            <div className="card-float-actions">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => onSelect(target)}
              >
                {t('Select {name}', { name: shownName(topology, target) })}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
