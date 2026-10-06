# ProjectWeb231 - maichailaewnaja

เว็บไซต์ตลาดซื้อขายสินค้ามือสองสำหรับนักศึกษา สร้างด้วย [Next.js](https://nextjs.org)

เว็บที่ deploy แล้ว: https://project-web231.vercel.app

## ฟีเจอร์

- สมัครและเข้าสู่ระบบ (Google sign-in)
- หน้าร้านค้า (`/Shop`) แสดงสินค้าทั้งหมด
- ค้นหาสินค้าด้วยชื่อ และกรองตามหมวดหมู่ (หนังสือ, ของใช้ในหอ, อิเล็กทรอนิกส์, เสื้อผ้า, กีฬา)
- ดูรายละเอียดสินค้า
- เพิ่มสินค้าลงตะกร้า (Cart)
- บันทึกสินค้าที่ชอบ (Favorites)
- ซื้อสินค้า โดยกรอกชื่อผู้ซื้อ ที่อยู่จัดส่ง และเบอร์โทร (ตัวเลข 10 หลัก)
- ดูคำสั่งซื้อ (Orders) และประวัติการซื้อ (Purchase History)
- ลงขายสินค้า (Post Sale) และจัดการประกาศของฉัน (My Posts)
- ส่วนของผู้ขาย (Seller)
- การแจ้งเตือน (Notifications)
- โปรไฟล์ผู้ใช้ (Profile)

## เทคโนโลยีที่ใช้

- Next.js (App Router) และ React
- TypeScript
- Tailwind CSS
- NextAuth (Google OAuth)
- ESLint
- Deploy บน Vercel

## วิธีติดตั้ง

### สิ่งที่ต้องมี

- [Node.js](https://nodejs.org) เวอร์ชัน 18.18 ขึ้นไป (แนะนำ 20 ขึ้นไป)
- npm
- บัญชี Google สำหรับสร้าง OAuth Client

### ขั้นตอน

1. โคลนโปรเจกต์

   ```bash
   git clone https://github.com/Wichai384/ProjectWeb231.git
   cd ProjectWeb231
   ```

2. ติดตั้ง dependencies

   ```bash
   npm install
   ```

3. สร้างไฟล์ตั้งค่า

   ```bash
   cp .env.example .env.local
   ```

   แล้วแก้ค่าใน `.env.local`

   | ตัวแปร | คำอธิบาย |
   |---|---|
   | `GOOGLE_CLIENT_ID` | Client ID จาก Google Cloud Console |
   | `GOOGLE_CLIENT_SECRET` | Client Secret จาก Google Cloud Console |
   | `NEXTAUTH_SECRET` | ข้อความสุ่มยาวๆ ที่ไม่ซ้ำใคร (สร้างได้ด้วย `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | `http://localhost:3000` (ตอนใช้งานจริงเปลี่ยนเป็นโดเมนของเว็บ) |

   > ชื่อตัวแปรให้ยึดตามไฟล์ `.env.example` ในโปรเจกต์เป็นหลัก และห้ามนำค่าเหล่านี้ขึ้น GitHub

4. ตั้งค่า Google sign-in

   1. เข้า [Google Cloud Console](https://console.cloud.google.com) แล้วสร้างโปรเจกต์
   2. ตั้งค่า OAuth consent screen ให้ audience เป็น **External**
   3. สร้าง OAuth client แบบ **Web application**
   4. เพิ่ม Authorized redirect URI

      ```text
      http://localhost:3000/api/auth/callback/google
      ```

      ถ้า deploy แล้ว ให้เพิ่ม callback ของโดเมนจริงด้วย เช่น `https://project-web231.vercel.app/api/auth/callback/google`
   5. ถ้า consent screen ยังเป็นโหมด testing จะมีเฉพาะบัญชีที่อยู่ในรายชื่อ test users เท่านั้นที่ล็อกอินได้ ต้อง publish แอปเพื่อให้บัญชี Google อื่นเข้าได้

   ระบบรับทุกบัญชี Google ที่ยืนยันอีเมลแล้ว และตรวจสอบ email claim ที่ฝั่งเซิร์ฟเวอร์ ไม่รองรับการล็อกอินด้วย Microsoft หรือผู้ให้บริการอื่น

5. รันเซิร์ฟเวอร์สำหรับพัฒนา

   ```bash
   npm run dev
   ```

   เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

### คำสั่งอื่นๆ

| คำสั่ง | หน้าที่ |
|---|---|
| `npm run dev` | รันโหมดพัฒนา |
| `npm run build` | build สำหรับใช้งานจริง |
| `npm run start` | รันเวอร์ชันที่ build แล้ว |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |

## วิธีใช้งาน

### ค้นหาและกรองสินค้า

1. เปิดหน้าแรกของเว็บ จะเห็นสินค้าทั้งหมดเรียงจากใหม่สุด
2. พิมพ์ชื่อสินค้าในช่องค้นหา ผลลัพธ์จะอัปเดตอัตโนมัติ
3. กดปุ่มหมวดหมู่เพื่อกรอง ใช้ร่วมกับคำค้นได้
4. กด "ล้างตัวกรอง" เพื่อกลับไปดูสินค้าทั้งหมด
5. ถ้าไม่พบสินค้า ระบบจะแสดงข้อความแนะนำให้ลองคำค้นหรือหมวดอื่น

### ซื้อสินค้า

1. เลือกสินค้าที่สนใจ แล้วกดซื้อ
2. กรอกชื่อ-นามสกุล ที่อยู่จัดส่ง และเบอร์โทรเป็นตัวเลข 10 หลัก
3. กด "ยืนยันการซื้อ"

### เข้าสู่ระบบ

กดปุ่มเข้าสู่ระบบ แล้วเลือกบัญชี Google

## โครงสร้างโปรเจกต์

```text
ProjectWeb231/
├── public/        ไฟล์สาธารณะ เช่น รูปภาพ
├── src/           โค้ดหลักของเว็บ
├── .env.example   ตัวอย่างไฟล์ตั้งค่า
└── package.json   รายการ dependencies และคำสั่ง
```

## สมาชิก

| ชื่อ-นามสกุล | รหัสนักศึกษา |
|---|---|---|
| นางสาวพัชราภรณ์ อ่อนจันทร์ | 6804101361 |
| นางสาวพิชชานันท์ ขันจันทร์ | 6804101362 |
| นางสาววิชญาดา ดำสอน | 6804101383 |
| นายสาวอรปรียา ชุมภู | 6804101397 |
| นายวิชัย ใสภา | 6804101384 |
| นายเอกราช แซ่ว่าง | 6804101400 |