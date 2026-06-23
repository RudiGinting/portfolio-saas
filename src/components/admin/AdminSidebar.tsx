// src/components/admin/AdminSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IModule } from "@/models";
import { useUIStore } from "@/store";
import {
  LayoutDashboard, Database, Settings, FolderOpen,
  FileText, MessageSquare, User, ChevronLeft, ChevronRight,
  Boxes, Package, Users, UserCheck, MapPin, Building2,
  ShoppingBag, DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icon map for dynamic modules
const ICON_MAP: Record<string, React.ElementType> = {
  Package, Users, UserCheck, MapPin, Building2,
  ShoppingBag, Database, DollarSign, Boxes, FileText,
};

const staticNavItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Proyek", href: "/admin/projects", icon: FolderOpen },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Pesan", href: "/admin/messages", icon: MessageSquare },
  { label: "Profile", href: "/admin/profile", icon: User },
];

const systemNavItems = [
  { label: "Master Data", href: "/admin/master-data", icon: Database },
  { label: "Pengaturan", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [modules, setModules] = useState<IModule[]>([]);

  useEffect(() => {
    fetch("/api/modules")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setModules(json.data);
      })
      .catch(console.error);
  }, []);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full border-r bg-card transition-all duration-300",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 px-4 border-b gap-3 shrink-0",
        !sidebarOpen && "justify-center"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Boxes className="h-4 w-4 text-primary-foreground" />
        </div>
        {sidebarOpen && (
          <div>
            <p className="font-bold text-sm leading-tight">Portfolio Suite</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={toggleSidebar}
      >
        {sidebarOpen
          ? <ChevronLeft className="h-3 w-3" />
          : <ChevronRight className="h-3 w-3" />
        }
      </Button>

      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {/* Static navigation */}
          {staticNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              collapsed={!sidebarOpen}
            />
          ))}

          {/* Dynamic module navigation */}
          {modules.length > 0 && (
            <>
              <div className="py-2">
                <Separator />
                {sidebarOpen && (
                  <p className="text-xs text-muted-foreground px-3 py-2 uppercase tracking-wider font-medium">
                    Modul Data
                  </p>
                )}
              </div>
              {modules.map((module) => {
                const Icon = ICON_MAP[module.icon ?? ""] ?? Database;
                return (
                  <NavItem
                    key={module.id}
                    item={{
                      label: module.label,
                      href: `/admin/modules/${module.name}`,
                      icon: Icon,
                    }}
                    isActive={pathname === `/admin/modules/${module.name}`}
                    collapsed={!sidebarOpen}
                    badge={module._count?.records}
                  />
                );
              })}
            </>
          )}

          {/* System navigation */}
          <div className="py-2">
            <Separator />
            {sidebarOpen && (
              <p className="text-xs text-muted-foreground px-3 py-2 uppercase tracking-wider font-medium">
                Sistem
              </p>
            )}
          </div>
          {systemNavItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              collapsed={!sidebarOpen}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

interface NavItemProps {
  item: { label: string; href: string; icon: React.ElementType };
  isActive: boolean;
  collapsed: boolean;
  badge?: number;
}

function NavItem({ item, isActive, collapsed, badge }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-primary/10 text-primary hover:bg-primary/15"
          : "text-muted-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {badge !== undefined && badge > 0 && (
            <Badge variant="secondary" className="text-xs h-5 min-w-5 px-1.5">
              {badge > 99 ? "99+" : badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
}
