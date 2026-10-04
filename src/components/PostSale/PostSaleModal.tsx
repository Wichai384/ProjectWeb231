
"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { useProductCatalog } from "@/context/ProductCatalogContext";

import {
  PRODUCT_CATEGORIES,
  type InfoProduct,
  type ProductCategory,
} from "@/types/type_infoProduct";

type PostSaleModalProps = {
  onClose: () => void;
};

export default function PostSaleModal({
  onClose,
}: PostSaleModalProps) {
  const router = useRouter();

  const { data: session } = useSession();

  const { addProduct } =
    useProductCatalog();

  const [submitError, setSubmitError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

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

    return () =>
      window.removeEventListener(
        "keydown",
        closeOnEscape,
      );
  }, [onClose]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(
        event.currentTarget,
      );

      const imageFile =
        formData.get("image");

      let image: string | undefined;

      if (
        imageFile instanceof File &&
        imageFile.size > 0
      ) {
        image = await new Promise<string>(
          (resolve, reject) => {
            const reader =
              new FileReader();

            reader.onload = () => {
              if (
                typeof reader.result ===
                "string"
              ) {
                resolve(reader.result);
              } else {
                reject(
                  new Error(
                    "อ่านไฟล์รูปไม่สำเร็จ",
                  ),
                );
              }
            };

            reader.onerror = () =>
              reject(
                new Error(
                  "อ่านไฟล์รูปไม่สำเร็จ",
                ),
              );

            reader.readAsDataURL(
              imageFile,
            );
          },
        );
      }

      const product: InfoProduct = {
        id: `product-${Date.now()}`,

        Name: String(
          formData.get("name"),
        ).trim(),

        Price: Number(
          formData.get("price"),
        ),

        Category: String(
          formData.get("category"),
        ) as ProductCategory,

        Description: String(
          formData.get("description"),
        ).trim(),

        status: "Selling",

        ...(image ? { image } : {}),

        sellerName:
          session?.user?.name ??
          "ผู้ขาย",

        sellerEmail:
          session?.user?.email ??
          undefined,

        sellerImage:
          session?.user?.image ??
          undefined,
      };

      addProduct(product);

      onClose();

      router.push("/Shop");
    } catch {
      setSubmitError(
        "เพิ่มสินค้าไม่สำเร็จ กรุณาลองเลือกรูปใหม่อีกครั้ง",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="sellDialogBackdrop"
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
        className="sellDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sellDialogTitle"
      >
        <div className="sellDialogHeader">
          <h2 id="sellDialogTitle">
            ลงขายสินค้า
          </h2>

          <button
            className="sellDialogClose"
            type="button"
            aria-label="ปิดหน้าต่าง"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="sellForm"
          onSubmit={handleSubmit}
        >
          <label htmlFor="sellName">
            ชื่อสินค้า
          </label>

          <input
            id="sellName"
            name="name"
            placeholder="ระบุชื่อสินค้า"
            required
          />

          <label htmlFor="sellPrice">
            ราคา (บาท)
          </label>

          <input
            id="sellPrice"
            name="price"
            type="number"
            min="0"
            placeholder="0"
            required
          />

          <label htmlFor="sellCategory">
            หมวดหมู่
          </label>

          <select
            id="sellCategory"
            name="category"
            defaultValue=""
            required
          >
            <option
              value=""
              disabled
            >
              เลือกหมวดหมู่
            </option>

            {PRODUCT_CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ),
            )}
          </select>

          <label htmlFor="sellDescription">
            รายละเอียดสินค้า
          </label>

          <textarea
            id="sellDescription"
            name="description"
            rows={4}
            placeholder="บอกรายละเอียดสินค้า"
            required
          />

          <label htmlFor="sellImage">
            รูปสินค้า
          </label>

          <input
            id="sellImage"
            name="image"
            type="file"
            accept="image/*"
          />

          {submitError && (
            <p
              className="sellFormError"
              role="alert"
            >
              {submitError}
            </p>
          )}

          <button
            className="sellFormSubmit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "กำลังลงขาย..."
              : "ลงขาย"}
          </button>
        </form>
      </section>
    </div>
  );
}
