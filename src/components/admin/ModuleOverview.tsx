import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Props {
  modules: Array<{ id: string; label: string; _count: { records: number } }>;
}

export function ModuleOverview({ modules }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Overview Modul
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {modules.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">Belum ada modul.</p>
          ) : (
            modules.map((module) => {
              const max = Math.max(...modules.map((m) => m._count.records), 1);
              const pct = (module._count.records / max) * 100;
              return (
                <div key={module.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{module.label}</span>
                    <span className="text-muted-foreground tabular-nums">{module._count.records} data</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary/70 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
