// src/components/admin/DashboardStats.tsx
"use client";

import { 
  Briefcase, FileText, MessageSquare, 
  Database, TrendingUp, Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: {
    totalProjects: number;
    totalBlogPosts: number;
    totalMessages: number;
    unreadMessages: number;
    totalModules: number;
  };
}

export function DashboardStats({ stats }: StatsProps) {
  const cards = [
    {
      title: "Total Proyek",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Proyek dipublish",
    },
    {
      title: "Artikel Blog",
      value: stats.totalBlogPosts,
      icon: FileText,
      color: "text-green-500",
      bg: "bg-green-500/10",
      description: "Artikel aktif",
    },
    {
      title: "Pesan Masuk",
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: stats.unreadMessages > 0 ? `${stats.unreadMessages} belum dibaca` : "Semua dibaca",
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : undefined,
    },
    {
      title: "Total Modul",
      value: stats.totalModules,
      icon: Database,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "Modul aktif",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <Icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{card.value}</span>
                {card.badge !== undefined && (
                  <Badge variant="destructive" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    {card.badge}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface ModuleOverviewProps {
  modules: Array<{
    id: string;
    label: string;
    icon?: string | null;
    _count: { records: number };
  }>;
}

export function ModuleOverview({ modules }: ModuleOverviewProps) {
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
            <p className="text-muted-foreground text-sm py-4 text-center">
              Belum ada modul. Buat modul pertama Anda.
            </p>
          ) : (
            modules.map((module) => {
              const max = Math.max(...modules.map((m) => m._count.records), 1);
              const percentage = (module._count.records / max) * 100;
              return (
                <div key={module.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{module.label}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {module._count.records} data
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
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
