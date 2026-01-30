"use client";

import { useState } from "react";
import StaggerReveal from "@/components/ui/StaggerReveal";
import WhatsAppLink from "@/components/ui/WhatsAppLink";

/**
 * Contact Page
 * Design V2: Elegant form + Map placeholder
 * Migrated from (v2) to production route.
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would POST to API
    console.log("Contact form submitted:", formData);
  };

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <StaggerReveal delay={0.1} className="mb-16 max-w-2xl">
          <p className="type-kicker text-muted mb-4">Contact</p>
          <h1 className="type-h1 text-foreground mb-4">
            Get in Touch
          </h1>
          <p className="type-body text-foreground-muted">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </StaggerReveal>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="type-data text-muted block mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-panel border border-border focus:border-foreground focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="type-data text-muted block mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-panel border border-border focus:border-foreground focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="type-data text-muted block mb-2">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-panel border border-border focus:border-foreground focus:outline-none transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="type-data text-muted block mb-2">Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-panel border border-border focus:border-foreground focus:outline-none transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="ui-btn-primary px-8 py-4 type-nav rounded-full w-full lg:w-auto"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info + Map */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div
              className="aspect-video rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <span className="type-ui text-muted">Map</span>
            </div>

            {/* Contact Details */}
            <div className="p-6 rounded-2xl bg-panel" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <h3 className="type-h4 text-foreground mb-4">Office</h3>
              <dl className="space-y-3 type-body text-foreground-muted">
                <div>
                  <dt className="type-data text-muted mb-1">Address</dt>
                  <dd>Jl. Contoh No. 123, Jakarta, Indonesia</dd>
                </div>
                <div>
                  <dt className="type-data text-muted mb-1">Phone</dt>
                  <dd>+62 21 1234 5678</dd>
                </div>
                <div>
                  <dt className="type-data text-muted mb-1">Email</dt>
                  <dd>info@alfabeauty.co.id</dd>
                </div>
                <div>
                  <dt className="type-data text-muted mb-1">Hours</dt>
                  <dd>Monday - Friday, 9:00 - 17:00 WIB</dd>
                </div>
              </dl>
            </div>

            {/* Quick WhatsApp */}
            <WhatsAppLink
              className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366] text-white type-nav hover:opacity-90 transition-opacity"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat via WhatsApp
            </WhatsAppLink>
          </div>
        </div>
      </div>
    </main>
  );
}
