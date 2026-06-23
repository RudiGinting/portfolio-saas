import { IProfile } from "@/models";
import { SectionHeader } from "./SkillsSection";

export function AboutSection({ profile }: { profile: IProfile }) {
  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <SectionHeader eyebrow="Tentang Saya" title="Siapa Saya?" />
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line text-center">{profile.bio}</p>
        </div>
      </div>
    </section>
  );
}
