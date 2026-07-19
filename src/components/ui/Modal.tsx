import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  preventDismiss?: boolean;
}

export default function Modal({ isOpen, onClose, children, preventDismiss = false }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventDismiss) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, preventDismiss]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!preventDismiss) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300"
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl transition-all duration-300 z-10">
        {children}
      </div>
    </div>
  );
}
