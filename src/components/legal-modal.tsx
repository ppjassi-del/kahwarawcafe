import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle2,
  Coffee,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type LegalTab = "privacy" | "terms" | "allergens";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: LegalTab;
}

export function LegalModal({
  open,
  onOpenChange,
  defaultTab = "privacy",
}: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(defaultTab);

  // Sync defaultTab when opened
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [open, defaultTab]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[calc(100vw-1.5rem)] sm:w-full max-w-3xl overflow-hidden p-0 rounded-2xl border-border bg-background shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-border/80 bg-muted/40 px-4 sm:px-6 py-4 sm:py-5 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-accent">
              <ShieldCheck className="size-4 sm:size-5" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Kahwa Raw Cafe Legal &amp; Guest Trust
              </span>
            </div>
            <DialogTitle className="font-display text-xl sm:text-3xl font-semibold mt-1">
              Guest Policies &amp; Terms
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              Last updated: March 2026 • Effective for all guests, digital orders, and table reservations.
            </DialogDescription>
          </DialogHeader>

          {/* Tab Selector */}
          <div className="mt-3.5 sm:mt-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as LegalTab)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 bg-background/80 p-1 border border-border/60 rounded-xl h-10 sm:h-11">
                <TabsTrigger
                  value="privacy"
                  className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-1 sm:px-3 truncate"
                >
                  <Lock className="size-3 sm:size-3.5 shrink-0" />
                  <span className="truncate">Privacy Policy</span>
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-1 sm:px-3 truncate"
                >
                  <Scale className="size-3 sm:size-3.5 shrink-0" />
                  <span className="truncate">Terms of Use</span>
                </TabsTrigger>
                <TabsTrigger
                  value="allergens"
                  className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg text-[11px] sm:text-xs md:text-sm font-semibold transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-1 sm:px-3 truncate"
                >
                  <AlertTriangle className="size-3 sm:size-3.5 shrink-0" />
                  <span className="truncate">Allergen Notice</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 text-sm leading-relaxed text-foreground/90 flex-1">
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900 dark:text-emerald-200">
                    <p className="font-bold text-sm mb-1">Our Privacy Promise to You</p>
                    Kahwa Raw Cafe does <strong>not sell, lease, or monetize</strong> guest data to third parties. We collect only what is strictly necessary to prepare your coffee orders, honor table reservations, and provide warm hospitality.
                  </div>
                </div>
              </div>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">1</span>
                  Information We Collect
                </h3>
                <p className="text-muted-foreground">
                  When you interact with our website or in-café digital services, we may collect the following:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Table Reservations:</strong> Guest full name, phone number, email address, party size, reservation date, requested arrival time, and any personalized dining notes.
                  </li>
                  <li>
                    <strong className="text-foreground">In-Café Digital Orders:</strong> Assigned table number, selected beverage and pastry items, preparation customizations (sweetness level, milk substitutes), and optional contact details for pickup alerts.
                  </li>
                  <li>
                    <strong className="text-foreground">Customer Inquiries:</strong> Direct messages submitted via our WhatsApp concierge or emails sent to <a href="mailto:contact@kahwacafe.ca" className="text-accent underline">contact@kahwacafe.ca</a>.
                  </li>
                  <li>
                    <strong className="text-foreground">Technical Analytics:</strong> Device type (Mobile, Tablet, Desktop), browser identity, and aggregated visit statistics used solely to optimize website speed.
                  </li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">2</span>
                  How Your Information Is Used
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li>To securely confirm, hold, or modify your dining reservation.</li>
                  <li>To coordinate barista and kitchen preparation and direct table delivery.</li>
                  <li>To respond promptly to catering, event booking, or menu inquiries.</li>
                  <li>To maintain cafe operational integrity and prevent fraudulent bookings.</li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">3</span>
                  Cookies &amp; Local Storage Policy
                </h3>
                <p className="text-muted-foreground">
                  Our application uses browser LocalStorage solely to remember your on-device preferences (such as audio volume, theme choices, or temporary order drafts). We do <strong>not</strong> inject invasive third-party cross-site marketing cookies, ad trackers, or surveillance pixels.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">4</span>
                  Data Protection &amp; Security
                </h3>
                <p className="text-muted-foreground">
                  All communications between your browser and our application are encrypted using industry-standard TLS/SSL protocols. Internal café access to reservation and order lists is strictly restricted to authorized staff and shift supervisors.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">5</span>
                  Your Privacy Rights &amp; Data Requests
                </h3>
                <p className="text-muted-foreground">
                  Under Canadian privacy laws (including PIPEDA and Alberta PIPA), you have the right to inspect, correct, or request the permanent deletion of your reservation history or contact records. Contact our Privacy Officer at <span className="font-mono text-accent">contact@kahwacafe.ca</span> with the subject line <em>"Privacy Data Request"</em>.
                </p>
              </section>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 p-4">
                <div className="flex items-start gap-3">
                  <FileText className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 dark:text-blue-200">
                    <p className="font-bold text-sm mb-1">Terms Summary</p>
                    By using this website, placing table reservations, or ordering in our café, you agree to these fair terms governing table holds, order fulfillment, and guest hospitality.
                  </div>
                </div>
              </div>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">1</span>
                  Acceptance of Terms
                </h3>
                <p className="text-muted-foreground">
                  These Terms of Use constitute a legally binding agreement between you and Kahwa Raw Cafe Inc. ("Kahwa", "we", "us"). If you do not agree with any portion of these terms, please discontinue using our online services.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">2</span>
                  Table Reservation Policy &amp; Seating Grace Period
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">15-Minute Grace Period:</strong> Reserved tables are held for exactly 15 minutes past your scheduled time. If your party is delayed, please message us via WhatsApp or phone so our staff can maintain your seating.
                  </li>
                  <li>
                    <strong className="text-foreground">Cancellation Courtesy:</strong> If you are unable to attend, we kindly request cancellation at least 1 hour prior to your booking time so another patron may enjoy the table.
                  </li>
                  <li>
                    <strong className="text-foreground">Party Sizing:</strong> Large parties of 6 or more may require confirmation via WhatsApp to arrange specialized seating arrangements.
                  </li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">3</span>
                  Digital In-Café Ordering
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                  <li>Digital table orders are prepared freshly on-demand by our baristas and pastry chefs.</li>
                  <li>Please double-check your table marker number before submitting your order to ensure direct service.</li>
                  <li>Once an order is in the "Preparing" status, modifications must be coordinated directly with your barista at the counter.</li>
                </ul>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">4</span>
                  Intellectual Property &amp; Brand Rights
                </h3>
                <p className="text-muted-foreground">
                  All content on this website—including the Kahwa Raw Cafe trademark, logo emblem, signature drink formulas, photography, video journeys, and site code—is the proprietary intellectual property of Kahwa Raw Cafe Inc. Commercial copying or unauthorized republication is strictly prohibited.
                </p>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <span className="flex size-6 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-mono font-bold">5</span>
                  Governing Law &amp; Jurisdiction
                </h3>
                <p className="text-muted-foreground">
                  These Terms of Use are governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein. Any legal proceeding shall be subject to the exclusive jurisdiction of the courts of Edmonton, Alberta.
                </p>
              </section>
            </div>
          )}

          {activeTab === "allergens" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-bold text-sm mb-1">Important Dietary &amp; Allergen Warning</p>
                    Our café proudly crafts artisan items featuring pistachios, almonds, dairy, and wheat. If you or any member of your party has an allergy, please inform our team prior to ordering.
                  </div>
                </div>
              </div>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground">Common Allergens Handled On Premise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-border bg-card p-3">
                    <strong className="text-foreground text-sm block mb-1">Tree Nuts &amp; Seeds</strong>
                    Pistachios, roasted almonds, walnuts, hazelnuts, sesame, and tahini are stored and prepared in our bakery workspace.
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <strong className="text-foreground text-sm block mb-1">Dairy &amp; Milk Alternatives</strong>
                    Whole dairy milk, cream, sweetened condensed milk, oat milk, and almond milk are steamed on shared espresso wands.
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <strong className="text-foreground text-sm block mb-1">Gluten &amp; Wheat</strong>
                    Signature cakes, croissants, and artisan flatbreads contain wheat flour. Gluten-friendly options may experience airborne contact.
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <strong className="text-foreground text-sm block mb-1">Spices &amp; Botanicals</strong>
                    Real cardamom pods, saffron threads, cinnamon, rosewater, and pure blossom honey are infused into specialty lattes.
                  </div>
                </div>
              </section>

              <section className="space-y-2.5">
                <h3 className="font-bold text-base text-foreground">Cross-Contact Policy</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  While our baristas purge steam wands and clean pitchers thoroughly between drinks, our open-concept coffee bar cannot guarantee a completely allergen-free environment. We take food safety seriously and will gladly prepare your drink with a dedicated sanitized pitcher upon verbal request.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer Contact & Action Bar */}
        <div className="border-t border-border/80 bg-muted/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-accent" />
              180 Mistatim Rd NW, Edmonton
            </span>
            <span className="hidden sm:inline">•</span>
            <a
              href="mailto:contact@kahwacafe.ca"
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Mail className="size-3.5 text-accent" />
              contact@kahwacafe.ca
            </a>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            Acknowledge &amp; Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Convenience Trigger Links / Buttons for Opening the Legal Modal
 */
export function LegalModalTrigger({
  tab = "privacy",
  children,
  className = "",
}: {
  tab: LegalTab;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        {children}
      </button>
      <LegalModal open={open} onOpenChange={setOpen} defaultTab={tab} />
    </>
  );
}
