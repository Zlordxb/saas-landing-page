# دليل التعلّم: BookFlow 📘

الملف ده هو "الكشكول" بتاعك. كل مرحلة مكتوب فيها: **عملنا إيه، فين، وليه**، وفي آخرها **كلمات تدوّر عليها** عشان تفهم أعمق.
(لو مش عايز الملف ده يظهر على GitHub، انقله برا فولدر المشروع قبل ما تعمل commit.)

---

## خريطة المشروع في سطور

```
project-1/
├─ docs/                  التخطيط والديزين (PRD, ROADMAP, DESIGN-SYSTEM, brand)
├─ supabase/migrations/   قاعدة البيانات بالـ SQL
├─ src/
│  ├─ app/                الصفحات (كل فولدر = رابط في الموقع)
│  ├─ components/         قطع الواجهة اللي بنعيد استخدامها
│  ├─ actions/            Server Actions (كود بيتنفذ على السيرفر لما المستخدم يدوس زرار)
│  ├─ lib/                المنطق: الحجز، الوقت، Supabase، الـ validation
│  ├─ config/clinic.ts    إعدادات العيادة وقواعد الحجز
│  ├─ content/home.ts     كلام الصفحة الرئيسية
│  └─ content/photos.ts   كل الصور ومصوّرينها في مكان واحد
├─ package.json           المكتبات والأوامر
└─ README.md              واجهة المشروع على GitHub
```

---

## المرحلة 0: تجهيز الجهاز ✅

- Node.js و Git متسطّبين، وعملت أول push على GitHub.
- عملت المشروع بـ `create-next-app` وشغّلت `npm install` بنفسك (commit `e326044`).

🔎 `What is Node.js` · `npm install` · `git config`

---

## المرحلة 1: التخطيط ✅

📍 `docs/PRD.md`

- **الـ PRD** (وثيقة متطلبات المنتج): فيها بنبني إيه ولمين، ومن غير ما نكتب سطر كود.
- **الـ MVP**: أقل نسخة شغالة. قسّمنا المميزات بطريقة **MoSCoW** لـ Must و Should و Could و Won't.
- **User Stories و Acceptance Criteria**: كل ميزة مكتوبة من وجهة نظر المستخدم، ومعاها checklist بنتأكد منها إنها شغالة.

💡 في الـ Vibe Coding، الـ PRD هو الاتفاق بينك وبين الـ AI. كل ما يكون أوضح، الكود اللي بيطلع يبقى أحسن.

🔎 `PRD template` · `MVP` · `MoSCoW` · `user stories acceptance criteria`

---

## المرحلة 2: الـ Design System ✅

📍 `docs/DESIGN-SYSTEM.md` · `docs/design/tokens.css` · `docs/brand/` · وصفحتين على Claude: **Nefer Dental Studio** (الـ Design System) و **Nefer Landing Page** (الـ Wireframe والديزين)

- **Design Tokens**: كل لون أو مسافة أو زاوية ليها اسم. الـ Components بتستخدم الاسم مش القيمة، فلو غيّرت القيمة تتغيّر في الموقع كله.
- **Primitive و Semantic tokens**: `faience-600` اسم لون. `primary` اسم **وظيفة**، وقيمته `faience-600` في الثيم الفاتح و `faience-400` في الغامق.
- **التباين (Contrast)** اتقاس بسكريبت حسب WCAG: 4.5 للنص، و3 للإطارات. لونين فشلوا في الأول واتصلّحوا.
- **OKLCH**: مساحة ألوان بتخلّي درجات اللون (من 50 لـ 950) تتدرّج بانتظام.

🔎 `design tokens` · `semantic tokens` · `WCAG contrast` · `OKLCH` · كتاب `Refactoring UI`

---

## المرحلة 3: إعداد المشروع ✅

📍 `package.json` · `tsconfig.json` · `next.config.ts` · `eslint.config.mjs` · `.prettierrc.json` · `.gitignore` · `.env.example` · `AGENTS.md`

انت عملت المشروع بـ `create-next-app` (نسخة Next.js 16.4.6)، وده الطريق الصح. أنا ظبطت الملفات اللي طلعت منه على مشروعنا:

- **`package.json`**: فيه قايمة المكتبات. الـ `dependencies` بيحتاجها الموقع وهو شغال، والـ `devDependencies` بنحتاجها واحنا بنطوّر بس (زي TypeScript و ESLint). وفيه كمان الأوامر (`scripts`) زي `npm run dev`. ضفت عليه `typecheck` و `test` و `format`.
- **أرقام النسخ**: `"next": "16.4.6"` من غير علامة يعني النسخة دي بالظبط. أما `^7.62.0` فمعناها: هات أحدث نسخة من غير ما الرقم الكبير يتغيّر، فتقبل `7.70.0` بس مش `8.0.0`. ده اسمه **Semantic Versioning**.
- **`next.config.ts`**:
  - Tailwind بيشتغل كـ **Turbopack loader** (`@tailwindcss/turbopack`)، زي ما الـ template عمله بالظبط.
  - الـ template كان مفعّل `cacheComponents`، وده نظام الكاش الجديد في Next.js 16. أنا قفلته، لأن صفحاتنا مكتوبة بالنظام اللي قبله (`export const revalidate` و `export const dynamic`)، و Next.js بيلغي الاتنين دول لما Cache Components يتفعّل. التحويل للنظام الجديد خطوة هنعملها بعدين.
- **`tsconfig.json`**: سبته زي ما الـ template عمله. فيه `"strict": true`، يعني TypeScript هيمسك أخطاء أكتر. وفيه `"@/*"`، وده معناه إن `@/components/...` بيشاور على `src/components/...` بدل ما تكتب `../../../`.
- **`.env.example`**: أسماء المتغيرات السرية من غير قيمها. القيم الحقيقية بتتحط في `.env.local`، والملف ده `.gitignore` مانعه يترفع على GitHub.
- **`AGENTS.md`**: ملف بيعرّف أي أداة AI على المشروع وقواعده. سبت فيه الجزء اللي Next.js بيكتبه بنفسه (بين `BEGIN:nextjs-agent-rules` و `END`)، لأن `next dev` بيرجّعه لو اتشال. والجزء ده بيقول معلومة مهمة: **توثيق Next.js لنسختك بالظبط موجود جوه `node_modules/next/dist/docs/`**، ومنه اتأكدت من الحاجات اللي فوق.
- **ملفات الـ template اللي اتشالت**: `src/app/page.tsx` (لأن الصفحة الرئيسية عندنا في `src/app/(site)/page.tsx`، ولو الاتنين موجودين Next.js بيطلع error إن فيه صفحتين لنفس الرابط)، و `favicon.ico` (الأيقونة عندنا `icon.svg`)، وصور `public/` اللي مش مستخدمة.

🔎 `create-next-app` · `package.json dependencies vs devDependencies` · `semantic versioning` · `tsconfig paths` · `environment variables nextjs` · `Next.js cacheComponents`

---

## المرحلة 4: الـ Layout والـ Components ✅

📍 `src/app/layout.tsx` · `src/app/globals.css` · `src/app/(site)/layout.tsx` · `src/components/ui/` · `src/components/site/`

- **Component** يعني دالة بترجّع HTML (اسمه JSX). الـ **props** هي المدخلات بتاعتها، زي الـ attributes في HTML بالظبط. مثال: `<Button variant="secondary">`.
- **App Router**: كل فولدر جوه `src/app` بيبقى رابط في الموقع، وملف `page.tsx` هو الصفحة نفسها. أما الـ `layout.tsx` فهو الإطار اللي بيلف الصفحات.
- **الـ Route Group `(site)`**: الأقواس معناها إن اسم الفولدر مش بيظهر في الرابط. فايدته إن الصفحات العامة تتجمع تحت Layout واحد فيه الـ Navbar والـ Footer.
- **Server Components و Client Components**: كل Component بيشتغل على السيرفر افتراضياً، فبيوصل للمتصفح HTML جاهز وسريع. لما تكتب `"use client"` في أول الملف، الـ Component بيشتغل في المتصفح، وده بنحتاجه لما يكون فيه state أو أحداث (زي فتح المنيو في `Navbar`).
- **Tailwind 4**: الـ tokens اتعرّفت في `globals.css` جوه `@theme`، فبقى عندنا كلاسات زي `bg-primary` و `text-ink-muted`.
- **`next/font`**: بيحمّل الخطوط وقت الـ build ويقدّمها من موقعنا نفسه، فمفيش اهتزاز في الصفحة وهي بتحمّل.

🐛 **درس من خطأ حقيقي حصل في المشروع:** حطّينا `border-transparent` و `border-line-strong` على نفس الزرار. التانية كانت المفروض تكسب، بس اللي بيكسب هو ترتيب الكلاسات في ملف الـ CSS، مش ترتيبهم في الكود. فالإطار اختفى. الحل إن كل variant يحدد لونه لوحده. ولقيت الخطأ ده لما أخدت screenshot للصفحة.

🔎 `React components props` · `Next.js App Router` · `Server vs Client Components` · `Tailwind CSS v4 @theme` · `next/font`

---

## المرحلة 5: الـ Landing Page ✅

📍 `src/app/(site)/page.tsx` · `src/components/landing/` · `src/content/home.ts`

- الكلام كله في `content/home.ts`، بعيد عن الديزين. كده لو بعت المشروع لبيزنس تاني، بيغيّر الكلام من غير ما يلمس الـ Components. الفكرة دي اسمها **White-label**.
- **`export const revalidate = 300`**: الصفحة بتتبني مرة واحدة، وبتتحدّث في الخلفية كل 5 دقايق. ده اسمه **ISR**، وبيخلّي الصفحة سريعة جداً. (ده من نظام الكاش اللي قبل Cache Components، وعشان كده قفلنا `cacheComponents` في `next.config.ts`.)
- **`AppointmentCard`**: كارت المواعيد في الـ Hero. ده Client Component بيجيب المواعيد الحقيقية من `/api/slots` جوه `useEffect`. وبيستخدم `AbortController` عشان لو الصفحة اتقفلت، الطلب يتلغي.
- **حركة واحدة بس** (`animate-rise`): الكارت بيطلع لفوق ويظهر في نص ثانية. وأي حد مفعّل "تقليل الحركة" في جهازه مش بيشوفها.
- الأسئلة الشائعة معمولة بـ `<details>`، وده Accordion جاهز في HTML نفسه، من غير JavaScript خالص.

🔎 `Next.js ISR revalidate` · `useEffect fetch AbortController` · `prefers-reduced-motion` · `details summary accordion`

---

## المرحلة 6: صفحة الخدمات ✅

📍 `src/app/(site)/services/page.tsx` · `src/components/services/ServiceCard.tsx` · `src/data/services.ts` · `src/lib/data/services.ts`

- **`.map()`** بتحوّل لستة خدمات للستة كروت. وكل عنصر في اللستة لازم ياخد `key` مختلف عن الباقيين.
- **`getServices()`** بتقرا الخدمات من Supabase، ولو مش متوصّل بتقرا من الداتا التجريبية. عشان كده الموقع شغال من أول `npm run dev`.
- **`cache()`** من React: لو صفحة واحدة طلبت الخدمات أكتر من مرة، قاعدة البيانات بتتسأل مرة واحدة بس.

🔎 `React list rendering key` · `React cache function`

---

## المرحلة 7: Supabase وقاعدة البيانات 🟡

📍 `supabase/migrations/` · `src/lib/supabase/` · `src/proxy.ts`

**جوه الـ SQL:**
- **الجداول**: `services` و `bookings` و `admin_users`. كل جدول ليه **Primary Key**، و `bookings.service_id` عبارة عن **Foreign Key** بيشاور على الخدمة.
- **Constraints**: قواعد قاعدة البيانات نفسها بتفرضها، زي إن رقم الموبايل لازم يبدأ بـ 010 أو 011 أو 012 أو 015، والسعر ميبقاش بالسالب.
- **⭐ `bookings_no_overlap` (اسمه Exclusion Constraint)**: بيمنع أي حجزين نشطين إنهم يتداخلوا في الوقت. حتى لو اتنين داسوا "تأكيد" في نفس اللحظة بالظبط، واحد بس اللي هيعدّي. المشكلة دي اسمها **Race Condition**، والحل ده أقوى من أي فحص بنعمله في الكود.
- **Row Level Security (RLS)**: قواعد بتحدد مين يشوف أنهي صفوف. الزائر بيشوف الخدمات بس. أما الحجوزات فمحدش بيشوفها غير الأدمن، والأدمن نفسه مش بيقدر يعدّل غير عمود الحالة (`status`).
- اتجرّب على PostgreSQL 16 حقيقي في **9 اختبارات**، وكلهم نجحوا.

**في الكود، عندنا 3 أنواع من Supabase Client:**
- `server.ts`: بيقرا جلسة صاحب العيادة من الـ cookies، فالـ RLS بيتطبّق عليه.
- `public.ts`: للبيانات العامة (الخدمات)، ومن غير جلسة.
- `admin.ts`: بالمفتاح السري (Secret Key)، وده بيعدّي الـ RLS. عشان كده مكتوب في أوله `import "server-only"`، ولو أي ملف بيشتغل في المتصفح استورده، الـ build يفشل. ده بيحمي المفتاح إنه يتسرّب.
- **`proxy.ts`**: كان اسمه `middleware` قبل Next.js 16. بيشتغل قبل أي صفحة تحت `/admin`، فبيجدّد الجلسة، ولو المستخدم مش مسجّل دخول بيوديه لصفحة الـ login.

⏳ **فاضل:** نوصّل المشروع بمشروع Supabase فعلي (التفاصيل تحت في "تشغيل المشروع").

🔎 `SQL primary key foreign key` · `PostgreSQL exclusion constraint` · `Supabase Row Level Security` · `race condition` · `Next.js 16 proxy`

---

## المرحلة 8: نظام الحجز ✅

📍 `src/lib/booking/` · `src/app/api/slots/route.ts` · `src/actions/booking.ts` · `src/components/booking/` · `src/app/(site)/book/`

- **الخوارزمية في `slots.ts`**: بتمشي على كل ربع ساعة في مواعيد الشغل، وتستبعد أي ميعاد:
  - قبل الساعتين اللي لازم تفصل بين الحجز والميعاد.
  - بيخلص بعد ما العيادة تقفل.
  - بيتداخل مع حجز موجود، بما فيه ربع ساعة التعقيم.
- **المناطق الزمنية**: السيرفر والمتصفح والعيادة ممكن يكونوا في توقيتات مختلفة، فكل الحسابات بتتعمل بتوقيت القاهرة (`Africa/Cairo`)، وده شامل التوقيت الصيفي. الحسابات دي في `time.ts`.
- **Unit Tests** (`slots.test.ts`): 7 اختبارات وكلهم نجحوا. بتشغّلها بأمر `npm test`.
- **Route Handler** (`/api/slots`): ده API بيرجّع المواعيد الفاضية كـ JSON، ومن غير أي بيانات شخصية.
- **الـ Wizard**: 4 خطوات جوه Client Component واحد. فلو رجعت خطوة لورا، مش هتخسر اللي اخترته.
- **التقويم بيشتغل بالكيبورد**: الأسهم بتتنقّل بين الأيام. الطريقة دي اسمها **Roving Tabindex**.
- **الـ Validation بيحصل مرتين**: نفس الـ Zod Schema بيتطبّق في المتصفح (مع React Hook Form) وعلى السيرفر. ليه مرتين؟ لأن أي حد يقدر يبعت طلب للسيرفر من غير ما يعدّي على الفورم أصلاً.
- **Server Action** (`createBooking`): بيعمل validation، وبعدين يتأكد إن الميعاد لسه فاضي، وبعدين يحفظ. ولو قاعدة البيانات رجّعت `23P01` (يعني حد سبقه للميعاد)، بيطلع للمريض رسالة واضحة.

🔎 `Next.js Server Actions` · `Route Handlers` · `Zod` · `React Hook Form zodResolver` · `useTransition` · `JavaScript time zones Intl` · `Vitest`

---

## المرحلة 9: لوحة التحكم ✅

📍 `src/app/admin/` · `src/actions/admin.ts` · `src/components/admin/` · `src/lib/data/admin.ts`

- **تسجيل الدخول**: الفورم بيستخدم `useActionState`، وده بيشغّل الـ Server Action ويرجّع النتيجة وحالة التحميل.
- **Defense in Depth (حماية على طبقات)**: الـ `proxy` بيتحقق من تسجيل الدخول، والصفحة نفسها بتتحقق تاني، وقاعدة البيانات (RLS) بتتحقق تالت مرة.
- **الفلاتر محفوظة في الرابط** (`?when=today&status=pending`). فايدة ده إنك تقدر تحفظ الرابط أو تبعته، والصفحة تفضل Server Component.
- **`revalidatePath('/admin')`**: بعد ما تأكد أو تلغي حجز، الصفحة بتتحدّث بالبيانات الجديدة.
- **الإلغاء بيسأل الأول جوه الصفحة نفسها**، مش بنافذة المتصفح المزعجة.

🔎 `Supabase auth Next.js` · `useActionState` · `searchParams Next.js` · `revalidatePath` · `defense in depth`

---

## المرحلة 10 (الجزء الأول): تصميم متقدم وصور حقيقية ✅

الفكرة الأساسية جاية من حيطة بلاط القاشاني اللي جوه هرم زوسر في سقارة. البلاط ده فوقه قبة صغيرة، فعملناه إطار للصور، وكارت الحجز بقى البلاطة اللي في نص الحيطة. والـ skill اللي اشتغلت بيه اسمه **frontend-design**، وقاعدته: كل قرار في التصميم لازم يطلع من عالم المشروع نفسه، وما نلجأش للـ template المعتاد.

| الفكرة | فين | بنتعلم منها إيه |
|---|---|---|
| صور حقيقية من Unsplash | `src/content/photos.ts` · `src/lib/unsplash-loader.ts` · `next.config.ts` | `next/image` بـ **custom loader**: الـ CDN بتاع Unsplash هو اللي بيصغّر الصورة لكل مقاس شاشة، وبيختار AVIF أو WebP لوحده |
| شكل البلاطة اللي فوقها قبة | `src/app/globals.css` (`@utility tile-dome`) | `@utility` في Tailwind 4، و `border-radius` بشكل بيضاوي |
| Dropdown بيشتغل بالكيبورد | `src/components/ui/Dropdown.tsx` | نمط **Menu Button** من WAI-ARIA: الأسهم بتتنقّل، Escape بيقفل، والضغط برا بيقفل |
| قايمة Treatments الكبيرة (Mega menu) | `src/components/site/Navbar.tsx` · `TreatmentsPanel.tsx` | نمط **Disclosure**، و **Hover intent** (بتفتح بعد وقفة قصيرة) |
| منيو الموبايل | `src/components/site/MobileMenu.tsx` | `role="dialog"`، وقفل الـ scroll، وإزاي تحرّك الـ focus |
| "مفتوح دلوقتي" لايف | `src/lib/booking/opening.ts` (عليه tests) · `src/lib/use-now.ts` | **`useSyncExternalStore`**: بنقرا الساعة من غير ما يحصل hydration mismatch |
| قايمة الأسعار (الصورة بتتغيّر) | `src/components/landing/PriceList.tsx` | **Stretched link**، و `AnimatePresence` |
| دليل ألوان الأسنان | `src/components/landing/ShadeGuide.tsx` | **Radio group** بيشتغل بالأسهم، و SVG فيه gradients، و spring animation |
| قسم الليل على النيل | `src/components/landing/Evenings.tsx` · `EveningTimes.tsx` | بنستخدم الـ API بتاعنا (`/api/slots`) في مكان تاني ونفلتر مواعيد المسا بس |
| معرض الصور اللي بيكبّر | `src/components/landing/StudioGallery.tsx` | الـ **`<dialog>`** الجاهز في المتصفح: بيمسك الـ focus جواه، وبيقفل بـ Escape، وبيغمّق الخلفية |
| آراء المرضى | `src/components/landing/Testimonials.tsx` | **Variants** في Motion مع `custom` عشان نعرف اتجاه الحركة |
| الأسئلة الشائعة بتفتح بنعومة | `globals.css` (`.accordion`) | CSS حديث: **`interpolate-size`** و `::details-content` |
| خريطة الزمالك | `src/components/landing/NileMap.tsx` | خريطة SVG مرسومة: من غير Google Maps ومن غير أي scripts خارجية |
| جدول المواعيد (النهارده متعلّم) | `src/components/landing/OpeningHours.tsx` | `<table>` بـ `<caption>`، و `aria-current="date"` |
| زرار الحجز اللي بيظهر على الموبايل | `src/components/site/MobileBookBar.tsx` | بيظهر لما تعمل scroll، ومش بيظهر في صفحات الحجز |
| فلتر و Sort في صفحة الخدمات | `src/components/services/ServicesBrowser.tsx` | `aria-pressed`، و Dropdown من نوع `menuitemradio`، و `layout` animation |
| "ضيف للتقويم" | `src/components/booking/AddToCalendar.tsx` · `src/lib/booking/calendar-link.ts` | ملف **.ics** (معيار RFC 5545) بيتعمل كـ data URL، وفيه تنبيه قبل الميعاد بساعتين |

💡 **الحركة:** جهازك مقفول فيه **Animation effects** في إعدادات Windows، والموقع بيحترم الإعداد ده (`prefers-reduced-motion`). عشان كده ممكن تشوف حركات أقل من الطبيعي. لو عايز تشوفها كاملة: Settings ← Accessibility ← Visual effects ← Animation effects.

🔎 `next/image custom loader` · `WAI-ARIA menu button pattern` · `disclosure navigation menu` · `useSyncExternalStore` · `HTML dialog element` · `interpolate-size` · `iCalendar ics format` · `prefers-reduced-motion`

---

## المراحل الجاية

- **10، Polish**: نشغّل Lighthouse على الموقع وهو أونلاين، ونضيف صورة Open Graph (اللي بتظهر لما حد يشارك اللينك)، ونحط صور حقيقية.
- **11، Deployment على Vercel**:
  1. من vercel.com اعمل Import للريبو بتاعك من GitHub.
  2. حط نفس المتغيرات اللي في `.env.local`، وضيف معاهم `NEXT_PUBLIC_SITE_URL` بلينك الموقع.
  3. دوس Deploy. وبعد كده أي push هيعمل deploy لوحده، ودي فكرة الـ **CI/CD**.
- **12، LinkedIn**: صور وفيديو قصير، وبوست بيحكي **القصة**: التخطيط، والديزين، ومنع الحجز المزدوج، والاختبارات.

---

## ▶️ تشغيل المشروع خطوة بخطوة

**1. تثبيت مكتبات المشروع** (مرة واحدة)، من Terminal جوه فولدر المشروع:
```
cd F:\Projects\SaaS-Landing-page\project-1
npm install @supabase/supabase-js@2 @supabase/ssr zod@4 react-hook-form@7 @hookform/resolvers@5 motion lucide-react server-only
npm install -D vitest prettier prettier-plugin-tailwindcss
```
- `npm install اسم-المكتبة` بيسطّب المكتبة **وبيكتبها في `package.json` لوحده** بأحدث نسخة.
- `@2` معناها: هات أحدث نسخة من الإصدار 2. حطيتها للمكتبات اللي الكود بتاعنا مكتوب على إصدار معيّن منها.
- `-D` معناها: ضيفها في `devDependencies`، يعني بنحتاجها واحنا بنطوّر بس.
- بعد كده، أي حد يعمل clone للمشروع يكتب `npm install` لوحدها، وكل المكتبات تتسطّب من `package.json`.

**2. التشغيل:**
```
npm run dev
```
افتح http://localhost:3000. الموقع هيشتغل على الداتا التجريبية، وهتلاقي ملاحظة إن المواعيد "Preview".

**3. الاختبارات والفحص:**
```
npm test
npm run typecheck
npm run lint
```

**4. توصيل Supabase:** الخطوات بالتفصيل في `README.md`، تحت "Connect Supabase".

---

## 🌱 خطة الـ commits (Git)

الـ scaffold انت عملتله commit خلاص (`e326044`). بعد ما الموقع يشتغل، اعمل commit لكل مرحلة لوحدها. كده تاريخ المشروع على GitHub بيحكي القصة، وده بيفرق جداً مع اللي بيراجع البورتفوليو:

```
git rm --quiet src/app/page.tsx src/app/favicon.ico "public/*.svg"
git add package.json package-lock.json next.config.ts .prettierrc.json .prettierignore .gitignore .gitattributes .env.example AGENTS.md CLAUDE.md
git commit -m "chore: configure the project: libraries, scripts, Prettier, Vitest and agent notes"

git add src/app/globals.css src/app/layout.tsx src/app/icon.svg src/app/not-found.tsx "src/app/(site)/layout.tsx" src/components/ui src/components/site src/config src/lib/format.ts src/lib/site.ts
git commit -m "feat: add design tokens, root layout and UI components"

git add "src/app/(site)/page.tsx" src/components/landing src/content
git commit -m "feat: build the landing page"

git add "src/app/(site)/services" src/components/services src/data src/lib/data/services.ts
git commit -m "feat: add the services page"

git add supabase src/lib/supabase src/proxy.ts
git commit -m "feat: add the Supabase schema, RLS policies and clients"

git add src/lib/booking src/lib/validation src/app/api src/actions/booking.ts "src/app/(site)/book" src/components/booking
git commit -m "feat: add the booking flow with live availability"

git add src/app/admin src/actions/admin.ts src/components/admin src/lib/data/admin.ts
git commit -m "feat: add the owner dashboard"

git add src/app/sitemap.ts src/app/robots.ts README.md docs
git commit -m "docs: add README, roadmap and learning notes"

git add -A
git commit -m "feat: redesign with real photos, dropdown menus and interactive sections"

git push
```

💡 الكلمة اللي في أول كل رسالة (`feat:` أو `chore:` أو `docs:`) جاية من نظام اسمه **Conventional Commits**. معناها: `feat` ميزة جديدة، `fix` تصليح، `docs` توثيق، و`chore` إعدادات.

🔎 `conventional commits` · `git add commit push` · `git log --oneline`
