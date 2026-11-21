import { useMemo } from 'react';
import type { NodeConfig, NodeKind } from '../sim/types';
import { t } from '../i18n';
import { useVendor } from '../content/vendors/useVendor';
import { mappingFor } from '../content/vendors/lookup';
import { DERIVED_NOTE, applySize, isSizedKind } from '../content/vendors/derive';
import { setSize, sizeKey, useSizes } from '../content/vendors/sizing';
import './VendorPanel.css';

/* ==========================================================================
   What this component is called at the chosen vendor, and how big it is.

   Only rendered when a vendor is chosen. On generic it is absent entirely
   rather than empty, because a student learning what a load balancer IS
   should not have a panel asking them to pick an instance class for it.

   THE HONESTY RULE. Every spec shown here is published and linked. The
   capacity a size implies is NOT published by anyone, so it is labelled as
   ours wherever it appears. That labelling is the feature; without it this
   panel would be the app quietly inventing numbers, which is the exact
   thing it exists to argue against.
   ========================================================================== */

export interface VendorPanelProps {
  nodeId: string;
  kind: NodeKind;
  config: NodeConfig;
  onChange: (patch: Partial<NodeConfig>) => void;
}

export function VendorPanel({ nodeId, kind, config, onChange }: VendorPanelProps) {
  const vendor = useVendor();
  const mapping = useMemo(() => mappingFor(kind, vendor), [kind, vendor]);
  const sizes_ = useSizes();
  const chosen = vendor ? (sizes_[sizeKey(vendor.id, nodeId)] ?? null) : null;

  if (!vendor || !mapping) return null;

  const sizes = mapping.sizes ?? [];
  const sizeable = isSizedKind(kind) && sizes.length > 0;

  return (
    <section className="vp" aria-label={t('{name} details', { name: vendor.label })}>
      <p className="label vp-eyebrow">{t('On {name}', { name: vendor.label })}</p>
      <p className="vp-product">{mapping.product}</p>
      {mapping.note && <p className="vp-note">{t(mapping.note)}</p>}

      {sizes.length > 0 && (
        <>
          <label className="vp-field">
            <span className="vp-label">{t('Size')}</span>
            {/* Uncontrolled on purpose. A size is an ACTION, not a stored
                property: picking one writes a capacity and the component
                then belongs to the student, who may tune it further. Binding
                the select to a value would either fight that edit or claim
                the component is still "a db.r6g.large" after they changed
                it, and neither is true. */}
            <select
              className="vp-select"
              value={chosen ?? ''}
              onChange={(e) => {
                const picked = sizes.find((s) => s.name === e.target.value);
                if (!picked) return;
                // Remembered so the design can be priced and so the choice
                // survives a reload. The engine never sees this: it only
                // ever learns the capacity written below.
                setSize(vendor.id, nodeId, picked.name);
                // Only the fields the derivation is willing to speak to.
                // applySize returns the config untouched for a kind or a
                // size it cannot honestly size, so an unsizeable pick is a
                // no-op rather than a silent zero.
                const next = applySize(kind, config, picked);
                if (next !== config) onChange({ capacity: next.capacity });
              }}
            >
              <option value="">{t('Choose a size')}</option>
              {sizes.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                  {s.vcpu ? ` · ${s.vcpu} vCPU` : ''} · {s.memory} {s.memoryUnit}
                  {s.pricePerHour ? ` · $${s.pricePerHour}/h` : ''}
                </option>
              ))}
            </select>
          </label>

          {sizeable ? (
            <p className="vp-derived">{t(DERIVED_NOTE)}</p>
          ) : (
            /* A size is shown for its published specs and its price, but
               nothing about it changes the simulation, and saying so is
               better than letting a reader assume the picker did something. */
            <p className="vp-derived">
              {t(
                'These sizes are for their published specs and prices. This kind is not limited by an instance size, so picking one changes nothing in the simulation.',
              )}
            </p>
          )}

          <p className="vp-source">
            {vendor.region
              ? t('Specs and prices published by {name} for {region}', {
                  name: vendor.label,
                  region: vendor.region,
                })
              : t('Specs and prices published by {name}', { name: vendor.label })}
            .{' '}
            <a href={sizes[0]!.source} target="_blank" rel="noreferrer noopener">
              {t('Source')}
            </a>
            {sizes[0]!.pricedOn ? t(', read {date}', { date: sizes[0]!.pricedOn }) : ''}
            .
          </p>
        </>
      )}
    </section>
  );
}
