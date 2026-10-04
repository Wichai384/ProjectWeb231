import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

type HomeProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { error } = await searchParams;

  return (
    <main className="loginPage">
      <section className="loginPanel" aria-labelledby="loginHeading">
        <p className="loginBrand">Maichailaewnaja</p>
        <p className="loginContext">STUDENT MARKETPLACE</p>
        <h1 id="loginHeading">เข้าสู่ระบบ</h1>
        <p className="loginDescription">เข้าสู่พื้นที่ซื้อขายและแบ่งปันของในมหาวิทยาลัย</p>

        {error && (
          <p className="loginError" role="alert">
            {error === "AccessDenied"
              ? "บัญชีนี้ไม่ได้รับอนุญาตให้เข้าสู่ระบบ โปรดใช้บัญชี Google ที่ยืนยันอีเมลแล้ว"
              : "เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง"}
          </p>
        )}

        <GoogleSignInButton />
      </section>
    </main>
  );
}
