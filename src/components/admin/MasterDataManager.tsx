"use client";
import { useState } from "react";
import { IModule, IModuleField, FieldType } from "@/models";
import { useModuleManagementViewModel } from "@/viewmodels/module.viewmodel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Settings2, Database } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
  modules: (IModule & { fields: IModuleField[]; _count: { records: number } })[];
}

export function MasterDataManager({ modules: initialModules }: Props) {
  const vm = useModuleManagementViewModel();
  const allModules = vm.modules.length > 0 ? vm.modules : initialModules;
  const [selectedModule, setSelectedModule] = useState<IModule & { fields: IModuleField[] } | null>(null);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [newModule, setNewModule] = useState({ name: "", label: "", description: "", icon: "" });
  const [newField, setNewField] = useState({ name: "", label: "", type: FieldType.TEXT, required: false });

  const handleAddModule = async () => {
    if (!newModule.name || !newModule.label) { toast.error("Nama dan label wajib diisi"); return; }
    await vm.createModule(newModule);
    setNewModule({ name: "", label: "", description: "", icon: "" });
    setShowAddModule(false);
  };

  const handleAddField = async () => {
    if (!selectedModule || !newField.name || !newField.label) { toast.error("Lengkapi data field"); return; }
    await vm.addField(selectedModule.id, newField);
    setNewField({ name: "", label: "", type: FieldType.TEXT, required: false });
    setShowAddField(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{allModules.length} modul terdaftar</p>
        <Button onClick={() => setShowAddModule(true)}><Plus className="mr-2 h-4 w-4" />Tambah Modul</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allModules.map((module) => (
          <Card key={module.id} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />{module.label}
                </CardTitle>
                <Badge variant="secondary">{(module as any)._count?.records ?? 0} data</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{module.fields?.length ?? 0} field</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelectedModule(module as any); setShowAddField(true); }}>
                  <Settings2 className="h-3 w-3 mr-1" />Kelola Field
                </Button>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={`/admin/modules/${module.name}`}>Lihat Data</Link>
                </Button>
                {!module.isSystem && (
                  <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => vm.deleteModule(module.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Module Dialog */}
      <Dialog open={showAddModule} onOpenChange={setShowAddModule}>
        <DialogContent>
          <DialogHeader><DialogTitle>Tambah Modul Baru</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Nama (key)</Label><Input placeholder="vendor" value={newModule.name} onChange={(e) => setNewModule({ ...newModule, name: e.target.value })} /></div>
            <div><Label>Label</Label><Input placeholder="Vendor" value={newModule.label} onChange={(e) => setNewModule({ ...newModule, label: e.target.value })} /></div>
            <div><Label>Deskripsi</Label><Input placeholder="Deskripsi modul" value={newModule.description} onChange={(e) => setNewModule({ ...newModule, description: e.target.value })} /></div>
            <div><Label>Icon (Lucide name)</Label><Input placeholder="Building2" value={newModule.icon} onChange={(e) => setNewModule({ ...newModule, icon: e.target.value })} /></div>
            <div className="flex gap-2 pt-2"><Button onClick={handleAddModule} className="flex-1">Buat Modul</Button><Button variant="outline" onClick={() => setShowAddModule(false)}>Batal</Button></div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Field Dialog */}
      <Dialog open={showAddField} onOpenChange={setShowAddField}>
        <DialogContent>
          <DialogHeader><DialogTitle>Kelola Field – {selectedModule?.label}</DialogTitle></DialogHeader>
          {selectedModule && (
            <div className="space-y-4">
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {selectedModule.fields?.map((f) => (
                  <div key={f.id} className="flex items-center justify-between px-3 py-2 text-sm">
                    <div><span className="font-medium">{f.label}</span><span className="text-muted-foreground ml-2">({f.name})</span></div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{f.type}</Badge>
                      {!f.isSystem && <button onClick={() => vm.deleteField(selectedModule.id, f.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="h-3 w-3" /></button>}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">Tambah Field Baru</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Nama (key)</Label><Input placeholder="fieldName" value={newField.name} onChange={(e) => setNewField({ ...newField, name: e.target.value })} /></div>
                <div><Label>Label</Label><Input placeholder="Nama Field" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} /></div>
              </div>
              <div><Label>Tipe</Label>
                <Select value={newField.type} onValueChange={(v) => setNewField({ ...newField, type: v as FieldType })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.values(FieldType).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2"><Button onClick={handleAddField} className="flex-1">Tambah Field</Button><Button variant="outline" onClick={() => setShowAddField(false)}>Tutup</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
