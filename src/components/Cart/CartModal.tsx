"use client";

import {
  useEffect,
  useState,
} from "react";

import { useSession } from "next-auth/react";

import { useProductCatalog } from "@/context/ProductCatalogContext";

import BuyProductModal from "@/components/Buy/BuyProductModal";

type CartModalProps = {
  onClose: () => void;
};

export default function CartModal({
  onClose,
}: CartModalProps) {
  const { data: session } = useSession();

  const {
    cart,
    removeFromCart,
    addOrder,
  } = useProductCatalog();

  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState<string | null>(null);

  const [
    isBuyingAll,
    setIsBuyingAll,
  ] = useState(false);

  const selectedProduct =
    cart.find(
      (product) =>
        product.id === selectedProductId,
    );

  const totalPrice =
    cart.reduce(
      (total, product) =>
        total + product.Price,
      0,
    );

  const availableProducts =
    cart.filter(
      (product) =>
        product.status === "Selling",
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

  function handleConfirmPurchase(
    buyerName: string,
    shippingAddress: string,
    phone: string,
  ) {
    const buyerEmail =
      session?.user?.email ?? "";

    if (isBuyingAll) {
      availableProducts.forEach(
        (product) => {
          addOrder(
            product,
            buyerName,
            buyerEmail,
            shippingAddress,
            phone,
          );
        },
      );

      setIsBuyingAll(false);

      window.alert(
        `ซื้อสินค้า ${availableProducts.length} รายการเรียบร้อยแล้ว`,
      );

      return;
    }

    if (!selectedProduct) {
      return;
    }

    addOrder(
      selectedProduct,
      buyerName,
      buyerEmail,
      shippingAddress,
      phone,
    );

    setSelectedProductId(null);

    window.alert(
      "ซื้อสินค้าเรียบร้อยแล้ว",
    );
  }

  function handleBuyAll() {
    if (availableProducts.length === 0) {
      window.alert(
        "ไม่มีสินค้าที่สามารถซื้อได้",
      );
      return;
    }

    setIsBuyingAll(true);
  }

  function handleCloseBuyModal() {
    setSelectedProductId(null);
    setIsBuyingAll(false);
  }

  return (
    <>
      <div
        className="cartBackdrop"
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
          className="cartDialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cartTitle"
        >
          <div className="cartHeader">
            <h2 id="cartTitle">
              🛒 ตะกร้าสินค้า
            </h2>

            <button
              type="button"
              onClick={onClose}
              aria-label="ปิดหน้าต่าง"
            >
              ×
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="cartEmpty">
              ยังไม่มีสินค้าในตะกร้า
            </p>
          ) : (
            <>
              <div className="cartList">
                {cart.map((product) => (
                  <article
                    key={product.id}
                    className="cartItem"
                  >
                    <div className="cartItemInfo">
                      <h3>
                        {product.Name}
                      </h3>

                      <p className="cartItemPrice">
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

                      {product.status !==
                        "Selling" && (
                        <p className="cartUnavailable">
                          ไม่สามารถซื้อสินค้านี้ได้
                        </p>
                      )}
                    </div>

                    <div className="cartItemActions">
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            product.id,
                          )
                        }
                      >
                        ลบ
                      </button>

                      <button
                        type="button"
                        disabled={
                          product.status !==
                          "Selling"
                        }
                        onClick={() =>
                          setSelectedProductId(
                            product.id,
                          )
                        }
                      >
                        ซื้อ
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cartSummary">
                <div>
                  <span>
                    สินค้าทั้งหมด
                  </span>

                  <strong>
                    {cart.length} รายการ
                  </strong>
                </div>

                <div>
                  <span>ยอดรวม</span>

                  <strong className="cartTotal">
                    ฿
                    {totalPrice.toLocaleString(
                      "th-TH",
                    )}
                  </strong>
                </div>
              </div>

              <button
                className="cartCheckoutButton"
                type="button"
                onClick={handleBuyAll}
              >
                ซื้อสินค้าทั้งหมด (
                {availableProducts.length}{" "}
                รายการ)
              </button>
            </>
          )}
        </section>
      </div>

      {selectedProduct && (
        <BuyProductModal
          productName={
            selectedProduct.Name
          }
          onClose={
            handleCloseBuyModal
          }
          onConfirm={
            handleConfirmPurchase
          }
        />
      )}

      {isBuyingAll && (
        <BuyProductModal
          productName={`สินค้าทั้งหมด ${availableProducts.length} รายการ`}
          onClose={
            handleCloseBuyModal
          }
          onConfirm={
            handleConfirmPurchase
          }
        />
      )}
    </>
  );
}