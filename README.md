# Tasbih

Modern va zamonaviy digital tasbih hisoblagichi. Bu loyiha foydalanuvchiga tasbih sonini hisoblash, kunlik streak kuzatib borish, maqsad belgilash va kundalik faoliyat statistikasi ko'rish imkonini beradi.

## Xususiyatlar

- Yagona bosishda tasbih sanash
- Maqsadli hisoblash rejimi
- Kunlik streak va eng yaxshi streak kuzatuvi
- Har kuni faoliyatni saqlash va heatmap/statistika ko'rsatish
- Ovoz va vibratsiya effektlari
- Dark / light rejim
- Ko'p tilli interfeys (uz, en, ru)
- Vite + React bilan ishlangan zamonaviy frontend
- PWA uchun manifest va favicon sozlamalari

## Texnologiyalar

- React 19
- Vite
- JavaScript
- CSS Modules-style custom styling
- LocalStorage bilan ma'lumot saqlash

## Loyihani ishga tushirish

1. Repozitoriyani klonlang:

```bash
git clone <repository-url>
cd Tasbeh
```

2. Bog'lanish uchun dependency'larni o'rnating:

```bash
npm install
```

3. Dev server ni ishga tushiring:

```bash
npm run dev
```

4. Brauzerda quyidagi manzilni oching:

```text
http://localhost:5173
```

## Build qilish

Production build yaratish uchun:

```bash
npm run build
```

Preview qilish:

```bash
npm run preview
```

## Skriptlar

- `npm run dev` — dev server ni ishga tushirish
- `npm run build` — production build yaratish
- `npm run preview` — build qilingan appni ko'rib chiqish
- `npm run lint` — lint tekshiruvi

## Ma'lumotlarni saqlash

Loyiha asosiy holatlarni `localStorage` orqali saqlaydi, jumladan:

- sanash qiymati
- kunlik streak
- eng yaxshi streak
- maqsadlar
- aktivlik tarixi
- sozlamalar (til, ovoz, vibratsiya va boshqalar)

## Strukturasi

```text
Tasbeh/
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── site.webmanifest
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Ishlatilishi

- Tasbihni sanash uchun markazdagi tugmani bosing.
- Har bir aylanma yoki maqsad chegarasiga yetganda statistikalar avtomatik yangilanadi.
- Sozlamalar orqali tilni, ovozni, vibratsiyani yoki maqsadni o'zgartirishingiz mumkin.
- Statistics bo'limida kunlik faoliyatingizni ko'rib borishingiz mumkin.

## Eslatma

Loyiha shaxsiy ibodat va tasbih amaliyoti uchun mo'ljallangan bo'lib, foydalanuvchining lokal ma'lumotlari brauzerda saqlanadi. Bu ma'lumotlar serverga yuborilmaydi.
