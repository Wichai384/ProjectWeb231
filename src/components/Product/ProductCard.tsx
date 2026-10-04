"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  useSession,
} from "next-auth/react";

import {
  useProductCatalog,
} from "@/context/ProductCatalogContext";

import BuyProductModal from "@/components/Buy/BuyProductModal";

import SellerProfileModal from "@/components/Seller/SellerProfileModal";

import type { InfoProduct } from "@/types/type_infoProduct";

type ProductCardProps = {
  product: InfoProduct;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const { data: session } =
    useSession();

  const {
    addOrder,
    addToCart,
    cart,
    favorites,
    toggleFavorite,
  } = useProductCatalog();

  const [isDetailsOpen, setIsDetailsOpen] =
    useState(false);

  const [isBuyModalOpen, setIsBuyModalOpen] =
    useState(false);

  const [
    isSellerProfileOpen,
    setIsSellerProfileOpen,
  ] = useState(false);

  const isInCart =
    cart.some(
      (cartProduct) =>
        cartProduct.id ===
        product.id,
    );

  const isFavorite =
    favorites.some(
      (favorite) =>
        favorite.id ===
        product.id,
    );

  const isMyProduct =
    !!session?.user?.email &&
    !!product.sellerEmail &&
    session.user.email ===
      product.sellerEmail;

  useEffect(() => {
    if (!isDetailsOpen) {
      return;
    }

    function closeOnEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsDetailsOpen(false);
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
  }, [isDetailsOpen]);

  function handleConfirmPurchase(
    buyerName: string,
    shippingAddress: string,
    phone: string,
  ) {
    const buyerEmail =
      session?.user?.email;

    if (!buyerEmail) {
      window.alert(
        "ไม่พบอีเมลผู้ใช้ กรุณาเข้าสู่ระบบใหม่",
      );

      return;
    }

    addOrder(
      product,
      buyerName,
      buyerEmail,
      shippingAddress,
      phone,
    );

    setIsBuyModalOpen(false);
    setIsDetailsOpen(false);

    window.alert(
      "ซื้อสินค้าเรียบร้อยแล้ว",
    );
  }

  function handleAddToCart() {
    addToCart(product);

    window.alert(
      "เพิ่มสินค้าลงตะกร้าแล้ว",
    );
  }

  function handleToggleFavorite() {
    toggleFavorite(product);
  }

  return (
    <>
      <article className="productCard">
        <button
          className="productCardTrigger"
          type="button"
          aria-haspopup="dialog"
          onClick={() =>
            setIsDetailsOpen(true)
          }
        >
          <span className="productMedia">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.Name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="productImage"
              />
            ) : (
              <span className="imagePlaceholder">
                ไม่มีรูป
              </span>
            )}
          </span>

          <span className="productInfo">
            <span className="productPrice">
              ฿
              {product.Price.toLocaleString(
                "th-TH",
              )}
            </span>

            <span className="productTitle">
              {product.Name}
            </span>

            <span className="productMeta">
              {product.Category}
            </span>

            <span className="productMeta">
              สถานะ:{" "}
              {product.status}
            </span>

            <span className="productSellerPreview">
              👤{" "}
              {product.sellerName ??
                "ผู้ขาย"}
            </span>

            <span className="productFavoritePreview">
              {isFavorite
                ? "❤️ ถูกใจแล้ว"
                : "♡ ถูกใจ"}
            </span>
          </span>
        </button>
      </article>

      {isDetailsOpen && (
        <div
          className="productDialogBackdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsDetailsOpen(false);
            }
          }}
        >
          <section
            className="productDialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="productDialogTitle"
          >
            <div className="productDialogHeader">
              <h2 id="productDialogTitle">
                รายละเอียดสินค้า
              </h2>

              <button
                className="productDialogClose"
                type="button"
                aria-label="ปิดหน้าต่าง"
                onClick={() =>
                  setIsDetailsOpen(false)
                }
              >
                ×
              </button>
            </div>

            {product.image ? (
              <div className="productDialogMedia">
                <Image
                  src={product.image}
                  alt={product.Name}
                  fill
                  sizes="(max-width: 640px) 90vw, 32rem"
                />
              </div>
            ) : (
              <div className="productDialogMedia productDialogPlaceholder">
                ไม่มีรูป
              </div>
            )}

            <h3 className="productDialogName">
              {product.Name}
            </h3>

            <p className="productDialogPrice">
              ฿
              {product.Price.toLocaleString(
                "th-TH",
              )}
            </p>

            <p className="productDialogCategory">
              {product.Category}
            </p>

            <button
              type="button"
              className="favoriteButton"
              onClick={
                handleToggleFavorite
              }
            >
              {isFavorite
                ? "❤️ ถูกใจแล้ว"
                : "♡ ถูกใจ"}
            </button>

            <button
              type="button"
              className="productSeller"
              onClick={() =>
                setIsSellerProfileOpen(
                  true,
                )
              }
            >
              <div className="productSellerAvatar">
                {product.sellerImage ? (
                  <Image
                    src={
                      product.sellerImage
                    }
                    alt={
                      product.sellerName ??
                      "ผู้ขาย"
                    }
                    width={40}
                    height={40}
                  />
                ) : (
                  "👤"
                )}
              </div>

              <div>
                <span className="productSellerLabel">
                  ผู้ขาย
                </span>

                <strong>
                  {product.sellerName ??
                    "ผู้ขาย"}
                </strong>
              </div>
            </button>

            <p className="productDialogStatus">
              สถานะ:{" "}
              {product.status}
            </p>

            <p className="productDialogDescription">
              {product.Description}
            </p>

            {product.status ===
              "Selling" && (
              <div className="productDialogActions">
                {isMyProduct ? (
                  <p className="myProductMessage">
                    สินค้าของคุณ
                    ไม่สามารถซื้อได้
                  </p>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={
                        handleAddToCart
                      }
                      disabled={isInCart}
                    >
                      {isInCart
                        ? "อยู่ในตะกร้าแล้ว"
                        : "เพิ่มลงตะกร้า"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setIsBuyModalOpen(
                          true,
                        )
                      }
                    >
                      ซื้อสินค้า
                    </button>
                  </>
                )}
              </div>
            )}

            {product.status ===
              "Reserved" && (
              <button
                type="button"
                disabled
              >
                สินค้าถูกจองแล้ว
              </button>
            )}

            {product.status ===
              "Sold" && (
              <button
                type="button"
                disabled
              >
                สินค้าขายแล้ว
              </button>
            )}
          </section>
        </div>
      )}

      {isBuyModalOpen && (
        <BuyProductModal
          productName={
            product.Name
          }
          onClose={() =>
            setIsBuyModalOpen(false)
          }
          onConfirm={
            handleConfirmPurchase
          }
        />
      )}

      {isSellerProfileOpen && (
        <SellerProfileModal
          sellerName={
            product.sellerName ??
            "ผู้ขาย"
          }
          sellerEmail={
            product.sellerEmail
          }
          sellerImage={
            product.sellerImage
          }
          onClose={() =>
            setIsSellerProfileOpen(
              false,
            )
          }
        />
      )}
    </>
  );
}