// src/components/admin/DynamicModulePage.tsx
// ============================================================
// DYNAMIC MODULE PAGE - View Layer
// Orchestrates DynamicForm + DynamicTable for any module
// ============================================================

"use client";

import { useState } from "react";
import { IModule, IModuleField, IModuleRecord } from "@/models";
import { DynamicForm } from "./DynamicForm";
import { DynamicTable } from "./DynamicTable";
import { useModuleListViewModel, useModuleFormViewModel } from "@/viewmodels/module.viewmodel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface DynamicModulePageProps {
  module: IModule & { fields: IModuleField[] };
}

export function DynamicModulePage({ module }: DynamicModulePageProps) {
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState<IModuleRecord | null>(null);

  const listVM = useModuleListViewModel(module.id);

  const formVM = useModuleFormViewModel(module.id, module.fields, {
    recordId: editRecord?.id,
    initialData: editRecord?.data as Record<string, unknown> | undefined,
    onSuccess: () => {
      setShowForm(false);
      setEditRecord(null);
      listVM.refresh();
    },
  });

  const handleEdit = (record: IModuleRecord) => {
    setEditRecord(record);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditRecord(null);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditRecord(null);
    formVM.form.reset();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{module.label}</h1>
          {module.description && (
            <p className="text-muted-foreground mt-1">{module.description}</p>
          )}
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah {module.label}
        </Button>
      </div>

      {/* Data table */}
      <DynamicTable
        fields={module.fields}
        records={listVM.records}
        totalRecords={listVM.totalRecords}
        currentPage={listVM.currentPage}
        pageSize={listVM.pageSize}
        totalPages={listVM.totalPages}
        searchQuery={listVM.searchQuery}
        selectedRecords={listVM.selectedRecords}
        isLoading={listVM.isLoading}
        onPageChange={listVM.setPage}
        onPageSizeChange={listVM.setPageSize}
        onSearch={listVM.setSearch}
        onSelectRecord={listVM.toggleSelectRecord}
        onSelectAll={listVM.selectAllRecords}
        onClearSelection={listVM.clearSelection}
        onEdit={handleEdit}
        onDelete={listVM.deleteRecord}
        onDeleteBulk={listVM.deleteBulk}
        onRefresh={listVM.refresh}
      />

      {/* Create / Edit dialog */}
      <Dialog open={showForm} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editRecord ? `Edit ${module.label}` : `Tambah ${module.label}`}
            </DialogTitle>
          </DialogHeader>
          <DynamicForm
            form={formVM.form}
            fields={module.fields}
            onSubmit={formVM.onSubmit}
            isSubmitting={formVM.isSubmitting}
            submitLabel={editRecord ? "Perbarui" : "Simpan"}
            onCancel={handleClose}
            columns={2}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
