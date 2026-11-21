import { memo, useMemo } from 'react';
import { t, getLocale } from '../i18n';
import { displayLabel } from '../i18n/display';
import type { SimNode } from '../sim/types';
import { useVendor } from '../content/vendors/useVendor';
import { sizeKey, useSizes } from '../content/vendors/sizing';
import { COST_NOTE, costDesign, formatMoney } from '../content/vendors/cost';
import './Cost.css';

/* ==========================================================================
   What this design would cost to run.

   WHY IT EXISTS. "Add a read replica" and "buy a bigger box" both drain a
   queue, and which one is right almost always turns on money. A simulator
   that only reports latency can argue one half of a real design review.

   Only shown once a vendor is chosen, because on generic there are no
   prices and an empty panel teaches nothing. And only ever labelled as
   compute at on-demand rates: the difference between an estimate and a bill
   is exactly the kind of gap this project refuses to paper over.
   ========================================================================== */

export interface CostProps {
  nodes: readonly SimNode[];
}

export const Cost = memo(function Cost({ nodes }: CostProps) {
  const vendor = useVendor();
  const sizes = useSizes();

  const cost = useMemo(
    () =>
      costDesign(nodes, vendor, (node) => {
        if (!vendor) return null;
        const name = sizes[sizeKey(vendor.id, node.id)];
        if (!name) return null;
        return vendor.kinds[node.kind]?.sizes?.find((s) => s.name === name) ?? null;
      }),
    [nodes, vendor, sizes],
  );

  if (!vendor) return null;

  const priced = cost.nodes.length > 0;

  return (
    <section className="ct" aria-label={t('Estimated cost')}>
      <header className="mx-head">
        <span className="label mx-eyebrow">{t('Monthly cost')}</span>
        {priced && (
          <span className="mx-head-right">
            <span className="mx-readout-wrap">
              <span className="num num-lg mx-readout">
                {formatMoney(cost.perMonth)}
              </span>
              <span className="unit mx-unit">{t('/mo')}</span>
            </span>
          </span>
        )}
      </header>

      {!priced ? (
        <p className="ct-empty">
          {t(
            'Pick an instance size for a component in the inspector and its cost will appear here.',
          )}
        </p>
      ) : (
        <>
          <ol className="ct-rows">
            {cost.nodes.map((n) => (
              <li key={n.nodeId} className="ct-row">
                {/* The stored label stays English; the row shows the
                    translation (display.ts). */}
                <span className="ct-name" title={displayLabel(n.label)}>
                  {displayLabel(n.label)}
                </span>
                <span className="ct-size">
                  {n.sizeName}
                  {n.fleet > 1 ? ` x${n.fleet}` : ''}
                </span>
                <span className="num ct-money">{formatMoney(n.perMonth)}</span>
              </li>
            ))}
          </ol>

          {cost.unpriced.length > 0 && (
            /* Said out loud. A total that quietly skips three components
               looks complete and is wrong by an unknown amount, which is
               worse than a total that admits what it left out. */
            <p className="ct-unpriced">
              {t('Not counted, no size chosen: {names}.', {
                names: cost.unpriced
                  .map(displayLabel)
                  .join(getLocale() === 'zh' ? '、' : ', '),
              })}
            </p>
          )}

          <p className="ct-note">{t(COST_NOTE)}</p>
        </>
      )}
    </section>
  );
});
