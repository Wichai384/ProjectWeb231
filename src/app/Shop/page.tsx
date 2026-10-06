import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import ProductExplorer from "@/components/search/searchExprolrer";
import { authOptions } from "@/lib/auth/authOptions";

export const metadata: Metadata = {
  title: "MAICHAILEAWNAJA | SHOP",
  description: "ตลาดสินค้า MAICHAILEAWNAJA",
};

export default async function Store() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=%2FShop");
  }

  return (
    <main className="shopPage">

      {/* HERO */}
      <section className="shopHero">

        <div className="shopHeroTop">
          <span>MARKET</span>
          <span>SHOP</span>
        </div>

        <div className="shopHeroContent">

          <p className="shopHeroSmall">
            สินค้าที่มีคุณค่า
          </p>

          <h1 className="shopHeroTitle">
            <span>MAI</span>
            <span className="shopHeroAccent">CHAI</span>
            <span>LEAW</span>
            <span>NAJA</span>
          </h1>

          <p className="shopHeroDescription">
            เลือกของที่ใช่ ในแบบของคุณ
          </p>

        </div>

        <div className="shopHeroBottom">
          <span>SHOP NOW</span>
          <span className="shopHeroArrow">↓</span>
        </div>

      </section>


      {/* PRODUCTS */}
      <section className="productArea">

        <div className="productHeader">

          <div>
            <span className="productNumber">02</span>

            <h2>
              สินค้าที่น่าสนใจ
            </h2>
          </div>

          <span className="productHeaderLabel">
            SECONDHAND
          </span>

        </div>

        <ProductExplorer />

      </section>

    </main>
  );
}