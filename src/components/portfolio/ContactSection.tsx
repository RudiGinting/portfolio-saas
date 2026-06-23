"use client";
import { SectionHeader } from "./SkillsSection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, ContactFormValues } from "@/lib/dynamic-validation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";

export function ContactSection({ email }: { email: string }) {
  const [sending, setSending] = useState(false);
  const form = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (data: ContactFormValues) => {
    setSending(true);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      toast.success("Pesan berhasil dikirim! Saya akan segera membalas.");
      form.reset();
    } catch {
      toast.error("Gagal mengirim pesan. Coba lagi.");
    } finally { setSending(false); }
  };

  return (
    <section id="contact" className="section-padding">
      <div className="container-custom">
        <SectionHeader eyebrow="Kontak" title="Mari Bekerja Sama" description="Punya proyek menarik? Hubungi saya!" />
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-8 text-muted-foreground">
            <Mail className="h-4 w-4" /><span>{email}</span>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nama</FormLabel><FormControl><Input placeholder="Nama Anda" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subjek</FormLabel><FormControl><Input placeholder="Subjek pesan" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Pesan</FormLabel><FormControl><Textarea placeholder="Ceritakan proyek Anda..." rows={5} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengirim...</> : <><Send className="mr-2 h-4 w-4" />Kirim Pesan</>}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
