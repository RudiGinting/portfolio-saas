// src/store/index.ts
// ============================================================
// ZUSTAND STATE MANAGEMENT
// Global application state
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IModule, IModuleRecord } from "@/models";

// ────────────────────────────────────────────────────────────
// UI Store
// ────────────────────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

// ────────────────────────────────────────────────────────────
// Module Store (Dynamic CRUD)
// ────────────────────────────────────────────────────────────
interface ModuleState {
  modules: IModule[];
  activeModule: IModule | null;
  records: IModuleRecord[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  selectedRecords: string[];

  setModules: (modules: IModule[]) => void;
  setActiveModule: (module: IModule | null) => void;
  setRecords: (records: IModuleRecord[], total: number) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearch: (query: string) => void;
  toggleSelectRecord: (id: string) => void;
  selectAllRecords: () => void;
  clearSelection: () => void;
  addRecord: (record: IModuleRecord) => void;
  updateRecord: (id: string, data: Partial<IModuleRecord>) => void;
  removeRecord: (id: string) => void;
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  modules: [],
  activeModule: null,
  records: [],
  totalRecords: 0,
  currentPage: 1,
  pageSize: 10,
  searchQuery: "",
  selectedRecords: [],

  setModules: (modules) => set({ modules }),
  setActiveModule: (module) => set({ activeModule: module, currentPage: 1, searchQuery: "" }),
  setRecords: (records, total) => set({ records, totalRecords: total }),
  setPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  setSearch: (query) => set({ searchQuery: query, currentPage: 1 }),

  toggleSelectRecord: (id) =>
    set((state) => ({
      selectedRecords: state.selectedRecords.includes(id)
        ? state.selectedRecords.filter((r) => r !== id)
        : [...state.selectedRecords, id],
    })),

  selectAllRecords: () =>
    set((state) => ({
      selectedRecords: state.records.map((r) => r.id),
    })),

  clearSelection: () => set({ selectedRecords: [] }),

  addRecord: (record) =>
    set((state) => ({
      records: [record, ...state.records],
      totalRecords: state.totalRecords + 1,
    })),

  updateRecord: (id, data) =>
    set((state) => ({
      records: state.records.map((r) => (r.id === id ? { ...r, ...data } : r)),
    })),

  removeRecord: (id) =>
    set((state) => ({
      records: state.records.filter((r) => r.id !== id),
      totalRecords: state.totalRecords - 1,
      selectedRecords: state.selectedRecords.filter((r) => r !== id),
    })),
}));

// ────────────────────────────────────────────────────────────
// App Preferences Store (persisted)
// ────────────────────────────────────────────────────────────
interface PreferencesState {
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      language: "id",
      setLanguage: (language) => set({ language }),
      compactMode: false,
      setCompactMode: (compactMode) => set({ compactMode }),
    }),
    { name: "app-preferences" }
  )
);
