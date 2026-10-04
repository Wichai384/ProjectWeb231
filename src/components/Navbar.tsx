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

  const [
    activeDialog,
    setActiveDialog,
  ] = useState<
    | "myPosts"
    | "sell"
    | "orders"
    | "cart"
    | "profile"
    | "favorites"
    | "purchaseHistory"
    | "notifications"
    | null
  >(null);

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

          <div className="navActions">
            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                setActiveDialog(
                  "myPosts",
                )
              }
            >
              โพสต์ของฉัน
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                setActiveDialog(
                  "orders",
                )
              }
            >
              รายการสั่งซื้อ
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                setActiveDialog(
                  "purchaseHistory",
                )
              }
            >
              🧾 ประวัติการซื้อ
            </button>

            <button
              className="navButton navButtonSecondary notificationButton"
              type="button"
              onClick={() =>
                setActiveDialog(
                  "notifications",
                )
              }
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
              onClick={() =>
                setActiveDialog(
                  "cart",
                )
              }
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
              onClick={() =>
                setActiveDialog(
                  "favorites",
                )
              }
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
              onClick={() =>
                setActiveDialog(
                  "sell",
                )
              }
            >
              ลงขายสินค้า
            </button>

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                setActiveDialog(
                  "profile",
                )
              }
            >
              👤 โปรไฟล์
            </button>

            <button
              className="navButton navButtonPrimary"
              type="button"
              onClick={() =>
                void signOut({
                  callbackUrl: "/",
                })
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