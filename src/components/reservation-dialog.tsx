import * as React from "react";
import {
  Calendar,
  CalendarX,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  Phone,
  RotateCcw,
  Search,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  recordReservation,
  cancelReservation,
  findReservationsByContact,
  getCafeSettings,
  DEFAULT_CAFE_SETTINGS,
  type CafeSettings,
  type Reservation,
} from "@/lib/admin-store";

interface ReservationDialogProps {
  triggerClassName?: string;
  triggerText?: string;
  variant?: "header" | "hero" | "mobile";
}

// Strict validation regular expressions
const NAME_REGEX = /^[a-zA-Z\s'-]{2,60}$/;
const PHONE_REGEX =
  /^(\+?[1-9]\d{0,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$|^\+?[0-9]{10,15}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CANCEL_REASONS = [
  "Change of plans / Schedule conflict",
  "Feeling unwell / Medical emergency",
  "Booked wrong date or time",
  "Booked duplicate by mistake",
  "Other reason",
];

export function ReservationDialog({
  triggerClassName,
  triggerText = "Reserve a Table",
  variant = "header",
}: ReservationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [settings, setSettings] = React.useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);

  // Active sub-tab within modal: "book" vs "manage"
  const [activeTab, setActiveTab] = React.useState<"book" | "manage">("book");

  // Form field states
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [heads, setHeads] = React.useState("2");
  const [date, setDate] = React.useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = React.useState("18:00");

  // Touched states to only show errors once user interacts
  const [touched, setTouched] = React.useState({
    name: false,
    phone: false,
    email: false,
    heads: false,
  });

  const [submitted, setSubmitted] = React.useState(false);
  const [createdReservation, setCreatedReservation] = React.useState<Reservation | null>(null);
  const [copiedRef, setCopiedRef] = React.useState(false);

  // Immediate cancellation on confirmation view
  const [showImmediateCancelPrompt, setShowImmediateCancelPrompt] = React.useState(false);
  const [isImmediateCancelled, setIsImmediateCancelled] = React.useState(false);

  // "Find & Manage Booking" tab states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [hasSearched, setHasSearched] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Reservation[]>([]);
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [cancelReasonChoice, setCancelReasonChoice] = React.useState(CANCEL_REASONS[0]);
  const [customCancelReason, setCustomCancelReason] = React.useState("");
  const [cancelFeedback, setCancelFeedback] = React.useState<string | null>(null);

  React.useEffect(() => {
    setSettings(getCafeSettings());
    const handleStorage = () => {
      setSettings(getCafeSettings());
      // If user is currently looking at search results, refresh them
      if (searchQuery.trim()) {
        setSearchResults(findReservationsByContact(searchQuery));
      }
    };
    window.addEventListener("kahwa:storage_update", handleStorage);
    return () => window.removeEventListener("kahwa:storage_update", handleStorage);
  }, [searchQuery]);

  // Validation checks
  const isNameValid = NAME_REGEX.test(name.trim());
  const isPhoneDigitsOnly = phone.replace(/\D/g, "");
  const isPhoneValid =
    PHONE_REGEX.test(phone.trim()) &&
    isPhoneDigitsOnly.length >= 10 &&
    isPhoneDigitsOnly.length <= 15;
  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const headsNum = parseInt(heads, 10);
  const isHeadsValid = !isNaN(headsNum) && headsNum >= 1 && headsNum <= 20;

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isHeadsValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      name: true,
      phone: true,
      email: true,
      heads: true,
    });

    if (!isFormValid) {
      return;
    }

    const newRes = recordReservation({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      heads: headsNum,
      date,
      time,
    });

    setCreatedReservation(newRes);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setHeads("2");
    setTouched({
      name: false,
      phone: false,
      email: false,
      heads: false,
    });
    setSubmitted(false);
    setCreatedReservation(null);
    setCopiedRef(false);
    setShowImmediateCancelPrompt(false);
    setIsImmediateCancelled(false);
    setCancellingId(null);
    setCancelFeedback(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setTimeout(() => {
        handleReset();
        setActiveTab("book");
      }, 300);
    }
  };

  // Immediate cancel handler from confirmation view
  const handleImmediateCancel = () => {
    if (!createdReservation) return;
    cancelReservation(
      createdReservation.id,
      "customer",
      "Cancelled right after booking on storefront"
    );
    setIsImmediateCancelled(true);
    setShowImmediateCancelPrompt(false);
  };

  // Search handler in "manage" tab
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    const results = findReservationsByContact(searchQuery);
    setSearchResults(results);
    setHasSearched(true);
    setCancellingId(null);
    setCancelFeedback(null);
  };

  // Confirm cancellation from manage list
  const handleConfirmCancellationFromList = (id: string) => {
    const reasonText =
      cancelReasonChoice === "Other reason" && customCancelReason.trim()
        ? customCancelReason.trim()
        : cancelReasonChoice;

    const cancelled = cancelReservation(id, "customer", reasonText);
    if (cancelled) {
      setCancelFeedback(`Reservation ${id} has been cancelled successfully.`);
      setCancellingId(null);
      setCustomCancelReason("");
      // Refresh list
      setSearchResults(findReservationsByContact(searchQuery));
    }
  };

  // Determine trigger styling based on variant if custom triggerClassName is not provided
  const defaultTriggerClasses =
    variant === "mobile"
      ? "btn-contemporary group flex w-full items-center justify-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-base font-bold text-accent-foreground shadow-md shadow-accent/25 hover:bg-accent/90"
      : "btn-contemporary group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-border/80 bg-background/90 px-6 py-3 text-base font-bold text-foreground shadow-sm transition-all duration-300 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-md";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName || defaultTriggerClasses}>
          <Calendar className="size-4 text-accent transition-transform duration-300 group-hover:scale-110" />
          <span>{triggerText}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/80 bg-background p-5 sm:p-7 shadow-2xl sm:max-w-lg">
        {/* Navigation Tab Switcher between "Book a Table" and "Find / Cancel" */}
        {!submitted && (
          <div className="mb-4 flex rounded-xl border border-border/70 bg-card/70 p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("book");
                setCancelFeedback(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "book"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="size-3.5" />
              <span>Book a Table</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("manage");
                setCancelFeedback(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "manage"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarX className="size-3.5" />
              <span>Find / Cancel Booking</span>
            </button>
          </div>
        )}

        {/* ==================================================================
            VIEW 1: FIND & CANCEL BOOKING (SELF-SERVICE)
           ================================================================== */}
        {activeTab === "manage" && !submitted ? (
          <div className="space-y-4">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <CalendarX className="size-3.5" />
                <span>Customer Self-Service • إلغاء أو إدارة الحجز</span>
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Find or Cancel Booking
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Enter your <strong>Booking Reference ID</strong> (e.g. KHW-101), <strong>Phone Number</strong>, or <strong>Email</strong> to view or cancel your reservation.
              </DialogDescription>
            </DialogHeader>

            {/* Search Input Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. KHW-101, +1 587-401-3212, or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-card/60 pl-9 pr-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <button
                type="submit"
                className="btn-contemporary h-11 shrink-0 rounded-xl bg-primary px-4 text-xs sm:text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary/95 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Feedback Alert */}
            {cancelFeedback && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                <span>{cancelFeedback}</span>
              </div>
            )}

            {/* Results Section */}
            {hasSearched && (
              <div className="space-y-3 pt-1">
                {searchResults.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/80 p-6 text-center">
                    <p className="text-sm font-semibold text-foreground">No bookings found</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      We couldn&apos;t find any reservations matching &ldquo;{searchQuery}&rdquo;. Please verify your booking reference or phone number.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                    {searchResults.map((res) => {
                      const isCancelled = res.status === "cancelled";
                      const isBeingCancelled = cancellingId === res.id;

                      return (
                        <div
                          key={res.id}
                          className={`rounded-xl border p-4 transition-all ${
                            isCancelled
                              ? "border-red-500/30 bg-red-500/5 opacity-80"
                              : "border-border/80 bg-card"
                          }`}
                        >
                          {/* Card Top Row */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-sm font-extrabold text-accent">
                              {res.id}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                res.status === "confirmed"
                                  ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                                  : res.status === "pending"
                                    ? "border border-amber-500/30 bg-amber-500/15 text-amber-400"
                                    : res.status === "completed"
                                      ? "border border-blue-500/30 bg-blue-500/15 text-blue-400"
                                      : "border border-red-500/30 bg-red-500/15 text-red-400"
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  res.status === "confirmed"
                                    ? "bg-emerald-400"
                                    : res.status === "pending"
                                      ? "bg-amber-400 animate-pulse"
                                      : res.status === "completed"
                                        ? "bg-blue-400"
                                        : "bg-red-400"
                                }`}
                              />
                              {res.status}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-muted-foreground block">Guest Name</span>
                              <span className="font-bold text-foreground">{res.name}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">Party Size</span>
                              <span className="font-semibold text-foreground">
                                {res.heads} {res.heads === 1 ? "Guest" : "Guests"}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">Date &amp; Time</span>
                              <span className="font-semibold text-foreground">
                                {res.date} at {res.time}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-muted-foreground block">Phone</span>
                              <span className="text-muted-foreground">{res.phone}</span>
                            </div>
                          </div>

                          {/* Cancellation info if already cancelled */}
                          {isCancelled && (
                            <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-300">
                              <p className="font-semibold flex items-center gap-1.5">
                                <XCircle className="size-3.5 text-red-400 shrink-0" />
                                Cancelled {res.cancelledBy ? `by ${res.cancelledBy}` : ""}
                              </p>
                              {res.cancelReason && (
                                <p className="mt-1 text-[11px] text-red-400/90 italic">
                                  &ldquo;{res.cancelReason}&rdquo;
                                </p>
                              )}
                            </div>
                          )}

                          {/* Active reservation action */}
                          {!isCancelled && res.status !== "completed" && (
                            <div className="mt-3 pt-2.5 border-t border-border/60">
                              {isBeingCancelled ? (
                                /* Confirmation box with reason */
                                <div className="space-y-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-left">
                                  <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                                    <XCircle className="size-3.5" />
                                    <span>Confirm Cancellation</span>
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    Please let us know why you need to cancel this table:
                                  </p>
                                  <select
                                    value={cancelReasonChoice}
                                    onChange={(e) => setCancelReasonChoice(e.target.value)}
                                    className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:border-red-500 focus:outline-none"
                                  >
                                    {CANCEL_REASONS.map((r) => (
                                      <option key={r} value={r}>
                                        {r}
                                      </option>
                                    ))}
                                  </select>

                                  {cancelReasonChoice === "Other reason" && (
                                    <input
                                      type="text"
                                      placeholder="Briefly state reason..."
                                      value={customCancelReason}
                                      onChange={(e) => setCustomCancelReason(e.target.value)}
                                      className="h-8 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-red-500 focus:outline-none"
                                    />
                                  )}

                                  <div className="flex gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleConfirmCancellationFromList(res.id)}
                                      className="btn-contemporary flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-500 cursor-pointer"
                                    >
                                      Yes, Cancel Table
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setCancellingId(null)}
                                      className="btn-contemporary rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-card cursor-pointer"
                                    >
                                      Keep Table
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] text-muted-foreground">
                                    Need to release this table?
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCancellingId(res.id);
                                      setCancelFeedback(null);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer"
                                  >
                                    <CalendarX className="size-3" />
                                    <span>Cancel Reservation</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : !settings.reservationsEnabled ? (
          /* ==================================================================
              VIEW 2: RESERVATIONS PAUSED NOTICE
             ================================================================== */
          <div className="py-6 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30 mb-4">
              <Clock className="size-8" />
            </div>
            <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Online Reservations Paused
            </DialogTitle>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              We are currently accepting guests on a walk-in basis or via direct message. Please visit us
              at 180 Mistatim Rd NW or contact our team directly.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row justify-center">
              <a
                href="https://wa.me/15874013212?text=Hi%20Kahwa%20Cafe%2C%20I%20would%20like%20to%20inquire%20about%20a%20table"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
              >
                <span>WhatsApp Barista</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-contemporary rounded-full border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-card cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : !submitted ? (
          /* ==================================================================
              VIEW 3: BOOK A TABLE FORM
             ================================================================== */
          <>
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <Sparkles className="size-3.5" />
                <span>Kahwa Raw Cafe • حجز طاولة</span>
              </div>
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Reserve a Table
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Please provide your contact details and guest count. All fields are verified strictly to guarantee seating.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-2 space-y-3.5">
              {/* 1. Name of Person */}
              <div>
                <label
                  htmlFor="reservation-name"
                  className="block text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  Name of Person <span className="text-destructive">*</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
                    <User className="size-4" />
                  </span>
                  <input
                    id="reservation-name"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                    className={`h-10 sm:h-11 w-full rounded-xl border pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                      touched.name && !isNameValid
                        ? "border-destructive bg-destructive/5 focus:ring-destructive"
                        : touched.name && isNameValid
                          ? "border-emerald-600/60 bg-emerald-500/5 focus:ring-emerald-600"
                          : "border-border bg-card/60 focus:border-accent focus:ring-accent"
                    }`}
                  />
                </div>
                {touched.name && !isNameValid && (
                  <p className="mt-1 text-[11px] font-semibold text-destructive">
                    Only letters, spaces, hyphens, and apostrophes allowed (min 2 chars).
                  </p>
                )}
              </div>

              {/* 2. Mobile / WhatsApp Number */}
              <div>
                <label
                  htmlFor="reservation-phone"
                  className="block text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  Mobile / WhatsApp Number <span className="text-destructive">*</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
                    <Phone className="size-4" />
                  </span>
                  <input
                    id="reservation-phone"
                    type="tel"
                    required
                    placeholder="e.g. +1 587-401-3212"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                    className={`h-10 sm:h-11 w-full rounded-xl border pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                      touched.phone && !isPhoneValid
                        ? "border-destructive bg-destructive/5 focus:ring-destructive"
                        : touched.phone && isPhoneValid
                          ? "border-emerald-600/60 bg-emerald-500/5 focus:ring-emerald-600"
                          : "border-border bg-card/60 focus:border-accent focus:ring-accent"
                    }`}
                  />
                </div>
                {touched.phone && !isPhoneValid && (
                  <p className="mt-1 text-[11px] font-semibold text-destructive">
                    Enter a valid 10 to 15 digit phone or WhatsApp number.
                  </p>
                )}
              </div>

              {/* 3. E-mail ID */}
              <div>
                <label
                  htmlFor="reservation-email"
                  className="block text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  E-mail ID <span className="text-destructive">*</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
                    <Mail className="size-4" />
                  </span>
                  <input
                    id="reservation-email"
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    className={`h-10 sm:h-11 w-full rounded-xl border pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                      touched.email && !isEmailValid
                        ? "border-destructive bg-destructive/5 focus:ring-destructive"
                        : touched.email && isEmailValid
                          ? "border-emerald-600/60 bg-emerald-500/5 focus:ring-emerald-600"
                          : "border-border bg-card/60 focus:border-accent focus:ring-accent"
                    }`}
                  />
                </div>
                {touched.email && !isEmailValid && (
                  <p className="mt-1 text-[11px] font-semibold text-destructive">
                    Enter a valid email address (e.g. name@domain.com).
                  </p>
                )}
              </div>

              {/* 4. Number of Heads Visiting & Reservation Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="reservation-heads"
                    className="block text-xs font-bold uppercase tracking-wider text-foreground"
                  >
                    Number of Heads <span className="text-destructive">*</span>
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
                      <Users className="size-4" />
                    </span>
                    <input
                      id="reservation-heads"
                      type="number"
                      min={1}
                      max={20}
                      required
                      placeholder="e.g. 2"
                      value={heads}
                      onChange={(e) => setHeads(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, heads: true }))}
                      className={`h-10 sm:h-11 w-full rounded-xl border pl-10 pr-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                        touched.heads && !isHeadsValid
                          ? "border-destructive bg-destructive/5 focus:ring-destructive"
                          : touched.heads && isHeadsValid
                            ? "border-emerald-600/60 bg-emerald-500/5 focus:ring-emerald-600"
                            : "border-border bg-card/60 focus:border-accent focus:ring-accent"
                      }`}
                    />
                  </div>
                  {touched.heads && !isHeadsValid && (
                    <p className="mt-1 text-[11px] font-semibold text-destructive">
                      1 to 20 guests.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reservation-time"
                    className="block text-xs font-bold uppercase tracking-wider text-foreground"
                  >
                    Preferred Time
                  </label>
                  <div className="relative mt-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground pointer-events-none">
                      <Clock className="size-4" />
                    </span>
                    <select
                      id="reservation-time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-10 sm:h-11 w-full rounded-xl border border-border bg-card/60 pl-10 pr-3.5 text-xs sm:text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="10:00">10:00 AM - Morning Coffee</option>
                      <option value="12:00">12:00 PM - Lunch &amp; Pastry</option>
                      <option value="14:00">02:00 PM - Afternoon Tea</option>
                      <option value="16:00">04:00 PM - Kahwa Hour</option>
                      <option value="18:00">06:00 PM - Evening Dessert</option>
                      <option value="20:00">08:00 PM - Late Gathering</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Date selection */}
              <div>
                <label
                  htmlFor="reservation-date"
                  className="block text-xs font-bold uppercase tracking-wider text-foreground"
                >
                  Reservation Date
                </label>
                <input
                  id="reservation-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-10 sm:h-11 w-full rounded-xl border border-border bg-card/60 px-3.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="btn-contemporary group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm sm:text-base font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/95 hover:shadow-xl disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <Calendar className="size-4 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <span>Confirm Reservation</span>
                </button>
                {!isFormValid && (
                  <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
                    Please complete all required fields correctly to reserve.
                  </p>
                )}
              </div>
            </form>
          </>
        ) : (
          /* ==================================================================
              VIEW 4: CONFIRMATION SUCCESS & IMMEDIATE CANCELLATION OPTION
             ================================================================== */
          <div className="py-2 text-center">
            {isImmediateCancelled ? (
              /* Already cancelled immediately */
              <div className="space-y-4">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-500/10 text-red-500">
                  <XCircle className="size-10" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Reservation Cancelled
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your table reservation <strong className="font-mono text-accent">{createdReservation?.id}</strong> has been released and cancelled.
                </p>
                <div className="rounded-xl border border-border/80 bg-card p-4 text-xs text-muted-foreground">
                  We have updated our schedule. You are always welcome to book again whenever you are ready!
                </div>
                <div className="pt-2 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-contemporary w-full rounded-full border border-border/80 bg-background px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-card cursor-pointer"
                  >
                    Book a New Table
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenChange(false)}
                    className="btn-contemporary w-full rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/95 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Normal Confirmed View */
              <div>
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="size-10" />
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Table Reserved!
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm font-medium text-accent">
                  تم استلام طلب الحجز بنجاح
                </p>

                {/* Prominent Booking Reference Card */}
                <div className="mt-4 rounded-xl border border-accent/40 bg-accent/10 p-3 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Booking Reference ID
                    </span>
                    <span className="font-mono text-base sm:text-lg font-bold text-accent">
                      {createdReservation?.id || "KHW-101"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (createdReservation?.id) {
                        navigator.clipboard.writeText(createdReservation.id);
                        setCopiedRef(true);
                        setTimeout(() => setCopiedRef(false), 2000);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-1.5 text-xs font-semibold text-accent shadow-xs hover:bg-card cursor-pointer transition-all"
                  >
                    {copiedRef ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copiedRef ? "Copied!" : "Copy ID"}</span>
                  </button>
                </div>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  Thank you, <strong className="text-foreground">{name}</strong>! We have reserved a
                  table for{" "}
                  <strong className="text-foreground">
                    {heads} {parseInt(heads, 10) === 1 ? "head" : "heads"}
                  </strong>{" "}
                  on <strong className="text-foreground">{date}</strong> at{" "}
                  <strong className="text-foreground">{time}</strong>.
                </p>

                <div className="mt-4 rounded-xl border border-border/80 bg-card p-3 text-left text-xs leading-5">
                  <p>
                    <span className="font-bold text-foreground">Contact:</span> {phone}
                  </p>
                  <p>
                    <span className="font-bold text-foreground">Email:</span> {email}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    A confirmation notice has been sent to your WhatsApp and Email.
                  </p>
                </div>

                {/* Immediate Cancellation Option */}
                {showImmediateCancelPrompt ? (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-left space-y-2">
                    <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <XCircle className="size-3.5" />
                      <span>Are you sure you want to cancel this booking?</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      This will immediately release your reserved table at Kahwa Raw Cafe.
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleImmediateCancel}
                        className="btn-contemporary flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-500 cursor-pointer"
                      >
                        Yes, Cancel My Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowImmediateCancelPrompt(false)}
                        className="btn-contemporary rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-card cursor-pointer"
                      >
                        Keep Reservation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-2 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => setShowImmediateCancelPrompt(true)}
                      className="text-xs text-muted-foreground hover:text-red-400 transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Need to cancel or change your plans? Cancel this reservation
                    </button>
                  </div>
                )}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-contemporary w-full rounded-full border border-border/80 bg-background px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-card cursor-pointer"
                  >
                    Book Another Table
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenChange(false)}
                    className="btn-contemporary w-full rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/95 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
