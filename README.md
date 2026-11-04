# موقع شركة موشا للتجارة والاستثمار

موقع الشركة الرسمي [www.moshaltd.com](https://www.moshaltd.com): عربي/إنجليزي، يشتغل على الكمبيوتر والتلفون، مع لوحة تحكم لإدارة المنتجات والعروض والرسائل.

**التقنيات:** React 18 + TypeScript + Vite + Tailwind CSS · Supabase (قاعدة البيانات + الصور + تسجيل الدخول) · Resend (الإيميل) · Vercel (الاستضافة)

---

## ⚙️ خطوات الإعداد (مرة واحدة فقط)

> الموقع العام يشتغل طوالي بعد النشر. لوحة التحكم تحتاج الخطوات 1 و 2 عشان تقدر تسجّل دخول.

### 1) قاعدة البيانات والحماية — Supabase

1. افتح [Supabase Dashboard](https://supabase.com/dashboard) ← مشروعك ← **SQL Editor** ← **New query**
2. انسخ محتوى الملف [`supabase/setup.sql`](supabase/setup.sql) كله، الصقه، واضغط **Run**.

الملف ده بيعمل الآتي:
- قائمة المدراء المسموح ليهم (`almujtabashawgi@gmail.com` و `mostafashawgi@gmail.com`)
- قواعد حماية (RLS): أي زول يقدر **يشوف** المنتجات، لكن **الإضافة والتعديل والحذف للمدراء بس**
- جدول **العروض** وجدول **الرسائل**
- حماية مخزن الصور: الرفع للمدراء بس، 5 ميقا كحد أقصى، صور بس

**إضافة مدير جديد لاحقاً** (من SQL Editor):
```sql
insert into public.admins (email) values ('new.admin@gmail.com');
```

### 2) تسجيل الدخول بـ Google

**أ) في Google Cloud:**
1. افتح [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)، واعمل مشروع لو ما عندك.
2. **OAuth consent screen**: اختار External، واكتب اسم التطبيق `Mosha Admin` وإيميلك.
3. **Create Credentials ← OAuth client ID ← Web application**
4. في **Authorized redirect URIs** أضف:
   ```
   https://mqklhyqprouooifigdyq.supabase.co/auth/v1/callback
   ```
5. انسخ **Client ID** و **Client Secret**.

**ب) في Supabase:**
1. **Authentication ← Sign In / Providers ← Google**: فعّله والصق Client ID و Secret ← Save
2. **Authentication ← URL Configuration**:
   - **Site URL:** `https://www.moshaltd.com`
   - **Redirect URLs** (أضف التلاتة):
     ```
     https://www.moshaltd.com/admin
     https://moshaltd.com/admin
     http://localhost:3000/admin
     ```
3. (حماية إضافية، اختياري) **Sign In / Providers ← Email**: اقفل "Allow new users to sign up".

بعدها ادخل على **www.moshaltd.com/admin** واضغط «المتابعة باستخدام Google».

### 3) متغيرات Vercel (عشان الرسائل تتحفظ ويتمنع السبام)

**Vercel ← المشروع ← Settings ← Environment Variables**:

| المتغير | القيمة | ملاحظة |
|---|---|---|
| `RESEND_API_KEY` | (موجود عندك) | مفتاح Resend |
| `SUPABASE_URL` | `https://mqklhyqprouooifigdyq.supabase.co` | |
| `SUPABASE_SERVICE_ROLE_KEY` | من Supabase ← Project Settings ← API Keys ← `service_role` | ⚠️ سري جداً، ما تحطه في الكود أبداً |
| `CONTACT_TO` | `mostafashawgi@gmail.com` | الإيميل اللي بتوصل ليه الرسائل (ممكن أكتر من واحد بفاصلة) |

بعد ما تضيفهم اعمل **Redeploy**.

### 4) (مهم) توثيق الدومين في Resend، عشان الرسائل توصل لأي إيميل

حالياً الإرسال من `onboarding@resend.dev`، وده بيوصل **لإيميل صاحب حساب Resend بس**. عشان توصل لـ `info@moshaltd.com` أو أي إيميل تاني، ويوصل للعميل إيميل تأكيد:
1. **Resend ← Domains ← Add Domain** ← `moshaltd.com`
2. أضف سجلات DNS اللي بيديك ليها في لوحة الدومين.
3. بعد ما يبقى **Verified**، أضف في Vercel:
   `RESEND_FROM` = `Mosha Website <no-reply@moshaltd.com>`

> حتى لو الإيميل فشل، كل رسالة بتتحفظ في لوحة التحكم ← **الرسائل**، بشرط تكون الخطوة 3 متعمولة.

### 5) Vercel ← Domains (اختياري)

خلّي `moshaltd.com` يحوّل على `www.moshaltd.com` بـ **308 Permanent** بدل 307، عشان تحسين الظهور في Google.

---

## ✏️ تعديل محتوى الموقع

| داير تعدل | الملف |
|---|---|
| اسم الشركة، التلفون، الواتساب، الإيميل، العنوان، روابط السوشيال ميديا | [`src/config/site.ts`](src/config/site.ts) |
| كل نصوص الموقع (عربي وإنجليزي) | [`src/i18n/index.ts`](src/i18n/index.ts) |
| المنتجات والعروض | من لوحة التحكم `/admin` (من غير كود) |

**روابط السوشيال ميديا:** اكتبها في `SITE.social`. الأيقونة بتظهر براها لما يكون فيها رابط.

---

## 🛡️ الحمايات الموجودة

- تسجيل دخول المدراء بـ **Google** بس، مع تحقق من القائمة جوه قاعدة البيانات (ما في كلمات سر في الكود)
- **RLS** على كل الجداول ومخزن الصور: حتى لو زول أخد المفتاح العام، ما بيقدر يعدل حاجة
- نموذج التواصل محمي من السبام بطرق متعددة: فخ للبوتات (حقل مخفي)، فحص الزمن، وحد أقصى 3 رسائل كل 10 دقائق لكل جهاز، مع تنظيف المدخلات ومنع حقن HTML في الإيميل
- **Security Headers** على Vercel: CSP، ومنع تضمين الموقع في iframe، و HSTS، و nosniff، و Referrer-Policy، و Permissions-Policy
- الصفحات `/admin` ما بتظهر في نتائج البحث
- الصور بتتصغّر وبتتحول لـ WebP قبل الرفع، وأسماء الملفات عشوائية
- روابط يوتيوب بتتفحص قبل عرضها، وبتشتغل من `youtube-nocookie`
- كل المكتبات محدّثة: `npm audit` = 0 ثغرات

---

## 💻 التشغيل على جهازك

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # بناء نسخة النشر
npm run typecheck  # فحص الأخطاء
```

> نموذج التواصل (`/api/send-email`) بيشتغل على Vercel. عشان تجربه محلياً استخدم `npx vercel dev`.

## 📁 هيكل المشروع

```
api/send-email.js        ← إرسال رسائل التواصل (خادم Vercel)
supabase/setup.sql       ← إعداد قاعدة البيانات والحماية
public/                  ← الأيقونات، صورة المشاركة، robots، sitemap
src/
  config/site.ts         ← بيانات الشركة والقطاعات
  i18n/index.ts          ← الترجمة عربي/إنجليزي
  lib/                   ← Supabase + معالجة الصور ويوتيوب
  hooks/                 ← اللغة، SEO، البيانات المباشرة، تسجيل الدخول
  components/            ← الهيدر، الفوتر، بطاقات المنتجات والعروض…
  pages/                 ← صفحات الموقع
  pages/admin/           ← لوحة التحكم (منتجات، عروض، رسائل)
```
