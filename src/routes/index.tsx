import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ChevronDown,
  Clock3,
  Coffee,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Play,
  Shield,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import heroImage from "../assets/kahwa-hero-placeholder.jpg";
import drinkImage from "../assets/kahwa-drink-placeholder.jpg";
import cakeImage from "../assets/kahwa-cake-placeholder.jpg";
import kahwaSignatureLatte from "../assets/kahwa-signature-latte.jpg";
import kahwaPistachioCake from "../assets/kahwa-pistachio-cake.jpg";
import kahwaIcedMatcha from "../assets/kahwa-iced-matcha.jpg";
import { ReservationDialog } from "@/components/reservation-dialog";
import { MenuBoardDialog } from "@/components/menu-board-dialog";
import { OrderInCafeDialog } from "@/components/order-in-cafe-dialog";
import { CoffeeJourneyVideo } from "@/components/coffee-journey-video";
import { AtmosphereVideo } from "@/components/atmosphere-video";
import {
  trackClick,
  getCafeSettings,
  DEFAULT_CAFE_SETTINGS,
  type CafeSettings,
} from "@/lib/admin-store";
import { menuCategories, menuItems, type MenuCategory } from "@/lib/menu-data";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kahwa Raw Cafe | Coffee & Treats in Edmonton" },
      {
        name: "description",
        content:
          "Visit Kahwa Raw Cafe in northwest Edmonton for drinks, cakes, and a comfortable contemporary cafe experience.",
      },
      { property: "og:title", content: "Kahwa Raw Cafe | Edmonton" },
      {
        property: "og:description",
        content: "Your cozy corner for coffee, treats, and good moments in northwest Edmonton.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=180%20Mistatim%20Rd%20NW%2C%20Edmonton%2C%20AB%20T6V%200M8%2C%20Canada";
const navItems = [
  { label: "Home", href: "#home" },
  { label: "Our Craft", href: "#craft-story" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
];

const faqItems = [
  {
    id: "item-1",
    question: "Do I need to reserve a table in advance, or do you accept walk-ins?",
    answer:
      "We always welcome walk-in guests! Walk-ins are accommodated promptly on a first-come, first-served basis. However, for weekends, evening peak hours, or parties of 4 or more, we recommend using our quick 'Reserve a Table' feature or messaging us on WhatsApp to ensure your preferred seating is ready upon arrival.",
  },
  {
    id: "item-2",
    question: "Are your menu items, pastries, and treats 100% Halal?",
    answer:
      "Yes, absolutely. Everything served at Kahwa Raw Cafe is 100% Halal. We also cater to diverse dietary preferences with dairy-free milk alternatives (oat, almond, coconut), along with delicious vegetarian and gluten-conscious pastry selections.",
  },
  {
    id: "item-3",
    question: "What makes Kahwa's coffee and roasting heritage special?",
    answer:
      "Kahwa draws inspiration from historic Arabic, Middle Eastern, and Yemeni coffee craft. We ethically source single-origin specialty beans, roast in small artisanal batches, and offer traditional Turkish sand-brewed coffee alongside contemporary micro-foam lattes, Kyoto cold-drip towers, and pour-overs.",
  },
  {
    id: "item-4",
    question: "Is the cafe suitable for remote work, studying, or quiet meetings?",
    answer:
      "Yes! We designed Kahwa as a welcoming neighborhood haven. You'll find comfortable leather banquette booths, high timber ceilings, natural greenery, complimentary high-speed Wi-Fi, accessible power outlets, and an ambient soundtrack suited for both productivity and relaxed conversation.",
  },
  {
    id: "item-5",
    question: "Where are you located in Edmonton, and is parking free?",
    answer:
      "We are located at 180 Mistatim Rd NW, Edmonton, AB T6V 0M8 (conveniently accessible from St. Albert Trail, 137 Ave, and Anthony Henday Drive). We have a large private commercial plaza lot offering free, hassle-free parking right outside our front door.",
  },
  {
    id: "item-6",
    question: "Can I host private gatherings or order bulk coffee & cake catering?",
    answer:
      "Yes, we frequently host private evening bookings, birthdays, corporate meetups, and provide artisan coffee & cake catering. Contact us via WhatsApp or email contact@kahwacafe.ca to discuss customized catering packages.",
  },
];

const buttonBase =
  "btn-contemporary group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-base font-bold shadow-md transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

function PlaceholderLabel() {
  return (
    <span className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-foreground shadow-xs backdrop-blur-sm">
      Replaceable image
    </span>
  );
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>("all");
  const [openFaq, setOpenFaq] = useState<string | null>("item-1");
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);
  const year = new Date().getFullYear();

  useEffect(() => {
    setSettings(getCafeSettings());
    const handleStorage = () => {
      setSettings(getCafeSettings());
    };
    window.addEventListener("kahwa:storage_update", handleStorage);
    return () => {
      window.removeEventListener("kahwa:storage_update", handleStorage);
    };
  }, []);

  const filteredMenuItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 lg:gap-8 px-5 lg:px-8">
          <a
            href="#home"
            className="group flex shrink-0 items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-primary font-display text-xl font-bold transition-transform duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/10">
              K
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-accent whitespace-nowrap">
                Kahwa Raw Cafe
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground whitespace-nowrap">
                <span
                  className={`size-1.5 rounded-full ${
                    settings.isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                {settings.isOpen ? "Open • Northwest Edmonton" : "Closed Currently • Reopening Soon"}
              </span>
            </div>
          </a>
          <nav className="hidden items-center gap-4 xl:gap-6 lg:flex shrink-0" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative py-1 text-sm xl:text-base font-bold text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-accent after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
            <ReservationDialog
              triggerClassName="btn-contemporary group inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border/80 bg-background/90 px-4 text-xs xl:text-sm font-bold text-foreground shadow-xs transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-sm active:scale-95 whitespace-nowrap"
            />
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-contemporary group inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-xs xl:text-sm font-bold text-primary-foreground shadow-xs shadow-primary/20 transition-all duration-300 hover:bg-primary/95 hover:shadow-md hover:shadow-primary/30 active:scale-95 whitespace-nowrap"
            >
              <MapPin className="size-3.5 xl:size-4 text-accent icon-pin-pop" />
              <span>Get Directions</span>
            </a>
            <Link
              to="/admin"
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3.5 text-xs xl:text-sm font-bold text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-xs active:scale-95 whitespace-nowrap"
              title="Open Admin Operations & Analytics Hub"
            >
              <Shield className="size-3.5" />
              <span>Admin</span>
            </Link>
          </nav>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-border/80 bg-background/80 backdrop-blur-sm text-foreground shadow-xs transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent hover:scale-105 active:scale-95 lg:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-6 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="size-6 transition-transform duration-200" />
            )}
          </button>
        </div>
        {menuOpen && (
          <nav
            className="border-t border-border bg-background px-5 py-6 lg:hidden"
            aria-label="Mobile navigation"
          >
            <div className="mx-auto grid max-w-7xl gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-border/60 py-3.5 text-lg font-bold transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <ReservationDialog variant="mobile" />
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonBase} flex w-full items-center justify-center bg-primary text-base text-primary-foreground shadow-primary/20 hover:bg-primary/95 hover:shadow-lg`}
                >
                  <MapPin className="size-4.5 text-accent icon-pin-pop" />
                  <span>Get Directions</span>
                </a>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/15 py-3 text-base font-bold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Shield className="size-4.5" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="home" className="relative min-h-[92svh] scroll-mt-18 overflow-hidden">
          <img
            src={heroImage}
            width={1400}
            height={1000}
            alt="Placeholder showing a warm contemporary cafe interior; replace with a Kahwa Raw Cafe photo"
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/10" />
          <div className="relative mx-auto flex min-h-[92svh] max-w-7xl items-end px-5 pb-16 pt-32 lg:px-8 lg:pb-20">
            <div className="max-w-3xl text-primary-foreground">
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]">
                <span className="h-px w-10 bg-accent" />
                Northwest Edmonton
              </p>
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.96] sm:text-6xl lg:text-8xl">
                Your cozy corner for coffee, treats &amp; good moments.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/85 sm:text-lg">
                A welcoming contemporary café with comfortable character, favourite drinks, and
                something sweet waiting on the menu.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <ReservationDialog
                  variant="hero"
                  triggerClassName={`${buttonBase} btn-pulse bg-accent px-8 py-3.5 text-base sm:text-lg text-accent-foreground shadow-accent/30 hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/50`}
                />
                <MenuBoardDialog
                  trigger={
                    <button
                      type="button"
                      className={`${buttonBase} btn-glass px-8 py-3.5 text-base sm:text-lg text-primary-foreground cursor-pointer`}
                    >
                      <Coffee className="size-5 text-accent" />
                      <span>Explore the Menu</span>
                    </button>
                  }
                />
                <a
                  href="#craft-story"
                  className={`${buttonBase} btn-glass px-7 py-3.5 text-base sm:text-lg text-primary-foreground`}
                >
                  <Play className="size-4.5 text-accent fill-current" />
                  <span>Watch Our Craft</span>
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonBase} btn-glass px-7 py-3.5 text-base sm:text-lg text-primary-foreground`}
                >
                  <MapPin className="size-5 icon-pin-pop" />
                  <span>Directions</span>
                </a>
              </div>
              <p className="mt-7 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/65">
                Concept image — replace with an actual café photograph
              </p>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="pattern-arabian-geom relative scroll-mt-20 overflow-hidden border-b border-border/80 bg-arabian-sand py-20 sm:py-28"
        >
          <div className="relative z-1 mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Welcome in • أهلاً وسهلاً
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
                A warm pause in your day.
              </h2>
            </div>
            <div className="lg:pt-9">
              <p className="max-w-2xl text-lg leading-8 text-foreground/80">
                Kahwa Raw Cafe brings together a clean, comfortable atmosphere, friendly service,
                drinks, and cakes in a modern space with Middle Eastern-inspired character.
              </p>
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  ["Dine-in", "Stay a while"],
                  ["Takeaway", "Take it with you"],
                  ["Northwest Edmonton", "Easy to find"],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xs p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-accent hover:bg-primary hover:text-primary-foreground hover:shadow-2xl hover:shadow-primary/25"
                  >
                    <div className="absolute top-0 left-0 h-1 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                    <p className="font-display text-2xl font-bold transition-colors duration-300">
                      {title}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-muted-foreground transition-colors duration-300 group-hover:text-accent">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {settings.showCoffeeJourneyVideo && <CoffeeJourneyVideo />}

        <section
          id="menu"
          className="pattern-arabian-geom relative scroll-mt-20 overflow-hidden border-b border-border/80 bg-arabian-terracotta py-20 sm:py-28"
        >
          <div className="relative z-1 mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 border-b border-border/70 pb-10 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  Menu &amp; Specialities • قائمة الطعام
                </p>
                <h2 className="mt-4 text-5xl font-semibold sm:text-6xl">
                  Find your next favourite.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-foreground/80 lg:justify-self-end">
                Explore our signature beverages, handcrafted coffees, and delightful cakes freshly
                prepared with quality ingredients and distinct character.
              </p>
            </div>

            {/* Category Filter Pills & In-Store Menu Board Trigger */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2.5">
                {menuCategories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`cursor-pointer rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                          : "border border-border/80 bg-background/80 text-foreground/85 hover:border-accent hover:bg-background hover:text-accent"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {settings.showMenuBoard && (
                <MenuBoardDialog
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/95 backdrop-blur-xs px-5 py-2 text-sm font-bold text-foreground shadow-xs transition-all duration-300 hover:border-accent hover:bg-background hover:text-accent cursor-pointer"
                    >
                      <Coffee className="size-4 text-accent" />
                      <span>View In-Store Menu Board</span>
                    </button>
                  }
                />
              )}
            </div>

            {/* Menu Items Grid */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenuItems.map((item) => {
                const isOutOfStock = settings.outOfStockItems.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ease-out ${
                      isOutOfStock
                        ? "border-border/60 bg-background/70 opacity-80"
                        : "border-border/80 bg-background/95 backdrop-blur-xs hover:-translate-y-1.5 hover:border-accent hover:shadow-2xl hover:shadow-primary/20"
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.alt}
                        width={800}
                        height={500}
                        loading="lazy"
                        className={`h-full w-full object-cover transition-transform duration-500 ease-out ${
                          isOutOfStock ? "grayscale contrast-125" : "group-hover:scale-105"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                      {/* Top Tag & Price */}
                      <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs backdrop-blur-xs">
                        {item.tag}
                      </span>

                      {/* Out of stock badge */}
                      {isOutOfStock ? (
                        <span className="absolute bottom-3 left-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-xs">
                          ● Sold Out Today
                        </span>
                      ) : null}

                      <span className="absolute bottom-3 right-3 rounded-full bg-accent/95 px-3 py-1 text-sm font-bold text-accent-foreground shadow-md backdrop-blur-xs">
                        {item.price}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-accent">
                          {item.categoryName}
                        </p>
                        <h3 className="mt-1.5 font-display text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-accent">
                          {item.name}
                        </h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="size-3.5 text-accent" />
                          {isOutOfStock ? "Temporarily unavailable" : "Handcrafted in-house"}
                        </span>

                        {isOutOfStock ? (
                          <span className="text-xs font-bold text-muted-foreground/70">
                            Check back soon
                          </span>
                        ) : (
                          <OrderInCafeDialog
                            item={item}
                            trigger={
                              <button
                                type="button"
                                className="flex items-center gap-1 text-xs font-bold text-accent transition-colors duration-200 hover:underline group-hover:text-primary cursor-pointer"
                              >
                                <span>Order in café</span>
                                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                              </button>
                            }
                          />
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm font-semibold text-foreground/80">
                Ask your barista about seasonal specials and milk alternatives (Oat, Almond, Lactose-free).
              </p>
              <a
                href="#visit"
                className={`${buttonBase} bg-primary px-8 py-3.5 text-base sm:text-lg text-primary-foreground shadow-primary/20 hover:bg-primary/95 hover:shadow-xl hover:shadow-primary/35`}
              >
                <span>Visit us to experience the menu</span>
                <ArrowRight className="size-5 text-accent icon-slide-right" />
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28" aria-labelledby="favourites-heading">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              From customer feedback
            </p>
            <h2 id="favourites-heading" className="mt-4 text-5xl font-semibold sm:text-6xl">
              Customer-mentioned favourites.
            </h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  id: "kahwa-signature-latte",
                  name: "Kahwa Signature Latte",
                  subtitle: "Rich espresso, silky foam & biscotti",
                  price: "CAD $6.50",
                  category: "coffee",
                  categoryName: "Signature Coffee",
                  image: kahwaSignatureLatte,
                  alt: "Kahwa signature coffee cup with latte art on wooden table",
                },
                {
                  id: "pistachio-milk-cake",
                  name: "Pistachio milk cake",
                  subtitle: "Sweetened milk sponge & fresh pistachio",
                  price: "CAD $8.75",
                  category: "dessert",
                  categoryName: "Artisanal Desserts",
                  image: kahwaPistachioCake,
                  alt: "Pistachio milk cake slice served with Kahwa latte",
                },
                {
                  id: "ceremonial-iced-matcha",
                  name: "Ceremonial Iced Matcha",
                  subtitle: "Stone-ground Japanese matcha & milk",
                  price: "CAD $7.25",
                  category: "tea-matcha",
                  categoryName: "Tea & Matcha",
                  image: kahwaIcedMatcha,
                  alt: "Iced ceremonial matcha latte in Kahwa glass with straw",
                },
              ].map((fav) => (
                <article key={fav.name} className="group flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                      <img
                        src={fav.image}
                        width={1000}
                        height={1250}
                        loading="lazy"
                        alt={fav.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent shadow-xs backdrop-blur-sm">
                        ★ Top Rated
                      </span>
                      <span className="absolute top-3 right-3 rounded-full bg-accent/95 px-3 py-1 text-xs font-bold text-accent-foreground shadow-md backdrop-blur-xs">
                        {fav.price}
                      </span>
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold">{fav.name}</h3>
                    <p className="mt-1 text-sm font-medium text-muted-foreground">{fav.subtitle}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent">{fav.price}</span>
                    <OrderInCafeDialog
                      item={fav}
                      trigger={
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        >
                          <Coffee className="size-3.5" />
                          <span>Order in café</span>
                        </button>
                      }
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="atmosphere"
          className="border-y border-border bg-muted py-20 sm:py-28"
          aria-labelledby="atmosphere-heading"
        >
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              {settings.showAtmosphereVideo ? (
                <AtmosphereVideo />
              ) : (
                <div className="mx-auto flex aspect-[9/16] w-full max-w-[360px] flex-col items-center justify-center rounded-[2rem] border border-border/80 bg-stone-950 p-6 text-center shadow-2xl">
                  <span className="grid size-14 place-items-center rounded-2xl bg-accent/15 text-accent border border-accent/30 mb-3">
                    <Sparkles className="size-7" />
                  </span>
                  <p className="font-display text-lg font-bold text-stone-100">
                    Atmosphere Tour Reel
                  </p>
                  <p className="mt-1 text-xs text-stone-400">
                    Visit Kahwa Raw Cafe at 180 Mistatim Rd NW to experience the ambiance in person.
                  </p>
                </div>
              )}
            </div>
            <div className="lg:pl-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <Sparkles className="size-3.5" />
                The Atmosphere • أجواء المقهى
              </p>
              <h2
                id="atmosphere-heading"
                className="mt-4 font-display text-4xl sm:text-6xl font-semibold leading-tight text-foreground"
              >
                Comfort, with character.
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-foreground/80">
                Step inside our northwest Edmonton cafe. High timber-beam ceilings, an indoor olive tree, warm leather banquette booths, and handcrafted Middle Eastern architectural arches create a welcoming haven for work, study, or catching up.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-border/80 bg-background/80 p-4 backdrop-blur-xs">
                  <p className="font-display text-lg font-bold text-foreground">🌿 Olive Tree Oasis</p>
                  <p className="mt-1 text-xs text-muted-foreground">Natural greenery &amp; serene ambient lighting</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/80 p-4 backdrop-blur-xs">
                  <p className="font-display text-lg font-bold text-foreground">🛋️ Banquette Booths</p>
                  <p className="mt-1 text-xs text-muted-foreground">Comfortable seating for groups &amp; solo pauses</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/80 p-4 backdrop-blur-xs">
                  <p className="font-display text-lg font-bold text-foreground">🍰 Fresh Pastry Bar</p>
                  <p className="mt-1 text-xs text-muted-foreground">Daily baked cakes, cheesecakes &amp; treats</p>
                </div>
                <div className="rounded-xl border border-border/80 bg-background/80 p-4 backdrop-blur-xs">
                  <p className="font-display text-lg font-bold text-foreground">☕ Cold Drip Tower</p>
                  <p className="mt-1 text-xs text-muted-foreground">Kyoto slow-drip &amp; artisan pour-over station</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ReservationDialog
                  variant="hero"
                  triggerText="Reserve Your Spot"
                  triggerClassName="btn-contemporary group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm sm:text-base font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/95 cursor-pointer"
                />
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-5 py-2.5 text-sm sm:text-base font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  <MapPin className="size-4.5 text-accent" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24" aria-label="Review summary">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[auto_1fr] md:items-center lg:px-8">
            <div className="flex items-center gap-5 border-r-0 border-border md:border-r md:pr-10">
              <span className="font-display text-7xl font-semibold">4.7</span>
              <div>
                <div className="flex gap-1 text-accent" aria-label="4.7 out of 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="size-4 fill-current transition-transform duration-200 hover:scale-125"
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  514 reviews*
                </p>
              </div>
            </div>
            <p className="max-w-2xl text-xl leading-8 text-muted-foreground">
              Friendly staff, tasty drinks and cakes, comfortable seating, and a pleasant atmosphere
              are recurring themes in customer feedback.
            </p>
            <p className="md:col-span-2 text-xs text-muted-foreground">
              *Supplied business listing information; editable and not independently verified by
              this website.
            </p>
          </div>
        </section>

        <section
          id="faq"
          className="scroll-mt-18 border-t border-border bg-muted/40 py-20 sm:py-28"
          aria-labelledby="faq-heading"
        >
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <div className="text-center">
              <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                <HelpCircle className="size-3.5" />
                Frequently Asked Questions • الأسئلة الشائعة
              </p>
              <h2
                id="faq-heading"
                className="mt-4 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground"
              >
                Everything You Need to Know
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-muted-foreground">
                Got questions about our artisan coffee, halal treats, table reservations, or cafe atmosphere? We've got answers.
              </p>
            </div>

            <div className="mt-12 space-y-3.5">
              {faqItems.map((item, idx) => {
                const isOpen = openFaq === item.id;
                return (
                  <div
                    key={item.id}
                    className={`overflow-hidden rounded-2xl border bg-background transition-all duration-300 ${
                      isOpen
                        ? "border-accent/60 shadow-md ring-1 ring-accent/20"
                        : "border-border/80 shadow-xs hover:border-accent/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between p-5 text-left transition-colors sm:p-6 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3.5 pr-4">
                        <span
                          className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                            isOpen
                              ? "bg-accent text-accent-foreground"
                              : "bg-accent/15 text-accent"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="font-display text-base font-bold text-foreground sm:text-lg">
                          {item.question}
                        </span>
                      </span>
                      <ChevronDown
                        className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-accent" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-border/40 px-5 pb-6 pt-3 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:text-base pl-14 sm:pl-16">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick Contact Prompt */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background p-6 shadow-sm sm:flex-row sm:p-8">
              <div className="text-center sm:text-left">
                <p className="font-display text-xl font-bold text-foreground">
                  Still have a question?
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  We're always happy to help. Chat with our baristas or send us a message.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/15874013212?text=Hello%20Kahwa%20Cafe%2C%20I%20have%20a%20question"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackClick("whatsapp", "FAQ WhatsApp Button", "+15874013212")}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="size-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <a
                  href="mailto:contact@kahwacafe.ca?subject=Kahwa%20Cafe%20FAQ%20Question"
                  onClick={() => trackClick("email", "FAQ Email Button", "contact@kahwacafe.ca")}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground hover:border-accent hover:text-accent transition-colors"
                >
                  <Mail className="size-4 text-accent" />
                  <span>Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="visit"
          className="scroll-mt-18 bg-primary py-20 text-primary-foreground sm:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Visit us</p>
              <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-none sm:text-7xl">
                Make Kahwa your next stop.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/75">
                Come by for a drink, something sweet, or a comfortable moment in northwest Edmonton.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ReservationDialog
                  variant="hero"
                  triggerClassName={`${buttonBase} bg-accent px-8 py-3.5 text-base sm:text-lg text-accent-foreground shadow-accent/30 hover:bg-accent/90 hover:shadow-2xl hover:shadow-accent/50`}
                />
                <a
                  href="https://wa.me/15874013212?text=Hello%20Kahwa%20Cafe%2C%20I%20have%20an%20inquiry%20about%20a%20table%20or%20menu"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackClick("whatsapp", "Visit Section WhatsApp Button", "+15874013212")
                  }
                  className={`${buttonBase} bg-emerald-600 px-7 py-3.5 text-base sm:text-lg text-white shadow-emerald-950/30 hover:bg-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/30`}
                >
                  <MessageCircle className="size-5" />
                  <span>WhatsApp Us</span>
                </a>
                <a
                  href="mailto:contact@kahwacafe.ca?subject=Kahwa%20Cafe%20Inquiry"
                  onClick={() =>
                    trackClick("email", "Visit Section Email Button", "contact@kahwacafe.ca")
                  }
                  className={`${buttonBase} btn-glass px-7 py-3.5 text-base sm:text-lg text-primary-foreground hover:border-accent hover:text-accent`}
                >
                  <Mail className="size-5 text-accent" />
                  <span>Email Us</span>
                </a>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${buttonBase} btn-glass px-7 py-3.5 text-base sm:text-lg text-primary-foreground`}
                >
                  <MapPin className="size-5 icon-pin-pop" />
                  <span>Get Directions</span>
                </a>
                <a
                  href="tel:+15874013212"
                  className={`${buttonBase} btn-glass px-7 py-3.5 text-base sm:text-lg text-primary-foreground`}
                >
                  <Phone className="size-5 text-accent icon-phone-ring" />
                  <span>Call the Café</span>
                </a>
              </div>
            </div>
            <address className="not-italic lg:border-l lg:border-primary-foreground/20 lg:pl-12">
              <p className="font-display text-3xl font-semibold">Kahwa Raw Cafe</p>
              <p className="mt-5 leading-7 text-primary-foreground/75">
                180 Mistatim Rd NW
                <br />
                Edmonton, AB T6V 0M8
                <br />
                Canada
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <a
                  href="tel:+15874013212"
                  className="inline-flex items-center gap-2 font-semibold text-accent underline underline-offset-4 transition-colors duration-200 hover:text-white"
                >
                  <Phone className="size-3.5" />
                  +1 587-401-3212
                </a>
                <a
                  href="https://wa.me/15874013212?text=Hello%20Kahwa%20Cafe"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackClick("whatsapp", "Address WhatsApp Link", "+15874013212")
                  }
                  className="inline-flex items-center gap-2 font-semibold text-emerald-400 underline underline-offset-4 transition-colors duration-200 hover:text-emerald-300"
                >
                  <MessageCircle className="size-3.5" />
                  Direct WhatsApp Chat
                </a>
                <a
                  href="mailto:contact@kahwacafe.ca?subject=Kahwa%20Cafe%20Inquiry"
                  onClick={() =>
                    trackClick("email", "Address Email Link", "contact@kahwacafe.ca")
                  }
                  className="inline-flex items-center gap-2 font-semibold text-accent underline underline-offset-4 transition-colors duration-200 hover:text-white"
                >
                  <Mail className="size-3.5" />
                  contact@kahwacafe.ca
                </a>
              </div>
              <div className="mt-9 grid gap-4 border-t border-primary-foreground/20 pt-6">
                <p className="flex items-center gap-3">
                  <Coffee className="size-5 text-accent" />
                  Dine-in &amp; takeaway listed
                </p>
                <p className="flex items-center gap-3">
                  <Clock3 className="size-5 text-accent" />
                  Check current hours before visiting
                </p>
              </div>
            </address>
          </div>
        </section>
      </main>

      <footer className="bg-foreground py-12 text-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="font-display text-3xl font-semibold">Kahwa Raw Cafe</p>
            <p className="mt-2 text-sm text-background/65">
              180 Mistatim Rd NW, Edmonton, AB T6V 0M8
            </p>
            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="tel:+15874013212"
                className="inline-block text-sm text-background/65 transition-colors hover:text-accent"
              >
                +1 587-401-3212
              </a>
              <span className="hidden text-background/30 sm:inline">•</span>
              <a
                href="mailto:contact@kahwacafe.ca"
                onClick={() =>
                  trackClick("email", "Footer Email Link", "contact@kahwacafe.ca")
                }
                className="inline-block text-sm text-background/65 transition-colors hover:text-accent"
              >
                contact@kahwacafe.ca
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 md:justify-end">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-background/70 transition-colors duration-200 hover:text-background"
              >
                {item.label}
              </a>
            ))}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              Directions
            </a>
          </div>
          <div className="flex flex-col gap-2 border-t border-background/15 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
            <p>© {year} Kahwa Raw Cafe. All rights reserved.</p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 font-medium text-background/40 transition-colors hover:text-accent"
              title="Staff Operations & Intelligence Hub"
            >
              <Lock className="size-3" />
              <span>Staff / Operations Portal</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Widget */}
      <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-50">
        <a
          href="https://wa.me/15874013212?text=Hello%20Kahwa%20Cafe%2C%20I%20would%20like%20to%20inquire%20about%20a%20table%20or%20menu"
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            trackClick("whatsapp", "Floating WhatsApp Button", "+15874013212")
          }
          className="group relative flex items-center gap-2.5 rounded-full bg-emerald-600 px-4 py-3.5 text-white shadow-2xl shadow-emerald-950/50 ring-4 ring-emerald-500/20 transition-all duration-300 hover:scale-105 hover:bg-emerald-500 hover:shadow-emerald-500/30 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:px-5"
          aria-label="Chat with Kahwa Cafe on WhatsApp"
        >
          {/* Dynamic pulse indicator */}
          <span className="absolute -top-1 -right-1 flex size-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex size-3.5 rounded-full bg-emerald-400" />
          </span>
          <MessageCircle className="size-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden text-sm font-bold tracking-wide sm:inline">
            Chat on WhatsApp
          </span>
        </a>
      </aside>
    </div>
  );
}
