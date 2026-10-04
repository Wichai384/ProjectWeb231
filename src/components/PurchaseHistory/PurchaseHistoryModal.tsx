"use client";

import {
  useEffect,
} from "react";

import {
  useSession,
} from "next-auth/react";

import {
  useProductCatalog,
} from "@/context/ProductCatalogContext";

type PurchaseHistoryModalProps = {
  onClose: () => void;
};

export default function PurchaseHistoryModal({
  onClose,
}: PurchaseHistoryModalProps) {
  const { data: session } =
    useSession();

  const { orders } =
    useProductCatalog();

  const buyerEmail =
    session?.user?.email;

  const myOrders =
    orders.filter(
      (order) =>
        order.buyerEmail ===
        buyerEmail,
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
      className="purchaseHistoryBackdrop"
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
        className="purchaseHistoryDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchaseHistoryTitle"
      >
        <div className="purchaseHistoryHeader">
          <div>
            <h2 id="purchaseHistoryTitle">
              🧾 ประวัติการซื้อ
            </h2>

            <p>
              ซื้อไปแล้ว{" "}
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
          <div className="purchaseHistoryEmpty">
            <p>
              ยังไม่มีประวัติการซื้อ
            </p>

            <span>
              สินค้าที่คุณซื้อ
              จะแสดงที่นี่
            </span>
          </div>
        ) : (
          <div className="purchaseHistoryList">
            {myOrders.map(
              (order) => (
                <article
                  key={order.id}
                  className="purchaseHistoryItem"
                >
                  <div>
                    <h3>
                      {order.product.Name}
                    </h3>

                    <p>
                      หมวดหมู่:{" "}
                      {order.product.Category}
                    </p>

                    <p className="purchaseHistoryPrice">
                      ฿
                      {order.product.Price.toLocaleString(
                        "th-TH",
                      )}
                    </p>

                    <p>
                      ผู้ซื้อ:{" "}
                      {order.buyerName}
                    </p>

                    <p>
                      ที่อยู่:{" "}
                      {order.shippingAddress}
                    </p>

                    <p>
                      เบอร์โทร:{" "}
                      {order.phone}
                    </p>
                  </div>

                  <span
                    className={`purchaseHistoryStatus purchaseHistoryStatus${order.status}`}
                  >
                    {order.status}
                  </span>
                </article>
              ),
            )}
          </div>
        )}

        <div className="purchaseHistoryFooter">
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