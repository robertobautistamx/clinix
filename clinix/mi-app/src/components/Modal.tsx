// ══════════════════════════════════════════════════════
//  components/Modal.tsx
// ══════════════════════════════════════════════════════

import { useEffect, ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

export default function Modal({ open, onClose, title, subtitle, icon, children, footer, wide = false }: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`modal-box${wide ? ' modal-box--wide' : ''}`}>

        <div className="modal-header">
          <div className="modal-header-left">
            {icon && <span className="modal-icono">{icon}</span>}
            <div>
              <h3 className="modal-titulo">{title}</h3>
              {subtitle && <p className="modal-subtitulo">{subtitle}</p>}
            </div>
          </div>
          <button className="modal-cerrar" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
