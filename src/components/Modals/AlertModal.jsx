import React, { useEffect, useRef } from "react";

export default function AlertModal({ title, message, onClose }) {
  const closeButtonRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();

      // Trap focus
      if (e.key === "Tab") {
        const focusableEls = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableEls || focusableEls.length === 0) return;

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-title"
      aria-describedby="alert-message"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center"
      >
        <h2
          id="alert-title"
          className="text-xl font-bold text-espressoy mb-2"
        >
          {title}
        </h2>

        <p id="alert-message" className="text-espressoy mb-4">
          {message}
        </p>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="px-4 py-2 bg-orangey text-white rounded hover:bg-espressoy"
        >
          OK
        </button>
      </div>
    </div>
  );
}
