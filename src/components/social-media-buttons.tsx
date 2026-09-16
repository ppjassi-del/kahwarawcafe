import React from "react";
import { ArrowUpRight } from "lucide-react";
import { trackClick } from "@/lib/admin-store";

export interface SocialLinksConfig {
  instagram?: string;
  facebook?: string;
  x?: string;
  www?: string;
}

export type SocialVariant = "icons" | "pills" | "cards" | "minimal";
export type SocialSize = "sm" | "md" | "lg";
export type SocialTheme = "dark" | "light" | "auto";

export interface SocialMediaButtonsProps {
  /** Visual presentation style */
  variant?: SocialVariant;
  /** Size scaling for buttons & icons */
  size?: SocialSize;
  /** Color theme context */
  theme?: SocialTheme;
  /** Custom links override */
  links?: SocialLinksConfig;
  /** Optional container class name */
  className?: string;
  /** Whether to show text labels in icon mode */
  showLabels?: boolean;
  /** Additional tracking source identifier */
  trackingSource?: string;
}

export const DEFAULT_SOCIAL_LINKS: Required<SocialLinksConfig> = {
  instagram: "https://www.instagram.com/kahwarawcafe/",
  facebook: "https://www.facebook.com/kahwarawcafe/",
  x: "https://x.com/kahwarawcafe",
  www: "https://kahwacafe.ca",
};

interface SocialItem {
  id: "instagram" | "facebook" | "x" | "www";
  name: string;
  handle: string;
  tagline: string;
  url: string;
  ariaLabel: string;
  brandGradient: string;
  hoverGlow: string;
  badgeBg: string;
  textColor: string;
  renderIcon: (className?: string) => React.ReactNode;
}

export function SocialMediaButtons({
  variant = "icons",
  size = "md",
  theme = "auto",
  links = {},
  className = "",
  showLabels = false,
  trackingSource = "Social Media Widget",
}: SocialMediaButtonsProps) {
  const mergedLinks: Required<SocialLinksConfig> = {
    instagram: links.instagram || DEFAULT_SOCIAL_LINKS.instagram,
    facebook: links.facebook || DEFAULT_SOCIAL_LINKS.facebook,
    x: links.x || DEFAULT_SOCIAL_LINKS.x,
    www: links.www || DEFAULT_SOCIAL_LINKS.www,
  };

  const socialItems: SocialItem[] = [
    {
      id: "instagram",
      name: "Instagram",
      handle: "@kahwarawcafe",
      tagline: "Daily roasts, latte art & reels",
      url: mergedLinks.instagram,
      ariaLabel: "Follow Kahwa Raw Cafe on Instagram",
      brandGradient: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]",
      hoverGlow: "group-hover:shadow-[0_8px_25px_rgba(220,39,67,0.38)]",
      badgeBg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white",
      textColor: "group-hover:text-pink-400",
      renderIcon: (iconClass = "size-5") => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "Kahwa Raw Cafe",
      tagline: "Events, stories & community updates",
      url: mergedLinks.facebook,
      ariaLabel: "Connect with Kahwa Raw Cafe on Facebook",
      brandGradient: "hover:bg-gradient-to-br hover:from-[#1877F2] hover:to-[#0D5CB6]",
      hoverGlow: "group-hover:shadow-[0_8px_25px_rgba(24,119,242,0.38)]",
      badgeBg: "bg-[#1877F2] text-white",
      textColor: "group-hover:text-blue-400",
      renderIcon: (iconClass = "size-5") => (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: "x",
      name: "X",
      handle: "@kahwarawcafe",
      tagline: "Real-time updates, hours & chat",
      url: mergedLinks.x,
      ariaLabel: "Follow Kahwa Raw Cafe on X (formerly Twitter)",
      brandGradient: "hover:bg-gradient-to-br hover:from-neutral-900 hover:via-neutral-800 hover:to-neutral-950",
      hoverGlow: "group-hover:shadow-[0_8px_25px_rgba(255,255,255,0.2)]",
      badgeBg: "bg-neutral-900 text-white border border-neutral-700",
      textColor: "group-hover:text-neutral-200",
      renderIcon: (iconClass = "size-5") => (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: "www",
      name: "WWW",
      handle: "kahwacafe.ca",
      tagline: "Official cafe portal, menu & catering",
      url: mergedLinks.www,
      ariaLabel: "Visit Kahwa Raw Cafe official website",
      brandGradient: "hover:bg-gradient-to-br hover:from-[#c59a6f] hover:via-[#9e7044] hover:to-[#6d4520]",
      hoverGlow: "group-hover:shadow-[0_8px_25px_rgba(197,154,111,0.4)]",
      badgeBg: "bg-gradient-to-br from-[#c59a6f] to-[#784a22] text-white",
      textColor: "group-hover:text-amber-400",
      renderIcon: (iconClass = "size-5") => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconClass}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
  ];

  const handleClick = (item: SocialItem) => {
    try {
      trackClick("social", `${trackingSource} (${item.name})`, item.url);
    } catch {
      // safe fallback
    }
  };

  // Base sizing tokens
  const sizeConfig = {
    sm: {
      btn: "size-8.5 p-1.5",
      icon: "size-4",
      pill: "px-3 py-1.5 text-xs gap-2",
      pillIcon: "size-3.5",
      cardIcon: "size-6",
      cardPad: "p-3.5",
    },
    md: {
      btn: "size-11 p-2.5",
      icon: "size-5",
      pill: "px-4 py-2 text-sm gap-2.5",
      pillIcon: "size-4",
      cardIcon: "size-7",
      cardPad: "p-5",
    },
    lg: {
      btn: "size-13 p-3.5",
      icon: "size-6",
      pill: "px-5 py-2.5 text-base gap-3",
      pillIcon: "size-5",
      cardIcon: "size-8",
      cardPad: "p-6",
    },
  }[size];

  // Theme styling helpers
  const getThemeClasses = () => {
    if (theme === "dark") {
      return {
        iconBtnBase:
          "border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-white/40 shadow-xs",
        pillBase:
          "border-white/15 bg-white/5 text-white/90 hover:text-white hover:border-white/40",
        cardBase:
          "border-white/10 bg-black/40 text-white hover:border-white/25",
        textMuted: "text-white/60",
      };
    }
    if (theme === "light") {
      return {
        iconBtnBase:
          "border-border/80 bg-background/90 text-foreground/80 hover:text-foreground hover:border-foreground/30 shadow-xs",
        pillBase:
          "border-border bg-card text-foreground hover:border-foreground/40",
        cardBase:
          "border-border bg-card text-card-foreground hover:border-border/80 shadow-xs",
        textMuted: "text-muted-foreground",
      };
    }
    // Auto (supports glassmorphic contexts)
    return {
      iconBtnBase:
        "border-current/15 bg-current/5 text-inherit hover:opacity-100 opacity-80 backdrop-blur-md shadow-xs",
      pillBase:
        "border-current/20 bg-current/5 text-inherit hover:border-current/40 backdrop-blur-md",
      cardBase:
        "border-border/80 bg-card/80 text-foreground backdrop-blur-md hover:border-border shadow-xs",
      textMuted: "opacity-65",
    };
  };

  const themeClasses = getThemeClasses();

  // 1. CARDS VARIANT
  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            onClick={() => handleClick(item)}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${themeClasses.cardBase} ${sizeConfig.cardPad}`}
          >
            {/* Ambient hover glow gradient */}
            <div
              className={`pointer-events-none absolute -right-12 -top-12 size-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40 ${
                item.id === "instagram"
                  ? "bg-pink-500"
                  : item.id === "facebook"
                    ? "bg-blue-500"
                    : item.id === "x"
                      ? "bg-zinc-400"
                      : "bg-amber-500"
              }`}
            />

            <div className="flex items-start justify-between gap-3">
              <div
                className={`grid place-items-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md ${sizeConfig.cardIcon} ${item.badgeBg} p-2.5`}
              >
                {item.renderIcon("size-full")}
              </div>
              <span className="flex size-7 items-center justify-center rounded-full border border-current/15 opacity-60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:border-current/40">
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base tracking-tight transition-colors duration-200">
                  {item.name}
                </h4>
                <span className="text-xs font-mono opacity-60">
                  {item.handle}
                </span>
              </div>
              <p className={`mt-1.5 text-xs line-clamp-2 ${themeClasses.textMuted}`}>
                {item.tagline}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase transition-colors duration-200 group-hover:underline">
              <span>Connect</span>
              <span aria-hidden="true">&rarr;</span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // 2. PILLS VARIANT
  if (variant === "pills") {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            onClick={() => handleClick(item)}
            className={`group relative inline-flex items-center rounded-full border backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:text-white ${themeClasses.pillBase} ${item.brandGradient} ${sizeConfig.pill}`}
          >
            <span className="transition-transform duration-300 group-hover:scale-115">
              {item.renderIcon(sizeConfig.pillIcon)}
            </span>
            <span className="font-semibold tracking-tight">{item.name}</span>
            <span className="opacity-60 text-[11px] group-hover:opacity-90 hidden sm:inline">
              {item.handle}
            </span>
            <ArrowUpRight className="size-3 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
          </a>
        ))}
      </div>
    );
  }

  // 3. MINIMAL VARIANT
  if (variant === "minimal") {
    return (
      <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        {socialItems.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel}
            onClick={() => handleClick(item)}
            className={`group inline-flex items-center gap-1.5 text-sm font-semibold opacity-75 transition-all duration-200 hover:opacity-100 ${item.textColor}`}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              {item.renderIcon("size-4")}
            </span>
            <span>{item.name}</span>
          </a>
        ))}
      </div>
    );
  }

  // 4. ICONS VARIANT (DEFAULT)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {socialItems.map((item) => (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.ariaLabel}
          title={`${item.name} (${item.handle})`}
          onClick={() => handleClick(item)}
          className={`group relative grid place-items-center rounded-full border transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${themeClasses.iconBtnBase} ${item.brandGradient} ${sizeConfig.btn}`}
        >
          {/* Subtle colored glow blur behind icon on hover */}
          <span
            className={`pointer-events-none absolute inset-0 rounded-full transition-shadow duration-300 ${item.hoverGlow}`}
          />

          <span className="relative z-10 transition-transform duration-300 group-hover:scale-115">
            {item.renderIcon(sizeConfig.icon)}
          </span>

          {showLabels && (
            <span className="sr-only sm:not-sr-only sm:ml-2 text-xs font-semibold">
              {item.name}
            </span>
          )}
        </a>
      ))}
    </div>
  );
}
