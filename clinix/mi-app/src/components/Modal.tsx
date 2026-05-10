// ══════════════════════════════════════════════════════
//  components/Modal.tsx
// ══════════════════════════════════════════════════════

import { useEffect, ReactNode } from 'react';
import './Modal.css';
import { X } from 'lucide-react';
import React from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
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

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={`modal-box${wide ? ' modal-box--wide' : ''}`}>
        <style>{`
          @keyframes modalEnter {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .modal-box {
            animation: modalEnter 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}</style>

        {(title || icon) ? (
          <div className="modal-header">
            <div className="modal-header-left">
              {icon && <span className="modal-icono">{icon}</span>}
              <div>
                {title && <h3 className="modal-titulo">{title}</h3>}
                {subtitle && <p className="modal-subtitulo">{subtitle}</p>}
              </div>
            </div>
            <button className="modal-cerrar" onClick={onClose}><X size={18} /></button>
          </div>
        ) : (
          <button className="modal-cerrar" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}><X size={18} /></button>
        )}

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
