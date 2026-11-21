import { X } from 'lucide-react';
import { t } from '../i18n';

/**
 * The one close control every dialog and panel uses: a ghost button with a
 * 16px X, named "Close", with Escape named in its tooltip. One look and one
 * name in every corner, so a student never has to find the way out twice.
 */
export function CloseButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={'btn btn-ghost btn-icon' + (className ? ` ${className}` : '')}
      aria-label={t('Close')}
      title={t('Close (Esc)')}
      onClick={onClick}
    >
      <X size={16} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
