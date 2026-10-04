"use client";

import { useEffect } from "react";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type FavoritesModalProps = {
  onClose: () => void;
};

export default function FavoritesModal({
  onClose,
}: FavoritesModalProps) {
  const {
    favorites,
    toggleFavorite,
  } = useProductCatalog();

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
      className="favoritesBackdrop"
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
        className="favoritesDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="favoritesTitle"
      >
        <div className="favoritesHeader">
          <h2 id="favoritesTitle">
            ❤️ สินค้าที่ถูกใจ
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            ×
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="favoritesEmpty">
            <p>
              ยังไม่มีสินค้าที่ถูกใจ
            </p>

            <span>
              กด ♡ ที่สินค้าเพื่อเพิ่ม
              สินค้าที่ชอบ
            </span>
          </div>
        ) : (
          <>
            <p className="favoritesCount">
              ถูกใจทั้งหมด{" "}
              <strong>
                {favorites.length}
              </strong>{" "}
              รายการ
            </p>

            <div className="favoritesList">
              {favorites.map(
                (product) => (
                  <article
                    key={product.id}
                    className="favoriteItem"
                  >
                    <div className="favoriteItemInfo">
                      <h3>
                        {product.Name}
                      </h3>

                      <p className="favoritePrice">
                        ฿
                        {product.Price.toLocaleString(
                          "th-TH",
                        )}
                      </p>

                      <p>
                        {product.Category}
                      </p>

                      <p>
                        สถานะ:{" "}
                        {product.status}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="favoriteRemoveButton"
                      onClick={() =>
                        toggleFavorite(
                          product,
                        )
                      }
                    >
                      💔 ลบ
                    </button>
                  </article>
                ),
              )}
            </div>
          </>
        )}

        <div className="favoritesActions">
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