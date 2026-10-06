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

  function openDialog(
    dialog: Exclude<ActiveDialog, null>
  ) {
    setActiveDialog(dialog);
    setIsMobileMenuOpen(false);
  }

  /* -----------------------------------------
     Loading
  ----------------------------------------- */

  if (status === "loading") {
    return null;
  }

  /* -----------------------------------------
     ไม่แสดง Navbar ที่หน้าแรก
  ----------------------------------------- */

  if (pathname === "/") {
    return null;
  }

  /* -----------------------------------------
     User Email
  ----------------------------------------- */

  const buyerEmail =
    session?.user?.email ?? "";

  /* -----------------------------------------
     จำนวน Notification ที่ยังไม่ได้อ่าน
  ----------------------------------------- */

  const unreadNotifications =
    orders.filter(
      (order) =>
        order.buyerEmail ===
          buyerEmail &&
        !order.notificationRead
    ).length;

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <nav
        className="navbar luxuryNavbar"
        aria-label="เมนูหลัก"
      >

        <div className="navList">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="navBrand">

            <h1 className="navTitle">
              MAICHAILEAWNAJA
            </h1>

            <span className="navBrandSub">
              SECONDHAND MARKET
            </span>

          </div>


          {/* =================================================
              MOBILE MENU
          ================================================= */}

          <button
            className="navMenuToggle"
            type="button"
            aria-expanded={
              isMobileMenuOpen
            }
            aria-controls="primary-navigation"
            aria-label={
              isMobileMenuOpen
                ? "ปิดเมนู"
                : "เปิดเมนู"
            }
            onClick={() =>
              setIsMobileMenuOpen(
                (isOpen) =>
                  !isOpen
              )
            }
          >

            <span>
              MENU
            </span>

            <span
              className="navMenuGlyph"
              aria-hidden="true"
            >
              ☰
            </span>

          </button>


          {/* =================================================
              NAVIGATION
          ================================================= */}

          <div
            id="primary-navigation"
            className={`navActions ${
              isMobileMenuOpen
                ? "navActionsOpen"
                : ""
            }`}
          >

            {/* -----------------------------------------------
                โพสต์ของฉัน
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                openDialog("myPosts")
              }
            >
              โพสต์ของฉัน
            </button>


            {/* -----------------------------------------------
                รายการสั่งซื้อ
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                openDialog("orders")
              }
            >
              รายการสั่งซื้อ
            </button>


            {/* -----------------------------------------------
                ประวัติการซื้อ
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                openDialog(
                  "purchaseHistory"
                )
              }
            >
              ประวัติการซื้อ
            </button>


            {/* -----------------------------------------------
                แจ้งเตือน
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary notificationButton"
              type="button"
              onClick={() =>
                openDialog(
                  "notifications"
                )
              }
            >
              แจ้งเตือน

              {unreadNotifications >
                0 && (
                <span className="notificationCount">
                  {unreadNotifications}
                </span>
              )}
            </button>


            {/* -----------------------------------------------
                ตะกร้า
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary cartButton"
              type="button"
              onClick={() =>
                openDialog("cart")
              }
            >
              ตะกร้า

              {cart.length > 0 && (
                <span className="cartCount">
                  {cart.length}
                </span>
              )}
            </button>


            {/* -----------------------------------------------
                ถูกใจ
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary favoriteNavButton"
              type="button"
              onClick={() =>
                openDialog("favorites")
              }
            >
              ถูกใจ

              {favorites.length >
                0 && (
                <span className="favoriteCount">
                  {favorites.length}
                </span>
              )}
            </button>


            {/* =================================================
                ลงขายสินค้า
                ตอนนี้เป็นปุ่มธรรมดา
            ================================================= */}

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                openDialog("sell")
              }
            >
              ลงขายสินค้า
            </button>


            {/* -----------------------------------------------
                โปรไฟล์
            ------------------------------------------------ */}

            <button
              className="navButton navButtonSecondary"
              type="button"
              onClick={() =>
                openDialog("profile")
              }
            >
              โปรไฟล์
            </button>


            {/* =================================================
                ออกจากระบบ
                ปุ่มสีเขียวอยู่ตรงนี้
            ================================================= */}

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


      {/* =====================================================
          MODALS
      ====================================================== */}


      {/* โพสต์ของฉัน */}

      {activeDialog ===
        "myPosts" && (
        <MyPostsModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* รายการสั่งซื้อ */}

      {activeDialog ===
        "orders" && (
        <OrdersModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* ประวัติการซื้อ */}

      {activeDialog ===
        "purchaseHistory" && (
        <PurchaseHistoryModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* แจ้งเตือน */}

      {activeDialog ===
        "notifications" && (
        <NotificationModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* ตะกร้า */}

      {activeDialog ===
        "cart" && (
        <CartModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* ถูกใจ */}

      {activeDialog ===
        "favorites" && (
        <FavoritesModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* ลงขายสินค้า */}

      {activeDialog ===
        "sell" && (
        <PostSaleModal
          onClose={() =>
            setActiveDialog(null)
          }
        />
      )}


      {/* โปรไฟล์ */}

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