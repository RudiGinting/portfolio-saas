import { IEducation } from "@/models";
import { SectionHeader } from "./SkillsSection";
import { formatDate } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

export function EducationSection({ educations }: { educations: IEducation[] }) {
  if (!educations.length) return null;
  return (
    <section id="education" className="section-padding bg-muted/30">
      <div className="container-custom">
        <SectionHeader eyebrow="Pendidikan" title="Latar Belakang Pendidikan" />
        <div className="max-w-3xl mx-auto space-y-6">
          {educations.map((edu) => (
            <div key={edu.id} className="flex gap-4 p-6 bg-card border rounded-xl card-hover">
              <div className="p-2 bg-primary/10 rounded-lg h-fit">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{edu.degree} – {edu.field}</h3>
                <p className="text-primary font-medium">{edu.institution}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(edu.startDate, "yyyy")} – {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Sekarang"}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
