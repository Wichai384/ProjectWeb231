"use client";

import { useState } from "react";

type BuyProductModalProps = {
  productName: string;
  onClose: () => void;
  onConfirm: (buyerName: string, shippingAddress: string, phone: string) => void;
};

const PHONE_REGEX = /^\d{10}$/;

export default function BuyProductModal({
  productName,
  onClose,
  onConfirm,
}: BuyProductModalProps) {
  const [buyerName, setBuyerName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !buyerName.trim() ||
      !shippingAddress.trim() ||
      !phone.trim()
    ) {
      window.alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (!PHONE_REGEX.test(phone)) {
      window.alert("กรุณากรอกเบอร์โทรเป็นตัวเลข 10 หลัก");
      return;
    }

    onConfirm(
      buyerName.trim(),
      shippingAddress.trim(),
      phone,
    );
  }

  return (
    <div
      className="buyModalBackdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="buyModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="buyModalTitle"
      >
        <div className="buyModalHeader">
          <h2 id="buyModalTitle">
            ซื้อสินค้า
          </h2>

          <button
            type="button"
            aria-label="ปิดหน้าต่าง"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <p>
          สินค้า: <strong>{productName}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            ชื่อผู้ซื้อ
            <input
              type="text"
              value={buyerName}
              onChange={(event) =>
                setBuyerName(event.target.value)
              }
              placeholder="กรอกชื่อ-นามสกุล"
            />
          </label>

          <label>
            ที่อยู่จัดส่ง
            <textarea
              value={shippingAddress}
              onChange={(event) =>
                setShippingAddress(
                  event.target.value,
                )
              }
              placeholder="กรอกที่อยู่สำหรับจัดส่ง"
              rows={4}
            />
          </label>

          <label>
            เบอร์โทร
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10),
                )
              }
              placeholder="กรอกเบอร์โทร 10 หลัก "
            />
          </label>

          <div>
            <button
              type="button"
              onClick={onClose}
            >
              ยกเลิก
            </button>

            <button type="submit">
              ยืนยันการซื้อ
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}