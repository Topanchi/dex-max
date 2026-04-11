'use client';

import { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet en móvil (desde abajo), modal centrado en desktop */}
      <div
        className="relative z-10 w-full sm:max-w-lg
                   rounded-t-2xl sm:rounded-2xl
                   bg-[#1a1a2e] border border-[#2a2a4e] shadow-2xl overflow-hidden
                   max-h-[92vh] sm:max-h-[85vh]
                   flex flex-col"
      >
        {/* Handle visual en móvil */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden" aria-hidden="true">
          <div className="w-10 h-1 rounded-full bg-[#3a3a6e]" />
        </div>

        {title && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#2a2a4e] shrink-0">
            <h2 className="text-base sm:text-lg font-semibold text-white truncate pr-4">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors rounded-lg p-1.5
                         focus:outline-none focus:ring-2 focus:ring-white/30 touch-manipulation shrink-0"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
