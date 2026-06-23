// src/config/master-data.config.ts
// ============================================================
// CONFIG-DRIVEN SYSTEM
// Add a new entry here → system auto-generates CRUD, Form, Table, Validation
// ============================================================

import { FieldType, MasterDataConfig } from "@/models";

export const masterDataConfig: MasterDataConfig = {
  // ──────────────────────────────────────────
  // ADDRESS MODULE
  // ──────────────────────────────────────────
  address: {
    label: "Alamat",
    description: "Master data alamat dan wilayah",
    icon: "MapPin",
    fields: [
      {
        name: "province",
        type: FieldType.TEXT,
        label: "Provinsi",
        required: true,
        isSearchable: true,
        order: 1,
      },
      {
        name: "city",
        type: FieldType.TEXT,
        label: "Kota / Kabupaten",
        required: true,
        isSearchable: true,
        order: 2,
      },
      {
        name: "district",
        type: FieldType.TEXT,
        label: "Kecamatan",
        required: false,
        order: 3,
      },
      {
        name: "postalCode",
        type: FieldType.TEXT,
        label: "Kode Pos",
        required: false,
        validation: {
          pattern: "^[0-9]{5}$",
          patternMessage: "Kode pos harus 5 digit angka",
        },
        order: 4,
      },
    ],
  },

  // ──────────────────────────────────────────
  // CUSTOMER MODULE
  // ──────────────────────────────────────────
  customer: {
    label: "Customer",
    description: "Data pelanggan bisnis",
    icon: "Users",
    fields: [
      {
        name: "name",
        type: FieldType.TEXT,
        label: "Nama Customer",
        required: true,
        isSearchable: true,
        order: 1,
      },
      {
        name: "email",
        type: FieldType.EMAIL,
        label: "Email",
        required: true,
        unique: true,
        isSearchable: true,
        order: 2,
      },
      {
        name: "phone",
        type: FieldType.PHONE,
        label: "Nomor Telepon",
        required: false,
        order: 3,
      },
      {
        name: "company",
        type: FieldType.TEXT,
        label: "Perusahaan",
        required: false,
        isSearchable: true,
        order: 4,
      },
      {
        name: "status",
        type: FieldType.SELECT,
        label: "Status",
        required: true,
        defaultValue: "active",
        options: [
          { label: "Aktif", value: "active" },
          { label: "Tidak Aktif", value: "inactive" },
          { label: "Prospek", value: "prospect" },
        ],
        order: 5,
      },
      {
        name: "notes",
        type: FieldType.TEXTAREA,
        label: "Catatan",
        required: false,
        order: 6,
      },
    ],
  },

  // ──────────────────────────────────────────
  // EMPLOYEE MODULE
  // ──────────────────────────────────────────
  employee: {
    label: "Karyawan",
    description: "Data karyawan dan tim",
    icon: "UserCheck",
    fields: [
      {
        name: "employeeId",
        type: FieldType.TEXT,
        label: "ID Karyawan",
        required: true,
        unique: true,
        isSearchable: true,
        order: 1,
      },
      {
        name: "name",
        type: FieldType.TEXT,
        label: "Nama Lengkap",
        required: true,
        isSearchable: true,
        order: 2,
      },
      {
        name: "email",
        type: FieldType.EMAIL,
        label: "Email",
        required: true,
        unique: true,
        order: 3,
      },
      {
        name: "department",
        type: FieldType.SELECT,
        label: "Departemen",
        required: true,
        options: [
          { label: "Engineering", value: "engineering" },
          { label: "Marketing", value: "marketing" },
          { label: "Finance", value: "finance" },
          { label: "HR", value: "hr" },
          { label: "Operations", value: "operations" },
        ],
        order: 4,
      },
      {
        name: "position",
        type: FieldType.TEXT,
        label: "Jabatan",
        required: true,
        order: 5,
      },
      {
        name: "joinDate",
        type: FieldType.DATE,
        label: "Tanggal Bergabung",
        required: true,
        order: 6,
      },
      {
        name: "salary",
        type: FieldType.NUMBER,
        label: "Gaji",
        required: false,
        order: 7,
      },
      {
        name: "isActive",
        type: FieldType.BOOLEAN,
        label: "Aktif",
        required: false,
        defaultValue: "true",
        order: 8,
      },
    ],
  },

  // ──────────────────────────────────────────
  // PRODUCT MODULE
  // ──────────────────────────────────────────
  product: {
    label: "Produk",
    description: "Katalog produk atau layanan",
    icon: "Package",
    fields: [
      {
        name: "sku",
        type: FieldType.TEXT,
        label: "SKU",
        required: true,
        unique: true,
        isSearchable: true,
        order: 1,
      },
      {
        name: "name",
        type: FieldType.TEXT,
        label: "Nama Produk",
        required: true,
        isSearchable: true,
        order: 2,
      },
      {
        name: "description",
        type: FieldType.TEXTAREA,
        label: "Deskripsi",
        required: false,
        order: 3,
      },
      {
        name: "price",
        type: FieldType.NUMBER,
        label: "Harga",
        required: true,
        validation: { min: 0 },
        order: 4,
      },
      {
        name: "stock",
        type: FieldType.NUMBER,
        label: "Stok",
        required: true,
        defaultValue: "0",
        validation: { min: 0 },
        order: 5,
      },
      {
        name: "category",
        type: FieldType.SELECT,
        label: "Kategori",
        required: true,
        options: [
          { label: "Produk Fisik", value: "physical" },
          { label: "Produk Digital", value: "digital" },
          { label: "Layanan", value: "service" },
        ],
        order: 6,
      },
      {
        name: "isActive",
        type: FieldType.BOOLEAN,
        label: "Aktif",
        required: false,
        defaultValue: "true",
        order: 7,
      },
    ],
  },

  // ──────────────────────────────────────────
  // VENDOR MODULE (example of adding new module)
  // ──────────────────────────────────────────
  vendor: {
    label: "Vendor",
    description: "Data vendor dan supplier",
    icon: "Building2",
    fields: [
      {
        name: "name",
        type: FieldType.TEXT,
        label: "Nama Vendor",
        required: true,
        isSearchable: true,
        order: 1,
      },
      {
        name: "contactPerson",
        type: FieldType.TEXT,
        label: "Kontak Person",
        required: true,
        order: 2,
      },
      {
        name: "email",
        type: FieldType.EMAIL,
        label: "Email",
        required: true,
        order: 3,
      },
      {
        name: "phone",
        type: FieldType.PHONE,
        label: "Telepon",
        required: true,
        order: 4,
      },
      {
        name: "category",
        type: FieldType.SELECT,
        label: "Kategori",
        required: true,
        options: [
          { label: "Supplier", value: "supplier" },
          { label: "Distributor", value: "distributor" },
          { label: "Mitra", value: "partner" },
        ],
        order: 5,
      },
      {
        name: "taxId",
        type: FieldType.TEXT,
        label: "NPWP",
        required: false,
        order: 6,
      },
    ],
  },
};

// ============================================================
// PORTFOLIO CONFIG
// ============================================================
export const portfolioConfig = {
  seo: {
    defaultTitle: "Portfolio | Full Stack Developer",
    titleTemplate: "%s | Portfolio",
    description: "Professional portfolio showcasing projects, skills, and experience",
    keywords: ["portfolio", "developer", "fullstack", "nextjs", "typescript"],
    ogImage: "/og-image.jpg",
  },
  features: {
    blog: true,
    darkMode: true,
    analytics: false,
    contactForm: true,
  },
  navigation: [
    { label: "Beranda", href: "/" },
    { label: "Proyek", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/contact" },
  ],
};

// ============================================================
// APP CONFIG
// ============================================================
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? "Portfolio & Business Suite",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION ?? "Modern Portfolio & Business Management Platform",
  admin: {
    prefix: "/admin",
    defaultRedirect: "/admin/dashboard",
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },
};
