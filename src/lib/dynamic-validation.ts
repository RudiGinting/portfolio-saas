// src/lib/dynamic-validation.ts
// ============================================================
// DYNAMIC VALIDATION BUILDER
// Auto-generates Zod schemas from field configs / module fields
// Part of ViewModel layer
// ============================================================

import { z } from "zod";
import { FieldType, IModuleField, IValidationRule } from "@/models";

// ────────────────────────────────────────────────────────────
// Build a single Zod field schema from a field definition
// ────────────────────────────────────────────────────────────
function buildFieldSchema(field: IModuleField): z.ZodTypeAny {
  const validation: IValidationRule = (field.validation as IValidationRule) ?? {};

  let schema: z.ZodTypeAny;

  switch (field.type) {
    case FieldType.EMAIL:
      schema = z.string().email("Format email tidak valid");
      break;

    case FieldType.URL:
      schema = z.string().url("Format URL tidak valid");
      break;

    case FieldType.NUMBER:
      schema = z.coerce.number({
        invalid_type_error: `${field.label} harus berupa angka`,
      });
      if (validation.min !== undefined) {
        schema = (schema as z.ZodNumber).min(
          validation.min,
          `${field.label} minimal ${validation.min}`
        );
      }
      if (validation.max !== undefined) {
        schema = (schema as z.ZodNumber).max(
          validation.max,
          `${field.label} maksimal ${validation.max}`
        );
      }
      break;

    case FieldType.BOOLEAN:
    case FieldType.CHECKBOX:
      schema = z.boolean();
      break;

    case FieldType.DATE:
    case FieldType.DATETIME:
      schema = z.coerce.date({
        errorMap: () => ({ message: `${field.label} harus berupa tanggal valid` }),
      });
      break;

    case FieldType.MULTISELECT:
      schema = z.array(z.string());
      break;

    case FieldType.PHONE:
      schema = z
        .string()
        .regex(
          /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
          "Format nomor telepon tidak valid (contoh: 081234567890)"
        );
      break;

    case FieldType.JSON:
      schema = z.string().refine(
        (val) => {
          try {
            JSON.parse(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "Format JSON tidak valid" }
      );
      break;

    case FieldType.SELECT:
    case FieldType.RADIO:
      if (field.options && field.options.length > 0) {
        const values = field.options.map((o) => o.value) as [string, ...string[]];
        schema = z.enum(values, {
          errorMap: () => ({ message: `${field.label} harus dipilih` }),
        });
      } else {
        schema = z.string();
      }
      break;

    case FieldType.TEXT:
    case FieldType.TEXTAREA:
    case FieldType.RICH_TEXT:
    case FieldType.FILE:
    case FieldType.IMAGE:
    default:
      schema = z.string();
      if (validation.minLength !== undefined) {
        schema = (schema as z.ZodString).min(
          validation.minLength,
          `${field.label} minimal ${validation.minLength} karakter`
        );
      }
      if (validation.maxLength !== undefined) {
        schema = (schema as z.ZodString).max(
          validation.maxLength,
          `${field.label} maksimal ${validation.maxLength} karakter`
        );
      }
      if (validation.pattern) {
        schema = (schema as z.ZodString).regex(
          new RegExp(validation.pattern),
          validation.patternMessage ?? `${field.label} format tidak valid`
        );
      }
      break;
  }

  // Handle required / optional
  if (!field.required) {
    if (field.type === FieldType.BOOLEAN || field.type === FieldType.CHECKBOX) {
      schema = schema.optional();
    } else if (field.type === FieldType.NUMBER) {
      schema = schema.optional();
    } else if (
      field.type === FieldType.DATE ||
      field.type === FieldType.DATETIME
    ) {
      schema = schema.optional().nullable();
    } else if (field.type === FieldType.MULTISELECT) {
      schema = schema.optional().default([]);
    } else {
      // string-based: allow empty string → treat as optional
      schema = z.union([z.literal(""), schema]).optional();
    }
  } else if (
    field.type === FieldType.TEXT ||
    field.type === FieldType.TEXTAREA ||
    field.type === FieldType.RICH_TEXT
  ) {
    schema = (schema as z.ZodString).min(1, `${field.label} wajib diisi`);
  }

  return schema;
}

// ────────────────────────────────────────────────────────────
// Build a complete Zod object schema from an array of fields
// ────────────────────────────────────────────────────────────
export function buildZodSchema(fields: IModuleField[]): z.ZodObject<z.ZodRawShape> {
  const shape: z.ZodRawShape = {};

  for (const field of fields) {
    if (field.isSystem) continue; // skip system fields
    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

// ────────────────────────────────────────────────────────────
// Type inference helper
// ────────────────────────────────────────────────────────────
export type InferredFormValues<T extends z.ZodObject<z.ZodRawShape>> = z.infer<T>;

// ────────────────────────────────────────────────────────────
// Build default values for a form from fields
// ────────────────────────────────────────────────────────────
export function buildDefaultValues(
  fields: IModuleField[],
  existing?: Record<string, unknown>
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.isSystem) continue;

    const existingValue = existing?.[field.name];
    if (existingValue !== undefined) {
      defaults[field.name] = existingValue;
      continue;
    }

    // Use configured default
    if (field.defaultValue !== undefined) {
      switch (field.type) {
        case FieldType.BOOLEAN:
        case FieldType.CHECKBOX:
          defaults[field.name] = field.defaultValue === "true";
          break;
        case FieldType.NUMBER:
          defaults[field.name] = Number(field.defaultValue);
          break;
        default:
          defaults[field.name] = field.defaultValue;
      }
      continue;
    }

    // Type-based defaults
    switch (field.type) {
      case FieldType.BOOLEAN:
      case FieldType.CHECKBOX:
        defaults[field.name] = false;
        break;
      case FieldType.NUMBER:
        defaults[field.name] = field.required ? 0 : undefined;
        break;
      case FieldType.MULTISELECT:
        defaults[field.name] = [];
        break;
      case FieldType.DATE:
      case FieldType.DATETIME:
        defaults[field.name] = null;
        break;
      default:
        defaults[field.name] = "";
    }
  }

  return defaults;
}

// ────────────────────────────────────────────────────────────
// Pre-built common schemas for portfolio forms
// ────────────────────────────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(20, "Pesan minimal 20 karakter").max(1000, "Pesan maksimal 1000 karakter"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const projectFormSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda -"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  content: z.string().optional(),
  coverImage: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
  demoUrl: z.string().url("URL demo tidak valid").optional().or(z.literal("")),
  githubUrl: z.string().url("URL GitHub tidak valid").optional().or(z.literal("")),
  techStack: z.array(z.string()).min(1, "Minimal 1 teknologi"),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const moduleFieldSchema = z.object({
  name: z
    .string()
    .min(1, "Nama field wajib diisi")
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "Nama field hanya boleh huruf, angka, dan underscore"),
  label: z.string().min(1, "Label wajib diisi"),
  type: z.nativeEnum(FieldType),
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  defaultValue: z.string().optional(),
  placeholder: z.string().optional(),
  isSearchable: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export type ModuleFieldFormValues = z.infer<typeof moduleFieldSchema>;
