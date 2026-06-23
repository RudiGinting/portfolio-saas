// src/app/(portfolio)/page.tsx
// ============================================================
// PORTFOLIO HOME PAGE - View Layer
// Sections: Hero, About, Skills, Experience, Education, 
//           Certificates, Projects, Contact
// ============================================================

import { HeroSection } from "@/components/portfolio/HeroSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { EducationSection } from "@/components/portfolio/EducationSection";
import { CertificatesSection } from "@/components/portfolio/CertificatesSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { PortfolioNav } from "@/components/portfolio/PortfolioNav";
import prisma from "@/lib/prisma";

async function getPortfolioData() {
  const profile = await prisma.profile.findFirst({
    where: { isActive: true },
    include: {
      skills: { orderBy: { order: "asc" } },
      experiences: { orderBy: { order: "asc" } },
      educations: { orderBy: { order: "asc" } },
      certificates: { orderBy: { order: "asc" } },
    },
  });

  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });

  return { profile, projects };
}

export default async function PortfolioHomePage() {
  const { profile, projects } = await getPortfolioData();

  // Seed data if no profile exists
  if (!profile) {
    return <EmptyPortfolio />;
  }

  // Group skills by category
  const skillsByCategory = profile.skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof profile.skills>
  );

  return (
    <>
      <PortfolioNav profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skillsByCategory={skillsByCategory} />
        <ExperienceSection experiences={profile.experiences} />
        <EducationSection educations={profile.educations} />
        <CertificatesSection certificates={profile.certificates} />
        <ProjectsSection projects={projects} />
        <ContactSection email={profile.email} />
      </main>
    </>
  );
}

function EmptyPortfolio() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-3xl font-bold mb-4">Portfolio Belum Dikonfigurasi</h1>
        <p className="text-muted-foreground mb-8">
          Masuk ke panel admin untuk mengisi data portfolio Anda.
        </p>
        <a
          href="/admin/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Buka Admin Panel
        </a>
      </div>
    </div>
  );
}
