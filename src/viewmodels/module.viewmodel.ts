// src/viewmodels/module.viewmodel.ts
// ============================================================
// VIEWMODEL LAYER - Business logic for Dynamic Module CRUD
// The VM in MVVM: bridges Model ↔ View
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IModule, IModuleField, IModuleRecord, ApiResponse, PaginatedResponse } from "@/models";
import { buildZodSchema, buildDefaultValues } from "@/lib/dynamic-validation";
import { useModuleStore } from "@/store";

// ────────────────────────────────────────────────────────────
// List ViewModel: fetches + manages record list state
// ────────────────────────────────────────────────────────────
export function useModuleListViewModel(moduleId: string) {
  const {
    records,
    totalRecords,
    currentPage,
    pageSize,
    searchQuery,
    selectedRecords,
    setRecords,
    setPage,
    setPageSize,
    setSearch,
    toggleSelectRecord,
    selectAllRecords,
    clearSelection,
    removeRecord,
  } = useModuleStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(pageSize),
        ...(searchQuery && { search: searchQuery }),
      });

      const res = await fetch(`/api/modules/${moduleId}/records?${params}`);
      const json: ApiResponse<PaginatedResponse<IModuleRecord>> = await res.json();

      if (!json.success || !json.data) throw new Error(json.error ?? "Gagal memuat data");
      setRecords(json.data.data, json.data.total);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal memuat data";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [moduleId, currentPage, pageSize, searchQuery, setRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const deleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}/records/${id}`, { method: "DELETE" });
      const json: ApiResponse = await res.json();
      if (!json.success) throw new Error(json.error ?? "Gagal menghapus data");
      removeRecord(id);
      toast.success("Data berhasil dihapus");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus data";
      toast.error(msg);
    }
  };

  const deleteBulk = async () => {
    if (selectedRecords.length === 0) return;
    try {
      const res = await fetch(`/api/modules/${moduleId}/records/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedRecords }),
      });
      const json: ApiResponse = await res.json();
      if (!json.success) throw new Error(json.error ?? "Gagal menghapus data");
      selectedRecords.forEach(removeRecord);
      clearSelection();
      toast.success(`${selectedRecords.length} data berhasil dihapus`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus data";
      toast.error(msg);
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    records,
    totalRecords,
    currentPage,
    pageSize,
    totalPages,
    searchQuery,
    selectedRecords,
    isLoading,
    error,
    setPage,
    setPageSize,
    setSearch,
    toggleSelectRecord,
    selectAllRecords,
    clearSelection,
    deleteRecord,
    deleteBulk,
    refresh: fetchRecords,
  };
}

// ────────────────────────────────────────────────────────────
// Form ViewModel: dynamic form with auto-validation
// ────────────────────────────────────────────────────────────
export function useModuleFormViewModel(
  moduleId: string,
  fields: IModuleField[],
  options?: {
    recordId?: string;
    initialData?: Record<string, unknown>;
    onSuccess?: (record: IModuleRecord) => void;
  }
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schema = buildZodSchema(fields);
  const defaultValues = buildDefaultValues(fields, options?.initialData);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    try {
      const url = options?.recordId
        ? `/api/modules/${moduleId}/records/${options.recordId}`
        : `/api/modules/${moduleId}/records`;

      const method = options?.recordId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json: ApiResponse<IModuleRecord> = await res.json();
      if (!json.success || !json.data) throw new Error(json.error ?? "Gagal menyimpan data");

      toast.success(options?.recordId ? "Data berhasil diperbarui" : "Data berhasil disimpan");
      options?.onSuccess?.(json.data);

      if (!options?.recordId) form.reset(defaultValues);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

// ────────────────────────────────────────────────────────────
// Module management ViewModel
// ────────────────────────────────────────────────────────────
export function useModuleManagementViewModel() {
  const { modules, setModules } = useModuleStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/modules");
      const json: ApiResponse<IModule[]> = await res.json();
      if (json.success && json.data) setModules(json.data);
    } catch {
      toast.error("Gagal memuat modul");
    } finally {
      setIsLoading(false);
    }
  }, [setModules]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const createModule = async (data: {
    name: string;
    label: string;
    description?: string;
    icon?: string;
  }) => {
    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: ApiResponse<IModule> = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchModules();
      toast.success("Modul berhasil dibuat");
      return json.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal membuat modul";
      toast.error(msg);
      return null;
    }
  };

  const deleteModule = async (id: string) => {
    try {
      const res = await fetch(`/api/modules/${id}`, { method: "DELETE" });
      const json: ApiResponse = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchModules();
      toast.success("Modul berhasil dihapus");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus modul";
      toast.error(msg);
    }
  };

  const addField = async (moduleId: string, fieldData: Partial<IModuleField>) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldData),
      });
      const json: ApiResponse<IModuleField> = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchModules();
      toast.success("Field berhasil ditambahkan");
      return json.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan field";
      toast.error(msg);
      return null;
    }
  };

  const deleteField = async (moduleId: string, fieldId: string) => {
    try {
      const res = await fetch(`/api/modules/${moduleId}/fields/${fieldId}`, { method: "DELETE" });
      const json: ApiResponse = await res.json();
      if (!json.success) throw new Error(json.error);
      await fetchModules();
      toast.success("Field berhasil dihapus");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus field";
      toast.error(msg);
    }
  };

  return {
    modules,
    isLoading,
    createModule,
    deleteModule,
    addField,
    deleteField,
    refresh: fetchModules,
  };
}
