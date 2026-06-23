import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.profile.upsert({
    where: { email: "developer@example.com" },
    update: {},
    create: {
      name: "Budi Santoso",
      title: "Full Stack Developer",
      bio: "Passionate Full Stack Developer dengan 5+ tahun pengalaman membangun aplikasi web modern. Spesialisasi dalam React, Next.js, dan Node.js.",
      email: "developer@example.com",
      phone: "+62 812-3456-7890",
      location: "Jakarta, Indonesia",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      skills: {
        create: [
          { name: "React / Next.js", category: "Frontend", level: 92, order: 1 },
          { name: "TypeScript", category: "Frontend", level: 88, order: 2 },
          { name: "Tailwind CSS", category: "Frontend", level: 90, order: 3 },
          { name: "Node.js", category: "Backend", level: 85, order: 4 },
          { name: "PostgreSQL", category: "Backend", level: 80, order: 5 },
          { name: "Prisma ORM", category: "Backend", level: 85, order: 6 },
          { name: "Docker", category: "DevOps", level: 75, order: 7 },
          { name: "Vercel / AWS", category: "DevOps", level: 78, order: 8 },
        ],
      },
    },
  });

  await prisma.project.upsert({
    where: { slug: "portfolio-saas" },
    update: {},
    create: {
      title: "Portfolio & Business Suite",
      slug: "portfolio-saas",
      description: "Platform portfolio modern dengan sistem CRUD dinamis berbasis konfigurasi.",
      techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS"],
      featured: true,
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log("✅ Seed selesai! Profile ID:", profile.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());
