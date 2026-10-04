import type { Metadata } from "next";
import ProductExplorer from "@/components/search/searchExprolrer";

export const metadata: Metadata = {
  title: "สินค้าทั้งหมด",
};


export default function Store() {
  return (
    <main className="shopPage">
      <ProductExplorer />
    </main>
  );
}
