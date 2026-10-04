
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type ProfileModalProps = {
  onClose: () => void;
};

export default function ProfileModal({
  onClose,
}: ProfileModalProps) {
  const { data: session } = useSession();

  const {
    myPosts,
    orders,
  } = useProductCatalog();

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

  const userName =
    session?.user?.name ?? "ผู้ใช้งาน";

  const userEmail =
    session?.user?.email ?? "-";

  const userImage =
    session?.user?.image;

  return (
    <div
      className="profileBackdrop"
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
        className="profileDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profileTitle"
      >
        <div className="profileHeader">
          <h2 id="profileTitle">
            โปรไฟล์ของฉัน
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
          >
            ×
          </button>
        </div>

        <div className="profileInfo">
          {userImage ? (
            <img
              className="profileImage"
              src={userImage}
              alt={userName}
            />
          ) : (
            <div className="profileImagePlaceholder">
              👤
            </div>
          )}

          <div className="profileDetails">
            <h3>{userName}</h3>

            <p>{userEmail}</p>
          </div>
        </div>

        <div className="profileStats">
          <div className="profileStat">
            <strong>
              {myPosts.length}
            </strong>

            <span>
              โพสต์ของฉัน
            </span>
          </div>

          <div className="profileStat">
            <strong>
              {orders.length}
            </strong>

            <span>
              คำสั่งซื้อ
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
