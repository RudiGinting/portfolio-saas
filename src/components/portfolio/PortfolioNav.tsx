"use client";
import { IProfile } from "@/models";
import { ModeToggle } from "@/components/shared/ModeToggle";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "#home" },
  { label: "Tentang", href: "#about" },
  { label: "Skill", href: "#skills" },
  { label: "Pengalaman", href: "#experience" },
  { label: "Proyek", href: "#projects" },
  { label: "Kontak", href: "#contact" },
];

export function PortfolioNav({ profile }: { profile: IProfile }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "glass shadow-sm" : "bg-transparent"
    )}>
      <div className="container-custom flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg text-gradient">{profile.name}</Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}
              className="nav-link text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden glass border-t">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-6 py-3 text-sm font-medium hover:bg-accent">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
