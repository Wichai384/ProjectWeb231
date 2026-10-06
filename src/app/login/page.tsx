import type { Metadata } from "next";
import Link from "next/link";

import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบ | MAICHAILEAWNAJA",
  description: "เข้าสู่ระบบด้วยบัญชี Google",
};

export default function LoginPage() {
  return (
    <main className="login-page loginPage">
      <section className="login-card" aria-labelledby="login-title">
        <Link className="loginBrand" href="/Shop">
          MAICHAILEAWNAJA
        </Link>
        <p className="loginEyebrow">SECONDHAND MARKET</p>
        <h1 id="login-title" className="loginTitle">
          ยินดีต้อนรับ
        </h1>
        <p className="loginDescription">
          เข้าสู่ระบบเพื่อซื้อขายและจัดการบัญชีของคุณ
        </p>
        <GoogleSignInButton />
      </section>
    </main>
  );
}
