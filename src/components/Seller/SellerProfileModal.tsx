"use client";

import { useEffect } from "react";
import Image from "next/image";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type SellerProfileModalProps = {
  sellerName: string;
  sellerEmail?: string;
  sellerImage?: string;
  onClose: () => void;
};

export default function SellerProfileModal({
  sellerName,
  sellerEmail,
  sellerImage,
  onClose,
}: SellerProfileModalProps) {
  const { products } =
    useProductCatalog();

  const sellerProducts =
    products.filter(
      (product) =>
        product.sellerEmail &&
        product.sellerEmail ===
          sellerEmail,
    );

  useEffect(() => {
    function closeOnEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      closeOnEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        closeOnEscape,
      );
    };
  }, [onClose]);

  return (
    <div
      className="sellerProfileBackdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        className="sellerProfileDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sellerProfileTitle"
      >
        <div className="sellerProfileHeader">
          <h2 id="sellerProfileTitle">
            โปรไฟล์ผู้ขาย
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            ×
          </button>
        </div>

        <div className="sellerProfileInfo">
          {sellerImage ? (
            <Image
              className="sellerProfileImage"
              src={sellerImage}
              alt={sellerName}
              width={64}
              height={64}
            />
          ) : (
            <div className="sellerProfilePlaceholder">
              👤
            </div>
          )}

          <div>
            <h3>{sellerName}</h3>

            {sellerEmail && (
              <p>{sellerEmail}</p>
            )}
          </div>
        </div>

        <div className="sellerProfileProducts">
          <h3>
            สินค้าของผู้ขาย
          </h3>

          {sellerProducts.length === 0 ? (
            <p>
              ยังไม่มีสินค้าอื่น
            </p>
          ) : (
            <div className="sellerProductList">
              {sellerProducts.map(
                (product) => (
                  <article
                    key={product.id}
                    className="sellerProductItem"
                  >
                    <div>
                      <strong>
                        {product.Name}
                      </strong>

                      <p>
                        ฿
                        {product.Price.toLocaleString(
                          "th-TH",
                        )}
                      </p>
                    </div>

                    <span>
                      {product.status}
                    </span>
                  </article>
                ),
              )}
            </div>
          )}
        </div>

        <div className="sellerProfileActions">
          <button
            type="button"
            onClick={onClose}
          >
            ปิด
          </button>
        </div>
      </section>
    </div>
  );
}