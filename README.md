# Portfolio & Business Suite

Modern portfolio + dynamic business management platform built with Next.js 15, TypeScript, Prisma, PostgreSQL.

## 🏗 Architecture: MVVM

```
Model      → src/models/       (interfaces, types, entities)
ViewModel  → src/viewmodels/   (business logic, form logic, API interaction)
View       → src/components/   (UI components, pages, layouts)
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env dengan DATABASE_URL Anda

# 3. Push database schema
npm run db:push

# 4. Seed data awal
npm run db:seed

# 5. Run development
npm run dev
```

## 📂 Struktur Folder

```
src/
├── app/                    # Next.js App Router
│   ├── (portfolio)/        # Portfolio public pages
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/
│   ├── admin/              # Admin UI components
│   ├── portfolio/          # Portfolio UI components
│   └── shared/             # Shared components
├── config/                 # Config-driven system
│   └── master-data.config.ts
├── lib/                    # Utilities & Prisma client
├── models/                 # TypeScript interfaces (Model)
├── store/                  # Zustand state management
└── viewmodels/             # Business logic (ViewModel)
```

## ⚙️ Menambah Modul Baru (Config-Driven)

Edit `src/config/master-data.config.ts`:

```typescript
export const masterDataConfig = {
  // ... existing modules ...
  
  vendor: {
    label: "Vendor",
    icon: "Building2",
    fields: [
      { name: "name", type: FieldType.TEXT, label: "Nama Vendor", required: true },
      { name: "email", type: FieldType.EMAIL, label: "Email", required: true },
    ],
  },
};
```

Sistem otomatis menghasilkan:
- ✅ Menu sidebar
- ✅ Form input dengan validasi
- ✅ Tabel dengan pagination
- ✅ CRUD API endpoints
- ✅ Zod validation

## 🌐 Deploy ke Vercel

1. Push ke GitHub
2. Import di vercel.com
3. Set environment variables:
   - `DATABASE_URL` (Vercel Postgres / Supabase / Neon)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
4. Deploy!

### Database Gratis
- **Vercel Postgres**: vercel.com/storage
- **Supabase**: supabase.com (free tier)
- **Neon**: neon.tech (free tier)
