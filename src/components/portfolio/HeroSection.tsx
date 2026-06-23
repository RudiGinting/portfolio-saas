// src/components/portfolio/HeroSection.tsx
"use client";

import Image from "next/image";
import { IProfile } from "@/models";
import { getInitials } from "@/lib/utils";
import { Github, Linkedin, Twitter, Globe, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  profile: IProfile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-custom relative z-10 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 animate-fade-in">
            <Badge variant="secondary" className="text-sm px-4 py-1.5">
              👋 Tersedia untuk proyek baru
            </Badge>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
                Halo, Saya{" "}
                <span className="text-gradient">{profile.name}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                {profile.title}
              </p>
            </div>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              {profile.bio.slice(0, 200)}
              {profile.bio.length > 200 && "..."}
            </p>

            {/* Location */}
            {profile.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span>📍</span> {profile.location}
              </p>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                <a href="#contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Hubungi Saya
                </a>
              </Button>
              {profile.resumeUrl && (
                <Button variant="outline" size="lg" asChild>
                  <a href={profile.resumeUrl} download>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh CV
                  </a>
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {profile.githubUrl && (
                <SocialLink href={profile.githubUrl} icon={<Github className="h-5 w-5" />} label="GitHub" />
              )}
              {profile.linkedinUrl && (
                <SocialLink href={profile.linkedinUrl} icon={<Linkedin className="h-5 w-5" />} label="LinkedIn" />
              )}
              {profile.twitterUrl && (
                <SocialLink href={profile.twitterUrl} icon={<Twitter className="h-5 w-5" />} label="Twitter" />
              )}
              {profile.websiteUrl && (
                <SocialLink href={profile.websiteUrl} icon={<Globe className="h-5 w-5" />} label="Website" />
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 scale-110 animate-pulse" />
              <div className="absolute inset-0 rounded-full border border-primary/10 scale-125" />

              {/* Avatar */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl animate-float">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <span className="text-6xl sm:text-7xl font-bold text-primary">
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xs">Scroll</span>
            <div className="w-5 h-8 border-2 border-current rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-current rounded-full" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-2.5 rounded-full border border-border bg-background hover:bg-accent hover:border-primary/50 transition-all duration-200 text-muted-foreground hover:text-foreground"
    >
      {icon}
    </a>
  );
}
