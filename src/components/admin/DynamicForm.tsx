// src/components/admin/DynamicForm.tsx
// ============================================================
// DYNAMIC FORM BUILDER - View Layer
// Auto-generates form fields from IModuleField[] config
// ============================================================

"use client";

import { UseFormReturn } from "react-hook-form";
import { IModuleField, FieldType } from "@/models";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DynamicFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  fields: IModuleField[];
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  columns?: 1 | 2 | 3;
}

export function DynamicForm({
  form,
  fields,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Simpan",
  onCancel,
  columns = 1,
}: DynamicFormProps) {
  const visibleFields = fields
    .filter((f) => f.isVisible && !f.isSystem)
    .sort((a, b) => a.order - b.order);

  const gridClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  }[columns];

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className={cn("grid gap-4", gridClass)}>
          {visibleFields.map((field) => (
            <DynamicField key={field.id} field={field} form={form} />
          ))}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

// ────────────────────────────────────────────────────────────
// Individual field renderer
// ────────────────────────────────────────────────────────────
interface DynamicFieldProps {
  field: IModuleField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

function DynamicField({ field, form }: DynamicFieldProps) {
  const isFullWidth =
    field.type === FieldType.TEXTAREA ||
    field.type === FieldType.RICH_TEXT ||
    field.type === FieldType.JSON;

  return (
    <div className={cn(isFullWidth && "md:col-span-2 lg:col-span-3")}>
      <FormField
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            <FormControl>
              <FieldInput field={field} formField={formField} />
            </FormControl>
            {field.placeholder && !formField.value && (
              <FormDescription>{field.placeholder}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Field input renderer based on type
// ────────────────────────────────────────────────────────────
interface FieldInputProps {
  field: IModuleField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formField: any;
}

function FieldInput({ field, formField }: FieldInputProps) {
  switch (field.type) {
    case FieldType.TEXTAREA:
      return (
        <Textarea
          {...formField}
          placeholder={field.placeholder ?? `Masukkan ${field.label}`}
          rows={4}
        />
      );

    case FieldType.NUMBER:
      return (
        <Input
          {...formField}
          type="number"
          placeholder={field.placeholder ?? `Masukkan ${field.label}`}
          onChange={(e) => formField.onChange(e.target.valueAsNumber)}
        />
      );

    case FieldType.EMAIL:
      return (
        <Input
          {...formField}
          type="email"
          placeholder={field.placeholder ?? `contoh@email.com`}
        />
      );

    case FieldType.URL:
      return (
        <Input
          {...formField}
          type="url"
          placeholder={field.placeholder ?? `https://`}
        />
      );

    case FieldType.PHONE:
      return (
        <Input
          {...formField}
          type="tel"
          placeholder={field.placeholder ?? `08xxxxxxxxxx`}
        />
      );

    case FieldType.DATE:
      return (
        <Input
          {...formField}
          type="date"
          value={
            formField.value instanceof Date
              ? formField.value.toISOString().split("T")[0]
              : formField.value ?? ""
          }
          onChange={(e) => formField.onChange(e.target.valueAsDate)}
        />
      );

    case FieldType.DATETIME:
      return (
        <Input
          {...formField}
          type="datetime-local"
          value={
            formField.value instanceof Date
              ? formField.value.toISOString().slice(0, 16)
              : formField.value ?? ""
          }
          onChange={(e) => formField.onChange(e.target.valueAsDate)}
        />
      );

    case FieldType.BOOLEAN:
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={formField.value ?? false}
            onCheckedChange={formField.onChange}
            id={field.name}
          />
          <Label htmlFor={field.name}>{formField.value ? "Ya" : "Tidak"}</Label>
        </div>
      );

    case FieldType.CHECKBOX:
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={formField.value ?? false}
            onCheckedChange={formField.onChange}
            id={field.name}
          />
          <Label htmlFor={field.name}>{field.label}</Label>
        </div>
      );

    case FieldType.SELECT:
      return (
        <Select value={formField.value ?? ""} onValueChange={formField.onChange}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder ?? `Pilih ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case FieldType.RADIO:
      return (
        <RadioGroup
          value={formField.value ?? ""}
          onValueChange={formField.onChange}
          className="flex flex-col space-y-2"
        >
          {field.options?.map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={`${field.name}-${opt.value}`} />
              <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      );

    case FieldType.MULTISELECT:
      return (
        <div className="space-y-2">
          {field.options?.map((opt) => {
            const selected: string[] = formField.value ?? [];
            const checked = selected.includes(opt.value);
            return (
              <div key={opt.value} className="flex items-center space-x-2">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => {
                    formField.onChange(
                      c
                        ? [...selected, opt.value]
                        : selected.filter((v) => v !== opt.value)
                    );
                  }}
                  id={`${field.name}-${opt.value}`}
                />
                <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
              </div>
            );
          })}
        </div>
      );

    case FieldType.JSON:
      return (
        <Textarea
          {...formField}
          placeholder='{"key": "value"}'
          rows={6}
          className="font-mono text-sm"
        />
      );

    // TEXT, RICH_TEXT, FILE, IMAGE, default
    default:
      return (
        <Input
          {...formField}
          type="text"
          placeholder={field.placeholder ?? `Masukkan ${field.label}`}
        />
      );
  }
}

export default DynamicForm;
