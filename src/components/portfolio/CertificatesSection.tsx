import { ICertificate } from "@/models";
import { SectionHeader } from "./SkillsSection";
import { formatDate } from "@/lib/utils";
import { Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CertificatesSection({ certificates }: { certificates: ICertificate[] }) {
  if (!certificates.length) return null;
  return (
    <section id="certificates" className="section-padding">
      <div className="container-custom">
        <SectionHeader eyebrow="Sertifikasi" title="Sertifikat & Penghargaan" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-5 bg-card border rounded-xl card-hover space-y-2">
              <Award className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{cert.name}</h3>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{formatDate(cert.issueDate, "MMM yyyy")}</Badge>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
