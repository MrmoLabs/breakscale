import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { t, tN } from '../i18n';
import { takesCorrectness } from '../sim/behaviour';
import {
  HARDER_BUDGET,
  kindFits,
  replayOf,
  retriesTowardCharges,
} from '../sim/breakit';
import type { Attack, AttackKind, BreakOptions, SearchProgress } from '../sim/breakit';
import { isCorrectnessGoal } from '../sim/challenge';
import type { Goal } from '../sim/challenge';
import type { Violation } from '../sim/oplog';
import type { SimNode, Topology } from '../sim/types';
import { followRequest } from '../sim/verify';
import type { BreakSearch } from '../useBreakSearch';
import {
  truncatedLine,
  baselineSentence,
  checkedLine,
  clock,
  closestLine,
  effectSentence,
  evidenceSentence,
  faultPhrase,
  goalLine,
  goneLine,
  nothingRetriesLine,
  phaseLine,
  scheduleSentence,
  singlePointLines,
  timelineWords,
  triedLine,
} from './breakCopy';
import type { Names, TimelineTag } from './breakCopy';
import { secs } from './breakCopy';
import { Term } from './Tooltip';
import './Challenge.css';
import './BreakIt.css';
import { CloseButton } from './CloseButton';

/**
 * "Can you break it?": pick what has to hold, and Breakscale throws faults
 * at the design until it gives way or runs out of tries.
 *
 * Docks where a brief does and uses its panel, sheet on a phone included,
 * because the canvas has to stay in view: the parts under attack are marked
 * on it. Non-modal, so nothing traps focus; Escape stops a search, and
 * closes the panel when nothing is running.
 */
export interface BreakPanelProps {
  search: BreakSearch;
  names: Names;
  /** The components the reader can leave alone. */
  nodes: readonly SimNode[];
  onClose: () => void;
  onWatch: () => void;
  onReplayLink: () => void;
  /** Mark a part as charging money, through the same undoable edit the Inspector makes. */
  onMarkChargeable: (id: string) => void;
  /**
   * While a replay plays: what it has measured so far, when its first fault
   * lands and when its window ends. The panel folds to it. Null otherwise.
   */
  watch: ReplayWatch | null;
  /** The replay's own clock, read on every render. */
  watchAtMs?: number;
  /** Stop watching and put the reader's design back. */
  onStopWatch?: () => void;
  foldOnStart?: boolean;
  onSheetResize?: (height: number | null, shut: boolean) => void;
}

export interface ReplayWatch {
  /** The figure so far, as a sentence. */
  line: string;
  firstMs: number;
  endMs: number;
}

const KIND_LABEL: Record<AttackKind, string> = {
  crash: 'Crashes',
  'crash-instance': 'Losing one instance',
  slow: 'Slowdowns',
  errors: 'Random errors',
  cut: 'Cut connections',
  duplicate: 'Requests delivered twice',
  pause: 'Stalls (a process pauses)',
  'cut-replies': 'Answers lost on the way back',
};

/** A template's name in the radio group. */
function templateLabel(goal: Goal, names: Names): string {
  const who = goal.route === undefined ? null : names.node(goal.route);
  switch (goal.metric) {
    case 'errorRate':
      return who ? t('Keep {who} up', { who }) : t('Keep everyone up');
    case 'p99':
    case 'p95':
      return who ? t('Keep {who} fast', { who }) : t('Stay fast');
    case 'lostWrites':
      return t('No lost writes');
    case 'lostJobs':
      return t('No lost jobs');
    case 'doubleCharges':
      return t('Every payment charged at most once');
    case 'lostAckedWrites':
      return t('No saved write is lost');
    case 'staleReads':
      return t('Read your own writes');
    case 'queueDepth':
      return '';
  }
}

/** The sentence around a template's number, and the number's unit. */
function templateSentence(goal: Goal): {
  before: string;
  after: string;
  unit: string;
  aria: string;
} {
  const onRoute = goal.route !== undefined;
  switch (goal.metric) {
    case 'errorRate':
      return {
        before: t('Fewer than'),
        after: onRoute ? t('% of their requests fail.') : t('% of requests fail.'),
        unit: t('percent'),
        aria: t('Fewer than how many percent'),
      };
    case 'p99':
    case 'p95':
      return {
        before: onRoute
          ? t('99 in 100 of their requests finish within')
          : t('99 in 100 requests finish within'),
        after: t('ms.'),
        unit: t('milliseconds'),
        aria: onRoute
          ? t('99 in 100 of their requests finish within how many milliseconds')
          : t('99 in 100 requests finish within how many milliseconds'),
      };
    case 'lostWrites':
      return {
        before: t('At most'),
        after: t('saved writes are lost.'),
        unit: t('writes'),
        aria: t('At most how many writes'),
      };
    case 'doubleCharges':
      return {
        before: t('At most'),
        after: t('payments are charged more than once.'),
        unit: t('payments'),
        aria: t('At most how many payments'),
      };
    case 'lostAckedWrites':
      return {
        before: t('At most'),
        after: t('writes the client was told were saved are lost.'),
        unit: t('writes'),
        aria: t('At most how many writes'),
      };
    case 'staleReads':
      return {
        before: t('At most'),
        after: t('reads miss a write the same client was told was saved.'),
        unit: t('reads'),
        aria: t('At most how many reads'),
      };
    default:
      return {
        before: t('At most'),
        after: t('accepted jobs fail.'),
        unit: t('jobs'),
        aria: t('At most how many jobs'),
      };
  }
}

/**
 * A goal's number. What the reader types is kept as typed, so the field can
 * be cleared and retyped; it counts once it reads as a number of 0 or more,
 * and a blur puts back the last one that did.
 */
function GoalNumber({
  id,
  value,
  describedBy,
  label,
  onCommit,
}: {
  id: string;
  value: number;
  describedBy: string;
  label: string;
  onCommit: (v: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      id={id}
      className="brk-num num"
      type="number"
      inputMode="decimal"
      min={0}
      step="any"
      value={draft ?? String(value)}
      aria-describedby={describedBy}
      aria-label={label}
      onChange={(e) => {
        const text = e.currentTarget.value;
        setDraft(text);
        const v = Number(text);
        if (text.trim() !== '' && Number.isFinite(v) && v >= 0) onCommit(v);
      }}
      onBlur={() => setDraft(null)}
    />
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={open ? 'm18 15-6-6-6 6' : 'm6 9 6 6 6-6'} />
    </svg>
  );
}

/** The heading for the state the panel is in. */
function headingOf(search: BreakSearch): string {
  const v = search.view;
  if (v.status !== 'done') return t('Can you break it?');
  switch (v.result.status) {
    case 'broke':
      return v.result.fromRemembered ? t('Still breaks.') : t('Broke it.');
    case 'held':
      return t('Held.');
    case 'alreadyBroken':
      return t('Already broken.');
  }
}

/** The one line a screen reader hears when a verdict lands. */
function announcement(search: BreakSearch, names: Names): string {
  const v = search.view;
  if (v.status === 'searching') return v.progress ? phaseLine(v.progress.phase) : '';
  if (v.status === 'stopped') return t('Stopped.');
  if (v.status !== 'done') return '';
  const r = v.result;
  switch (r.status) {
    case 'broke':
      return `${headingOf(search)} ${scheduleSentence(r.attacks, names)} ${effectSentence(r.run, v.goal, names)}`;
    case 'held':
      return heldLine(r.tried);
    case 'alreadyBroken':
      return `${t('Already broken with no faults.')} ${effectSentence(r.baseline.worst, v.goal, names)}`;
  }
}

/** "Held across N fault schedule(s)." */
function heldLine(tried: number): string {
  return tN(
    tried,
    'Held across {n} fault schedule.',
    'Held across {n} fault schedules.',
  );
}

export function BreakPanel({
  search,
  names,
  nodes,
  onClose,
  onWatch,
  onReplayLink,
  onMarkChargeable,
  watch,
  watchAtMs = 0,
  onStopWatch,
  foldOnStart = false,
  onSheetResize,
}: BreakPanelProps) {
  const headingId = useId();
  const bodyId = useId();
  const baselineId = useId();
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [collapsed, setCollapsed] = useState(foldOnStart);
  /** Folded to one line while fixing or watching. */
  const [fixing, setFixing] = useState(false);
  const view = search.view;
  const shut = collapsed;

  /* Report the sheet's size to the shell, as the brief's panel does. */
  const shutRef = useRef(shut);
  const onSheetResizeRef = useRef(onSheetResize);
  useLayoutEffect(() => {
    shutRef.current = shut;
    onSheetResizeRef.current = onSheetResize;
  });
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      onSheetResizeRef.current?.(el.getBoundingClientRect().height, shutRef.current);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      onSheetResizeRef.current?.(null, shutRef.current);
    };
  }, []);

  /* The panel only ever opens because the reader asked, from the bar, the
     menu or F, so focus comes to its heading: from F on the diagram it used
     to stay on a box, and nothing said the panel had opened. Escape takes
     focus back to the bar's button. */
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  /* Focus goes to a verdict's heading as it lands, so a screen reader is
     where the answer is. Keyed on the result object, which is new per run. */
  const result = view.status === 'done' ? view.result : null;
  useEffect(() => {
    if (result) headingRef.current?.focus();
  }, [result]);

  /* A new search unfolds the panel again. Adjusted during render, so the
     folded bar is never painted for a frame over a running search. */
  const [seenStatus, setSeenStatus] = useState(view.status);
  if (seenStatus !== view.status) {
    setSeenStatus(view.status);
    if (view.status === 'searching') setFixing(false);
  }

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Escape') return;
    e.stopPropagation();
    if (view.status === 'searching') search.stop();
    else onClose();
  };

  const heading = headingOf(search);
  const verdictTone =
    result?.status === 'broke' || result?.status === 'alreadyBroken'
      ? 'is-failed'
      : result?.status === 'held'
        ? 'is-passed'
        : '';

  return (
    <section
      ref={sectionRef}
      className={`chal brk ${verdictTone}${shut ? ' is-collapsed' : ''}`}
      role="region"
      aria-labelledby={headingId}
      data-chrome=""
      onKeyDown={onKeyDown}
    >
      <header className="chal-head">
        <div className="chal-head-text">
          {view.status === 'done' ? (
            <p className="label chal-kicker">{t('Can you break it?')}</p>
          ) : null}
          <h2 id={headingId} ref={headingRef} className="chal-name" tabIndex={-1}>
            {heading}
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-icon chal-collapse"
          aria-expanded={!shut}
          aria-controls={bodyId}
          aria-label={shut ? t('Show the panel') : t('Fold the panel')}
          title={shut ? t('Show the panel') : t('Fold the panel')}
          onClick={() => setCollapsed((c) => !c)}
        >
          <Chevron open={!shut} />
        </button>
        <CloseButton onClick={onClose} className="btn-sm" />
      </header>

      <p className="sr-only" role="status">
        {announcement(search, names)}
      </p>

      {watch !== null ? (
        <ReplayStrip
          watch={watch}
          atMs={watchAtMs}
          onStop={
            onStopWatch
              ? () => {
                  setCollapsed(false);
                  onStopWatch();
                }
              : undefined
          }
        />
      ) : null}

      <div id={bodyId} className="chal-body" hidden={shut}>
        {search.stale && view.status === 'done' ? (
          <div className="brk-stale">
            <p className="chal-note">
              {t('You changed the design after this ran. A replay plays it as it was.')}
            </p>
            {/* The fixing view below has its own. */}
            {fixing && result?.status === 'broke' ? null : <RunAgain search={search} />}
          </div>
        ) : null}

        {view.status === 'picking' ? (
          <Picking
            search={search}
            names={names}
            nodes={nodes}
            baselineId={baselineId}
            onMarkChargeable={onMarkChargeable}
          />
        ) : view.status === 'searching' || view.status === 'stopped' ? (
          <Searching
            search={search}
            names={names}
            progress={view.progress}
            stopped={view.status === 'stopped'}
          />
        ) : fixing && result?.status === 'broke' ? (
          <div className="brk-fixing">
            <p className="chal-note">
              {t(
                'Broke at: {schedule} Change the design, then run it again. Those faults are tried first.',
                {
                  schedule: scheduleSentence(result.attacks, names),
                },
              )}
            </p>
            <div className="chal-actions">
              <RunAgain search={search} primary />
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setFixing(false)}
              >
                {t('Show the verdict')}
              </button>
            </div>
          </div>
        ) : view.status === 'done' ? (
          <Verdict
            search={search}
            names={names}
            onWatch={() => {
              // Folded to the replay's line, so the run can be seen.
              setCollapsed(true);
              onWatch();
            }}
            onReplayLink={onReplayLink}
            onFix={() => {
              if (result?.status === 'broke') search.remember(result.attacks);
              setFixing(true);
            }}
          />
        ) : null}
      </div>
    </section>
  );
}

/**
 * Where a replay is: its clock against the end of the window, a bar for the
 * same, the figure so far, and a way out. Shown folded or not, so the run
 * can be stopped without opening the panel first.
 */
function ReplayStrip({
  watch,
  atMs,
  onStop,
}: {
  watch: ReplayWatch;
  atMs: number;
  onStop: (() => void) | undefined;
}) {
  const at = Math.min(Math.floor(atMs / 1000) * 1000, watch.endMs);
  const done = atMs >= watch.endMs;
  const until = Math.ceil((watch.firstMs - atMs) / 1000);
  const clock = done
    ? t('Replay done')
    : t('Replay {a} of {b}', { a: secs(at), b: secs(watch.endMs) });
  return (
    <div className="brk-watch">
      <div className="brk-watch-head">
        <p className="brk-watch-clock">{clock}</p>
        {onStop ? (
          <button type="button" className="btn btn-sm" onClick={onStop}>
            {t('Stop replay')}
          </button>
        ) : null}
      </div>
      <div
        className="brk-watch-bar"
        role="progressbar"
        aria-label={t('Replay')}
        aria-valuemin={0}
        aria-valuemax={watch.endMs / 1000}
        aria-valuenow={at / 1000}
        aria-valuetext={clock}
      >
        <span style={{ width: `${(at / watch.endMs) * 100}%` }} />
      </div>
      <p className="brk-pill" aria-live="off">
        {watch.line}
        {until > 0
          ? ` ${t('The first fault lands at {at}, in {n}s.', {
              at: secs(watch.firstMs),
              n: until,
            })}`
          : ''}
      </p>
    </div>
  );
}

function Picking({
  search,
  names,
  nodes,
  baselineId,
  onMarkChargeable,
}: {
  search: BreakSearch;
  names: Names;
  nodes: readonly SimNode[];
  baselineId: string;
  onMarkChargeable: (id: string) => void;
}) {
  const { templates, baselines, opts } = search;
  const set = (patch: Partial<BreakOptions>) => search.setOpts({ ...opts, ...patch });
  const toggleKind = (k: AttackKind) =>
    set({
      kinds: opts.kinds.includes(k)
        ? opts.kinds.filter((x) => x !== k)
        : [...opts.kinds, k],
    });
  const toggleProtect = (id: string) =>
    set({
      protect: opts.protect.includes(id)
        ? opts.protect.filter((x) => x !== id)
        : [...opts.protect, id],
    });
  const selected = templates.findIndex((t) => t.id === search.goalId);
  const base = selected >= 0 ? baselines?.[selected] : undefined;
  const targets = nodes.filter((n) => n.kind !== 'client');
  const charging = search.goal.metric === 'doubleCharges';
  const charged = nodes.filter((n) => n.config.chargeable === 1);
  const unmarked = charging && charged.length === 0;

  return (
    <>
      <p className="chal-brief">
        {t(
          'Pick what has to hold. Breakscale throws faults at your design until it fails, or until it runs out of tries.',
        )}
      </p>
      {search.goneId !== null ? (
        <p className="chal-note">
          {goneLine(search.goneId)} {t('Pick another goal.')}
        </p>
      ) : null}
      <fieldset className="brk-goals">
        <legend className="label chal-block-title">{t('What has to hold')}</legend>
        {templates.map((tpl) => {
          const on = tpl.id === search.goalId;
          const s = templateSentence(tpl.goal);
          const inputId = `brk-max-${tpl.id}`;
          return (
            <div key={tpl.id} className={`brk-goal${on ? ' is-on' : ''}`}>
              <label className="brk-goal-head">
                <input
                  type="radio"
                  name="brk-goal"
                  checked={on}
                  onChange={() => search.setGoalId(tpl.id)}
                />
                <span className="brk-goal-name">{templateLabel(tpl.goal, names)}</span>
              </label>
              {on ? (
                <p className="brk-goal-sentence">
                  <label htmlFor={inputId}>{s.before}</label>{' '}
                  <GoalNumber
                    id={inputId}
                    value={search.maxOf(tpl.id)}
                    describedBy={baselineId}
                    label={s.aria}
                    onCommit={(v) => search.setMax(tpl.id, v)}
                  />{' '}
                  {s.after}
                </p>
              ) : null}
              {on ? <GoalTerms metric={tpl.goal.metric} /> : null}
              {on && tpl.goal.metric === 'doubleCharges' ? (
                <ChargeablePicker
                  nodes={nodes}
                  charged={charged}
                  names={names}
                  onMark={onMarkChargeable}
                />
              ) : null}
            </div>
          );
        })}
      </fieldset>
      <p id={baselineId} className="chal-note">
        {unmarked
          ? t('Pick the part that charges the card to measure it.')
          : base
            ? `${baselineSentence(base.worst, search.goal, names)} ${t('That is the worst of three runs of traffic.')}`
            : t('Measuring it with no faults…')}
      </p>

      {search.singlePoints.length > 0 ? (
        <div className="chal-block brk-spof">
          <p className="label chal-block-title">{t('Single points of failure')}</p>
          <ul className="brk-list">
            {singlePointLines(search.singlePoints, names).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          {isCorrectnessGoal(search.goal) ? (
            // An outage cannot break a goal about the data, and a crash of the
            // one store is how its writes get lost, so nothing is spared.
            <p className="chal-note">
              {t(
                'Each of these is a single point of failure. This goal is about the data, not about staying up, so the search crashes and cuts them like any other part.',
              )}
            </p>
          ) : (
            <>
              <p className="chal-note">
                {t(
                  'Each of these is a single point of failure: lose one and that traffic has nowhere to go, which breaks any goal. So the search only slows them and takes down single machines.',
                )}
              </p>
              <label className="brk-check">
                <input
                  type="checkbox"
                  checked={opts.includeSinglePoints}
                  onChange={(e) =>
                    set({ includeSinglePoints: e.currentTarget.checked })
                  }
                />
                {t('Crash and cut them too')}
              </label>
            </>
          )}
        </div>
      ) : null}

      <details className="brk-more">
        <summary>{t('What can go wrong')}</summary>
        <fieldset className="brk-kinds">
          <legend className="sr-only">{t('Kinds of fault')}</legend>
          {(Object.keys(KIND_LABEL) as AttackKind[])
            .filter((k) => kindFits(k, search.goal))
            .map((k) => (
              <label key={k} className="brk-check">
                <input
                  type="checkbox"
                  checked={opts.kinds.includes(k)}
                  onChange={() => toggleKind(k)}
                />
                {t(KIND_LABEL[k])}
              </label>
            ))}
        </fieldset>
        <label className="brk-check">
          {t('Up to')}{' '}
          <select
            value={opts.maxFaults}
            onChange={(e) =>
              set({ maxFaults: Number(e.currentTarget.value) as 1 | 2 | 3 })
            }
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>{' '}
          {t('faults at once')}
        </label>
        {targets.length > 0 ? (
          <fieldset className="brk-kinds">
            <legend className="chal-note">{t('Leave these alone:')}</legend>
            {targets.map((n) => (
              <label key={n.id} className="brk-check">
                <input
                  type="checkbox"
                  checked={opts.protect.includes(n.id)}
                  onChange={() => toggleProtect(n.id)}
                />
                {names.node(n.id)}
              </label>
            ))}
          </fieldset>
        ) : null}
      </details>

      <div className="chal-actions">
        <button
          type="button"
          className="btn btn-sm btn-primary"
          disabled={!opts.kinds.some((k) => kindFits(k, search.goal)) || unmarked}
          onClick={() => search.start()}
        >
          {t('Try to break it')}
        </button>
      </div>
    </>
  );
}

function Searching({
  search,
  names,
  progress,
  stopped,
}: {
  search: BreakSearch;
  names: Names;
  progress: SearchProgress | null;
  stopped: boolean;
}) {
  const tried = progress?.tried ?? 0;
  const budget = progress?.budget ?? search.opts.budget;
  const shrinking = progress?.phase === 'shrink';
  const holds = progress?.notes.filter((n) => n.kind === 'holds').length ?? 0;
  return (
    <>
      {stopped ? (
        <p className="chal-note">
          {t('Stopped after {tried} of {budget}. Nothing broke it yet.', {
            tried,
            budget,
          })}
        </p>
      ) : (
        <p className="chal-note">
          {progress ? phaseLine(progress.phase) : t('Starting')}
        </p>
      )}
      <div
        className="chal-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={budget}
        aria-valuenow={tried}
        aria-valuetext={t('{tried} of {budget} tried', { tried, budget })}
      >
        <span
          className="chal-progress-fill"
          style={{
            transform: `scaleX(${budget > 0 ? Math.min(1, tried / budget) : 0})`,
          }}
        />
      </div>
      <p className="brk-count">
        <span className="num">{tried}</span>
        {t(' of ')}
        <span className="num">{budget}</span>
        {t(' tried')}
        {shrinking ? (
          <>
            {t(', then ')}
            <span className="num">{progress?.shrinkTried ?? 0}</span>
            {t(' smaller versions')}
          </>
        ) : null}
      </p>
      {progress && progress.current.length > 0 && !stopped ? (
        <p className="chal-note brk-now" aria-hidden="true">
          {t('Now: {list}', {
            list: progress.current.map((a) => faultPhrase(a, names)).join(t(' and ')),
          })}
        </p>
      ) : null}
      {holds > 0 ? (
        <p className="chal-note">
          {holds === 1
            ? t('The break from last time holds now. Looking for another way in.')
            : t('{n} breaks from before hold now. Looking for another way in.', {
                n: holds,
              })}
        </p>
      ) : null}
      {progress?.notes
        .filter((n) => n.kind === 'gone')
        .map((n, i) => (
          <p key={i} className="chal-note">
            {n.kind === 'gone'
              ? t('{name} is gone, so that one no longer applies.', {
                  name: names.node(n.target),
                })
              : null}
          </p>
        ))}
      {!shrinking ? (
        <p className="chal-note">
          {closestLine(progress?.closest ?? null, search.goal, names)}
          {progress?.closest && progress.closest.score >= 0.5
            ? ` ${goalLine(search.goal)}`
            : ''}
        </p>
      ) : null}
      <div className="chal-actions">
        {stopped ? (
          <>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={search.keepGoing}
            >
              {t('Keep going')}
            </button>
            <button type="button" className="btn btn-sm" onClick={search.backToGoals}>
              {t('Change the goal')}
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-sm" onClick={search.stop}>
            {t('Stop')}
          </button>
        )}
      </div>
    </>
  );
}

function Verdict({
  search,
  names,
  onWatch,
  onReplayLink,
  onFix,
}: {
  search: BreakSearch;
  names: Names;
  onWatch: () => void;
  onReplayLink: () => void;
  onFix: () => void;
}) {
  const view = search.view;
  if (view.status !== 'done') return null;
  const r = view.result;
  if (r.status === 'alreadyBroken') {
    return (
      <>
        <p className="brk-verdict">
          {t('It is already broken with no faults.')}{' '}
          {effectSentence(r.baseline.worst, view.goal, names)}{' '}
          {goalLine(view.goal, r.baseline.worst)}
        </p>
        {r.baseline.worst.truncated === true ? (
          <p className="chal-note">{truncatedLine()}</p>
        ) : null}
        {r.baseline.worst.violations?.[0] ? (
          <FollowRequest
            design={view.design}
            attacks={[]}
            seed={r.baseline.worst.seed}
            violation={r.baseline.worst.violations[0]}
            names={names}
          />
        ) : null}
        <div className="chal-actions">
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={search.backToGoals}
          >
            {t('Change the goal')}
          </button>
        </div>
      </>
    );
  }
  const fixed = r.notes.filter((n) => n.kind === 'holds').length;
  const gone = r.notes.filter((n) => n.kind === 'gone');
  if (r.status === 'held') {
    return (
      <>
        <p className="brk-verdict">{heldLine(r.tried)}</p>
        <p className="chal-note">
          {triedLine(r.bySize)}{' '}
          {t(
            'Each landed between 10s and 15s, and the goal was measured from 5s to 35s on three runs of traffic.',
          )}
        </p>
        {view.goal.metric === 'doubleCharges' &&
        !r.triedDuplicates &&
        !retriesTowardCharges(view.design) ? (
          <p className="chal-note">
            {nothingRetriesLine(
              view.design.nodes
                .filter((n) => n.config.chargeable === 1)
                .map((n) => n.id),
              names,
            )}
          </p>
        ) : null}
        {r.baseline.worst.checked !== undefined ? (
          <p className="chal-note">
            {checkedLine(view.goal, r.baseline.worst.checked)}
          </p>
        ) : null}
        {r.baseline.worst.truncated === true ? (
          <p className="chal-note">{truncatedLine()}</p>
        ) : null}
        <p className="chal-note">{closestLine(r.closest, view.goal, names)}</p>
        {fixed > 0 ? (
          <p className="chal-note">
            {tN(
              fixed,
              'You fixed the way it broke last time.',
              'You fixed {n} ways it broke.',
            )}
          </p>
        ) : null}
        {gone.map((n, i) => (
          <p key={i} className="chal-note">
            {n.kind === 'gone'
              ? t('{name} is gone, so that break no longer applies.', {
                  name: names.node(n.target),
                })
              : null}
          </p>
        ))}
        <div className="chal-actions">
          {/* Only when it used every try it had and more are on offer. Fewer
              means it ran out of new schedules, and more tries find none. */}
          {r.budget < HARDER_BUDGET && r.tried >= r.budget ? (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => search.start(true)}
            >
              {t('Try harder')}
            </button>
          ) : null}
          <button type="button" className="btn btn-sm" onClick={search.backToGoals}>
            {t('Change the goal')}
          </button>
        </div>
      </>
    );
  }
  return (
    <>
      <p className="brk-verdict brk-schedule">{scheduleSentence(r.attacks, names)}</p>
      <p className="brk-verdict">
        {effectSentence(r.run, view.goal, names)} {goalLine(view.goal, r.run)}
      </p>
      <p className="chal-note brk-small">
        {r.fromRemembered
          ? t('The same faults as last time.')
          : r.shrinkTried > 0
            ? t('Found on try {n}, then made smaller in {m} more.', {
                n: r.foundAt,
                m: r.shrinkTried,
              })
            : t('Found on try {n}.', { n: r.foundAt })}{' '}
        {t('It broke on this run of traffic and on another one too.')}
      </p>
      {r.run.truncated === true ? <p className="chal-note">{truncatedLine()}</p> : null}
      {r.run.violations?.[0] ? (
        <FollowRequest
          design={view.design}
          attacks={r.attacks}
          seed={r.run.seed}
          violation={r.run.violations[0]}
          names={names}
        />
      ) : null}
      <div className="chal-actions brk-actions">
        <button type="button" className="btn btn-sm btn-primary" onClick={onWatch}>
          {t('Watch the replay')}
        </button>
        <button type="button" className="btn btn-sm" onClick={onReplayLink}>
          {t('Replay link')}
        </button>
        <button type="button" className="btn btn-sm" onClick={onFix}>
          {t('Try to fix it')}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost"
          onClick={search.backToGoals}
        >
          {t('Change the goal')}
        </button>
      </div>
    </>
  );
}

/** A story line's tag, in words as well as colour. */
const TAG_WORDS: Record<NonNullable<TimelineTag>, string> = {
  'charged-again': 'Charged again',
  lost: 'Lost',
  stale: 'Stale',
};

/**
 * Run the search again, or, when the goal it ran is no longer offered by
 * the design, say why and go back to the goals instead of quietly running
 * another one.
 */
function RunAgain({
  search,
  primary = false,
}: {
  search: BreakSearch;
  primary?: boolean;
}) {
  const cls = `btn btn-sm${primary ? ' btn-primary' : ''}`;
  if (search.goneId !== null) {
    return (
      <>
        <p className="chal-note">{goneLine(search.goneId)}</p>
        <button type="button" className={cls} onClick={search.backToGoals}>
          {t('Pick another goal')}
        </button>
      </>
    );
  }
  return (
    <button type="button" className={cls} onClick={() => search.start()}>
      {t('Run again')}
    </button>
  );
}

/** What a correctness goal counts, with its terms explained on hover. */
function GoalTerms({ metric }: { metric: Goal['metric'] }) {
  if (metric === 'doubleCharges') {
    return (
      <p className="chal-note brk-small">
        {t('A payment charged twice breaks the ')}
        <Term id="at-most-once">{t('at most once')}</Term>
        {t(
          ' rule. It happens when a call that already charged looks failed to its caller, after a ',
        )}
        <Term id="timeout">{t('timeout')}</Term>
        {t(' or an error further on, and the ')}
        <Term id="retry">{t('retry')}</Term>
        {t(' charges again, or when the network delivers the same call twice. An ')}
        <Term id="idempotency-key">{t('idempotency key')}</Term>
        {t(' on the part that charges is the usual fix.')}
      </p>
    );
  }
  if (metric === 'lostAckedWrites') {
    return (
      <p className="chal-note brk-small">
        {t('Counts every ')}
        <Term id="acknowledged-write">{t('acknowledged write')}</Term>
        {t(' that never reaches storage, a ')}
        <Term id="lost-write">{t('lost write')}</Term>
        {t('. A write still on its way when the run ends is not counted.')}
      </p>
    );
  }
  if (metric === 'staleReads') {
    return (
      <p className="chal-note brk-small">
        {t('Checks ')}
        <Term id="read-your-writes">{t('read your writes')}</Term>
        {t(
          ': once a client is told a write was saved, its next read of that record should show it. A ',
        )}
        <Term id="replication-lag">{t('replica that is behind')}</Term>
        {t(' serves a ')}
        <Term id="stale-read">{t('stale read')}</Term>
        {t(' instead.')}
      </p>
    );
  }
  return null;
}

/**
 * For a correctness goal with nothing marked yet: which part charges the
 * card. Once one is marked, says which, so the reader knows what is counted.
 */
function ChargeablePicker({
  nodes,
  charged,
  names,
  onMark,
}: {
  nodes: readonly SimNode[];
  charged: readonly SimNode[];
  names: Names;
  onMark: (id: string) => void;
}) {
  const id = useId();
  if (charged.length > 0) {
    return (
      <p className="chal-note brk-small">
        {t(
          "Counted at {list}, where each finished call charges money. Change it in the part's settings.",
          {
            list: charged.map((n) => names.node(n.id)).join(t(', ')),
          },
        )}
      </p>
    );
  }
  const candidates = nodes.filter((n) => takesCorrectness(n.kind));
  return (
    <p className="brk-goal-sentence">
      <label htmlFor={id}>{t('Which part charges the card?')}</label>{' '}
      <select
        id={id}
        value=""
        onChange={(e) => {
          if (e.currentTarget.value !== '') onMark(e.currentTarget.value);
        }}
      >
        <option value="">{t('Pick one')}</option>
        {candidates.map((n) => (
          <option key={n.id} value={n.id}>
            {names.node(n.id)}
          </option>
        ))}
      </select>
    </p>
  );
}

/**
 * The earliest violation in words, and the request's whole story on
 * demand. The story is played again from the replay, headless and from the
 * start, so it is the run the search measured; the canvas replay steps at
 * the display's rate and can differ in the details.
 */
function FollowRequest({
  design,
  attacks,
  seed,
  violation,
  names,
}: {
  design: Topology;
  attacks: readonly Attack[];
  seed: number;
  violation: Violation;
  names: Names;
}) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const lines = useMemo(() => {
    if (!open) return null;
    const tl = followRequest(replayOf(design, attacks, seed), violation.rid);
    return tl === null ? [] : timelineWords(tl, names, violation);
  }, [open, design, attacks, seed, violation, names]);
  return (
    <div className="brk-follow">
      <p className="brk-verdict">{evidenceSentence(violation, names)}</p>
      <div className="chal-actions">
        <button
          type="button"
          className="btn btn-sm"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? t('Hide') : t('Follow')}
          {t(' request ')}
          <span className="num">{violation.rid}</span>
        </button>
      </div>
      <ol id={listId} className="brk-story" hidden={!open}>
        {lines?.map((l, i) => (
          <li
            key={i}
            className={l.tag === null ? 'brk-story-row' : 'brk-story-row is-bad'}
          >
            <span className="num brk-story-t">{clock(l.t)}</span>
            <span>
              {l.text}
              {l.tag !== null ? (
                <span className="brk-story-tag">{t(TAG_WORDS[l.tag])}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
