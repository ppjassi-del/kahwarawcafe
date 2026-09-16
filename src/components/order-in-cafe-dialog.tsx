import * as React from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Copy,
  Plus,
  RotateCcw,
  Shield,
  Sparkles,
  Store,
  User,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { recordCafeOrder, type CafeOrder } from "@/lib/admin-store";
import type { MenuItem } from "@/lib/menu-data";

interface OrderInCafeDialogProps {
  item: MenuItem | {
    id: string;
    name: string;
    category?: string;
    categoryName?: string;
    price: string;
    image?: string;
    tag?: string;
    description?: string;
  };
  trigger?: React.ReactNode;
  triggerClassName?: string;
  triggerText?: string;
}

const QUICK_TABLES = [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
  "Patio Table",
];

const PREPARATION_PRESETS = [
  "Oat milk",
  "Almond milk",
  "Extra hot",
  "Less sweet",
  "Double espresso shot",
  "Decaf",
];

export function OrderInCafeDialog({
  item,
  trigger,
  triggerClassName,
  triggerText = "Order in café",
}: OrderInCafeDialogProps) {
  const [open, setOpen] = React.useState(false);

  // Form states
  const [orderType, setOrderType] = React.useState<"dine-in" | "takeaway">("dine-in");
  const [tableNumber, setTableNumber] = React.useState("Table 1");
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedOrder, setSubmittedOrder] = React.useState<CafeOrder | null>(null);
  const [copiedId, setCopiedId] = React.useState(false);

  const resetForm = () => {
    setOrderType("dine-in");
    setTableNumber("Table 1");
    setCustomerName("");
    setCustomerPhone("");
    setNotes("");
    setSubmittedOrder(null);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(resetForm, 300);
    }
  };

  const handlePresetNote = (preset: string) => {
    if (!notes) {
      setNotes(preset);
    } else if (!notes.includes(preset)) {
      setNotes(`${notes}, ${preset}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const created = recordCafeOrder({
        itemId: item.id,
        itemName: item.name,
        category: item.category || "coffee",
        categoryName: item.categoryName || "Cafe Item",
        price: item.price,
        image: item.image,
        tableNumber: orderType === "dine-in" ? tableNumber : "Takeaway Counter",
        orderType,
        customerName,
        customerPhone,
        notes,
      });

      setSubmittedOrder(created);
    } catch (err) {
      console.error("Error creating in-cafe order:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedOrder) {
      navigator.clipboard.writeText(submittedOrder.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className={
              triggerClassName ||
              "flex items-center gap-1 text-xs font-bold text-accent transition-colors duration-200 hover:underline group-hover:text-primary cursor-pointer"
            }
          >
            <span>{triggerText}</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-1.5rem)] sm:w-full max-w-xl max-h-[90svh] overflow-y-auto p-4 sm:p-7 bg-background border-border/80 shadow-2xl rounded-2xl sm:rounded-3xl">
        {!submittedOrder ? (
          <div>
            {/* Header */}
            <DialogHeader className="text-left pb-4 border-b border-border/60">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                  <Sparkles className="size-3.5" />
                  <span>In-Cafe Digital Order</span>
                </span>
                <span className="font-display text-lg font-bold text-accent">
                  {item.price}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-16 sm:size-20 rounded-2xl object-cover border border-border shadow-xs shrink-0"
                  />
                )}
                <div>
                  <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
                    {item.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {item.description || "Freshly handcrafted by our expert baristas using authentic ingredients."}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Dine-In vs Takeaway Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Dining Preference
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOrderType("dine-in")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-bold transition-all cursor-pointer ${
                      orderType === "dine-in"
                        ? "border-accent bg-accent text-accent-foreground shadow-sm ring-1 ring-accent"
                        : "border-border/80 bg-background/80 text-foreground hover:border-accent/40"
                    }`}
                  >
                    <Coffee className="size-4" />
                    <span>Dine-In (Table)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType("takeaway")}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-bold transition-all cursor-pointer ${
                      orderType === "takeaway"
                        ? "border-accent bg-accent text-accent-foreground shadow-sm ring-1 ring-accent"
                        : "border-border/80 bg-background/80 text-foreground hover:border-accent/40"
                    }`}
                  >
                    <Store className="size-4" />
                    <span>Takeaway / Counter</span>
                  </button>
                </div>
              </div>

              {/* Table Number Selection (if Dine-In) */}
              {orderType === "dine-in" && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Your Table Number
                    </label>
                    <span className="text-[11px] text-accent font-semibold">
                      Selected: {tableNumber}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUICK_TABLES.map((tbl) => (
                      <button
                        key={tbl}
                        type="button"
                        onClick={() => setTableNumber(tbl)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          tableNumber === tbl
                            ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-accent"
                            : "border border-border/80 bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground"
                        }`}
                      >
                        {tbl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Guest Details (Optional) */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="order-guest-name"
                    className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Your Name (Optional)
                  </label>
                  <input
                    id="order-guest-name"
                    type="text"
                    placeholder="e.g. Layla or Table 3"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="order-guest-phone"
                    className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    id="order-guest-phone"
                    type="tel"
                    placeholder="e.g. +1 587-555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Barista Notes & Dietary Customizations */}
              <div>
                <label
                  htmlFor="order-notes"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Barista Notes &amp; Preparation
                </label>
                <input
                  id="order-notes"
                  type="text"
                  placeholder="e.g. Oat milk, extra hot, less sweet..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PREPARATION_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetNote(preset)}
                      className="rounded-full border border-border/70 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-foreground/80 hover:border-accent hover:text-accent cursor-pointer transition-colors"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-Admin Accounts Dispatch Notification Pill */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
                  <Shield className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Instant Multi-Account Alert:</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                  Upon clicking submit, this order is dispatched in real time to all three accounts:
                  <strong> Primary Administrator</strong>, <strong>Cafe Floor Manager</strong>, and <strong>Shift Supervisor</strong>.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent/90 py-3.5 px-6 text-sm font-bold text-accent-foreground shadow-lg shadow-accent/20 transition-all duration-200 hover:brightness-105 active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <span>Send Order to Cafe Baristas ({item.price})</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        ) : (
          /* ================================================================
             ORDER CONFIRMATION VIEW
             ================================================================ */
          <div className="py-3 text-center space-y-6">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-inner animate-bounce">
              <Check className="size-8 stroke-[3]" />
            </div>

            <div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Order Sent to Baristas
              </span>
              <DialogTitle className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                Order Confirmed!
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-xs text-muted-foreground">
                Your order is now on the kitchen queue and being prepared handcrafted.
              </DialogDescription>
            </div>

            {/* Order Reference Box */}
            <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Order Reference ID
                  </span>
                  <div className="font-mono text-xl font-bold text-accent">
                    {submittedOrder.id}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:border-accent hover:text-accent cursor-pointer"
                >
                  <Copy className="size-3.5" />
                  <span>{copiedId ? "Copied!" : "Copy ID"}</span>
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-left text-xs">
                <div>
                  <span className="text-muted-foreground">Item:</span>{" "}
                  <span className="font-semibold text-foreground">{submittedOrder.itemName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span className="font-semibold text-accent">{submittedOrder.tableNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>{" "}
                  <span className="font-semibold text-foreground">{submittedOrder.price}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Wait:</span>{" "}
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <Clock className="size-3" /> 5 - 8 mins
                  </span>
                </div>
              </div>

              {submittedOrder.notes && (
                <div className="mt-2 text-left text-xs border-t border-border/60 pt-2 text-muted-foreground">
                  <span>Note: </span>
                  <span className="italic text-foreground font-medium">"{submittedOrder.notes}"</span>
                </div>
              )}
            </div>

            {/* Multi-Account Delivery Verification Badge */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Delivered to All 3 Admin Accounts:</span>
              </div>
              <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
                {submittedOrder.sentToAccounts.map((acc) => (
                  <div
                    key={acc.accountId}
                    className="flex items-center justify-between rounded-lg bg-background/80 px-2.5 py-1 border border-emerald-500/20"
                  >
                    <span className="font-semibold text-foreground">{acc.accountName}</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Received
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2.5 text-xs font-bold text-foreground hover:border-accent hover:text-accent cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>Order Another Item</span>
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
