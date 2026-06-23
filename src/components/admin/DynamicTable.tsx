// src/components/admin/DynamicTable.tsx
// ============================================================
// DYNAMIC TABLE BUILDER - View Layer
// Auto-generates data table columns from IModuleField[] config
// ============================================================

"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IModuleField, IModuleRecord, FieldType } from "@/models";
import { formatDate, formatCurrency, truncate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DynamicTableProps {
  fields: IModuleField[];
  records: IModuleRecord[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  searchQuery: string;
  selectedRecords: string[];
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSearch: (query: string) => void;
  onSelectRecord: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onEdit?: (record: IModuleRecord) => void;
  onDelete?: (id: string) => void;
  onDeleteBulk?: () => void;
  onRefresh?: () => void;
}

export function DynamicTable({
  fields,
  records,
  totalRecords,
  currentPage,
  pageSize,
  totalPages,
  searchQuery,
  selectedRecords,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSelectRecord,
  onSelectAll,
  onClearSelection,
  onEdit,
  onDelete,
  onDeleteBulk,
  onRefresh,
}: DynamicTableProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const visibleFields = fields
    .filter((f) => f.isVisible && !f.isSystem)
    .sort((a, b) => a.order - b.order)
    .slice(0, 6); // Max 6 columns for readability

  // Build columns dynamically
  const columns: ColumnDef<IModuleRecord>[] = [
    // Selection column
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            records.length > 0 && selectedRecords.length === records.length
          }
          onCheckedChange={(checked) => (checked ? onSelectAll() : onClearSelection())}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRecords.includes(row.original.id)}
          onCheckedChange={() => onSelectRecord(row.original.id)}
          aria-label="Select row"
        />
      ),
      size: 40,
    },

    // Dynamic data columns
    ...visibleFields.map(
      (field): ColumnDef<IModuleRecord> => ({
        id: field.name,
        header: field.label,
        cell: ({ row }) => {
          const value = row.original.data[field.name];
          return <CellRenderer field={field} value={value} />;
        },
      })
    ),

    // Actions column
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(row.original.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 60,
    },
  ];

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari data..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">Cari</Button>
        </form>

        <div className="flex items-center gap-2">
          {selectedRecords.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteBulk}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus ({selectedRecords.length})
            </Button>
          )}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: header.column.getSize() }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-12 text-muted-foreground"
                >
                  Belum ada data. Tambahkan data pertama Anda.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedRecords.includes(row.original.id) && "selected"}
                  className={cn(
                    selectedRecords.includes(row.original.id) && "bg-muted/50"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Menampilkan</span>
          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>dari {totalRecords} data</span>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8"
            onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8"
            onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm px-3">
            Halaman {currentPage} / {totalPages || 1}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8"
            onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8"
            onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages}>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Smart cell renderer based on field type
// ────────────────────────────────────────────────────────────
function CellRenderer({ field, value }: { field: IModuleField; value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  switch (field.type) {
    case FieldType.BOOLEAN:
    case FieldType.CHECKBOX:
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Ya" : "Tidak"}
        </Badge>
      );

    case FieldType.DATE:
    case FieldType.DATETIME:
      return (
        <span className="text-sm whitespace-nowrap">
          {formatDate(value as string)}
        </span>
      );

    case FieldType.NUMBER:
      return <span className="font-mono text-sm">{Number(value).toLocaleString("id-ID")}</span>;

    case FieldType.EMAIL:
      return (
        <a href={`mailto:${value}`} className="text-primary hover:underline text-sm">
          {String(value)}
        </a>
      );

    case FieldType.URL:
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm truncate max-w-[150px] block"
        >
          {String(value)}
        </a>
      );

    case FieldType.SELECT:
    case FieldType.RADIO: {
      const option = field.options?.find((o) => o.value === value);
      return <Badge variant="outline">{option?.label ?? String(value)}</Badge>;
    }

    case FieldType.MULTISELECT: {
      const values = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-1">
          {values.slice(0, 2).map((v) => {
            const option = field.options?.find((o) => o.value === v);
            return (
              <Badge key={v} variant="secondary" className="text-xs">
                {option?.label ?? v}
              </Badge>
            );
          })}
          {values.length > 2 && (
            <Badge variant="secondary" className="text-xs">+{values.length - 2}</Badge>
          )}
        </div>
      );
    }

    case FieldType.TEXTAREA:
    case FieldType.RICH_TEXT:
      return (
        <span className="text-sm text-muted-foreground">
          {truncate(String(value), 60)}
        </span>
      );

    default:
      return <span className="text-sm">{truncate(String(value), 40)}</span>;
  }
}

export default DynamicTable;
