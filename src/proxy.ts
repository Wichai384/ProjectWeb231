import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
  callbacks: {
    authorized: ({ token }) => process.env.ENABLE_AUTH !== "true" || Boolean(token),
  },
});

export const config = {
  matcher: ["/Shop/:path*"],
};
