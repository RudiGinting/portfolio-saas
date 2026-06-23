"use client";
import { useUIStore } from "@/store";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { Bell, Menu } from "lucide-react";
import Link from "next/link";

export function AdminHeader() {
  const { toggleSidebar } = useUIStore();
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b bg-card shrink-0">
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/messages">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>
        <ModeToggle />
        <Button variant="outline" size="sm" asChild>
          <Link href="/" target="_blank">Lihat Portfolio</Link>
        </Button>
      </div>
    </header>
  );
}
