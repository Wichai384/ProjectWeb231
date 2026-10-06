"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { useProductCatalog } from "@/context/ProductCatalogContext";

import { PRODUCT_CATEGORIES } from "@/types/type_infoProduct";

import type {
  InfoProduct,
  ProductCategory,
  ProductStatus,
} from "@/types/type_infoProduct";

type MyPostsModalProps = {
  onClose: () => void;
};

export default function MyPostsModal({
  onClose,
}: MyPostsModalProps) {
  const {
    myPosts,
    updateProduct,
    deleteProduct,
    updateProductStatus,
  } = useProductCatalog();

  const [keyword, setKeyword] = useState("");

  const [editingProduct, setEditingProduct] =
    useState<InfoProduct | null>(null);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const searchText = keyword.trim().toLowerCase();

  const visiblePosts = myPosts.filter((product) => {
    const values = [
      product.Name,
      product.Category,
      product.Description,
    ];

    return values.some((value) =>
      value.toLowerCase().includes(searchText),
    );
  });

  function handleDelete(product: InfoProduct) {
    const confirmed = window.confirm(
      `ต้องการลบโพสต์ "${product.Name}" ใช่หรือไม่?`,
    );

    if (!confirmed) return;

    deleteProduct(product.id);

    if (editingProduct?.id === product.id) {
      setEditingProduct(null);
    }
  }

  function handleSaveEdit() {
    if (!editingProduct) return;

    if (
      !editingProduct.Name.trim() ||
      editingProduct.Price <= 0 ||
      !editingProduct.Description.trim()
    ) {
      window.alert(
        "กรุณากรอกข้อมูลให้ครบ และราคาต้องมากกว่า 0",
      );
      return;
    }

    updateProduct(editingProduct.id, {
      ...editingProduct,
      Name: editingProduct.Name.trim(),
      Description: editingProduct.Description.trim(),
    });

    setEditingProduct(null);

    window.alert("แก้ไขโพสต์เรียบร้อยแล้ว");
  }

  function handleStatusChange(
    id: string,
    status: ProductStatus,
  ) {
    updateProductStatus(id, status);
  }

  return (
    <div
      className="premiumPostsBackdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="premiumPostsDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="myPostsTitle"
      >
        {/* =========================
            TOP BAR
        ========================= */}
        <div className="premiumPostsTop">
          <button
            className="premiumPostsClose"
            type="button"
            aria-label="ปิดหน้าต่าง"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* =========================
            HEADER
        ========================= */}
        <header className="premiumPostsHeader">
          <h2
            id="myPostsTitle"
            className="premiumPostsTitle"
          >
            โพสต์ของฉัน
          </h2>

          <div className="premiumPostsCountBox">
            <span>จำนวนโพสต์</span>

            <strong>
              {myPosts.length} รายการ
            </strong>
          </div>
        </header>

        <div className="premiumPostsDivider" />

        {/* =========================
            SEARCH
        ========================= */}
        {myPosts.length > 0 && (
          <div className="premiumPostsTools">
            <div className="premiumPostsSearchWrap">
              <span
                className="premiumSearchIcon"
                aria-hidden="true"
              >
                ⌕
              </span>

              <input
                className="premiumPostsSearch"
                type="search"
                aria-label="ค้นหาโพสต์"
                placeholder="ค้นหาสินค้า"
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
              />
            </div>
          </div>
        )}

        {/* =========================
            CONTENT
        ========================= */}
        <div className="premiumPostsContent">
          {/* ไม่มีโพสต์ */}
          {myPosts.length === 0 ? (
            <div className="premiumPostsEmpty">
              <div className="premiumEmptyMark">
                +
              </div>

              <h3>ยังไม่มีโพสต์</h3>

              <p>
                สินค้าที่คุณลงขาย
                จะแสดงอยู่ในหน้านี้
              </p>
            </div>
          ) : visiblePosts.length === 0 ? (
            /* ค้นหาไม่เจอ */
            <div className="premiumPostsEmpty">
              <div className="premiumEmptyMark">
                ?
              </div>

              <h3>ไม่พบสินค้าที่ค้นหา</h3>

              <p>
                ลองค้นหาด้วยชื่อสินค้า
                หรือหมวดหมู่อื่น
              </p>

              <button
                type="button"
                className="premiumClearSearch"
                onClick={() => setKeyword("")}
              >
                ล้างการค้นหา
              </button>
            </div>
          ) : (
            /* รายการสินค้า */
            <div className="premiumPostsList">
              {visiblePosts.map((product) => (
                <article
                  className="premiumPostCard"
                  key={product.id}
                >
                  {/* รูปสินค้า */}
                  {product.image ? (
                    <div className="premiumPostImage">
                      <Image
                        src={product.image}
                        alt={product.Name}
                        fill
                        sizes="120px"
                      />
                    </div>
                  ) : (
                    <div className="premiumPostImage premiumPostImagePlaceholder">
                      ไม่มีรูป
                    </div>
                  )}

                  {/* ข้อมูลสินค้า */}
                  <div className="premiumPostInfo">
                    <div className="premiumPostTopInfo">
                      <div>
                        <p className="premiumPostCategory">
                          {product.Category}
                        </p>

                        <h3>
                          {product.Name}
                        </h3>
                      </div>

                      <strong className="premiumPostPrice">
                        ฿
                        {product.Price.toLocaleString(
                          "th-TH",
                        )}
                      </strong>
                    </div>

                    <p className="premiumPostDescription">
                      {product.Description}
                    </p>

                    {/* สถานะ */}
                    <div className="premiumPostMeta">
                      <div className="premiumStatus">
                        <span
                          className={`premiumStatusDot premiumStatus-${product.status.toLowerCase()}`}
                        />

                        <span>สถานะ</span>

                        <strong>
                          {product.status}
                        </strong>
                      </div>

                      <select
                        className="premiumPostStatusSelect"
                        value={product.status}
                        onChange={(event) =>
                          handleStatusChange(
                            product.id,
                            event.target
                              .value as ProductStatus,
                          )
                        }
                      >
                        <option value="Selling">
                          Selling
                        </option>

                        <option value="Reserved">
                          Reserved
                        </option>

                        <option value="Sold">
                          Sold
                        </option>
                      </select>
                    </div>

                    {/* ปุ่ม */}
                    <div className="premiumPostActions">
                      <button
                        type="button"
                        className="premiumEditButton"
                        onClick={() =>
                          setEditingProduct(product)
                        }
                      >
                        แก้ไข
                      </button>

                      <button
                        type="button"
                        className="premiumDeleteButton"
                        onClick={() =>
                          handleDelete(product)
                        }
                      >
                        ลบโพสต์
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* =========================
            FOOTER
        ========================= */}
        <footer className="premiumPostsFooter">
          <strong>
            MAICHAILEAWNAJA
          </strong>

          <button
            type="button"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </footer>

        {/* =========================
            EDIT MODAL
        ========================= */}
        {editingProduct && (
          <div
            className="premiumEditBackdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setEditingProduct(null);
              }
            }}
          >
            <section
              className="premiumEditDialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="editPostTitle"
            >
              <div className="premiumEditTop">
                <h3 id="editPostTitle">
                  แก้ไขโพสต์
                </h3>

                <button
                  type="button"
                  aria-label="ปิดการแก้ไข"
                  onClick={() =>
                    setEditingProduct(null)
                  }
                >
                  ×
                </button>
              </div>

              <div className="premiumEditBody">
                {/* ชื่อ */}
                <label className="premiumEditField">
                  <span>ชื่อสินค้า</span>

                  <input
                    type="text"
                    value={editingProduct.Name}
                    onChange={(event) =>
                      setEditingProduct({
                        ...editingProduct,
                        Name: event.target.value,
                      })
                    }
                  />
                </label>

                {/* ราคา */}
                <label className="premiumEditField">
                  <span>ราคา</span>

                  <input
                    type="number"
                    min="1"
                    value={editingProduct.Price}
                    onChange={(event) =>
                      setEditingProduct({
                        ...editingProduct,
                        Price: Number(
                          event.target.value,
                        ),
                      })
                    }
                  />
                </label>

                {/* หมวดหมู่ */}
                <label className="premiumEditField">
                  <span>หมวดหมู่</span>

                  <select
                    value={editingProduct.Category}
                    onChange={(event) =>
                      setEditingProduct({
                        ...editingProduct,
                        Category:
                          event.target
                            .value as ProductCategory,
                      })
                    }
                  >
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
                </label>

                {/* รายละเอียด */}
                <label className="premiumEditField">
                  <span>รายละเอียด</span>

                  <textarea
                    rows={5}
                    value={
                      editingProduct.Description
                    }
                    onChange={(event) =>
                      setEditingProduct({
                        ...editingProduct,
                        Description:
                          event.target.value,
                      })
                    }
                  />
                </label>
              </div>

              {/* ปุ่มแก้ไข */}
              <div className="premiumEditActions">
                <button
                  type="button"
                  onClick={() =>
                    setEditingProduct(null)
                  }
                >
                  ยกเลิก
                </button>

                <button
                  type="button"
                  onClick={handleSaveEdit}
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}