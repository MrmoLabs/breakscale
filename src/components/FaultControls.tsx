import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Ellipsis } from 'lucide-react';
import { HintLine } from './HintLine';
import { t, tN } from '../i18n';
import type { ActiveDuplicate, ActiveFailure, ActiveReplyCut } from '../sim/types';
import { formatPct } from './format';
import {
  DEFAULT_DUP_RATE,
  DEFAULT_GLITCH_RATE,
  DEFAULT_LOSS_RATE,
  DEFAULT_PAUSE_MS,
  DUP_RATES,
  DEFAULT_RESTART_DOWN_MS,
  DEFAULT_SLOW_FACTOR,
  GLITCH_RATES,
  LOSS_RATES,
  PAUSE_MS,
  RESTART_DOWN_MS,
  SLOW_FACTORS,
  dupStatus,
  faultStatus,
  formatDownFor,
  formatFactor,
  replyCutStatus,
  strandedStatus,
} from './faultWiring';
import type { CableInfo } from './faultWiring';

/* ------------------------------------------------------------------ *
 * Fault controls
 *
 * Breaking a component on purpose, from the inspector. Every action goes
 * through the engine's record* calls, so it lands in the fault schedule at
 * the current simulated time and Reset plays it back at the same moment.
 *
 * The buttons that would change nothing are aria-disabled rather than
 * disabled. Pressing Crash turns Crash into a no-op, and a real `disabled`
 * would drop keyboard focus onto the page the moment it was pressed. The
 * fault in force is not greyed out like the rest: it reads as pressed, in
 * the danger colours, and says what is happening ("Crashed"), since a grey
 * button read as the one thing you could not do.
 * ------------------------------------------------------------------ */

export interface NodeFaultControlsProps {
  /** The fault in force on this node, or null when it is healthy. */
  fault: ActiveFailure | null;
  /** Every cable into or out of this node. */
  cables: readonly CableInfo[];
  onCrash: () => void;
  /** Take it down, and have it start again by itself `downMs` later. */
  onRestart: (downMs: number) => void;
  /**
   * What else a restart loses on this kind, as a sentence: the writes a
   * store had not put on disk, or the messages a broker held. Absent where
   * losing the work in progress is all.
   */
  restartLoses?: string;
  /**
   * Take one machine down and leave the rest serving. Absent for a node with
   * a single instance, or a kind that cannot lose one, and the row is not
   * shown: with one machine it would be Crash under another name.
   */
  onCrashOne?: () => void;
  /** How many machines the node runs, for the Crash one instance hint. */
  instances?: number;
  /**
   * False for a kind that does no timed work (a gate, a controller, the
   * client), where Slow would change nothing. The row stays, inert, and says
   * why. Defaults to true.
   */
  canSlow?: boolean;
  onSlow: (factor: number) => void;
  /**
   * Stop it for a while, and have it carry on by itself. Absent for a kind
   * that serves no requests, and the row is not shown.
   */
  onPause?: (pauseMs: number) => void;
  onGlitch: (rate: number) => void;
  onFix: () => void;
  onCut: (edgeId: string) => void;
  onRestore: (edgeId: string) => void;
  /**
   * The cable faults, offered on each cable that carries requests, so they
   * are reachable from the keyboard as well as by selecting the cable.
   * Duplicate uses the default share; the cable's own panel picks another.
   */
  onDuplicate?: (edgeId: string, rate: number) => void;
  onUndup?: (edgeId: string) => void;
  onCutReplies?: (edgeId: string) => void;
  onRestoreReplies?: (edgeId: string) => void;
  /** How many entries the fault schedule holds. */
  recorded?: number;
  /** Empty the schedule. Without it, the Forget row is not shown. */
  onForget?: () => void;
}

/** Shared click guard for aria-disabled buttons. */
function guarded(inert: boolean, act: () => void): () => void {
  return () => {
    if (!inert) act();
  };
}

export function NodeFaultControls({
  fault,
  cables,
  onCrash,
  onRestart,
  restartLoses,
  onCrashOne,
  instances = 1,
  canSlow = true,
  onSlow,
  onPause,
  onGlitch,
  onFix,
  onCut,
  onRestore,
  onDuplicate,
  onUndup,
  onCutReplies,
  onRestoreReplies,
  recorded = 0,
  onForget,
}: NodeFaultControlsProps) {
  const id = useId();
  const [factor, setFactor] = useState(DEFAULT_SLOW_FACTOR);
  const [rate, setRate] = useState(DEFAULT_GLITCH_RATE);
  const [downMs, setDownMs] = useState(DEFAULT_RESTART_DOWN_MS);
  const [pauseMs, setPauseMs] = useState(DEFAULT_PAUSE_MS);

  const crashed = fault?.kind === 'crash';
  // Already down, so a restart now would only move the moment it comes back.
  const restartInert = crashed || fault?.kind === 'restart';
  const oneDown = fault?.kind === 'crash-instance';
  const slowSame = fault?.kind === 'slow' && fault.factor === factor;
  const slowInert = !canSlow || slowSame;
  const glitchSame = fault?.kind === 'errors' && fault.rate === rate;
  // A second pause would only move the moment it carries on.
  const paused = fault?.kind === 'pause';
  const healthy = fault === null;

  /* The faults this kind offers, as one segmented row. Picking one shows
     only its own option and button; a wall of five option rows, each with a
     paragraph under it, was more than a student reads before pressing. */
  const offered: readonly FaultPick[] = [
    'crash',
    'restart',
    ...(onCrashOne ? (['crash-instance'] as const) : []),
    'slow',
    ...(onPause ? (['pause'] as const) : []),
    'errors',
  ];
  const [chosen, setChosen] = useState<FaultPick>(() =>
    fault && isPick(fault.kind) ? fault.kind : 'crash',
  );
  // A node switched under the panel may not offer what was picked last.
  const pick: FaultPick = offered.includes(chosen) ? chosen : 'crash';

  let panel: ReactNode;
  switch (pick) {
    case 'crash':
      panel = (
        <div className="ins-fault-row">
          <button
            type="button"
            className="btn btn-sm"
            aria-disabled={crashed}
            aria-pressed={crashed}
            aria-describedby={`${id}-hint`}
            onClick={guarded(crashed, onCrash)}
          >
            {crashed ? t('Crashed') : t('Crash')}
          </button>
          <HintLine
            id={`${id}-hint`}
            about="Crash"
            text={t(
              'Stops it completely until you press Fix. Work it was holding is lost.',
            )}
          />
        </div>
      );
      break;
    case 'restart':
      panel = (
        <div className="ins-fault-row">
          <label className="row-k" htmlFor={`${id}-down`}>
            {t('Down for')}
          </label>
          <div className="ins-fault-pair">
            <select
              id={`${id}-down`}
              className="ins-number"
              value={downMs}
              onChange={(e) => setDownMs(Number(e.currentTarget.value))}
            >
              {RESTART_DOWN_MS.map((ms) => (
                <option key={ms} value={ms}>
                  {formatDownFor(ms)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm"
              aria-disabled={restartInert}
              aria-describedby={`${id}-hint`}
              onClick={guarded(restartInert, () => onRestart(downMs))}
            >
              {t('Restart')}
            </button>
          </div>
          <HintLine
            id={`${id}-hint`}
            about="Restart"
            text={`${t('Stops it, then it starts again by itself. Work in progress is lost.')}${restartLoses ? ` ${restartLoses}` : ''}`}
          />
        </div>
      );
      break;
    case 'crash-instance':
      panel = (
        <div className="ins-fault-row">
          <button
            type="button"
            className="btn btn-sm"
            aria-disabled={oneDown}
            aria-pressed={oneDown}
            aria-describedby={`${id}-hint`}
            onClick={guarded(oneDown, () => onCrashOne?.())}
          >
            {oneDown ? t('One instance down') : t('Crash one instance')}
          </button>
          <HintLine
            id={`${id}-hint`}
            about="Crash one instance"
            text={t(
              'Stops one of its {n} machines. The work on that machine is lost, and the other {rest} keep serving with fewer slots between them.',
              { n: instances, rest: instances - 1 },
            )}
          />
        </div>
      );
      break;
    case 'slow':
      panel = (
        <div className="ins-fault-row">
          <label className="row-k" htmlFor={`${id}-factor`}>
            {t('How much slower')}
          </label>
          <div className="ins-fault-pair">
            <select
              id={`${id}-factor`}
              className="ins-number"
              value={factor}
              disabled={!canSlow}
              onChange={(e) => setFactor(Number(e.currentTarget.value))}
            >
              {SLOW_FACTORS.map((f) => (
                <option key={f} value={f}>
                  {formatFactor(f)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm"
              aria-disabled={slowInert}
              aria-pressed={slowSame}
              aria-describedby={`${id}-hint`}
              onClick={guarded(slowInert, () => onSlow(factor))}
            >
              {slowSame ? t('Slowed') : t('Slow')}
            </button>
          </div>
          <HintLine
            id={`${id}-hint`}
            about="Slow"
            text={
              canSlow
                ? t('Every request takes that many times longer to handle.')
                : t(
                    'It does no work of its own that takes time, so there is nothing here to slow down. Try it on a component that handles requests.',
                  )
            }
          />
        </div>
      );
      break;
    case 'pause':
      panel = (
        <div className="ins-fault-row">
          <label className="row-k" htmlFor={`${id}-pause`}>
            {t('Stall for')}
          </label>
          <div className="ins-fault-pair">
            <select
              id={`${id}-pause`}
              className="ins-number"
              value={pauseMs}
              onChange={(e) => setPauseMs(Number(e.currentTarget.value))}
            >
              {PAUSE_MS.map((ms) => (
                <option key={ms} value={ms}>
                  {formatDownFor(ms)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm"
              aria-disabled={paused}
              aria-describedby={`${id}-hint`}
              onClick={guarded(paused, () => onPause?.(pauseMs))}
            >
              {t('Stall')}
            </button>
          </div>
          <HintLine
            id={`${id}-hint`}
            about="Stall"
            text={t(
              'It freezes for that long, then carries on by itself. A long garbage collection pause stalls a program the same way. It returns no errors itself, but callers that give up waiting fail or send the same request again.',
            )}
          />
        </div>
      );
      break;
    case 'errors':
      panel = (
        <div className="ins-fault-row">
          <label className="row-k" htmlFor={`${id}-rate`}>
            {t('Requests that fail')}
          </label>
          <div className="ins-fault-pair">
            <select
              id={`${id}-rate`}
              className="ins-number"
              value={rate}
              onChange={(e) => setRate(Number(e.currentTarget.value))}
            >
              {GLITCH_RATES.map((r) => (
                <option key={r} value={r}>
                  {formatPct(r)}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm"
              aria-disabled={glitchSame}
              aria-pressed={glitchSame}
              aria-describedby={`${id}-hint`}
              onClick={guarded(glitchSame, () => onGlitch(rate))}
            >
              {glitchSame ? t('Glitching') : t('Glitch')}
            </button>
          </div>
          <HintLine
            id={`${id}-hint`}
            about="Glitch"
            text={t('It stays up, but that share of its answers are errors.')}
          />
        </div>
      );
      break;
  }

  return (
    <div className="ins-fault">
      <p
        className={healthy ? 'ins-fault-status' : 'ins-fault-status is-danger'}
        role="status"
      >
        {faultStatus(fault)}
      </p>

      {/* Native radios: the arrows move between them and a screen reader
          hears "Slow, radio button, 4 of 6" without any wiring here. */}
      <fieldset className="ins-seg">
        <legend className="sr-only">{t('Fault to try')}</legend>
        {offered.map((p) => {
          const live = fault?.kind === p;
          return (
            <label
              key={p}
              className={`ins-seg-opt${p === pick ? ' is-active' : ''}${live ? ' is-live' : ''}`}
            >
              <input
                type="radio"
                className="ins-seg-input"
                name={`${id}-fault`}
                value={p}
                checked={p === pick}
                onChange={() => setChosen(p)}
              />
              {t(PICK_LABEL[p])}
              {live ? <span className="sr-only">{t(', in force')}</span> : null}
            </label>
          );
        })}
      </fieldset>

      {panel}

      <div className="ins-fault-row">
        {/* The way back is the one next step while something is broken. */}
        <button
          type="button"
          className={healthy ? 'btn btn-sm' : 'btn btn-sm btn-primary'}
          aria-disabled={healthy}
          onClick={guarded(healthy, onFix)}
        >
          {t('Fix')}
        </button>
      </div>

      {cables.length > 0 && (
        <div className="ins-fault-cables">
          <h3 className="label ins-fault-sub">{t('Connections')}</h3>
          <ul className="ins-fault-list">
            {cables.map((c) => {
              const extras =
                c.carriesRequests &&
                onDuplicate &&
                onUndup &&
                onCutReplies &&
                onRestoreReplies;
              const notes = [
                c.duplicating ? t('duplicating') : null,
                c.repliesCut ? t('answers cut') : null,
              ].filter((n): n is string => n !== null);
              return (
                <li key={c.id} className="ins-fault-cable">
                  <span
                    className={
                      c.state === 'connected' && notes.length === 0
                        ? 'row-k'
                        : 'row-k is-danger'
                    }
                  >
                    {c.label}
                    {c.state === 'connected' ? null : (
                      <span className="sr-only">{t(', cut')}</span>
                    )}
                    {notes.length > 0
                      ? t(', {notes}', { notes: notes.join(t(', ')) })
                      : null}
                  </span>
                  <span className="ins-fault-cable-acts">
                    <CableButton
                      cable={c}
                      onCut={onCut}
                      onRestore={onRestore}
                      named
                      short
                    />
                    {extras ? (
                      <CableMenu
                        cable={c}
                        onDuplicate={onDuplicate}
                        onUndup={onUndup}
                        onCutReplies={onCutReplies}
                        onRestoreReplies={onRestoreReplies}
                      />
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <RecordedFaults recorded={recorded} onForget={onForget} />
    </div>
  );
}

/** A fault the segmented row can pick, by the engine's own name for it. */
type FaultPick = 'crash' | 'restart' | 'crash-instance' | 'slow' | 'pause' | 'errors';

const PICK_LABEL: Record<FaultPick, string> = {
  crash: 'Crash',
  restart: 'Restart',
  'crash-instance': 'Crash one',
  slow: 'Slow',
  pause: 'Stall',
  errors: 'Glitch',
};

function isPick(kind: string): kind is FaultPick {
  return kind in PICK_LABEL;
}

/**
 * How many faults Reset will replay, and the way to stop it. Shown only
 * once there is something to forget, so a run nobody has broken looks
 * the way it always did.
 */
function RecordedFaults({
  recorded,
  onForget,
}: {
  recorded: number;
  onForget: (() => void) | undefined;
}) {
  const id = useId();
  if (recorded === 0 || !onForget) return null;
  return (
    <div className="ins-fault-row ins-fault-recorded">
      <p id={id} className="ins-hint">
        {tN(
          recorded,
          '1 fault is saved with this run. Reset plays it again at the same moments, and a replay link sends it along.',
          '{n} faults are saved with this run. Reset plays them again at the same moments, and a replay link sends them along.',
        )}
      </p>
      <button
        type="button"
        className="btn btn-sm"
        aria-describedby={id}
        onClick={(e) => {
          // Forgetting removes this row, button and all. Hand focus to the
          // control just above it first, so the keyboard is not dropped
          // onto the page.
          const above = e.currentTarget
            .closest('.ins-fault-recorded')
            ?.previousElementSibling?.querySelectorAll<HTMLElement>('button, select');
          above?.[above.length - 1]?.focus();
          onForget();
        }}
      >
        {t('Forget saved faults')}
      </button>
    </div>
  );
}

/**
 * Cut cable or Restore for one edge. `named` puts the cable's own label in
 * the accessible name, for a list where several buttons share the same
 * visible text. The name always starts with the visible words, so a voice
 * command that says what it sees still lands.
 */
function CableButton({
  cable,
  onCut,
  onRestore,
  named = false,
  short = false,
}: {
  cable: CableInfo;
  onCut: (edgeId: string) => void;
  onRestore: (edgeId: string) => void;
  named?: boolean;
  /** "Cut" rather than "Cut connection", for a row already headed by the connection. */
  short?: boolean;
}) {
  const who = `${cable.label.charAt(0).toLowerCase()}${cable.label.slice(1)}`;
  if (cable.state === 'connected') {
    return (
      <button
        type="button"
        className="btn btn-sm"
        aria-label={named ? t('Cut connection {name}', { name: who }) : undefined}
        onClick={() => onCut(cable.id)}
      >
        {short ? t('Cut') : t('Cut connection')}
      </button>
    );
  }
  const inert = cable.state === 'partitioned';
  return (
    <button
      type="button"
      className="btn btn-sm"
      aria-label={named ? t('Restore {name}', { name: who }) : undefined}
      aria-disabled={inert}
      onClick={guarded(inert, () => onRestore(cable.id))}
    >
      {t('Restore')}
    </button>
  );
}

/**
 * The rarer cable faults for one row of a node's cable list, behind a "⋯"
 * button: Duplicate and Cut answers. A disclosure rather than an ARIA menu,
 * so Tab and the usual button keys work inside it and nothing has to
 * re-implement arrow handling. Escape, a press outside, or focus leaving it
 * closes it.
 */
function CableMenu({
  cable,
  onDuplicate,
  onUndup,
  onCutReplies,
  onRestoreReplies,
}: {
  cable: CableInfo;
  onDuplicate: (edgeId: string, rate: number) => void;
  onUndup: (edgeId: string) => void;
  onCutReplies: (edgeId: string) => void;
  onRestoreReplies: (edgeId: string) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const named = `${cable.label.charAt(0).toLowerCase()}${cable.label.slice(1)}`;

  // A press anywhere else closes it, the way out on a touch screen.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, [open]);

  return (
    <span
      ref={wrapRef}
      className="ins-cable-more"
      onKeyDown={(e) => {
        if (e.key !== 'Escape' || !open) return;
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
        toggleRef.current?.focus();
      }}
      onBlur={(e) => {
        const next = e.relatedTarget as Node | null;
        if (next && wrapRef.current?.contains(next)) return;
        setOpen(false);
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className="btn btn-sm ins-cable-more-btn"
        aria-label={t('More for the connection {name}', { name: named })}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      {open ? (
        <span id={id} className="ins-cable-menu" role="group" aria-label={cable.label}>
          {cable.duplicating ? (
            <button
              type="button"
              className="btn btn-sm"
              aria-label={t('Deliver once {name}', { name: named })}
              onClick={() => onUndup(cable.id)}
            >
              {t('Deliver once')}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm"
              aria-label={t('Duplicate {rate} of requests {name}', {
                rate: formatPct(DEFAULT_DUP_RATE),
                name: named,
              })}
              onClick={() => onDuplicate(cable.id, DEFAULT_DUP_RATE)}
            >
              {t('Duplicate')}
            </button>
          )}
          {cable.repliesCut ? (
            <button
              type="button"
              className="btn btn-sm"
              aria-label={t('Let answers back {name}', { name: named })}
              onClick={() => onRestoreReplies(cable.id)}
            >
              {t('Let answers back')}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm"
              aria-label={t('Cut answers only {name}', { name: named })}
              onClick={() => onCutReplies(cable.id)}
            >
              {t('Cut answers')}
            </button>
          )}
          <span className="ins-hint ins-cable-menu-note">
            {t(
              'Duplicate delivers {rate} of its requests twice. Cut answers lets requests through but loses what comes back. Select the connection itself for more.',
              { rate: formatPct(DEFAULT_DUP_RATE) },
            )}
          </span>
        </span>
      ) : null}
    </span>
  );
}

export interface EdgeFaultControlsProps {
  cable: CableInfo;
  /** Name of the node whose own fault is cutting this cable, if any. */
  cutBy?: string;
  onCut: (edgeId: string) => void;
  onRestore: (edgeId: string) => void;
  /** Delivering some requests twice, or null. */
  dup?: ActiveDuplicate | null;
  /**
   * Deliver some requests twice, and stop. Absent for a cable that carries
   * no requests, such as a controller's, and the rows are not shown.
   */
  onDuplicate?: (edgeId: string, rate: number) => void;
  onUndup?: (edgeId: string) => void;
  /** Losing the answers back across it, or null. */
  replyCut?: ActiveReplyCut | null;
  /** Calls still waiting on answers this cable lost, once it has stopped losing them. */
  stranded?: number;
  /** The caller has no timeout, so it waits for good on a lost answer. */
  callerWaits?: boolean;
  /**
   * Lose every answer back across it, and stop. Absent for a cable that
   * carries no requests, and the row is not shown.
   */
  onCutReplies?: (edgeId: string) => void;
  onRestoreReplies?: (edgeId: string) => void;
  /** How many entries the fault schedule holds. */
  recorded?: number;
  /** Empty the schedule. Without it, the Forget row is not shown. */
  onForget?: () => void;
}

/** The same cable control, for a single selected connection. */
export function EdgeFaultControls({
  cable,
  cutBy,
  onCut,
  onRestore,
  dup = null,
  onDuplicate,
  onUndup,
  replyCut = null,
  stranded = 0,
  callerWaits = false,
  onCutReplies,
  onRestoreReplies,
  recorded = 0,
  onForget,
}: EdgeFaultControlsProps) {
  // "Connected." beside "losing every answer" reads as a contradiction, so
  // while a fault rides on a connected cable this line says what still works.
  const status =
    cable.state === 'connected'
      ? dup !== null || replyCut !== null || stranded > 0
        ? t('Requests get through.')
        : t('Connected.')
      : cable.state === 'cut'
        ? t('Cut. Nothing crosses this connection until you restore it.')
        : cutBy
          ? t(
              'Cut because {name} is cut off from its connections. Fix {name} to reconnect it.',
              {
                name: cutBy,
              },
            )
          : t(
              'Cut because a component at one end is cut off from its connections. Fix that component to reconnect it.',
            );
  return (
    <div className="ins-fault">
      <p
        className={
          cable.state === 'connected'
            ? 'ins-fault-status'
            : 'ins-fault-status is-danger'
        }
        role="status"
      >
        {status}
      </p>
      {/* Always mounted, with only the text changing: a live region added
          to the page already holding its words is often not read out. */}
      <p
        className={dup !== null ? 'ins-fault-status is-danger' : 'sr-only'}
        role="status"
      >
        {dup !== null ? dupStatus(dup) : ''}
      </p>
      <p
        className={
          replyCut !== null || stranded > 0 ? 'ins-fault-status is-danger' : 'sr-only'
        }
        role="status"
      >
        {replyCut !== null
          ? replyCutStatus(replyCut, callerWaits)
          : stranded > 0
            ? strandedStatus(stranded)
            : ''}
      </p>
      <div className="ins-fault-row">
        <CableButton cable={cable} onCut={onCut} onRestore={onRestore} />
      </div>
      {onDuplicate && onUndup ? (
        <DuplicateRows
          edgeId={cable.id}
          dup={dup}
          onDuplicate={onDuplicate}
          onUndup={onUndup}
        />
      ) : null}
      {onCutReplies && onRestoreReplies ? (
        <ReplyCutRow
          edgeId={cable.id}
          cut={replyCut !== null}
          callerWaits={callerWaits}
          onCutReplies={onCutReplies}
          onRestoreReplies={onRestoreReplies}
        />
      ) : null}
      <RecordedFaults recorded={recorded} onForget={onForget} />
    </div>
  );
}

/**
 * Deliver some of a cable's requests twice, and stop. A scheduled fault
 * like Cut cable, so it is recorded, and Reset plays it at the same moment.
 */
function DuplicateRows({
  edgeId,
  dup,
  onDuplicate,
  onUndup,
}: {
  edgeId: string;
  dup: ActiveDuplicate | null;
  onDuplicate: (edgeId: string, rate: number) => void;
  onUndup: (edgeId: string) => void;
}) {
  const id = useId();
  const [rate, setRate] = useState(dup?.rate ?? DEFAULT_DUP_RATE);
  // A replay link can carry a share the list does not offer.
  const rates =
    dup === null || DUP_RATES.includes(dup.rate)
      ? DUP_RATES
      : [...DUP_RATES, dup.rate].sort((a, b) => a - b);
  const same = dup?.rate === rate;
  const once = dup === null;
  return (
    <>
      <div className="ins-fault-row">
        <label className="row-k" htmlFor={`${id}-dup`}>
          {t('Requests delivered twice')}
        </label>
        <div className="ins-fault-pair">
          <select
            id={`${id}-dup`}
            className="ins-number"
            value={rate}
            onChange={(e) => setRate(Number(e.currentTarget.value))}
          >
            {rates.map((r) => (
              <option key={r} value={r}>
                {formatPct(r)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-sm"
            aria-disabled={same}
            aria-describedby={`${id}-dup-hint`}
            onClick={guarded(same, () => onDuplicate(edgeId, rate))}
          >
            {t('Duplicate')}
          </button>
        </div>
        <p id={`${id}-dup-hint`} className="ins-hint">
          {t(
            'The far end gets that share of requests a second time, the way a network that resends a packet can, and does the work again. Idempotency keys there spot the copy.',
          )}
        </p>
      </div>
      <div className="ins-fault-row">
        <button
          type="button"
          className="btn btn-sm"
          aria-disabled={once}
          onClick={guarded(once, () => onUndup(edgeId))}
        >
          {t('Deliver once')}
        </button>
      </div>
    </>
  );
}

/**
 * Lose the answers coming back across a cable, and stop. The cable keeps
 * carrying requests, so this is a separate switch from Cut cable.
 */
function ReplyCutRow({
  edgeId,
  cut,
  callerWaits,
  onCutReplies,
  onRestoreReplies,
}: {
  edgeId: string;
  cut: boolean;
  callerWaits: boolean;
  onCutReplies: (edgeId: string) => void;
  onRestoreReplies: (edgeId: string) => void;
}) {
  const id = useId();
  return (
    <div className="ins-fault-row">
      {cut ? (
        <button
          type="button"
          className="btn btn-sm"
          aria-describedby={id}
          onClick={() => onRestoreReplies(edgeId)}
        >
          {t('Let answers back')}
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-sm"
          aria-describedby={id}
          onClick={() => onCutReplies(edgeId)}
        >
          {t('Cut answers only')}
        </button>
      )}
      <p id={id} className="ins-hint">
        {t(
          'Requests still get through and do their work, but the answers never come back. {more}',
          {
            more: callerWaits
              ? t(
                  'The caller has no timeout, so every call that lost its answer stays stuck, even after you let answers back.',
                )
              : t(
                  'The caller waits until its timeout gives up, and with retries it does the work a second time.',
                ),
          },
        )}
      </p>
    </div>
  );
}

export interface LinkLossControlsProps {
  /** The share of crossings this connection drops now, 0 to 1. */
  lossRate: number;
  /** Set it. A design edit, so it is saved and undoable, not recorded. */
  onLoss: (lossRate: number) => void;
}

/**
 * Packet loss for a single selected connection. Unlike the fault buttons
 * this changes the design itself, the way a slider does, so it is saved
 * with the design and stays in force after Reset.
 */
export function LinkLossControls({ lossRate, onLoss }: LinkLossControlsProps) {
  const id = useId();
  const [rate, setRate] = useState(lossRate > 0 ? lossRate : DEFAULT_LOSS_RATE);
  // A design loaded from a file can hold a value the list does not offer.
  const rates = LOSS_RATES.includes(lossRate)
    ? LOSS_RATES
    : [...LOSS_RATES, lossRate].sort((a, b) => a - b);
  const same = rate === lossRate;

  return (
    <div className="ins-fault">
      <p
        className={lossRate > 0 ? 'ins-fault-status is-danger' : 'ins-fault-status'}
        role="status"
      >
        {lossRate > 0
          ? t(
              'Losing {rate} of the requests sent across it. A caller with retries sends a lost request again.',
              { rate: formatPct(lossRate) },
            )
          : t('Delivers every request sent across it.')}
      </p>
      <div className="ins-fault-row">
        <label className="row-k" htmlFor={`${id}-loss`}>
          {t('Requests lost on the way')}
        </label>
        <div className="ins-fault-pair">
          <select
            id={`${id}-loss`}
            className="ins-number"
            value={rate}
            onChange={(e) => setRate(Number(e.currentTarget.value))}
          >
            {rates.map((r) => (
              <option key={r} value={r}>
                {r === 0 ? t('None') : formatPct(r)}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-sm"
            aria-disabled={same}
            aria-describedby={`${id}-hint`}
            onClick={guarded(same, () => onLoss(rate))}
          >
            {t('Set loss')}
          </button>
        </div>
        <p id={`${id}-hint`} className="ins-hint">
          {t(
            'Saved with the design, so it stays after Reset. The component at the other end never sees a lost request.',
          )}
        </p>
      </div>
    </div>
  );
}
