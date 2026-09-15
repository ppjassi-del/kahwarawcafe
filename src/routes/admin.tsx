import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coffee,
  Copy,
  Download,
  Eye,
  EyeOff,
  Globe,
  Key,
  Laptop,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  MousePointerClick,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Smartphone,
  Trash2,
  TrendingUp,
  User,
  Users,
  X,
  XCircle,
  Sliders,
  Sparkles,
  Store,
  Video,
  Film,
  Check,
  Power,
  RotateCcw,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Switch } from "@/components/ui/switch";
import {
  authenticateAdmin,
  authenticateUser,
  clearAllData,
  exportDataToCSV,
  getAdminCredentials,
  getCafeOrders,
  getCafeSettings,
  getClickEvents,
  getCurrentUser,
  getReservations,
  getSiteVisits,
  getUserAccounts,
  isUserAuthenticated,
  logoutAdmin,
  recordReservation,
  seedSampleData,
  toggleMenuItemStock,
  toggleSubAccountEnabled,
  updateAdminCredentials,
  updateCafeOrderStatus,
  updateCafeSettings,
  updateReservationStatus,
  updateSubAccount,
  deleteCafeOrder,
  deleteReservation,
  cancelReservation,
  reactivateReservation,
  DEFAULT_CAFE_SETTINGS,
  type CafeOrder,
  type CafeSettings,
  type ClickEvent,
  type Reservation,
  type SiteVisit,
  type UserAccount,
  type UserSession,
} from "@/lib/admin-store";
import { menuItems, menuCategories, type MenuItem } from "@/lib/menu-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Kahwa Cafe | Admin Operations & Intelligence Hub" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabType = "overview" | "orders" | "menu-controls" | "reservations" | "clicks" | "visitors" | "settings";

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Login form states
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Admin Dashboard states
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<CafeOrder[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [settings, setSettings] = useState<CafeSettings>(DEFAULT_CAFE_SETTINGS);

  // Filter & Search states
  const [resFilter, setResFilter] = useState<string>("all");
  const [resSearch, setResSearch] = useState<string>("");
  const [ordersFilter, setOrdersFilter] = useState<string>("all");
  const [ordersSearch, setOrdersSearch] = useState<string>("");
  const [clicksFilter, setClicksFilter] = useState<"all" | "whatsapp" | "email">("all");
  const [menuFilter, setMenuFilter] = useState<string>("all");
  const [menuSearch, setMenuSearch] = useState<string>("");
  const [switchToast, setSwitchToast] = useState<string>("");

  // New reservation modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRes, setNewRes] = useState({
    name: "",
    phone: "",
    email: "",
    heads: 2,
    date: new Date().toISOString().split("T")[0],
    time: "18:00",
    notes: "",
  });

  // User Accounts & Authentication states
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);

  // Primary Admin Credential Form
  const [adminCurrentPass, setAdminCurrentPass] = useState("");
  const [adminNewUser, setAdminNewUser] = useState("admin");
  const [adminNewPass, setAdminNewPass] = useState("");
  const [adminConfirmPass, setAdminConfirmPass] = useState("");
  const [showAdminCurrentPass, setShowAdminCurrentPass] = useState(false);
  const [showAdminNewPass, setShowAdminNewPass] = useState(false);
  const [adminCredSuccess, setAdminCredSuccess] = useState("");
  const [adminCredError, setAdminCredError] = useState("");

  // Sub-Account 1 Form
  const [sub1Name, setSub1Name] = useState("Cafe Floor Manager");
  const [sub1User, setSub1User] = useState("manager1");
  const [sub1Pass, setSub1Pass] = useState("");
  const [sub1Enabled, setSub1Enabled] = useState(true);
  const [showSub1Pass, setShowSub1Pass] = useState(false);
  const [sub1Success, setSub1Success] = useState("");
  const [sub1Error, setSub1Error] = useState("");

  // Sub-Account 2 Form
  const [sub2Name, setSub2Name] = useState("Shift Supervisor");
  const [sub2User, setSub2User] = useState("supervisor2");
  const [sub2Pass, setSub2Pass] = useState("");
  const [sub2Enabled, setSub2Enabled] = useState(true);
  const [showSub2Pass, setShowSub2Pass] = useState(false);
  const [sub2Success, setSub2Success] = useState("");
  const [sub2Error, setSub2Error] = useState("");

  // Quick copy indicator for cheat-sheet
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopyValue = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Admin Cancel Reservation Modal states
  const [adminCancelModalReservation, setAdminCancelModalReservation] = useState<Reservation | null>(null);
  const [adminCancelReason, setAdminCancelReason] = useState("Customer phoned to cancel");
  const [adminCustomCancelReason, setAdminCustomCancelReason] = useState("");

  // Load data helper
  const reloadData = () => {
    setVisits(getSiteVisits());
    setClicks(getClickEvents());
    setReservations(getReservations());
    setOrders(getCafeOrders());
    setSettings(getCafeSettings());
    const accs = getUserAccounts();
    setAccounts(accs);
    const user = getCurrentUser();
    setCurrentUser(user);

    const adm = accs.find((a) => a.id === "admin");
    if (adm) {
      setAdminNewUser(adm.username);
    }
    const s1 = accs.find((a) => a.id === "sub_1");
    if (s1) {
      setSub1Name(s1.displayName);
      setSub1User(s1.username);
      setSub1Enabled(s1.enabled);
    }
    const s2 = accs.find((a) => a.id === "sub_2");
    if (s2) {
      setSub2Name(s2.displayName);
      setSub2User(s2.username);
      setSub2Enabled(s2.enabled);
    }
  };

  // Order Handlers
  const handleUpdateOrderStatus = (id: string, newStatus: CafeOrder["status"]) => {
    updateCafeOrderStatus(id, newStatus);
    reloadData();
    setSwitchToast(`Order ${id} marked as "${newStatus.toUpperCase()}".`);
    setTimeout(() => setSwitchToast(""), 3500);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm(`Are you sure you want to delete order record ${id}?`)) {
      deleteCafeOrder(id);
      reloadData();
      setSwitchToast(`Order ${id} removed.`);
      setTimeout(() => setSwitchToast(""), 3500);
    }
  };

  const handleAdminConfirmCancel = () => {
    if (!adminCancelModalReservation) return;
    const finalReason =
      adminCancelReason === "Other reason" && adminCustomCancelReason.trim()
        ? adminCustomCancelReason.trim()
        : adminCancelReason;

    cancelReservation(adminCancelModalReservation.id, "admin", finalReason);
    setAdminCancelModalReservation(null);
    setAdminCustomCancelReason("");
    reloadData();
    setSwitchToast(`Reservation ${adminCancelModalReservation.id} cancelled by admin.`);
    setTimeout(() => setSwitchToast(""), 3500);
  };

  const handleAdminReactivate = (id: string) => {
    reactivateReservation(id);
    reloadData();
    setSwitchToast(`Reservation ${id} restored to confirmed.`);
    setTimeout(() => setSwitchToast(""), 3500);
  };

  // Primary Admin Credential Update Handler
  const handleSaveAdminCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCredError("");
    setAdminCredSuccess("");

    if (!adminCurrentPass) {
      setAdminCredError("Please enter your current administrator password.");
      return;
    }
    if (adminNewPass !== adminConfirmPass) {
      setAdminCredError("New password and confirmation password do not match.");
      return;
    }

    const res = updateAdminCredentials(adminCurrentPass, adminNewUser, adminNewPass);
    if (res.success) {
      setAdminCredSuccess(res.message);
      setAdminCurrentPass("");
      setAdminNewPass("");
      setAdminConfirmPass("");
      reloadData();
      setTimeout(() => setAdminCredSuccess(""), 4500);
    } else {
      setAdminCredError(res.message);
    }
  };

  // Sub-Account 1 Update Handler
  const handleSaveSubAccount1 = (e: React.FormEvent) => {
    e.preventDefault();
    setSub1Error("");
    setSub1Success("");

    const res = updateSubAccount("sub_1", {
      displayName: sub1Name,
      username: sub1User,
      password: sub1Pass.trim() ? sub1Pass.trim() : undefined,
      enabled: sub1Enabled,
    });

    if (res.success) {
      setSub1Success(res.message);
      setSub1Pass("");
      reloadData();
      setTimeout(() => setSub1Success(""), 4500);
    } else {
      setSub1Error(res.message);
    }
  };

  // Sub-Account 2 Update Handler
  const handleSaveSubAccount2 = (e: React.FormEvent) => {
    e.preventDefault();
    setSub2Error("");
    setSub2Success("");

    const res = updateSubAccount("sub_2", {
      displayName: sub2Name,
      username: sub2User,
      password: sub2Pass.trim() ? sub2Pass.trim() : undefined,
      enabled: sub2Enabled,
    });

    if (res.success) {
      setSub2Success(res.message);
      setSub2Pass("");
      reloadData();
      setTimeout(() => setSub2Success(""), 4500);
    } else {
      setSub2Error(res.message);
    }
  };

  // Toggle Sub-Account Status
  const handleToggleSubAccount = (id: "sub_1" | "sub_2", enable: boolean) => {
    if (id === "sub_1") {
      setSub1Enabled(enable);
      updateSubAccount("sub_1", {
        displayName: sub1Name,
        username: sub1User,
        enabled: enable,
      });
    } else {
      setSub2Enabled(enable);
      updateSubAccount("sub_2", {
        displayName: sub2Name,
        username: sub2User,
        enabled: enable,
      });
    }
    reloadData();
    setSwitchToast(`${id === "sub_1" ? sub1Name : sub2Name} access is now ${enable ? "Enabled" : "Disabled"}`);
    setTimeout(() => setSwitchToast(""), 3500);
  };

  // Switch handlers
  const handleToggleSetting = (key: keyof CafeSettings, value: boolean) => {
    const updated = updateCafeSettings({ [key]: value });
    setSettings(updated);
    const labelMap: Record<string, string> = {
      isOpen: "Cafe Open Status",
      reservationsEnabled: "Online Table Reservations",
      showAtmosphereVideo: "Atmosphere Video Tour",
      showCoffeeJourneyVideo: "Coffee Journey Craft Reel",
      showMenuBoard: "In-Store Menu Board Modal",
    };
    setSwitchToast(`${labelMap[String(key)] || String(key)} is now switched ${value ? "ON" : "OFF"}`);
    setTimeout(() => setSwitchToast(""), 3500);
  };

  const handleToggleStock = (itemId: string, itemName: string) => {
    const isNowOutOfStock = toggleMenuItemStock(itemId);
    setSettings(getCafeSettings());
    setSwitchToast(
      isNowOutOfStock
        ? `"${itemName}" switched OFF (Marked Sold Out)`
        : `"${itemName}" switched ON (Available in cafe)`
    );
    setTimeout(() => setSwitchToast(""), 3500);
  };

  const handleSetAllStock = (inStock: boolean) => {
    const updated = updateCafeSettings({
      outOfStockItems: inStock ? [] : menuItems.map((m) => m.id),
    });
    setSettings(updated);
    setSwitchToast(inStock ? "All menu items switched ON" : "All menu items switched OFF");
    setTimeout(() => setSwitchToast(""), 3500);
  };

  useEffect(() => {
    const isAuthed = isUserAuthenticated();
    setIsAuthenticated(isAuthed);
    setAuthChecked(true);

    if (isAuthed) {
      reloadData();
    }

    // Auto-seed initial sample data if empty so admin has rich initial experience
    if (typeof window !== "undefined") {
      const storedVisits = getSiteVisits();
      const storedClicks = getClickEvents();
      const storedRes = getReservations();
      if (storedVisits.length === 0 && storedClicks.length === 0 && storedRes.length === 0) {
        seedSampleData();
        reloadData();
      }
    }

    const handleStorageUpdate = () => {
      reloadData();
    };
    window.addEventListener("kahwa:storage_update", handleStorageUpdate);
    return () => {
      window.removeEventListener("kahwa:storage_update", handleStorageUpdate);
    };
  }, []);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const result = authenticateUser(loginUsername, loginPassword);
    if (result.success && result.session) {
      setIsAuthenticated(true);
      setCurrentUser(result.session);
      reloadData();
    } else {
      setLoginError(result.message || "Invalid username or password. Please try again.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginPassword("");
  };

  // Copy Admin link
  const handleCopyAdminLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // Handle manual reservation submit
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRes.name.trim() || !newRes.phone.trim()) return;
    recordReservation(newRes);
    setShowAddModal(false);
    setNewRes({
      name: "",
      phone: "",
      email: "",
      heads: 2,
      date: new Date().toISOString().split("T")[0],
      time: "18:00",
      notes: "",
    });
    reloadData();
  };

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesStatus = resFilter === "all" || r.status === resFilter;
      const searchLower = resSearch.toLowerCase();
      const matchesSearch =
        !resSearch ||
        r.name.toLowerCase().includes(searchLower) ||
        r.phone.toLowerCase().includes(searchLower) ||
        r.email.toLowerCase().includes(searchLower) ||
        r.id.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [reservations, resFilter, resSearch]);

  // Filtered click events
  const filteredClicks = useMemo(() => {
    return clicks.filter((c) => {
      if (clicksFilter === "all") return true;
      return c.type === clicksFilter;
    });
  }, [clicks, clicksFilter]);

  // Filtered admin menu items
  const filteredAdminMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = menuFilter === "all" || item.category === menuFilter;
      const searchLower = menuSearch.toLowerCase();
      const matchesSearch =
        !menuSearch ||
        item.name.toLowerCase().includes(searchLower) ||
        item.categoryName.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [menuFilter, menuSearch]);

  // Metrics calculations
  const totalVisitsCount = visits.length;
  const uniqueVisitorsCount = useMemo(() => {
    return new Set(visits.map((v) => v.visitorId)).size;
  }, [visits]);

  const whatsappClicks = useMemo(() => {
    return clicks.filter((c) => c.type === "whatsapp");
  }, [clicks]);

  const emailClicks = useMemo(() => {
    return clicks.filter((c) => c.type === "email");
  }, [clicks]);

  const pendingReservationsCount = useMemo(() => {
    return reservations.filter((r) => r.status === "pending").length;
  }, [reservations]);

  const totalHeadsReserved = useMemo(() => {
    return reservations
      .filter((r) => r.status !== "cancelled")
      .reduce((sum, r) => sum + (r.heads || 0), 0);
  }, [reservations]);

  const resCounts = useMemo(() => {
    return {
      all: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      completed: reservations.filter((r) => r.status === "completed").length,
      cancelled: reservations.filter((r) => r.status === "cancelled").length,
    };
  }, [reservations]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = ordersFilter === "all" || o.status === ordersFilter;
      const searchLower = ordersSearch.toLowerCase();
      const matchesSearch =
        !ordersSearch ||
        o.id.toLowerCase().includes(searchLower) ||
        o.itemName.toLowerCase().includes(searchLower) ||
        o.tableNumber.toLowerCase().includes(searchLower) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchLower)) ||
        (o.notes && o.notes.toLowerCase().includes(searchLower));
      return matchesStatus && matchesSearch;
    });
  }, [orders, ordersFilter, ordersSearch]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => o.status === "new" || o.status === "preparing").length;
  }, [orders]);

  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      new: orders.filter((o) => o.status === "new").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      served: orders.filter((o) => o.status === "served").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-50">
        <div className="flex items-center gap-3">
          <RefreshCw className="size-6 animate-spin text-amber-500" />
          <span className="font-medium tracking-wide">Securing Kahwa Operations...</span>
        </div>
      </div>
    );
  }

  /* ========================================================================
     1. LOGIN SCREEN
     ======================================================================== */
  if (!isAuthenticated) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 px-4 py-12 text-zinc-100">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-96 rounded-full bg-amber-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-10 size-96 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-amber-500/20 bg-zinc-900/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4 grid size-16 place-items-center rounded-2xl border border-amber-500/30 bg-gradient-to-tr from-amber-600/20 to-amber-400/20 shadow-inner">
              <Shield className="size-8 text-amber-400" />
              <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-950">
                ★
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-amber-100 sm:text-4xl">
              Kahwa Raw Cafe
            </h1>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400/80">
              Admin &amp; Operations Portal
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Sign in to monitor live traffic, WhatsApp/Email inquiries, and table reservations.
            </p>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/15 p-3.5 text-xs font-medium text-red-300">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="admin-user"
                className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
              >
                Username
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <User className="size-4" />
                </div>
                <input
                  id="admin-user"
                  type="text"
                  required
                  placeholder="e.g. admin"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/80 py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="admin-pass"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                >
                  Password
                </label>
              </div>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                  <Lock className="size-4" />
                </div>
                <input
                  id="admin-pass"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/80 py-3 pl-10 pr-11 text-sm font-medium text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Quick credentials hint */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-300/85">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Key className="size-3.5" />
                <span>Authorized Sign-In Options:</span>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-1.5 font-mono text-[11px] sm:grid-cols-2">
                <div className="rounded-lg bg-zinc-900/80 p-2 border border-zinc-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Primary Admin</div>
                  <div className="text-zinc-300">User: <code className="text-amber-200">admin</code></div>
                  <div className="text-zinc-300">Pass: <code className="text-amber-200">kahwa2026</code></div>
                </div>
                <div className="rounded-lg bg-zinc-900/80 p-2 border border-zinc-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Staff Sub-Accounts</div>
                  <div className="text-zinc-300">User: <code className="text-blue-200">manager1</code> (Pass: <code className="text-blue-200">kahwa123</code>)</div>
                  <div className="text-zinc-300">User: <code className="text-blue-200">supervisor2</code> (Pass: <code className="text-blue-200">kahwa456</code>)</div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:from-amber-400 hover:to-amber-500 hover:shadow-xl hover:shadow-amber-500/40 active:scale-[0.98] cursor-pointer"
            >
              <span>Unlock Admin Panel</span>
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </form>

          {/* Footer return link */}
          <div className="mt-8 border-t border-zinc-800/80 pt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition-colors hover:text-amber-400"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Public Kahwa Cafe Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================
     2. ADMIN DASHBOARD VIEW
     ======================================================================== */
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-3.5">
            <div className="grid size-10 place-items-center rounded-xl border border-amber-500/40 bg-gradient-to-tr from-amber-500/20 to-amber-400/10 font-display text-lg font-bold text-amber-400">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-zinc-100">
                  Kahwa Raw Cafe
                </span>
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Admin Hub
                </span>
              </div>
              <p className="text-xs text-zinc-400">Operations &amp; Customer Analytics</p>
            </div>
          </div>

          {/* Quick Actions & Header Switches */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick Switch: Reservations On/Off */}
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 shadow-xs">
              <Coffee className="size-3.5 text-amber-400" />
              <span className="hidden text-xs font-semibold text-zinc-300 md:inline">
                Reservations:
              </span>
              <Switch
                id="header-switch-reservations"
                checked={settings.reservationsEnabled}
                onCheckedChange={(checked) => handleToggleSetting("reservationsEnabled", checked)}
                className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-700"
                aria-label="Toggle Online Table Reservations"
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  settings.reservationsEnabled ? "text-emerald-400" : "text-zinc-500"
                }`}
              >
                {settings.reservationsEnabled ? "ON" : "OFF"}
              </span>
            </div>

            {/* Quick Switch: Cafe Open/Close */}
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 shadow-xs">
              <Store className="size-3.5 text-amber-400" />
              <span className="hidden text-xs font-semibold text-zinc-300 md:inline">
                Cafe:
              </span>
              <Switch
                id="header-switch-cafe"
                checked={settings.isOpen}
                onCheckedChange={(checked) => handleToggleSetting("isOpen", checked)}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700"
                aria-label="Toggle Cafe Open Status"
              />
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  settings.isOpen ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {settings.isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>

            {/* Logged-in User Profile Badge */}
            {currentUser && (
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 shadow-xs">
                <div
                  className={`grid size-6 place-items-center rounded-lg text-xs font-bold ${
                    currentUser.role === "admin"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  }`}
                >
                  {currentUser.role === "admin" ? (
                    <Shield className="size-3.5" />
                  ) : (
                    <User className="size-3.5" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5 leading-tight">
                    <span className="text-xs font-bold text-zinc-100">
                      {currentUser.displayName}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                        currentUser.role === "admin"
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {currentUser.role === "admin" ? "Master Admin" : "Sub-Account"}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400">
                    @{currentUser.username}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleCopyAdminLink}
              title="Copy Special Admin URL"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-amber-500/40 hover:bg-zinc-800 hover:text-amber-400 cursor-pointer"
            >
              <Copy className="size-3.5" />
              <span className="hidden sm:inline">
                {copiedLink ? "Link Copied!" : "Copy Admin Link"}
              </span>
            </button>

            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              <Globe className="size-3.5 text-zinc-400" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition-colors hover:bg-red-500/20 cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 border-t border-zinc-800/60 py-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <BarChart3 className="size-4" />
              <span>Overview</span>
            </button>

            {/* Live In-Cafe Orders Tab */}
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Store className="size-4" />
              <span>Live In-Cafe Orders</span>
              {activeOrdersCount > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold text-zinc-950 animate-pulse">
                  {activeOrdersCount}
                </span>
              )}
            </button>

            {/* Menu & Feature Switches Tab */}
            <button
              onClick={() => setActiveTab("menu-controls")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "menu-controls"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Sliders className="size-4" />
              <span>Menu &amp; Controls</span>
              {settings.outOfStockItems.length > 0 && (
                <span className="rounded-full bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.2 text-[10px] font-bold">
                  {settings.outOfStockItems.length} Off
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("reservations")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "reservations"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Coffee className="size-4" />
              <span>Reservations</span>
              {pendingReservationsCount > 0 && (
                <span className="rounded-full bg-amber-500 px-1.5 py-0.2 text-[10px] font-bold text-zinc-950">
                  {pendingReservationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("clicks")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "clicks"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <MousePointerClick className="size-4" />
              <span>WhatsApp &amp; Email Clicks</span>
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-bold text-zinc-300">
                {clicks.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("visitors")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "visitors"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Users className="size-4" />
              <span>Site Visitors</span>
              <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-bold text-zinc-300">
                {visits.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-amber-500/15 text-amber-400 shadow-xs border border-amber-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Key className="size-4" />
              <span>Accounts &amp; Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Real-time Switch Toast Notification */}
        {switchToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-500/50 bg-zinc-900/95 px-4 py-3 text-xs font-semibold text-amber-300 shadow-2xl backdrop-blur-md">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
            <span>{switchToast}</span>
          </div>
        )}

        {/* ==================================================================
           TAB 1: OVERVIEW & INTELLIGENCE
           ================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Top Row: Welcome Banner with Special Link Info */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 p-6 shadow-xl sm:p-8">
              <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                    Live Operations Status • Edmonton NW
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
                    Kahwa Cafe Intelligence Dashboard
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                    Real-time telemetry tracking visitor footfalls, direct WhatsApp inquiries,
                    email communications, and automated table reservations.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      seedSampleData();
                      reloadData();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-xs font-bold text-zinc-200 shadow-xs hover:border-amber-500/40 hover:bg-zinc-700 cursor-pointer"
                  >
                    <RefreshCw className="size-3.5 text-amber-400" />
                    <span>Reset / Load Sample Data</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-xs hover:bg-emerald-500/20 cursor-pointer"
                  >
                    <Store className="size-3.5" />
                    <span>In-Cafe Orders ({activeOrdersCount})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("reservations")}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 cursor-pointer"
                  >
                    <Coffee className="size-3.5" />
                    <span>Manage Reservations</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 7 Key Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {/* Stat 1: Site Visits */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Page Visits</span>
                  <Globe className="size-4 text-amber-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-zinc-100">
                  {totalVisitsCount}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">
                  <span className="font-semibold text-amber-400">{uniqueVisitorsCount}</span> unique
                  visitors
                </p>
              </div>

              {/* Stat 2: In-Cafe Orders */}
              <div
                onClick={() => setActiveTab("orders")}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-sm backdrop-blur-xs cursor-pointer hover:border-emerald-400 transition-all"
              >
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">In-Cafe Orders</span>
                  <Store className="size-4 text-emerald-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-emerald-300">
                  {orders.length}
                </p>
                <p className="mt-1 text-[11px] text-emerald-400/80">
                  <span className="font-semibold text-emerald-300">{activeOrdersCount}</span> active in queue
                </p>
              </div>

              {/* Stat 3: WhatsApp Clicks */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/15 p-4 shadow-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">WhatsApp</span>
                  <MessageCircle className="size-4 text-emerald-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-emerald-300">
                  {whatsappClicks.length}
                </p>
                <p className="mt-1 text-[11px] text-emerald-400/80">Direct chat requests</p>
              </div>

              {/* Stat 4: Email Inquiries */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-950/15 p-4 shadow-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-blue-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Email Clicks</span>
                  <Mail className="size-4 text-blue-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-blue-300">
                  {emailClicks.length}
                </p>
                <p className="mt-1 text-[11px] text-blue-400/80">Contact inquiries</p>
              </div>

              {/* Stat 5: Total Bookings */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Reservations</span>
                  <Coffee className="size-4 text-amber-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-zinc-100">
                  {reservations.length}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">Total bookings received</p>
              </div>

              {/* Stat 6: Pending Action */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 shadow-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
                  <Clock className="size-4 text-amber-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-amber-300">
                  {pendingReservationsCount}
                </p>
                <p className="mt-1 text-[11px] text-amber-400/80">Requires confirmation</p>
              </div>

              {/* Stat 7: Guests Headcount */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Guests</span>
                  <Users className="size-4 text-amber-400" />
                </div>
                <p className="mt-3 font-display text-3xl font-bold text-zinc-100">
                  {totalHeadsReserved}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">Seats reserved</p>
              </div>
            </div>

            {/* Middle Section: Activity Distribution & Recent Feed */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left 2 Cols: Conversion & Device Distribution */}
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-zinc-100">
                        Engagement Conversion Breakdown
                      </h3>
                      <p className="text-xs text-zinc-400">
                        How visitors interact with Kahwa's contact points
                      </p>
                    </div>
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-bold text-amber-400">
                      Telemetry
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {/* WhatsApp Rate */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <MessageCircle className="size-3.5" /> WhatsApp Button Clicks
                        </span>
                        <span className="text-zinc-300">
                          {whatsappClicks.length} clicks (
                          {totalVisitsCount > 0
                            ? Math.round((whatsappClicks.length / totalVisitsCount) * 100)
                            : 0}
                          % of visits)
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(8, (whatsappClicks.length / Math.max(1, totalVisitsCount)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Email Rate */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-blue-400">
                          <Mail className="size-3.5" /> Email Button Clicks
                        </span>
                        <span className="text-zinc-300">
                          {emailClicks.length} clicks (
                          {totalVisitsCount > 0
                            ? Math.round((emailClicks.length / totalVisitsCount) * 100)
                            : 0}
                          % of visits)
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(6, (emailClicks.length / Math.max(1, totalVisitsCount)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Reservations Rate */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <Coffee className="size-3.5" /> Table Reservations Submitted
                        </span>
                        <span className="text-zinc-300">
                          {reservations.length} bookings (
                          {totalVisitsCount > 0
                            ? Math.round((reservations.length / totalVisitsCount) * 100)
                            : 0}
                          % conversion)
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(10, (reservations.length / Math.max(1, totalVisitsCount)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Device breakdown badges */}
                  <div className="mt-8 grid grid-cols-3 gap-3 border-t border-zinc-800/80 pt-6">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center">
                      <Smartphone className="mx-auto size-4 text-zinc-400" />
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Mobile
                      </p>
                      <p className="text-lg font-bold text-zinc-100">
                        {visits.filter((v) => v.device === "Mobile").length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center">
                      <Laptop className="mx-auto size-4 text-zinc-400" />
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Desktop
                      </p>
                      <p className="text-lg font-bold text-zinc-100">
                        {visits.filter((v) => v.device === "Desktop").length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 text-center">
                      <Globe className="mx-auto size-4 text-zinc-400" />
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Tablet/Other
                      </p>
                      <p className="text-lg font-bold text-zinc-100">
                        {visits.filter((v) => v.device === "Tablet").length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts to Export */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <div className="flex items-center gap-3">
                    <Download className="size-5 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-zinc-200">Download Data Reports</p>
                      <p className="text-[11px] text-zinc-400">Export clean CSV spreadsheets</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => exportDataToCSV("reservations")}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                    >
                      Reservations CSV
                    </button>
                    <button
                      onClick={() => exportDataToCSV("clicks")}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                    >
                      Clicks Log CSV
                    </button>
                    <button
                      onClick={() => exportDataToCSV("visits")}
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                    >
                      Visits Log CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Live Activity Stream */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-zinc-100">Recent Stream</h3>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-400">Latest reservations and click engagements</p>

                <div className="mt-5 space-y-3.5">
                  {reservations.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-950/10 p-3 text-xs"
                    >
                      <Coffee className="mt-0.5 size-4 shrink-0 text-amber-400" />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-zinc-200">
                          {r.name} ({r.heads} guests)
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {r.date} at {r.time} •{" "}
                          <span
                            className={
                              r.status === "confirmed"
                                ? "text-emerald-400"
                                : r.status === "pending"
                                  ? "text-amber-400"
                                  : "text-zinc-400"
                            }
                          >
                            {r.status}
                          </span>
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-400">{r.id}</span>
                    </div>
                  ))}

                  {clicks.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs"
                    >
                      {c.type === "whatsapp" ? (
                        <MessageCircle className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      ) : (
                        <Mail className="mt-0.5 size-4 shrink-0 text-blue-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-zinc-300">
                          {c.type === "whatsapp" ? "WhatsApp Clicked" : "Email Inquired"}
                        </p>
                        <p className="truncate text-[11px] text-zinc-400">{c.source}</p>
                      </div>
                      <span className="text-[10px] text-zinc-400">{c.device}</span>
                    </div>
                  ))}

                  {reservations.length === 0 && clicks.length === 0 && (
                    <div className="py-8 text-center text-xs text-zinc-400">
                      No customer activities recorded yet. Click "Reset / Load Sample Data" above to
                      populate demonstration entries.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
           TAB 1.5: LIVE IN-CAFE ORDERS (SENT TO ALL 3 ADMIN ACCOUNTS)
           ================================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 p-6 shadow-xl sm:p-8">
              <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30">
                      <Store className="size-3.5" />
                      Live In-Cafe Queue
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 border border-blue-500/30">
                      <Users className="size-3.5" />
                      Alerts Sent to All 3 Admin Accounts
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
                    Live In-Cafe Digital Orders
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                    Real-time feed of food &amp; drink orders submitted by guests in the cafe. Every order is automatically transmitted in real time to the Master Admin, Cafe Floor Manager, and Shift Supervisor.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => exportDataToCSV("orders")}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/90 px-3.5 py-2 text-xs font-bold text-zinc-200 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer shadow-xs"
                  >
                    <Download className="size-3.5" />
                    <span>Export Orders CSV</span>
                  </button>

                  <button
                    onClick={() => {
                      recordCafeOrder({
                        itemId: "kahwa-flat-white",
                        itemName: "Signature Flat White",
                        category: "coffee",
                        categoryName: "Signature Coffee",
                        price: "CAD $5.50",
                        tableNumber: `Table ${Math.floor(Math.random() * 8) + 1}`,
                        orderType: "dine-in",
                        customerName: "Walk-in Guest",
                        notes: "Extra hot with oat milk",
                      });
                      reloadData();
                      setSwitchToast("Simulated live in-cafe order transmitted to all 3 accounts!");
                      setTimeout(() => setSwitchToast(""), 3500);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-2 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-400 hover:to-amber-500 cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Simulate Test Order</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 5 In-Cafe Order Metric Summary Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Total Orders
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-zinc-100">
                  {orderCounts.all}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">Lifetime in-cafe orders</p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  New (Awaiting Prep)
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-amber-300">
                  {orderCounts.new}
                </p>
                <p className="mt-1 text-[11px] text-amber-400/80">Needs barista attention</p>
              </div>

              <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  In Preparation
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-blue-300">
                  {orderCounts.preparing}
                </p>
                <p className="mt-1 text-[11px] text-blue-400/80">Currently being brewed</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Ready for Table
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-emerald-300">
                  {orderCounts.ready}
                </p>
                <p className="mt-1 text-[11px] text-emerald-400/80">Waiting for runner/pickup</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Served &amp; Completed
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-zinc-100">
                  {orderCounts.served}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">Delivered to guest</p>
              </div>
            </div>

            {/* Filter Pills & Search Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: "all", label: "All Orders", count: orderCounts.all },
                    { key: "new", label: "New", count: orderCounts.new },
                    { key: "preparing", label: "Preparing", count: orderCounts.preparing },
                    { key: "ready", label: "Ready", count: orderCounts.ready },
                    { key: "served", label: "Served", count: orderCounts.served },
                    { key: "cancelled", label: "Cancelled", count: orderCounts.cancelled },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setOrdersFilter(tab.key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                      ordersFilter === tab.key
                        ? "bg-amber-500 text-zinc-950 shadow-sm"
                        : "border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-semibold ${
                        ordersFilter === tab.key
                          ? "bg-zinc-950/20 text-zinc-950"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search order, table, guest..."
                  value={ordersSearch}
                  onChange={(e) => setOrdersSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 py-2 pl-9 pr-4 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Orders Feed Cards / Table */}
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isNew = order.status === "new";
                const isPreparing = order.status === "preparing";
                const isReady = order.status === "ready";
                const isServed = order.status === "served";
                const isCancelled = order.status === "cancelled";

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border p-5 transition-all shadow-sm ${
                      isNew
                        ? "border-amber-500/40 bg-amber-950/10 ring-1 ring-amber-500/20"
                        : isPreparing
                        ? "border-blue-500/30 bg-blue-950/10"
                        : isReady
                        ? "border-emerald-500/30 bg-emerald-950/10"
                        : isCancelled
                        ? "border-red-500/20 bg-red-950/10 opacity-75"
                        : "border-zinc-800 bg-zinc-900/70"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Left: Order Info */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-amber-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                            {order.id}
                          </span>
                          <span className="rounded-full bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 text-xs font-bold text-zinc-200">
                            {order.tableNumber}
                          </span>
                          <span className="text-[11px] font-medium text-zinc-400">
                            {new Date(order.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              isNew
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
                                : isPreparing
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : isReady
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : isServed
                                ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Right: Quick Action Workflow Buttons */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isNew && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 cursor-pointer shadow-xs"
                          >
                            <Clock className="size-3.5" />
                            <span>Start Preparing</span>
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "ready")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 cursor-pointer shadow-xs"
                          >
                            <Check className="size-3.5" />
                            <span>Mark Ready for Table</span>
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "served")}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-zinc-700 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="size-3.5" />
                            <span>Mark as Served</span>
                          </button>
                        )}

                        {isServed && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-lg">
                            <Check className="size-3.5" />
                            <span>Served &amp; Completed</span>
                          </span>
                        )}

                        {!isCancelled && !isServed && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20 cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Delete Order Record"
                          className="rounded-xl p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-zinc-800/80 pt-4 md:grid-cols-3">
                      {/* Item Details */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          Ordered Item
                        </span>
                        <div className="mt-1 flex items-center gap-2.5">
                          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            <Coffee className="size-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-zinc-100">{order.itemName}</h4>
                            <p className="text-xs text-amber-400 font-semibold">{order.price}</p>
                          </div>
                        </div>
                      </div>

                      {/* Guest & Customization Notes */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                          Guest &amp; Preparation Notes
                        </span>
                        <div className="mt-1 text-xs text-zinc-300 space-y-0.5">
                          <div>
                            <span className="text-zinc-500">Guest:</span>{" "}
                            <span className="font-semibold text-zinc-200">
                              {order.customerName || "In-Cafe Customer"}
                            </span>
                            {order.customerPhone && (
                              <span className="ml-1 text-zinc-400 font-mono">({order.customerPhone})</span>
                            )}
                          </div>
                          {order.notes ? (
                            <div className="italic text-amber-200/90 bg-zinc-950/60 p-1.5 rounded-lg border border-zinc-800">
                              "{order.notes}"
                            </div>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">Standard recipe</span>
                          )}
                        </div>
                      </div>

                      {/* 3 Accounts Delivery Acknowledgement Box */}
                      <div className="rounded-xl bg-zinc-950/70 p-3 border border-emerald-500/20">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="size-3 text-emerald-400" />
                          Sent to All 3 Admin Accounts:
                        </span>
                        <div className="mt-1.5 space-y-1 font-mono text-[10px]">
                          {order.sentToAccounts && order.sentToAccounts.length > 0 ? (
                            order.sentToAccounts.map((acc) => (
                              <div key={acc.accountId} className="flex items-center justify-between text-zinc-300">
                                <span>{acc.accountName}:</span>
                                <span className="text-emerald-400 font-semibold">✓ Delivered</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-zinc-400">
                              <span>Master Admin &amp; 2 Sub-Accounts: </span>
                              <span className="text-emerald-400">✓ Received</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
                  <Store className="mx-auto size-10 text-zinc-500" />
                  <h3 className="mt-3 font-display text-base font-bold text-zinc-200">
                    No In-Cafe Orders Found
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">
                    {ordersSearch
                      ? `No orders matching "${ordersSearch}". Try searching for another item or table.`
                      : "No orders currently in this status category."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
           TAB 2: CAFE MENU & FEATURE SWITCHES
           ================================================================== */}
        {activeTab === "menu-controls" && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 p-6 shadow-xl sm:p-8">
              <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Sliders className="size-3.5" />
                    Central Operations Switchboard
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-zinc-100 sm:text-3xl">
                    Menu Items &amp; Feature Switches
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                    Turn individual menu items ON or OFF (Available vs. Sold Out) and toggle core website
                    components including online reservations, atmosphere video tour, and coffee craft reel.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => handleSetAllStock(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/90 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 cursor-pointer"
                  >
                    <Check className="size-4" />
                    <span>Turn All Items ON</span>
                  </button>
                  <button
                    onClick={() => handleSetAllStock(false)}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/90 px-4 py-2.5 text-xs font-bold text-zinc-300 shadow-xs hover:border-red-500/40 hover:bg-zinc-700 cursor-pointer"
                  >
                    <Power className="size-4 text-red-400" />
                    <span>Turn All Items OFF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Total Menu Items
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-zinc-100">
                  {menuItems.length}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">Catalog items</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/15 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Items Available (ON)
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-emerald-300">
                  {menuItems.length - settings.outOfStockItems.length}
                </p>
                <p className="mt-1 text-[11px] text-emerald-400/80">In stock for customers</p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Items Switched OFF
                </span>
                <p className="mt-2 font-display text-3xl font-bold text-amber-300">
                  {settings.outOfStockItems.length}
                </p>
                <p className="mt-1 text-[11px] text-amber-400/80">Marked as Sold Out</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-sm backdrop-blur-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Online Bookings
                </span>
                <p
                  className={`mt-2 font-display text-2xl font-bold ${
                    settings.reservationsEnabled ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  {settings.reservationsEnabled ? "ACTIVE (ON)" : "PAUSED (OFF)"}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">Customer table bookings</p>
              </div>
            </div>

            {/* SECTION 1: CORE FEATURE SWITCHBOARD */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <Power className="size-4.5 text-amber-400" />
                    <span>Website &amp; Store Feature Switches</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Switch key interactive website components ON or OFF. Changes take effect on the live
                    site immediately.
                  </p>
                </div>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400 self-start sm:self-auto">
                  Instant Reactive Sync
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Switch 1: Online Table Reservations */}
                <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition-all hover:border-amber-500/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <Coffee className="size-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          settings.reservationsEnabled
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {settings.reservationsEnabled ? "ON • Accepting" : "OFF • Paused"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-zinc-100">
                      Table Reservations
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      Controls the online table booking modal. When turned OFF, guests are notified that
                      reservations are temporarily paused and directed to WhatsApp/walk-ins.
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <span className="text-xs font-semibold text-zinc-300">
                      Switch {settings.reservationsEnabled ? "OFF" : "ON"}
                    </span>
                    <Switch
                      id="feature-switch-reservations"
                      checked={settings.reservationsEnabled}
                      onCheckedChange={(checked) => handleToggleSetting("reservationsEnabled", checked)}
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-700"
                      aria-label="Toggle Online Table Reservations"
                    />
                  </div>
                </div>

                {/* Switch 2: Atmosphere Video Tour Reel */}
                <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition-all hover:border-amber-500/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid size-10 place-items-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                        <Video className="size-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          settings.showAtmosphereVideo
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {settings.showAtmosphereVideo ? "ON • Displayed" : "OFF • Hidden"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-zinc-100">
                      Atmosphere Video Tour
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      Controls the 9:16 vertical cafe walk-through reel showcasing the indoor olive
                      tree, leather banquettes, and seating area on the home page.
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <span className="text-xs font-semibold text-zinc-300">
                      Switch {settings.showAtmosphereVideo ? "OFF" : "ON"}
                    </span>
                    <Switch
                      id="feature-switch-atmosphere"
                      checked={settings.showAtmosphereVideo}
                      onCheckedChange={(checked) => handleToggleSetting("showAtmosphereVideo", checked)}
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-700"
                      aria-label="Toggle Atmosphere Video Tour"
                    />
                  </div>
                </div>

                {/* Switch 3: Coffee Journey Craft Reel */}
                <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition-all hover:border-amber-500/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid size-10 place-items-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
                        <Film className="size-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          settings.showCoffeeJourneyVideo
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {settings.showCoffeeJourneyVideo ? "ON • Displayed" : "OFF • Hidden"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-zinc-100">
                      Coffee Journey Craft Reel
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      Controls the interactive 4-stage craft story reel (raw bean, roasting, grinding,
                      and signature cup) on the home page.
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <span className="text-xs font-semibold text-zinc-300">
                      Switch {settings.showCoffeeJourneyVideo ? "OFF" : "ON"}
                    </span>
                    <Switch
                      id="feature-switch-craft"
                      checked={settings.showCoffeeJourneyVideo}
                      onCheckedChange={(checked) =>
                        handleToggleSetting("showCoffeeJourneyVideo", checked)
                      }
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-700"
                      aria-label="Toggle Coffee Journey Video Reel"
                    />
                  </div>
                </div>

                {/* Switch 4: Cafe Operational Open/Closed */}
                <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition-all hover:border-amber-500/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid size-10 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                        <Store className="size-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          settings.isOpen
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border border-red-500/30 bg-red-500/15 text-red-400"
                        }`}
                      >
                        {settings.isOpen ? "OPEN for Service" : "CLOSED Currently"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-zinc-100">
                      Cafe Open / Closed Status
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      Broadcasts real-time operational open or closed indicators to visitors across the
                      Kahwa Cafe site.
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <span className="text-xs font-semibold text-zinc-300">
                      Mark {settings.isOpen ? "Closed" : "Open"}
                    </span>
                    <Switch
                      id="feature-switch-store-open"
                      checked={settings.isOpen}
                      onCheckedChange={(checked) => handleToggleSetting("isOpen", checked)}
                      className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700"
                      aria-label="Toggle Cafe Operational Status"
                    />
                  </div>
                </div>

                {/* Switch 5: In-Store Menu Board Modal */}
                <div className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition-all hover:border-amber-500/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid size-10 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <Sliders className="size-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          settings.showMenuBoard
                            ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                            : "border border-zinc-700 bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {settings.showMenuBoard ? "ON • Enabled" : "OFF • Disabled"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-base font-bold text-zinc-100">
                      In-Store Menu Board Dialog
                    </h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      Controls the zoomable in-store printed menu board modal accessible via "Explore the
                      Menu" and "View In-Store Menu Board" buttons.
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-zinc-800/80 pt-4">
                    <span className="text-xs font-semibold text-zinc-300">
                      Switch {settings.showMenuBoard ? "OFF" : "ON"}
                    </span>
                    <Switch
                      id="feature-switch-menuboard"
                      checked={settings.showMenuBoard}
                      onCheckedChange={(checked) => handleToggleSetting("showMenuBoard", checked)}
                      className="data-[state=checked]:bg-amber-500 data-[state=unchecked]:bg-zinc-700"
                      aria-label="Toggle In-Store Menu Board Dialog"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: CAFE MENU ITEMS SWITCHBOARD */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-100 flex items-center gap-2">
                    <Coffee className="size-5 text-amber-400" />
                    <span>Cafe Menu Items Switchboard</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Switch individual drinks, coffees, and cakes ON (In Stock) or OFF (Sold Out).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSetAllStock(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:border-emerald-500/40 hover:text-emerald-400 cursor-pointer"
                  >
                    <Check className="size-3.5 text-emerald-400" />
                    <span>Set All Available</span>
                  </button>
                  <button
                    onClick={() => handleSetAllStock(false)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:border-red-500/40 hover:text-red-400 cursor-pointer"
                  >
                    <Power className="size-3.5 text-red-400" />
                    <span>Set All Sold Out</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {menuCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setMenuFilter(cat.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                        menuFilter === cat.id
                          ? "bg-amber-500 text-zinc-950 shadow-xs"
                          : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800/90 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Menu Items Cards Grid */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredAdminMenuItems.map((item) => {
                  const isAvailable = !settings.outOfStockItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${
                        isAvailable
                          ? "border-zinc-800 bg-zinc-900/80 hover:border-amber-500/40"
                          : "border-red-500/30 bg-red-950/10 opacity-90"
                      }`}
                    >
                      {/* Image Preview */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className={`h-full w-full object-cover transition-all ${
                            isAvailable ? "" : "grayscale contrast-125"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Tag */}
                        <span className="absolute left-3 top-3 rounded-full bg-zinc-900/90 border border-zinc-700/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {item.tag}
                        </span>

                        {/* Price */}
                        <span className="absolute bottom-3 right-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-zinc-950 shadow-md">
                          {item.price}
                        </span>

                        {/* Availability Pill on Image */}
                        <div className="absolute bottom-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                              isAvailable
                                ? "bg-emerald-500/90 text-zinc-950"
                                : "bg-red-500/90 text-white"
                            }`}
                          >
                            <span className="size-1.5 rounded-full bg-current" />
                            {isAvailable ? "In Stock" : "Switched OFF (Sold Out)"}
                          </span>
                        </div>
                      </div>

                      {/* Content & Switch Controls */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
                            {item.categoryName}
                          </p>
                          <h4 className="mt-1 font-display text-lg font-bold text-zinc-100">
                            {item.name}
                          </h4>
                          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                            {item.description}
                          </p>
                        </div>

                        {/* Switch On / Off Button Control */}
                        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`size-2 rounded-full ${
                                isAvailable ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                              }`}
                            />
                            <div>
                              <p className="text-xs font-bold text-zinc-200">
                                {isAvailable ? "Active on Menu" : "Sold Out / Inactive"}
                              </p>
                              <p className="text-[10px] text-zinc-400">
                                {isAvailable ? "Visible to customers" : "Marked unavailable"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              id={`switch-item-${item.id}`}
                              checked={isAvailable}
                              onCheckedChange={() => handleToggleStock(item.id, item.name)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700"
                              aria-label={`Switch ${item.name} On or Off`}
                            />
                            <span
                              className={`text-[11px] font-bold uppercase tracking-wider min-w-[32px] ${
                                isAvailable ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {isAvailable ? "ON" : "OFF"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredAdminMenuItems.length === 0 && (
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-12 text-center text-zinc-400">
                  <p className="font-semibold">No menu items match your search or filter.</p>
                  <button
                    onClick={() => {
                      setMenuFilter("all");
                      setMenuSearch("");
                    }}
                    className="mt-3 text-xs font-bold text-amber-400 underline cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================
           TAB 3: TABLE RESERVATIONS MANAGEMENT
           ================================================================== */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-100">
                  Table Reservations
                </h2>
                <p className="text-xs text-zinc-400">
                  View, confirm, and manage customer table bookings.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>New Booking (Walk-in/Phone)</span>
                </button>
                <button
                  onClick={() => exportDataToCSV("reservations")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Status Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: "all", label: "All", count: resCounts.all },
                  { key: "pending", label: "Pending", count: resCounts.pending },
                  { key: "confirmed", label: "Confirmed", count: resCounts.confirmed },
                  { key: "completed", label: "Completed", count: resCounts.completed },
                  { key: "cancelled", label: "Cancelled", count: resCounts.cancelled },
                ].map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setResFilter(st.key)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-colors cursor-pointer ${
                      resFilter === st.key
                        ? "bg-amber-500 text-zinc-950 shadow-xs"
                        : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span>{st.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                        resFilter === st.key
                          ? "bg-zinc-950/20 text-zinc-950"
                          : "bg-zinc-700/60 text-zinc-300"
                      }`}
                    >
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search guest, phone, ID..."
                  value={resSearch}
                  onChange={(e) => setResSearch(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/90 py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Reservations Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3.5">Ref ID</th>
                      <th className="px-4 py-3.5">Guest Information</th>
                      <th className="px-4 py-3.5">Party</th>
                      <th className="px-4 py-3.5">Date &amp; Time</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Notes</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {filteredReservations.map((r) => {
                      const cleanPhone = r.phone.replace(/\D/g, "");
                      const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("1") ? cleanPhone : "1" + cleanPhone}?text=${encodeURIComponent(
                        `Hi ${r.name}, greetings from Kahwa Raw Cafe! We are confirming your table reservation for ${r.heads} guests on ${r.date} at ${r.time}.`
                      )}`;

                      return (
                        <tr key={r.id} className="transition-colors hover:bg-zinc-800/30">
                          <td className="px-4 py-4 font-mono font-bold text-amber-400">{r.id}</td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-zinc-100">{r.name}</p>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
                              <a
                                href={`tel:${r.phone}`}
                                className="inline-flex items-center gap-1 hover:text-zinc-200"
                              >
                                <Phone className="size-3 text-amber-400" />
                                {r.phone}
                              </a>
                              <span>•</span>
                              <a
                                href={`mailto:${r.email}`}
                                className="inline-flex items-center gap-1 hover:text-zinc-200"
                              >
                                <Mail className="size-3 text-amber-400" />
                                {r.email}
                              </a>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-200">
                              <Users className="size-3 text-amber-400" />
                              {r.heads} {r.heads === 1 ? "Guest" : "Guests"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-zinc-200">{r.date}</p>
                            <p className="text-[11px] text-zinc-400">{r.time}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1 items-start">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                                  r.status === "confirmed"
                                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                    : r.status === "pending"
                                      ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                                      : r.status === "completed"
                                        ? "border border-blue-500/30 bg-blue-500/10 text-blue-400"
                                        : "border border-rose-500/30 bg-rose-500/10 text-rose-400"
                                }`}
                              >
                                <span
                                  className={`size-1.5 rounded-full ${
                                    r.status === "confirmed"
                                      ? "bg-emerald-400"
                                      : r.status === "pending"
                                        ? "bg-amber-400"
                                        : r.status === "completed"
                                          ? "bg-blue-400"
                                          : "bg-rose-400"
                                  }`}
                                />
                                {r.status === "cancelled"
                                  ? r.cancelledBy
                                    ? `Cancelled (${r.cancelledBy})`
                                    : "Cancelled"
                                  : r.status}
                              </span>
                              {r.status === "cancelled" && r.cancelReason && (
                                <span
                                  className="max-w-[170px] truncate text-[10px] italic text-rose-400/80"
                                  title={r.cancelReason}
                                >
                                  &ldquo;{r.cancelReason}&rdquo;
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="max-w-[200px] truncate px-4 py-4 text-[11px] text-zinc-400">
                            {r.notes || "—"}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Direct WhatsApp guest link */}
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Chat with guest on WhatsApp"
                                className="grid size-7 place-items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              >
                                <MessageCircle className="size-3.5" />
                              </a>

                              {/* Status Action: Confirm */}
                              {r.status !== "confirmed" && (
                                <button
                                  onClick={() => {
                                    updateReservationStatus(r.id, "confirmed");
                                    reloadData();
                                  }}
                                  title="Confirm Reservation"
                                  className="grid size-7 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 cursor-pointer"
                                >
                                  <CheckCircle2 className="size-3.5" />
                                </button>
                              )}

                              {/* Status Action: Complete */}
                              {r.status === "confirmed" && (
                                <button
                                  onClick={() => {
                                    updateReservationStatus(r.id, "completed");
                                    reloadData();
                                  }}
                                  title="Mark Seated / Completed"
                                  className="grid size-7 place-items-center rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                                >
                                  <Coffee className="size-3.5" />
                                </button>
                              )}

                              {/* Status Action: Cancel (Admin Modal) */}
                              {r.status !== "cancelled" && (
                                <button
                                  onClick={() => {
                                    setAdminCancelModalReservation(r);
                                    setAdminCancelReason("Customer phoned to cancel");
                                    setAdminCustomCancelReason("");
                                  }}
                                  title="Cancel Reservation (Admin)"
                                  className="grid size-7 place-items-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer transition-colors"
                                >
                                  <XCircle className="size-3.5" />
                                </button>
                              )}

                              {/* Status Action: Restore / Re-activate */}
                              {r.status === "cancelled" && (
                                <button
                                  onClick={() => handleAdminReactivate(r.id)}
                                  title="Re-activate / Restore Reservation"
                                  className="grid size-7 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 cursor-pointer transition-colors"
                                >
                                  <RotateCcw className="size-3.5" />
                                </button>
                              )}

                              {/* Delete */}
                              <button
                                onClick={() => {
                                  if (confirm(`Delete reservation for ${r.name}?`)) {
                                    deleteReservation(r.id);
                                    reloadData();
                                  }
                                }}
                                title="Delete from records"
                                className="grid size-7 place-items-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredReservations.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-zinc-400">
                          No reservations match your current filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
           TAB 3: WHATSAPP & EMAIL CLICKS INTELLIGENCE
           ================================================================== */}
        {activeTab === "clicks" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-100">
                  WhatsApp &amp; Email Engagements
                </h2>
                <p className="text-xs text-zinc-400">
                  Audit log of every user who clicked WhatsApp and Email communication buttons.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => exportDataToCSV("clicks")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Export Clicks CSV</span>
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setClicksFilter("all")}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  clicksFilter === "all"
                    ? "bg-amber-500 text-zinc-950 shadow-xs"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                All Engagements ({clicks.length})
              </button>
              <button
                onClick={() => setClicksFilter("whatsapp")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  clicksFilter === "whatsapp"
                    ? "bg-emerald-500 text-zinc-950 shadow-xs"
                    : "bg-zinc-800 text-emerald-400 hover:bg-zinc-700"
                }`}
              >
                <MessageCircle className="size-3.5" />
                WhatsApp Only ({whatsappClicks.length})
              </button>
              <button
                onClick={() => setClicksFilter("email")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  clicksFilter === "email"
                    ? "bg-blue-500 text-zinc-950 shadow-xs"
                    : "bg-zinc-800 text-blue-400 hover:bg-zinc-700"
                }`}
              >
                <Mail className="size-3.5" />
                Email Only ({emailClicks.length})
              </button>
            </div>

            {/* Clicks Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5">Channel</th>
                      <th className="px-4 py-3.5">Trigger Location / Button</th>
                      <th className="px-4 py-3.5">Target Destination</th>
                      <th className="px-4 py-3.5">Device Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {filteredClicks.map((c) => (
                      <tr key={c.id} className="transition-colors hover:bg-zinc-800/30">
                        <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                          {new Date(c.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          {c.type === "whatsapp" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                              <MessageCircle className="size-3" />
                              WhatsApp
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-bold text-blue-400">
                              <Mail className="size-3" />
                              Email
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-zinc-200">{c.source}</td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                          {c.target || "N/A"}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                            {c.device === "Mobile" ? (
                              <Smartphone className="size-3" />
                            ) : (
                              <Laptop className="size-3" />
                            )}
                            {c.device}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredClicks.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-zinc-400">
                          No click engagements recorded for this filter yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
           TAB 4: SITE VISITORS AUDIT LOG
           ================================================================== */}
        {activeTab === "visitors" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-100">
                  Site Visitor Traffic
                </h2>
                <p className="text-xs text-zinc-400">
                  Anonymous session tracking for page views, devices, and traffic origins.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => exportDataToCSV("visits")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-amber-500/40 hover:text-amber-400 cursor-pointer"
                >
                  <Download className="size-3.5" />
                  <span>Export Visitors CSV</span>
                </button>
              </div>
            </div>

            {/* Visitor Table */}
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    <tr>
                      <th className="px-4 py-3.5">Visit Timestamp</th>
                      <th className="px-4 py-3.5">Visitor Identifier</th>
                      <th className="px-4 py-3.5">Page Path</th>
                      <th className="px-4 py-3.5">Device</th>
                      <th className="px-4 py-3.5">Browser</th>
                      <th className="px-4 py-3.5">Referrer Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {visits.map((v) => (
                      <tr key={v.id} className="transition-colors hover:bg-zinc-800/30">
                        <td className="px-4 py-3.5 font-mono text-[11px] text-zinc-400">
                          {new Date(v.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-amber-400">
                          {v.visitorId}
                        </td>
                        <td className="px-4 py-3.5 font-medium text-zinc-200">{v.path}</td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                            {v.device}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-zinc-400">{v.browser}</td>
                        <td className="max-w-[240px] truncate px-4 py-3.5 text-[11px] text-zinc-400">
                          {v.referrer}
                        </td>
                      </tr>
                    ))}

                    {visits.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-zinc-400">
                          No page visits recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
           TAB 5: SETTINGS & SECURITY (MULTI-ACCOUNT MANAGEMENT)
           ================================================================== */}
        {activeTab === "settings" && (
          <div className="max-w-4xl space-y-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-zinc-100">
                  Settings &amp; Staff Account Management
                </h2>
                <p className="text-xs text-zinc-400">
                  Change Primary Admin password, assign and configure 02 cafe staff sub-accounts, or export data.
                </p>
              </div>

              {/* Account Quick Stats Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300">
                  <Shield className="size-3.5" />
                  <span>1 Master Admin</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300">
                  <Users className="size-3.5" />
                  <span>2 Staff Sub-Accounts</span>
                </span>
              </div>
            </div>

            {/* Role Notice for Sub-Managers */}
            {currentUser && currentUser.role === "sub_manager" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-300">
                      Restricted Settings View (Staff Sub-Manager)
                    </h4>
                    <p className="mt-1 text-xs text-amber-200/90 leading-relaxed">
                      You are logged in as <strong>{currentUser.displayName}</strong> (@{currentUser.username}).
                      Changing administrator passwords and provisioning sub-accounts is reserved exclusively for the <strong>Primary Administrator</strong>.
                      You have full access to cafe operations, live menu stock switches, and reservation management.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CARD 1: PRIMARY ADMINISTRATOR CREDENTIALS */}
            {(!currentUser || currentUser.role === "admin") && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-xl border border-amber-500/40 bg-gradient-to-tr from-amber-500/20 to-amber-400/10 text-amber-400">
                      <Key className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-zinc-100">
                          Primary Admin Password &amp; Credentials
                        </h3>
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          Master Account
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Update your administrator username or change the master login password
                      </p>
                    </div>
                  </div>
                </div>

                {adminCredSuccess && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>{adminCredSuccess}</span>
                  </div>
                )}

                {adminCredError && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{adminCredError}</span>
                  </div>
                )}

                <form onSubmit={handleSaveAdminCredentials} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="admin-new-user"
                        className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      >
                        Admin Username
                      </label>
                      <input
                        id="admin-new-user"
                        type="text"
                        required
                        value={adminNewUser}
                        onChange={(e) => setAdminNewUser(e.target.value)}
                        placeholder="admin"
                        className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="admin-curr-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      >
                        Current Password *
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          id="admin-curr-pass"
                          type={showAdminCurrentPass ? "text" : "password"}
                          required
                          value={adminCurrentPass}
                          onChange={(e) => setAdminCurrentPass(e.target.value)}
                          placeholder="Enter current password to verify"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2.5 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminCurrentPass(!showAdminCurrentPass)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showAdminCurrentPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="admin-new-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      >
                        New Password (optional if keeping current)
                      </label>
                      <div className="relative mt-1.5">
                        <input
                          id="admin-new-pass"
                          type={showAdminNewPass ? "text" : "password"}
                          value={adminNewPass}
                          onChange={(e) => setAdminNewPass(e.target.value)}
                          placeholder="Leave blank to keep current password"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2.5 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showAdminNewPass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="admin-confirm-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                      >
                        Confirm New Password
                      </label>
                      <input
                        id="admin-confirm-pass"
                        type="password"
                        value={adminConfirmPass}
                        onChange={(e) => setAdminConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        disabled={!adminNewPass}
                        className="mt-1.5 w-full rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-amber-500 focus:outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-zinc-500">
                      Default admin credentials: <code className="text-amber-400/80">admin</code> / <code className="text-amber-400/80">kahwa2026</code>
                    </p>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-md hover:from-amber-400 hover:to-amber-500 active:scale-95 transition-all cursor-pointer"
                    >
                      Update Admin Password &amp; Credentials
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* CARD 2: STAFF SUB-ACCOUNTS SWITCHBOARD (02 DEDICATED ACCOUNTS) */}
            {(!currentUser || currentUser.role === "admin") && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-xl border border-blue-500/40 bg-gradient-to-tr from-blue-500/20 to-blue-400/10 text-blue-400">
                      <Users className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-zinc-100">
                          Staff Sub-Accounts (02 Accounts for Cafe Management)
                        </h3>
                        <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                          2 Managed Slots
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        Assign names, usernames, and passwords to 2 sub-accounts for your cafe staff to manage daily operations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* SUB-ACCOUNT 1 */}
                  <div className={`rounded-2xl border p-5 transition-all ${
                    sub1Enabled
                      ? "border-blue-500/30 bg-blue-950/10 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/40 opacity-75"
                  }`}>
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-300 border border-blue-500/40">
                          1
                        </span>
                        <div>
                          <span className="text-xs font-bold text-zinc-100">Sub-Account #1</span>
                          <span className="ml-2 text-[10px] font-mono text-zinc-400">ID: sub_1</span>
                        </div>
                      </div>

                      {/* On/Off Switch */}
                      <div className="flex items-center gap-2">
                        <Switch
                          id="sub1-enable-switch"
                          checked={sub1Enabled}
                          onCheckedChange={(checked) => handleToggleSubAccount("sub_1", checked)}
                          className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-zinc-700"
                        />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          sub1Enabled ? "text-emerald-400" : "text-zinc-500"
                        }`}>
                          {sub1Enabled ? "ACTIVE" : "DISABLED"}
                        </span>
                      </div>
                    </div>

                    {sub1Success && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span>{sub1Success}</span>
                      </div>
                    )}

                    {sub1Error && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-semibold text-red-400">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{sub1Error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveSubAccount1} className="mt-4 space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Account Display Name / Role Title
                        </label>
                        <input
                          type="text"
                          required
                          value={sub1Name}
                          onChange={(e) => setSub1Name(e.target.value)}
                          placeholder="e.g. Cafe Floor Manager"
                          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Login Username
                        </label>
                        <input
                          type="text"
                          required
                          value={sub1User}
                          onChange={(e) => setSub1User(e.target.value)}
                          placeholder="e.g. manager1"
                          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Assign / Update Password
                        </label>
                        <div className="relative mt-1">
                          <input
                            type={showSub1Pass ? "text" : "password"}
                            value={sub1Pass}
                            onChange={(e) => setSub1Pass(e.target.value)}
                            placeholder="Leave empty to keep existing password"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSub1Pass(!showSub1Pass)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showSub1Pass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-500">
                          Current default: <code className="text-blue-300 font-mono">kahwa123</code>
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all active:scale-98 cursor-pointer"
                      >
                        Save Sub-Account 1 Settings
                      </button>
                    </form>
                  </div>

                  {/* SUB-ACCOUNT 2 */}
                  <div className={`rounded-2xl border p-5 transition-all ${
                    sub2Enabled
                      ? "border-purple-500/30 bg-purple-950/10 shadow-sm"
                      : "border-zinc-800 bg-zinc-900/40 opacity-75"
                  }`}>
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="grid size-6 place-items-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-300 border border-purple-500/40">
                          2
                        </span>
                        <div>
                          <span className="text-xs font-bold text-zinc-100">Sub-Account #2</span>
                          <span className="ml-2 text-[10px] font-mono text-zinc-400">ID: sub_2</span>
                        </div>
                      </div>

                      {/* On/Off Switch */}
                      <div className="flex items-center gap-2">
                        <Switch
                          id="sub2-enable-switch"
                          checked={sub2Enabled}
                          onCheckedChange={(checked) => handleToggleSubAccount("sub_2", checked)}
                          className="data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-zinc-700"
                        />
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          sub2Enabled ? "text-emerald-400" : "text-zinc-500"
                        }`}>
                          {sub2Enabled ? "ACTIVE" : "DISABLED"}
                        </span>
                      </div>
                    </div>

                    {sub2Success && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3.5 shrink-0" />
                        <span>{sub2Success}</span>
                      </div>
                    )}

                    {sub2Error && (
                      <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs font-semibold text-red-400">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{sub2Error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveSubAccount2} className="mt-4 space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Account Display Name / Role Title
                        </label>
                        <input
                          type="text"
                          required
                          value={sub2Name}
                          onChange={(e) => setSub2Name(e.target.value)}
                          placeholder="e.g. Shift Supervisor"
                          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Login Username
                        </label>
                        <input
                          type="text"
                          required
                          value={sub2User}
                          onChange={(e) => setSub2User(e.target.value)}
                          placeholder="e.g. supervisor2"
                          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Assign / Update Password
                        </label>
                        <div className="relative mt-1">
                          <input
                            type={showSub2Pass ? "text" : "password"}
                            value={sub2Pass}
                            onChange={(e) => setSub2Pass(e.target.value)}
                            placeholder="Leave empty to keep existing password"
                            className="w-full rounded-xl border border-zinc-700 bg-zinc-800/90 px-3 py-2 pr-10 text-xs text-zinc-100 placeholder:text-zinc-500 focus:border-purple-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSub2Pass(!showSub2Pass)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                            tabIndex={-1}
                          >
                            {showSub2Pass ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                          </button>
                        </div>
                        <p className="mt-1 text-[10px] text-zinc-500">
                          Current default: <code className="text-purple-300 font-mono">kahwa456</code>
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500 transition-all active:scale-98 cursor-pointer"
                      >
                        Save Sub-Account 2 Settings
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* CARD 3: STAFF CREDENTIALS QUICK COPY CHEAT-SHEET */}
            {(!currentUser || currentUser.role === "admin") && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <Copy className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-zinc-100">
                        Staff Logins Quick Copy Cheat-Sheet
                      </h3>
                      <p className="text-xs text-zinc-400">
                        1-Click copy usernames &amp; passwords to share with your cafe team via WhatsApp or Email
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const portalUrl = typeof window !== "undefined" ? `${window.location.origin}/admin` : "http://localhost:8080/admin";
                      const s1 = accounts.find((a) => a.id === "sub_1") || { displayName: sub1Name, username: sub1User, passwordHash: "kahwa123", enabled: sub1Enabled };
                      const s2 = accounts.find((a) => a.id === "sub_2") || { displayName: sub2Name, username: sub2User, passwordHash: "kahwa456", enabled: sub2Enabled };
                      const summary = `☕ KAHWA RAW CAFE - ADMIN & STAFF PORTAL ACCESS\nPortal URL: ${portalUrl}\n\n1. Master Admin: User: ${adminNewUser}\n2. ${s1.displayName}: User: ${s1.username} | Pass: ${s1.passwordHash} [${s1.enabled ? "Active" : "Disabled"}]\n3. ${s2.displayName}: User: ${s2.username} | Pass: ${s2.passwordHash} [${s2.enabled ? "Active" : "Disabled"}]`;
                      handleCopyValue(summary, "all_summary");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                  >
                    <Copy className="size-3.5" />
                    <span>{copiedKey === "all_summary" ? "All Credentials Copied!" : "Copy Full Team Cheat-Sheet"}</span>
                  </button>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-zinc-800 bg-zinc-950/60 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="px-4 py-3">Account Title</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Login Username</th>
                        <th className="px-4 py-3">Password</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                      {/* Admin Row */}
                      <tr className="transition-colors hover:bg-zinc-800/30">
                        <td className="px-4 py-3 font-semibold text-amber-200">
                          Primary Administrator
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                            Master Admin
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-200">{adminNewUser}</td>
                        <td className="px-4 py-3 font-mono text-zinc-400">
                          {accounts.find((a) => a.id === "admin")?.passwordHash || "••••••••"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleCopyValue(adminNewUser, "copy_admin_user")}
                            className="rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                          >
                            {copiedKey === "copy_admin_user" ? "Copied!" : "Copy User"}
                          </button>
                        </td>
                      </tr>

                      {/* Sub-Account 1 Row */}
                      <tr className="transition-colors hover:bg-zinc-800/30">
                        <td className="px-4 py-3 font-semibold text-blue-200">
                          {sub1Name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                            Sub-Account #1
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-200">{sub1User}</td>
                        <td className="px-4 py-3 font-mono text-blue-300">
                          {accounts.find((a) => a.id === "sub_1")?.passwordHash || "kahwa123"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            sub1Enabled
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}>
                            {sub1Enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleCopyValue(sub1User, "copy_sub1_user")}
                            className="rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                          >
                            {copiedKey === "copy_sub1_user" ? "Copied!" : "User"}
                          </button>
                          <button
                            onClick={() => {
                              const pass = accounts.find((a) => a.id === "sub_1")?.passwordHash || "kahwa123";
                              handleCopyValue(pass, "copy_sub1_pass");
                            }}
                            className="rounded-lg bg-blue-600/30 px-2.5 py-1 text-[11px] font-semibold text-blue-200 hover:bg-blue-600/50 cursor-pointer"
                          >
                            {copiedKey === "copy_sub1_pass" ? "Copied!" : "Pass"}
                          </button>
                        </td>
                      </tr>

                      {/* Sub-Account 2 Row */}
                      <tr className="transition-colors hover:bg-zinc-800/30">
                        <td className="px-4 py-3 font-semibold text-purple-200">
                          {sub2Name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                            Sub-Account #2
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-200">{sub2User}</td>
                        <td className="px-4 py-3 font-mono text-purple-300">
                          {accounts.find((a) => a.id === "sub_2")?.passwordHash || "kahwa456"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            sub2Enabled
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}>
                            {sub2Enabled ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleCopyValue(sub2User, "copy_sub2_user")}
                            className="rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer"
                          >
                            {copiedKey === "copy_sub2_user" ? "Copied!" : "User"}
                          </button>
                          <button
                            onClick={() => {
                              const pass = accounts.find((a) => a.id === "sub_2")?.passwordHash || "kahwa456";
                              handleCopyValue(pass, "copy_sub2_pass");
                            }}
                            className="rounded-lg bg-purple-600/30 px-2.5 py-1 text-[11px] font-semibold text-purple-200 hover:bg-purple-600/50 cursor-pointer"
                          >
                            {copiedKey === "copy_sub2_pass" ? "Copied!" : "Pass"}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Special Link Information */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-zinc-100">
                Special Admin Direct Link
              </h3>
              <p className="mt-1 text-xs text-zinc-400">
                Bookmark or copy this URL to access this operations hub from any browser:
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 p-2.5">
                <code className="flex-1 truncate font-mono text-xs text-amber-300">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/admin`
                    : "http://localhost:8080/admin"}
                </code>
                <button
                  onClick={handleCopyAdminLink}
                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                >
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Clear Database Danger Zone */}
            <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 shadow-sm">
              <h3 className="font-display text-base font-bold text-red-400">Data Management</h3>
              <p className="mt-1 text-xs text-zinc-400">
                Reset or erase current logs and reservations from local storage.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear all analytics data and reservations?"
                      )
                    ) {
                      clearAllData();
                      reloadData();
                    }
                  }}
                  className="rounded-xl border border-red-500/40 bg-red-500/20 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/30 cursor-pointer"
                >
                  Erase All Stored Data
                </button>
                <button
                  onClick={() => {
                    seedSampleData();
                    reloadData();
                  }}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                >
                  Load Fresh Sample Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
         MODAL: ADD MANUAL RESERVATION
         ==================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="font-display text-lg font-bold text-zinc-100">
                Add Manual Table Booking
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReservation} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Guest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Layla Smith"
                  value={newRes.name}
                  onChange={(e) => setNewRes({ ...newRes, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (587) 555-0100"
                    value={newRes.phone}
                    onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={newRes.email}
                    onChange={(e) => setNewRes({ ...newRes, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newRes.heads}
                    onChange={(e) =>
                      setNewRes({ ...newRes, heads: parseInt(e.target.value, 10) || 1 })
                    }
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newRes.date}
                    onChange={(e) => setNewRes({ ...newRes, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newRes.time}
                    onChange={(e) => setNewRes({ ...newRes, time: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Special Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Seating request, dietary notes, occasion..."
                  value={newRes.notes}
                  onChange={(e) => setNewRes({ ...newRes, notes: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-amber-400 cursor-pointer"
                >
                  Save Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
         MODAL: CANCEL RESERVATION (ADMIN)
         ==================================================================== */}
      {adminCancelModalReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-zinc-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="grid size-9 place-items-center rounded-xl bg-red-500/15 text-red-400">
                  <XCircle className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-100">
                    Cancel Reservation
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Admin cancellation &amp; table release
                  </p>
                </div>
              </div>
              <button
                onClick={() => setAdminCancelModalReservation(null)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Reservation Summary */}
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400">
                  {adminCancelModalReservation.id}
                </span>
                <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-300">
                  {adminCancelModalReservation.heads} Guests
                </span>
              </div>
              <p className="mt-2 font-bold text-zinc-200 text-sm">
                {adminCancelModalReservation.name}
              </p>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                {adminCancelModalReservation.date} at {adminCancelModalReservation.time}
              </p>
              <p className="text-zinc-400 text-[11px]">
                {adminCancelModalReservation.phone} • {adminCancelModalReservation.email}
              </p>
            </div>

            {/* Reason selector */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                Reason for Cancellation
              </label>
              <select
                value={adminCancelReason}
                onChange={(e) => setAdminCancelReason(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-red-500 focus:outline-none"
              >
                <option value="Customer phoned to cancel">Customer phoned to cancel</option>
                <option value="Customer messaged on WhatsApp">Customer messaged on WhatsApp</option>
                <option value="No-show / Guest did not arrive">No-show / Guest did not arrive</option>
                <option value="Cafe overbooked / Capacity limit">Cafe overbooked / Capacity limit</option>
                <option value="Emergency closure / Kitchen maintenance">Emergency closure / Kitchen maintenance</option>
                <option value="Other reason">Other reason</option>
              </select>

              {adminCancelReason === "Other reason" && (
                <input
                  type="text"
                  placeholder="Type specific cancellation reason..."
                  value={adminCustomCancelReason}
                  onChange={(e) => setAdminCustomCancelReason(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-100 focus:border-red-500 focus:outline-none"
                />
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAdminCancelModalReservation(null)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 cursor-pointer"
              >
                Nevermind
              </button>
              <button
                type="button"
                onClick={handleAdminConfirmCancel}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 shadow-md shadow-red-600/20 cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
