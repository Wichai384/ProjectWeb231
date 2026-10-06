"use client";

import type { ReactNode } from "react";

type PremiumModalProps = {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function PremiumModal({
  number,
  eyebrow,
  title,
  description,
  onClose,
  children,
  footer,
}: PremiumModalProps) {
  return (
    <div
      className="premiumModalOverlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="premiumModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-modal-title"
      >
        {/* TOP LINE */}
        <div className="premiumModalTop">

          <div className="premiumModalIdentity">
            <span className="premiumModalNumber">
              {number}
            </span>

            <span className="premiumModalSlash">
              /
            </span>

            <span className="premiumModalEyebrow">
              {eyebrow}
            </span>
          </div>

          <button
            className="premiumModalClose"
            type="button"
            onClick={onClose}
            aria-label="ปิด"
          >
            <span>ESC</span>
            <strong>×</strong>
          </button>

        </div>


        {/* HEADER */}
        <header className="premiumModalHeader">

          <div>
            <h2
              id="premium-modal-title"
              className="premiumModalTitle"
            >
              {title}
            </h2>

            {description && (
              <p className="premiumModalDescription">
                {description}
              </p>
            )}
          </div>

        </header>


        {/* CONTENT */}
        <div className="premiumModalDivider" />

        <div className="premiumModalContent">
          {children}
        </div>


        {/* FOOTER */}
        <div className="premiumModalFooter">

          <div className="premiumModalFooterBrand">
            <span>
              MAICHAILEAWNAJA
            </span>

            <small>
              SECONDHAND MARKET
            </small>
          </div>

          {footer && (
            <div className="premiumModalFooterAction">
              {footer}
            </div>
          )}

        </div>

      </section>
    </div>
  );
}