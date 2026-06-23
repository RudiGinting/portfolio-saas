import { IProject } from "@/models";
import { SectionHeader } from "./SkillsSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export function ProjectsSection({ projects }: { projects: IProject[] }) {
  if (!projects.length) return null;
  return (
    <section id="projects" className="section-padding bg-muted/30">
      <div className="container-custom">
        <SectionHeader eyebrow="Portofolio" title="Proyek Terbaru" description="Beberapa proyek yang pernah saya kerjakan" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border rounded-xl overflow-hidden card-hover flex flex-col">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <span className="text-4xl">🚀</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                <p className="text-sm text-muted-foreground flex-1 mb-3">{project.description.slice(0, 100)}...</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  {project.demoUrl && <Button size="sm" variant="outline" asChild><a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1" />Demo</a></Button>}
                  {project.githubUrl && <Button size="sm" variant="ghost" asChild><a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-3 w-3 mr-1" />Code</a></Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" size="lg" asChild><Link href="/projects">Lihat Semua Proyek</Link></Button>
        </div>
      </div>
    </section>
  );
}
