// src/app/admin/dashboard/page.tsx
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { DashboardStats } from "@/components/admin/DashboardStats";
import { RecentActivity } from "@/components/admin/RecentActivity";
import { ModuleOverview } from "@/components/admin/ModuleOverview";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getDashboardData() {
  const [
    totalProjects,
    totalBlogPosts,
    totalMessages,
    unreadMessages,
    totalModules,
    recentActivity,
    moduleStats,
  ] = await Promise.all([
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.module.count({ where: { isActive: true } }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.module.findMany({
      where: { isActive: true },
      include: { _count: { select: { records: true } } },
      orderBy: { order: "asc" },
      take: 8,
    }),
  ]);

  return {
    stats: {
      totalProjects,
      totalBlogPosts,
      totalMessages,
      unreadMessages,
      totalModules,
    },
    recentActivity,
    moduleStats,
  };
}

export default async function DashboardPage() {
  const { stats, recentActivity, moduleStats } = await getDashboardData();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas dan statistik aplikasi</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ModuleOverview modules={moduleStats} />
        </div>
        <div>
          <RecentActivity logs={recentActivity} />
        </div>
      </div>
    </div>
  );
}
