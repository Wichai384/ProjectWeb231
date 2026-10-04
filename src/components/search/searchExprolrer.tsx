"use client";

import {
  useState,
  type ChangeEvent,
} from "react";

import type {
  CategoryFilterValue,
} from "../../types/type_infoProduct";

import CategoryFilter from "../filter/CategoryFilter";
import ProductCard from "../Product/ProductCard";

import { useProductCatalog } from "@/context/ProductCatalogContext";

type SortOption =
  | "default"
  | "price-low"
  | "price-high";

export default function ProductExplorer() {
  const { products } =
    useProductCatalog();

  // ช่องค้นหาสินค้า
  const [keyword, setKeyword] =
    useState("");

  // หมวดหมู่ที่เลือก
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterValue>("");

  // รูปแบบการเรียงสินค้า
  const [sortOption, setSortOption] =
    useState<SortOption>("default");

  function handleKeywordChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setKeyword(
      event.target.value,
    );
  }

  function handleSortChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setSortOption(
      event.target.value as SortOption,
    );
  }

  const searchText =
    keyword.trim().toLowerCase();

  const visibleProducts =
    products
      .filter((product) => {
        const matchesKeyword =
          product.Name
            .toLowerCase()
            .includes(searchText) ||
          product.Category
            .toLowerCase()
            .includes(searchText);

        const matchesCategory =
          !selectedCategory ||
          product.Category ===
            selectedCategory;

        return (
          matchesKeyword &&
          matchesCategory
        );
      })
      .sort((a, b) => {
        if (
          sortOption ===
          "price-low"
        ) {
          return a.Price - b.Price;
        }

        if (
          sortOption ===
          "price-high"
        ) {
          return b.Price - a.Price;
        }

        return 0;
      });

  return (
    <div>
      <div className="searchControls">
        <input
          className="searchInput"
          type="search"
          aria-label="ค้นหาสินค้า"
          value={keyword}
          onChange={
            handleKeywordChange
          }
          placeholder="ค้นหาชื่อสินค้าหรือหมวดหมู่สินค้า"
        />

        <CategoryFilter
          value={selectedCategory}
          onChange={
            setSelectedCategory
          }
        />

        <select
          className="sortSelect"
          aria-label="เรียงสินค้า"
          value={sortOption}
          onChange={
            handleSortChange
          }
        >
          <option value="default">
            เรียงสินค้า
          </option>

          <option value="price-low">
            ราคา: ต่ำ → สูง
          </option>

          <option value="price-high">
            ราคา: สูง → ต่ำ
          </option>
        </select>
      </div>

      <p className="productResultCount">
        พบสินค้า{" "}
        <strong>
          {visibleProducts.length}
        </strong>{" "}
        รายการ
      </p>

      {visibleProducts.length ===
      0 ? (
        <p>ไม่พบสินค้า</p>
      ) : (
        <section
          className="productGrid"
          aria-label="ผลการค้นหาสินค้า"
        >
          {visibleProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ),
          )}
        </section>
      )}
    </div>
  );
}