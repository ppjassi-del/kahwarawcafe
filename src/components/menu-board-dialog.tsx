import * as React from "react";
import { ArrowDown, Coffee, ExternalLink, MapPin, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import menuBoardImage from "../assets/kahwa-menu-board.jpg";

interface MenuBoardDialogProps {
  trigger?: React.ReactNode;
  triggerClassName?: string;
  triggerText?: string;
}

const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=180%20Mistatim%20Rd%20NW%2C%20Edmonton%2C%20AB%20T6V%200M8%2C%20Canada";

export function MenuBoardDialog({
  trigger,
  triggerClassName,
  triggerText = "Explore the Menu",
}: MenuBoardDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isZoomed, setIsZoomed] = React.useState(false);

  const handleScrollToMenu = () => {
    setOpen(false);
    // Smooth scroll down to interactive menu section
    setTimeout(() => {
      const menuEl = document.getElementById("menu");
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className={
              triggerClassName ||
              "btn-contemporary group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-base sm:text-lg font-bold shadow-md transition-all duration-300 btn-glass text-primary-foreground cursor-pointer"
            }
          >
            <Coffee className="size-5 text-accent" />
            <span>{triggerText}</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-4xl max-h-[92svh] overflow-y-auto p-3.5 sm:p-7 bg-background border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader className="text-left pb-2 border-b border-border/60">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3 text-accent" />
              Official In-Store Menu
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              180 Mistatim Rd NW, Edmonton
            </span>
          </div>
          <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Kahwa Raw Cafe Menu Board
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Current in-cafe menu prices for hot drinks, cold beverages, Karak Chai, specialty brews &amp; extras.
          </DialogDescription>
        </DialogHeader>

        {/* Action bar above image */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span>Click image to {isZoomed ? "fit screen" : "zoom in"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsZoomed(!isZoomed)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-bold text-foreground shadow-xs transition-colors hover:border-accent hover:text-accent cursor-pointer"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="size-3.5 text-accent" />
                  <span>Fit View</span>
                </>
              ) : (
                <>
                  <ZoomIn className="size-3.5 text-accent" />
                  <span>Zoom In</span>
                </>
              )}
            </button>

            <a
              href="/kahwa-menu-board.jpg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 text-xs font-bold text-foreground shadow-xs transition-colors hover:border-accent hover:text-accent"
            >
              <ExternalLink className="size-3.5 text-accent" />
              <span>Full Size</span>
            </a>
          </div>
        </div>

        {/* Menu Board Image Container */}
        <div
          className={`relative overflow-auto rounded-xl border border-border/80 bg-stone-950/90 p-2 shadow-inner transition-all duration-300 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={menuBoardImage}
            alt="Kahwa Raw Cafe In-Store Menu Board with prices and beverage offerings"
            className={`mx-auto rounded-lg shadow-xl transition-all duration-300 select-none ${
              isZoomed ? "w-[1200px] max-w-none" : "w-full max-h-[65vh] object-contain"
            }`}
          />
        </div>

        {/* Quick Highlights and Navigation Footer */}
        <div className="mt-2 flex flex-col gap-4 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Prices are subject to applicable taxes. Seasonal cakes &amp; pastries available daily at the counter.
          </p>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleScrollToMenu}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/95 hover:shadow-md cursor-pointer"
            >
              <span>Explore Menu Showcase</span>
              <ArrowDown className="size-4 text-accent" />
            </button>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <MapPin className="size-4 text-accent" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
