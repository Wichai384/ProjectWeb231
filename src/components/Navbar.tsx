"use client";

import { useState } from "react";

import {
  signOut,
  useSession,
} from "next-auth/react";

import { usePathname } from "next/navigation";

import MyPostsModal from "./MyPosts/MyPostsModal";
import PostSaleModal from "./PostSale/PostSaleModal";
import OrdersModal from "./Orders/OrdersModal";
import CartModal from "./Cart/CartModal";
import ProfileModal from "./Profile/ProfileModal";
import FavoritesModal from "./Favorites/FavoritesModal";
import PurchaseHistoryModal from "./PurchaseHistory/PurchaseHistoryModal";
import NotificationModal from "./Notifications/NotificationModal";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type ActiveDialog =
  | "myPosts"
  | "sell"
  | "orders"
  | "cart"
  | "profile"
  | "favorites"
  | "purchaseHistory"
  | "notifications"
  | null;

export default function Navbar() {
  const { data: session, status } =
    useSession();

  const pathname =
    usePathname();

  const {
    cart,
    favorites,
    orders,
  } = useProductCatalog();

  const [activeDialog, setActiveDialog] =
    useState<ActiveDialog>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  function openDialog(dialog: Exclude<ActiveDialog, null>) {
    setActiveDialog(dialog);
    setIsMobileMenuOpen(false);
  }

  if (status === "loading") {
    return null;
  }

  if (pathname === "/") {
    return null;
  }

  const buyerEmail =
    session?.user?.email ?? "";

  const unreadNotifications =
    orders.filter(
      (order) =>
        order.buyerEmail ===
        buyerEmail &&
        !order.notificationRead,
    ).length;

  return (
    <>
      <nav
        className="navbar"
        aria-label="เมนูหลัก"
      >
        <div className="navList">
          <h1 className="navTitle">
            Maichailaewnaj
          </h1>

          <button
            className="navMenuToggle"
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          >
            <span>เมนู</span>
            <span className="navMenuGlyph" aria-hidden="true">☰</span>
          </button>

          <div
            id="primary-navigation"
            className={`navActions ${isMobileMenuOpen ? "navActionsOpen" : ""}`}
          >
            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() => openDialog("myPosts")}
            >
              โพสต์ของฉัน
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() => openDialog("orders")}
            >
              รายการสั่งซื้อ
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() => openDialog("purchaseHistory")}
            >
              🧾 ประวัติการซื้อ
            </button>

            <button
              className="navButton navButtonSecondary notificationButton"
              type="button"
              onClick={() => openDialog("notifications")}
            >
              🔔 แจ้งเตือน

              {unreadNotifications >
                0 && (
                  <span className="notificationCount">
                    {unreadNotifications}
                  </span>
                )}
            </button>

            <button
              className="navButton navButtonSecondary cartButton"
              type="button"
              onClick={() => openDialog("cart")}
            >
              🛒 ตะกร้า

              {cart.length > 0 && (
                <span className="cartCount">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              className="navButton navButtonSecondary favoriteNavButton"
              type="button"
              onClick={() => openDialog("favorites")}
            >
              ❤️ ถูกใจ

              {favorites.length >
                0 && (
                  <span className="favoriteCount">
                    {favorites.length}
                  </span>
                )}
            </button>

            <button
              className="navButton navButtonPrimary"
              type="button"
              onClick={() => openDialog("sell")}
            >
              ลงขายสินค้า
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() => openDialog("profile")}
            >
              👤 โปรไฟล์
            </button>

            <button
              className="navButton navButtonPrimary"
              type="button"
              onClick={() =>
                void signOut({ callbackUrl: "/" })
              }
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {activeDialog ===
        "myPosts" && (
          <MyPostsModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}

      {activeDialog ===
        "orders" && (
          <OrdersModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}

      {activeDialog ===
        "purchaseHistory" && (
          <PurchaseHistoryModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}

      {activeDialog ===
        "notifications" && (
          <NotificationModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}

      {activeDialog ===
        "cart" && (
          <CartModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}

      {activeDialog ===
        "favorites" && (
          <FavoritesModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}

      {activeDialog === "sell" && (
        <PostSaleModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}

      {activeDialog ===
        "profile" && (
          <ProfileModal
            onClose={() =>
              setActiveDialog(null)
            }
          />
        )}
    </>
  );
}