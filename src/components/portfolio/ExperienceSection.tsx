import { IExperience } from "@/models";
import { SectionHeader } from "./SkillsSection";
import { formatDate } from "@/lib/utils";
import { Building2 } from "lucide-react";

export function ExperienceSection({ experiences }: { experiences: IExperience[] }) {
  if (!experiences.length) return null;
  return (
    <section id="experience" className="section-padding">
      <div className="container-custom">
        <SectionHeader eyebrow="Pengalaman" title="Riwayat Pekerjaan" />
        <div className="max-w-3xl mx-auto space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="flex gap-4 p-6 bg-card border rounded-xl card-hover">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{exp.position}</h3>
                <p className="text-primary font-medium">{exp.company}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(exp.startDate, "MMM yyyy")} – {exp.isCurrent ? "Sekarang" : exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : ""}
                  {exp.location && ` · ${exp.location}`}
                </p>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
