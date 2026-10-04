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

export default function MyPostsModal({ onClose }: MyPostsModalProps) {
    const { myPosts, updateProduct, deleteProduct, updateProductStatus } =
        useProductCatalog();

    const [keyword, setKeyword] = useState("");

    const [editingProduct, setEditingProduct] = useState<InfoProduct | null>(
        null,
    );

    useEffect(() => {
        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [onClose]);

    const searchText = keyword.trim().toLowerCase();

    const visiblePosts = myPosts.filter((product) => {
        const values = [product.Name, product.Category, product.Description];

        return values.some((value) => value.toLowerCase().includes(searchText));
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
            window.alert("กรุณากรอกข้อมูลให้ครบ และราคาต้องมากกว่า 0");
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

    function handleStatusChange(id: string, status: ProductStatus) {
        updateProductStatus(id, status);
    }

    return (
        <div
            className="myPostsBackdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="myPostsDialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="myPostsTitle"
            >
                <div className="myPostsHeader">
                    <div>
                        <h2 id="myPostsTitle">โพสต์ของฉัน</h2>

                        <p className="myPostsCount">
                            ทั้งหมด <strong>{myPosts.length}</strong> โพสต์
                        </p>
                    </div>

                    <button
                        className="myPostsClose"
                        type="button"
                        aria-label="ปิดหน้าต่าง"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {myPosts.length > 0 && (
                    <input
                        className="myPostsSearch"
                        type="search"
                        aria-label="ค้นหาโพสต์ของฉัน"
                        placeholder="ค้นหาชื่อสินค้า หมวดหมู่ หรือรายละเอียด"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                )}

                {myPosts.length === 0 ? (
                    <div className="myPostsEmpty">
                        <p>ยังไม่มีโพสต์ของคุณ</p>

                        <span>กด &quot;ลงขายสินค้า&quot; เพื่อสร้างโพสต์แรก</span>
                    </div>
                ) : visiblePosts.length === 0 ? (
                    <div className="myPostsEmpty">
                        <p>ไม่พบโพสต์ที่ค้นหา</p>

                        <span>ลองเปลี่ยนคำค้นหา</span>
                    </div>
                ) : (
                    <div className="myPostsList">
                        {visiblePosts.map((product) => (
                            <article className="myPostItem" key={product.id}>
                                {product.image ? (
                                    <div className="myPostImage">
                                        <Image
                                            src={product.image}
                                            alt={product.Name}
                                            fill
                                            sizes="5rem"
                                        />
                                    </div>
                                ) : (
                                    <div className="myPostImage myPostImagePlaceholder">
                                        ไม่มีรูป
                                    </div>
                                )}

                                <div className="myPostInfo">
                                    <h3>{product.Name}</h3>

                                    <p className="myPostCategory">{product.Category}</p>

                                    <strong className="myPostPrice">
                                        ฿{product.Price.toLocaleString("th-TH")}
                                    </strong>

                                    <p className="myPostDescription">{product.Description}</p>

                                    <p className="myPostStatus">
                                        สถานะ: <strong>{product.status}</strong>
                                    </p>

                                    <select
                                        className="myPostStatusSelect"
                                        value={product.status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                product.id,
                                                event.target.value as ProductStatus,
                                            )
                                        }
                                    >
                                        <option value="Selling">Selling</option>

                                        <option value="Reserved">Reserved</option>

                                        <option value="Sold">Sold</option>
                                    </select>

                                    <div className="myPostActions">
                                        <button
                                            type="button"
                                            className="myPostEditButton"
                                            onClick={() => setEditingProduct(product)}
                                        >
                                            แก้ไข
                                        </button>

                                        <button
                                            type="button"
                                            className="myPostDeleteButton"
                                            onClick={() => handleDelete(product)}
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {editingProduct && (
                    <div className="editPostBackdrop">
                        <section
                            className="editPostDialog"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="editPostTitle"
                        >
                            <div className="editPostHeader">
                                <h3 id="editPostTitle">แก้ไขโพสต์</h3>

                                <button
                                    type="button"
                                    aria-label="ปิดการแก้ไข"
                                    onClick={() => setEditingProduct(null)}
                                >
                                    ×
                                </button>
                            </div>

                            <label className="editPostField">
                                ชื่อสินค้า
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

                            <label className="editPostField">
                                ราคา
                                <input
                                    type="number"
                                    min="1"
                                    value={editingProduct.Price}
                                    onChange={(event) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            Price: Number(event.target.value),
                                        })
                                    }
                                />
                            </label>

                            <label className="editPostField">
                                หมวดหมู่
                                <select
                                    value={editingProduct.Category}
                                    onChange={(event) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            Category: event.target.value as ProductCategory,
                                        })
                                    }
                                >
                                    {PRODUCT_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="editPostField">
                                รายละเอียด
                                <textarea
                                    rows={5}
                                    value={editingProduct.Description}
                                    onChange={(event) =>
                                        setEditingProduct({
                                            ...editingProduct,
                                            Description: event.target.value,
                                        })
                                    }
                                />
                            </label>

                            <div className="editPostActions">
                                <button type="button" onClick={() => setEditingProduct(null)}>
                                    ยกเลิก
                                </button>

                                <button type="button" onClick={handleSaveEdit}>
                                    บันทึกการแก้ไข
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                <div className="myPostsFooter">
                    <button type="button" onClick={onClose}>
                        ปิด
                    </button>
                </div>
            </section>
        </div>
    );
}
