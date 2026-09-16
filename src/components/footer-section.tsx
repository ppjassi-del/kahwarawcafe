import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Heart,
  Lock,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Wifi,
} from "lucide-react";
import { SocialMediaButtons } from "@/components/social-media-buttons";
import { LegalModal, type LegalTab } from "@/components/legal-modal";
import { ReservationDialog } from "@/components/reservation-dialog";
import { MenuBoardDialog } from "@/components/menu-board-dialog";
import { trackClick } from "@/lib/admin-store";

interface FooterSectionProps {
  directionsUrl?: string;
  navItems?: Array<{ label: string; href: string }>;
}

export function FooterSection({
  directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=180%20Mistatim%20Rd%20NW%2C%20Edmonton%2C%20AB%20T6V%200M8%2C%20Canada",
  navItems = [
    { label: "Home", href: "#home" },
    { label: "Our Craft", href: "#craft-story" },
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Community", href: "#social" },
  ],
}: FooterSectionProps) {
  const currentYear = new Date().getFullYear();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalTab, setSelectedLegalTab] = useState<LegalTab>("privacy");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const openLegal = (tab: LegalTab) => {
    setSelectedLegalTab(tab);
    setLegalModalOpen(true);
    trackClick("social", `Footer Legal Link (${tab})`);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) return;
    setNewsletterSubmitted(true);
    trackClick("email", "Footer Newsletter Subscription", newsletterEmail);
    setTimeout(() => {
      setNewsletterEmail("");
    }, 3000);
  };

  return (
    <footer className="bg-[#120f0c] text-[#ece5df] border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="pointer-events-none absolute -left-48 top-0 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 bottom-0 size-96 rounded-full bg-[#c59a6f]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8 relative z-10">
        {/* Top Heritage Callout Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="grid size-13 shrink-0 place-items-center rounded-2xl border-2 border-accent/60 bg-accent/10 font-display text-2xl font-bold text-accent shadow-[0_0_20px_rgba(197,154,111,0.25)]">
              K
            </div>
            <div>
              <p className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Kahwa Raw Cafe
              </p>
              <p className="text-xs sm:text-sm text-white/60">
                Artisanal Roastery &amp; Cardamom Espresso Sanctuary • Northwest Edmonton
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Open Today • Dine-in &amp; Takeaway</span>
            </div>
            <ReservationDialog
              variant="hero"
              triggerClassName="btn-contemporary inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-xs font-bold text-white hover:border-accent hover:text-accent transition-colors"
            />
          </div>
        </div>

        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-12 border-b border-white/10">
          {/* Column 1: About Kahwa & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              About Kahwa
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              Inspired by age-old Arabian raw coffee traditions and Edmonton's contemporary cafe spirit. We curate single-origin beans, crush whole green cardamom, and bake delicate pistachio treats daily.
            </p>

            <address className="not-italic space-y-2 pt-2 text-xs text-white/75">
              <p className="flex items-start gap-2.5">
                <MapPin className="size-4 text-accent shrink-0 mt-0.5" />
                <span>180 Mistatim Rd NW, Edmonton, AB T6V 0M8, Canada</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="size-4 text-accent shrink-0" />
                <a
                  href="tel:+15874013212"
                  className="hover:text-accent transition-colors underline-offset-4 hover:underline"
                >
                  +1 587-401-3212
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="size-4 text-accent shrink-0" />
                <a
                  href="mailto:contact@kahwacafe.ca"
                  onClick={() =>
                    trackClick("email", "Footer Contact Email", "contact@kahwacafe.ca")
                  }
                  className="hover:text-accent transition-colors underline-offset-4 hover:underline"
                >
                  contact@kahwacafe.ca
                </a>
              </p>
            </address>

            <div className="flex items-center gap-4 text-xs text-white/50 pt-2">
              <span className="inline-flex items-center gap-1.5">
                <Wifi className="size-3.5 text-accent" /> High-speed Wi-Fi
              </span>
              <span>•</span>
              <span>Free Guest Parking</span>
            </div>
          </div>

          {/* Column 2: Quick Links & Experiences (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-white/70 hover:text-accent transition-colors inline-block duration-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Directions &amp; Map</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours & Service (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Hours &amp; Hospitality
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Monday – Thursday</span>
                <span className="font-semibold text-white/90">8:00 AM – 10:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Friday</span>
                <span className="font-semibold text-white/90">8:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Saturday</span>
                <span className="font-semibold text-white/90">9:00 AM – 11:00 PM</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/60">Sunday</span>
                <span className="font-semibold text-white/90">9:00 AM – 9:00 PM</span>
              </div>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed pt-1">
              Table hold policy: 15-minute reservation grace period. Walk-in guests are always welcomed.
            </p>
          </div>

          {/* Column 4: Community & Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Social Lounge
            </h3>
            <p className="text-xs text-white/70">
              Follow our daily brewing stories, latte art &amp; community events across our official channels:
            </p>

            {/* Social Media Buttons (Instagram, Facebook, X, WWW) */}
            <div className="pt-1">
              <SocialMediaButtons
                variant="icons"
                size="md"
                theme="dark"
                trackingSource="Footer Navigation Social"
              />
            </div>

            {/* VIP Coffee Club Signup */}
            <div className="pt-3">
              <p className="text-xs font-bold text-white mb-2">
                VIP Coffee Tasting Circle
              </p>
              {newsletterSubmitted ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                  <span>Welcome to the circle! Check your inbox soon.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="h-9 w-full rounded-full border border-white/15 bg-white/5 px-3.5 text-xs text-white placeholder:text-white/40 focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded-full bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Legal & Policy Highlights Row (Privacy Policy, Terms of Use & Allergen Notice) */}
        <div className="py-8 border-b border-white/10">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                <ShieldCheck className="size-4" />
                <span>Guest Policies &amp; Legal Transparency</span>
              </h4>
              <p className="text-xs text-white/50 mt-1">
                Clear, transparent terms safeguarding customer privacy, table bookings, and food allergen safety.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => openLegal("privacy")}
                className="text-xs font-semibold text-accent hover:underline cursor-pointer"
              >
                Open Full Policy Viewer &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Privacy Policy Summary */}
            <div
              onClick={() => openLegal("privacy")}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-pink-400">
                  <Lock className="size-4" />
                  <span className="font-bold text-sm text-white group-hover:text-accent transition-colors">
                    Privacy Policy
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  PIPEDA Compliant
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">
                We safeguard reservation details and in-café orders. We strictly never sell, trade, or distribute your personal data to advertisers.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:underline">
                <span>View Full Privacy Policy</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>

            {/* Card 2: Terms of Use Summary */}
            <div
              onClick={() => openLegal("terms")}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-blue-400">
                  <Scale className="size-4" />
                  <span className="font-bold text-sm text-white group-hover:text-accent transition-colors">
                    Terms of Use
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  Alberta Law
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">
                Rules governing table reservations, the 15-minute seating hold grace period, digital order fulfillment, and dining etiquette.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:underline">
                <span>View Terms of Use</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>

            {/* Card 3: Allergen Notice Summary */}
            <div
              onClick={() => openLegal("allergens")}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="size-4" />
                  <span className="font-bold text-sm text-white group-hover:text-accent transition-colors">
                    Allergen &amp; Kitchen Notice
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  Guest Safety
                </span>
              </div>
              <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">
                Our roastery handles pistachios, tree nuts, wheat, and dairy. Please inform our baristas of any dietary restrictions before ordering.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent group-hover:underline">
                <span>View Allergen Disclosures</span>
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Staff Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-center sm:text-left">
            <p>© {currentYear} Kahwa Raw Cafe Inc. All rights reserved.</p>
            <span className="hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => openLegal("privacy")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/30">•</span>
            <button
              type="button"
              onClick={() => openLegal("terms")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-white/30">•</span>
            <button
              type="button"
              onClick={() => openLegal("allergens")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Allergen Policy
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/40">Handcrafted in Edmonton, Alberta</span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-medium text-white/50 transition-colors hover:border-accent/40 hover:text-accent"
              title="Staff Operations & Intelligence Hub"
            >
              <Lock className="size-3" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Full Legal Text */}
      <LegalModal
        open={legalModalOpen}
        onOpenChange={setLegalModalOpen}
        defaultTab={selectedLegalTab}
      />
    </footer>
  );
}
