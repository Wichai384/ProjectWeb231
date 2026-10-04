"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type OrdersModalProps = {
  onClose: () => void;
};

export default function OrdersModal({
  onClose,
}: OrdersModalProps) {
  const { data: session } = useSession();

  const {
    orders,
    updateProductStatus,
  } = useProductCatalog();

  const sellerEmail = session?.user?.email;

  const myOrders = orders.filter(
    (order) =>
      order.product.sellerEmail === sellerEmail,
  );

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
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

  function handleMarkAsSold(productId: string) {
    const confirmed = window.confirm(
      "ต้องการเปลี่ยนสถานะสินค้าเป็น Sold ใช่หรือไม่?",
    );

    if (!confirmed) {
      return;
    }

    updateProductStatus(
      productId,
      "Sold",
    );
  }

  return (
    <div
      className="ordersBackdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        className="ordersDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ordersTitle"
      >
        <div className="ordersHeader">
          <div>
            <h2 id="ordersTitle">
              รายการสั่งซื้อ
            </h2>

            <p>
              มีคนสั่งซื้อสินค้าของคุณ{" "}
              <strong>
                {myOrders.length}
              </strong>{" "}
              รายการ
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            ×
          </button>
        </div>

        {myOrders.length === 0 ? (
          <div className="ordersEmpty">
            <p>
              ยังไม่มีรายการสั่งซื้อ
            </p>

            <span>
              เมื่อมีคนซื้อสินค้าของคุณ
              รายการจะแสดงที่นี่
            </span>
          </div>
        ) : (
          <div className="ordersList">
            {myOrders.map((order) => (
              <article
                key={order.id}
                className="orderItem"
              >
                <h3>
                  {order.product.Name}
                </h3>

                <p>
                  ราคา: ฿
                  {order.product.Price.toLocaleString(
                    "th-TH",
                  )}
                </p>

                <p>
                  ผู้ซื้อ:{" "}
                  {order.buyerName}
                </p>

                <p>
                  อีเมลผู้ซื้อ:{" "}
                  {order.buyerEmail}
                </p>

                <p>
                  ที่อยู่จัดส่ง:{" "}
                  {order.shippingAddress}
                </p>

                <p>
                  เบอร์โทร:{" "}
                  {order.phone}
                </p>

                <p>
                  สถานะ:{" "}
                  <strong>
                    {order.status}
                  </strong>
                </p>

                {order.status === "Reserved" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleMarkAsSold(
                        order.product.id,
                      )
                    }
                  >
                    เปลี่ยนเป็น Sold
                  </button>
                )}

                {order.status === "Sold" && (
                  <p>
                    ขายสินค้าเรียบร้อยแล้ว
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="ordersFooter">
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