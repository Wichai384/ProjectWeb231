"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setError(null);

    try {
      await signIn("google", { callbackUrl: "/Shop" });
    } catch {
      setError("เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  }

  return (
    <>
      <button
        className="loginProviderButton"
        onClick={() => void handleSignIn()}
        type="button"
      >
        เข้าสู่ระบบด้วย Google
      </button>
      {error && (
        <p className="loginError" role="alert">
          {error}
        </p>
      )}
    </>
  );
}
