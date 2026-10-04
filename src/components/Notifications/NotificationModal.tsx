"use client";

import { useEffect } from "react";

import { useSession } from "next-auth/react";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type NotificationModalProps = {
  onClose: () => void;
};

export default function NotificationModal({
  onClose,
}: NotificationModalProps) {
  const { data: session } =
    useSession();

  const {
    orders,
    markOrderNotificationAsRead,
  } = useProductCatalog();

  const buyerEmail =
    session?.user?.email ?? "";

  const myOrders = orders.filter(
    (order) =>
      order.buyerEmail === buyerEmail,
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
      className="notificationBackdrop"
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
        className="notificationDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notificationTitle"
      >
        <div className="notificationHeader">
          <div>
            <h2 id="notificationTitle">
              🔔 แจ้งเตือน
            </h2>

            <p>
              การแจ้งเตือนเกี่ยวกับ
              สินค้าที่คุณซื้อ
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
          <div className="notificationEmpty">
            <p>
              ยังไม่มีแจ้งเตือน
            </p>

            <span>
              เมื่อคุณซื้อสินค้า
              การเปลี่ยนสถานะจะแสดงที่นี่
            </span>
          </div>
        ) : (
          <div className="notificationList">
            {myOrders.map((order) => (
              <article
                key={order.id}
                className={`notificationItem ${
                  order.notificationRead
                    ? "notificationRead"
                    : "notificationUnread"
                }`}
              >
                <div>
                  <h3>
                    {order.product.Name}
                  </h3>

                  {order.status ===
                    "Reserved" && (
                    <p>
                      🟡 สินค้าถูกจองแล้ว
                    </p>
                  )}

                  {order.status ===
                    "Sold" && (
                    <p>
                      🟢 สินค้าขายแล้ว
                    </p>
                  )}

                  <span>
                    สถานะ:{" "}
                    {order.status}
                  </span>
                </div>

                {!order.notificationRead && (
                  <button
                    type="button"
                    onClick={() =>
                      markOrderNotificationAsRead(
                        order.id,
                      )
                    }
                  >
                    อ่านแล้ว
                  </button>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="notificationFooter">
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