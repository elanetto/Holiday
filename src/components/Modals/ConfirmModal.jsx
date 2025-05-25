import React, { useEffect, useRef } from "react";

export default function ConfirmModal({
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();

      // Trap focus within modal
      if (e.key === "Tab") {
        const focusableEls = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableEls || focusableEls.length === 0) return;

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  // Focus the cancel button on mount
  const modalRef = useRef(null);
  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-message"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg text-center"
      >
        <h2 id="modal-title" className="text-xl font-bold text-espressoy mb-2">
          {title}
        </h2>

        <p id="modal-message" className="text-espressoy mb-4">
          {message}
        </p>

        <div className="flex justify-center gap-4">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
