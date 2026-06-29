"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { Icon } from "@/components/icon";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BookingModal({ open, onClose, children }: BookingModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      if (open) onClose();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [open, onClose]);

  return (
    <>
      <style>{`
        #booking-dialog::backdrop {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
        }
      `}</style>
      <dialog
        id="booking-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        aria-describedby="booking-modal-desc"
        className="fixed inset-0 z-50 m-0 h-full w-full bg-transparent p-0 open:flex open:items-center open:justify-center"
        onClick={(e) => {
          if (e.target === dialogRef.current) onClose();
        }}
      >
        <div
          className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1326] shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          style={{ backdropFilter: "blur(24px)" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 id="booking-modal-title" className="text-lg font-semibold text-[#dae2fd]">
              Book a Meeting
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#c2c6d6] transition-colors hover:bg-white/10 hover:text-[#dae2fd]"
            >
              <Icon name="close" className="text-[18px]" />
            </button>
          </div>
          <p id="booking-modal-desc" className="sr-only">
            Fill in the form below to request a meeting. All fields marked with an asterisk are required.
          </p>
          <div className="px-6 py-6">{children}</div>
        </div>
      </dialog>
    </>
  );
}
