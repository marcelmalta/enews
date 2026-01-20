"use client";

import { useEffect, useRef, useState } from "react";

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const ModalShell = ({ open, onClose, children }: ModalShellProps) => {
  const [isVisible, setIsVisible] = useState(open);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      setIsVisible(true);
      setIsClosing(false);
      return;
    }

    if (!open && isVisible) {
      setIsClosing(true);
      closeTimeoutRef.current = window.setTimeout(() => {
        setIsVisible(false);
        setIsClosing(false);
        closeTimeoutRef.current = null;
      }, 220);
    }

    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [open, isVisible]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        data-state={isClosing ? "closing" : "open"}
        className="modal-backdrop absolute inset-0 bg-black/80"
      />
      <div
        data-state={isClosing ? "closing" : "open"}
        className="modal-panel relative z-10 h-[100svh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0b0b0b] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.6)] sm:h-auto sm:max-h-[90vh] sm:rounded-3xl"
      >
        {children}
      </div>
    </div>
  );
};
