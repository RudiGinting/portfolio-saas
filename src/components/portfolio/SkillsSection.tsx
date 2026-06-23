// src/components/portfolio/SkillsSection.tsx
"use client";

import { ISkill } from "@/models";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface SkillsSectionProps {
  skillsByCategory: Record<string, ISkill[]>;
}

export function SkillsSection({ skillsByCategory }: SkillsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const categories = Object.entries(skillsByCategory);

  if (categories.length === 0) return null;

  return (
    <section ref={sectionRef} id="skills" className="section-padding bg-muted/30">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Keahlian"
          title="Teknologi yang Saya Kuasai"
          description="Kumpulan teknologi dan alat yang saya gunakan dalam pengembangan proyek"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(([category, skills]) => (
            <div
              key={category}
              className="bg-card border rounded-xl p-6 space-y-4 card-hover"
            >
              <h3 className="font-semibold text-lg capitalize">{category}</h3>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <SkillBar
                    key={skill.id}
                    skill={skill}
                    animate={isVisible}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillBar({ skill, animate }: { skill: ISkill; animate: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{skill.name}</span>
        <span className="text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="skill-bar">
        <div
          className="skill-bar-fill"
          style={{
            width: animate ? `${skill.level}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

// Reusable section header
export function SectionHeader({
  eyebrow,
  title,
  description,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("mb-12", centered && "text-center")}>
      {eyebrow && (
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
