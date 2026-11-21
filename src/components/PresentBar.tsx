import { useLayoutEffect, useRef } from 'react';
import type { ActiveFailure } from '../sim/types';
import { t } from '../i18n';
import { DEFAULT_SLOW_FACTOR, formatFactor } from './faultWiring';
import './PresentBar.css';

/* ==========================================================================
   The presenting bar, at the foot of the canvas.

   Presenting hides the inspector, which is where the fault buttons live, so
   this carries the three a teacher reaches for in front of a class: crash,
   slow and fix the part in hand, each with the key that does the same. It
   also holds the way out, which must never depend on knowing a key.
   ========================================================================== */

export interface PresentPart {
  id: string;
  label: string;
  fault: ActiveFailure | null;
  canSlow: boolean;
}

export interface PresentBarProps {
  part: PresentPart | null;
  coarse: boolean;
  canFullscreen: boolean;
  fullscreen: boolean;
  onCrash: (id: string) => void;
  onSlow: (id: string) => void;
  onFix: (id: string) => void;
  onFullscreen: () => void;
  onStop: () => void;
}

/** "Crashed", "Slowed 5x": the part's state in the words its buttons use. */
function faultWord(f: ActiveFailure | null): string {
  if (f === null) return t('Running');
  switch (f.kind) {
    case 'crash':
      return t('Crashed');
    case 'crash-instance':
      return t('One instance down');
    case 'slow':
      return t('Slowed {factor}', { factor: formatFactor(f.factor ?? 1) });
    case 'errors':
      return t('Glitching');
    case 'partition':
      return t('Cut off');
    case 'restart':
      return t('Restarting');
    case 'pause':
      return t('Paused');
  }
}

export function PresentBar({
  part,
  coarse,
  canFullscreen,
  fullscreen,
  onCrash,
  onSlow,
  onFix,
  onFullscreen,
  onStop,
}: PresentBarProps) {
  const key = (k: string) =>
    coarse ? null : (
      <kbd className="pb-kbd" aria-hidden="true">
        {k}
      </kbd>
    );
  const fault = part?.fault ?? null;

  /* The bar's height, published on the shell as --pb-h so the safe area
     the camera frames into stops above it however many rows it wraps to.
     A style write from an observer: the layout is the external system. */
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const host = el?.closest<HTMLElement>('.app-body');
    if (!el || !host) return;
    const write = () => host.style.setProperty('--pb-h', `${el.offsetHeight}px`);
    write();
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(write);
    ro?.observe(el);
    return () => {
      ro?.disconnect();
      host.style.removeProperty('--pb-h');
    };
  }, []);

  return (
    <div ref={ref} className="pb" data-chrome="present" data-spot-avoid="">
      {part ? (
        <div
          className="pb-part"
          role="group"
          aria-label={t('Faults for {name}', { name: part.label })}
        >
          <p className="pb-name">
            <span className="pb-label">{part.label}</span>
            <span className={`pb-state${fault ? ' is-danger' : ''}`} role="status">
              {faultWord(fault)}
            </span>
          </p>
          <div className="pb-acts">
            <button
              type="button"
              className="btn pb-btn"
              disabled={fault?.kind === 'crash'}
              aria-keyshortcuts={coarse ? undefined : 'X'}
              onClick={() => onCrash(part.id)}
            >
              {t('Crash')} {key('X')}
            </button>
            {part.canSlow ? (
              <button
                type="button"
                className="btn pb-btn"
                disabled={fault !== null}
                aria-keyshortcuts={coarse ? undefined : 'W'}
                onClick={() => onSlow(part.id)}
              >
                {t('Slow down {factor}', { factor: formatFactor(DEFAULT_SLOW_FACTOR) })}{' '}
                {key('W')}
              </button>
            ) : null}
            <button
              type="button"
              className="btn pb-btn"
              disabled={fault === null}
              aria-keyshortcuts={coarse ? undefined : 'R'}
              onClick={() => onFix(part.id)}
            >
              {t('Fix')} {key('R')}
            </button>
          </div>
        </div>
      ) : (
        <p className="pb-hint">
          {coarse
            ? t('Tap a part to crash, slow or fix it.')
            : t('Click a part or Tab to one. X crashes it, W slows it, R fixes it.')}
        </p>
      )}
      <div className="pb-exit">
        {canFullscreen ? (
          <button
            type="button"
            className="btn pb-btn pb-fullscreen"
            onClick={onFullscreen}
          >
            {fullscreen ? t('Leave full screen') : t('Full screen')}
          </button>
        ) : null}
        <button
          type="button"
          className="btn pb-btn"
          aria-keyshortcuts={coarse ? undefined : 'Shift+P'}
          onClick={onStop}
        >
          {t('Stop presenting')} {key('Shift+P')}
        </button>
      </div>
    </div>
  );
}
