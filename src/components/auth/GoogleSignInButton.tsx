"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      className="loginProviderButton"
      onClick={() => void signIn("google", { callbackUrl: "/Shop" })}
      type="button"
    >
      Sign in with Google
    </button>
  );
}
