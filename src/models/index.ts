// src/models/index.ts
// ============================================================
// MODEL LAYER - Interfaces, Types, Entities
// This is the M in MVVM
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export enum FieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  EMAIL = "EMAIL",
  NUMBER = "NUMBER",
  PHONE = "PHONE",
  URL = "URL",
  DATE = "DATE",
  DATETIME = "DATETIME",
  BOOLEAN = "BOOLEAN",
  SELECT = "SELECT",
  MULTISELECT = "MULTISELECT",
  RADIO = "RADIO",
  CHECKBOX = "CHECKBOX",
  FILE = "FILE",
  IMAGE = "IMAGE",
  RICH_TEXT = "RICH_TEXT",
  JSON = "JSON",
}

export enum ProjectStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum MessageStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  REPLIED = "REPLIED",
  ARCHIVED = "ARCHIVED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  VIEWER = "VIEWER",
}

// ============================================================
// PORTFOLIO INTERFACES
// ============================================================

export interface IProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  skills?: ISkill[];
  experiences?: IExperience[];
  educations?: IEducation[];
  certificates?: ICertificate[];
}

export interface ISkill {
  id: string;
  profileId: string;
  name: string;
  category: string;
  level: number;
  iconUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExperience {
  id: string;
  profileId: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  location?: string;
  logoUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducation {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: string;
  logoUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICertificate {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  coverImage?: string;
  demoUrl?: string;
  githubUrl?: string;
  techStack: string[];
  featured: boolean;
  status: ProjectStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: PostStatus;
  publishedAt?: Date;
  readTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// DYNAMIC MODULE INTERFACES
// ============================================================

export interface ISelectOption {
  label: string;
  value: string;
}

export interface IValidationRule {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  custom?: string; // Custom Zod schema string
}

export interface IModuleField {
  id: string;
  moduleId: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  unique: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: ISelectOption[];
  validation?: IValidationRule;
  order: number;
  isSystem: boolean;
  isVisible: boolean;
  isSearchable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModule {
  id: string;
  name: string;
  label: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  isSystem: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  fields?: IModuleField[];
  _count?: {
    records: number;
  };
}

export interface IModuleRecord {
  id: string;
  moduleId: string;
  data: Record<string, unknown>;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog {
  id: string;
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// ============================================================
// CONFIG TYPES
// ============================================================

export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: ISelectOption[];
  validation?: IValidationRule;
  order?: number;
  isSearchable?: boolean;
}

export interface ModuleConfig {
  label: string;
  description?: string;
  icon?: string;
  fields: FieldConfig[];
}

export interface MasterDataConfig {
  [key: string]: ModuleConfig;
}
