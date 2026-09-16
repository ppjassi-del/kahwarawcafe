/**
 * Kahwa Raw Cafe - Admin & Analytics Store
 * Handles visitor analytics, click event tracking (WhatsApp, Email),
 * table reservations management, authentication, and persistence.
 */

export interface SiteVisit {
  id: string;
  visitorId: string;
  timestamp: string;
  path: string;
  referrer: string;
  device: "Mobile" | "Tablet" | "Desktop";
  browser: string;
}

export type ClickType = "whatsapp" | "email" | "social" | "website";

export interface ClickEvent {
  id: string;
  type: ClickType;
  source: string;
  target?: string | undefined;
  timestamp: string;
  device: "Mobile" | "Tablet" | "Desktop";
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string;
  heads: number;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  cancelledAt?: string;
  cancelledBy?: "customer" | "admin";
  cancelReason?: string;
  createdAt: string;
}

export interface AdminCredentials {
  username: string;
  passwordHash: string; // Plain/simple hash for client demo security
}

export interface UserAccount {
  id: "admin" | "sub_1" | "sub_2";
  role: "admin" | "sub_manager";
  displayName: string;
  username: string;
  passwordHash: string;
  enabled: boolean;
  lastLogin?: string;
  updatedAt?: string;
}

export interface UserSession {
  id: "admin" | "sub_1" | "sub_2";
  role: "admin" | "sub_manager";
  displayName: string;
  username: string;
  loginTime: string;
}

export interface CafeSettings {
  isOpen: boolean;
  reservationsEnabled: boolean;
  showAtmosphereVideo: boolean;
  showCoffeeJourneyVideo: boolean;
  showMenuBoard: boolean;
  outOfStockItems: string[];
}

export interface OrderAccountDelivery {
  accountId: "admin" | "sub_1" | "sub_2";
  accountName: string;
  role: "admin" | "sub_manager";
  deliveredAt: string;
}

export interface CafeOrder {
  id: string; // e.g. "ORD-101"
  itemId: string;
  itemName: string;
  category: string;
  categoryName: string;
  price: string;
  image?: string;
  customerName?: string;
  customerPhone?: string;
  tableNumber: string;
  orderType: "dine-in" | "takeaway";
  notes?: string;
  timestamp: string;
  status: "new" | "preparing" | "ready" | "served" | "cancelled";
  device: "Mobile" | "Tablet" | "Desktop";
  sentToAccounts: OrderAccountDelivery[];
}

const STORAGE_KEYS = {
  VISITS: "kahwa_analytics_visits_v1",
  CLICKS: "kahwa_analytics_clicks_v1",
  RESERVATIONS: "kahwa_reservations_v1",
  ORDERS: "kahwa_cafe_orders_v1",
  AUTH: "kahwa_admin_auth_session",
  CREDENTIALS: "kahwa_admin_credentials_v1",
  ACCOUNTS: "kahwa_admin_accounts_v2",
  SESSION: "kahwa_admin_user_session_v2",
  VISITOR_ID: "kahwa_visitor_id",
  LAST_VISIT_TIME: "kahwa_last_visit_timestamp",
  SETTINGS: "kahwa_cafe_settings_v1",
};

// Default Accounts Configuration
export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: "admin",
    role: "admin",
    displayName: "Primary Administrator",
    username: "admin",
    passwordHash: "kahwa2026",
    enabled: true,
  },
  {
    id: "sub_1",
    role: "sub_manager",
    displayName: "Cafe Floor Manager",
    username: "manager1",
    passwordHash: "kahwa123",
    enabled: true,
  },
  {
    id: "sub_2",
    role: "sub_manager",
    displayName: "Shift Supervisor",
    username: "supervisor2",
    passwordHash: "kahwa456",
    enabled: true,
  },
];

// Default Admin Login (backward compatibility fallback)
const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: "admin",
  passwordHash: "kahwa2026",
};

export const DEFAULT_CAFE_SETTINGS: CafeSettings = {
  isOpen: true,
  reservationsEnabled: true,
  showAtmosphereVideo: true,
  showCoffeeJourneyVideo: true,
  showMenuBoard: true,
  outOfStockItems: [],
};

function isClient(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function getFromStorage<T>(key: string, fallback: T): T {
  if (!isClient()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom window event for real-time reactivity across tabs/components
    window.dispatchEvent(new CustomEvent("kahwa:storage_update", { detail: { key } }));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// Device detection helper
export function detectDevice(): "Mobile" | "Tablet" | "Desktop" {
  if (!isClient()) return "Desktop";
  const ua = navigator.userAgent;
  if (/iPad|Tablet|(android(?!.*mobile))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// Browser detection helper
export function detectBrowser(): string {
  if (!isClient()) return "Unknown";
  const ua = navigator.userAgent;
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/")) return "Chrome";
  if (ua.includes("Safari/")) return "Safari";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  return "Other";
}

// Get or create persistent visitor ID
export function getVisitorId(): string {
  if (!isClient()) return "anon";
  let id = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!id) {
    id = "vis_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36).substring(4);
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, id);
  }
  return id;
}

/* ==========================================================================
   ACCOUNTS & MULTI-USER AUTHENTICATION
   ========================================================================== */

export function getUserAccounts(): UserAccount[] {
  if (!isClient()) return DEFAULT_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      // Check if legacy credentials exist to migrate admin
      const legacyRaw = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      const accounts = [...DEFAULT_ACCOUNTS];
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw) as AdminCredentials;
          if (legacy.username && legacy.passwordHash) {
            accounts[0] = {
              ...accounts[0],
              username: legacy.username.trim(),
              passwordHash: legacy.passwordHash,
            };
          }
        } catch {
          // ignore
        }
      }
      saveToStorage(STORAGE_KEYS.ACCOUNTS, accounts);
      return accounts;
    }

    const parsed = JSON.parse(raw) as UserAccount[];
    const idMap = new Map(parsed.map((a) => [a.id, a]));
    const merged = DEFAULT_ACCOUNTS.map((def) => {
      const existing = idMap.get(def.id);
      return existing ? { ...def, ...existing } : def;
    });
    return merged;
  } catch (err) {
    console.error("Error reading accounts:", err);
    return DEFAULT_ACCOUNTS;
  }
}

export function getAccountById(id: "admin" | "sub_1" | "sub_2"): UserAccount | undefined {
  return getUserAccounts().find((a) => a.id === id);
}

export function updateAdminCredentials(
  currentPassword: string,
  newUsername: string,
  newPassword: string
): { success: boolean; message: string } {
  const accounts = getUserAccounts();
  const adminAcc = accounts.find((a) => a.id === "admin");
  if (!adminAcc) {
    return { success: false, message: "Admin account record not found." };
  }

  if (adminAcc.passwordHash !== currentPassword) {
    return { success: false, message: "Current password does not match our records." };
  }

  const cleanUser = newUsername.trim();
  if (cleanUser.length < 3) {
    return { success: false, message: "Username must be at least 3 characters long." };
  }
  if (newPassword.length < 4) {
    return { success: false, message: "New password must be at least 4 characters long." };
  }

  // Check username collision with sub accounts
  const collision = accounts.some(
    (a) => a.id !== "admin" && a.username.toLowerCase() === cleanUser.toLowerCase()
  );
  if (collision) {
    return { success: false, message: `Username "${cleanUser}" is already taken by a staff sub-account.` };
  }

  const updatedAccounts = accounts.map((a) => {
    if (a.id === "admin") {
      return {
        ...a,
        username: cleanUser,
        passwordHash: newPassword,
        updatedAt: new Date().toISOString(),
      };
    }
    return a;
  });

  saveToStorage(STORAGE_KEYS.ACCOUNTS, updatedAccounts);
  saveToStorage(STORAGE_KEYS.CREDENTIALS, { username: cleanUser, passwordHash: newPassword });

  // Update active session if logged in as admin
  const currentSession = getCurrentUser();
  if (currentSession && currentSession.id === "admin") {
    const updatedSession: UserSession = {
      ...currentSession,
      username: cleanUser,
    };
    if (isClient()) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
    }
  }

  return { success: true, message: "Primary Admin credentials updated successfully!" };
}

export function updateSubAccount(
  id: "sub_1" | "sub_2",
  data: {
    displayName: string;
    username: string;
    password?: string;
    enabled: boolean;
  }
): { success: boolean; message: string } {
  const accounts = getUserAccounts();
  const targetIndex = accounts.findIndex((a) => a.id === id);
  if (targetIndex === -1) {
    return { success: false, message: "Sub-account record not found." };
  }

  const cleanName = data.displayName.trim();
  if (cleanName.length < 2) {
    return { success: false, message: "Account Name must be at least 2 characters long." };
  }

  const cleanUser = data.username.trim();
  if (cleanUser.length < 3) {
    return { success: false, message: "Login Username must be at least 3 characters long." };
  }

  if (data.password !== undefined && data.password.length > 0 && data.password.length < 4) {
    return { success: false, message: "Password must be at least 4 characters long." };
  }

  // Check username collision with other accounts
  const collision = accounts.some(
    (a) => a.id !== id && a.username.toLowerCase() === cleanUser.toLowerCase()
  );
  if (collision) {
    return {
      success: false,
      message: `Username "${cleanUser}" is already assigned to another account. Choose a distinct username.`,
    };
  }

  const updatedAccounts = [...accounts];
  const current = updatedAccounts[targetIndex];
  updatedAccounts[targetIndex] = {
    ...current,
    displayName: cleanName,
    username: cleanUser,
    passwordHash: data.password && data.password.length > 0 ? data.password : current.passwordHash,
    enabled: data.enabled,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(STORAGE_KEYS.ACCOUNTS, updatedAccounts);

  // If this sub-account is currently logged in, update session or logout if disabled
  const session = getCurrentUser();
  if (session && session.id === id) {
    if (!data.enabled) {
      logoutAdmin();
    } else {
      const updatedSession: UserSession = {
        ...session,
        displayName: cleanName,
        username: cleanUser,
      };
      if (isClient()) {
        sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
      }
    }
  }

  return { success: true, message: `${cleanName} configuration saved successfully!` };
}

export function toggleSubAccountEnabled(id: "sub_1" | "sub_2"): boolean {
  const accounts = getUserAccounts();
  const target = accounts.find((a) => a.id === id);
  if (!target) return false;
  const newEnabled = !target.enabled;
  updateSubAccount(id, {
    displayName: target.displayName,
    username: target.username,
    enabled: newEnabled,
  });
  return newEnabled;
}

export function authenticateUser(
  usernameAttempt: string,
  passwordAttempt: string
): { success: boolean; message?: string; session?: UserSession } {
  const accounts = getUserAccounts();
  const cleanAttempt = usernameAttempt.trim().toLowerCase();

  const account = accounts.find((a) => a.username.toLowerCase() === cleanAttempt);
  if (!account) {
    return { success: false, message: "Invalid username or password." };
  }

  if (!account.enabled) {
    return {
      success: false,
      message: `The account "${account.displayName}" has been disabled by the Primary Administrator.`,
    };
  }

  if (account.passwordHash !== passwordAttempt) {
    return { success: false, message: "Invalid username or password." };
  }

  // Create session
  const session: UserSession = {
    id: account.id,
    role: account.role,
    displayName: account.displayName,
    username: account.username,
    loginTime: new Date().toISOString(),
  };

  if (isClient()) {
    sessionStorage.setItem(STORAGE_KEYS.AUTH, "authenticated");
    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  }

  // Record login timestamp
  const updatedAccounts = accounts.map((a) => {
    if (a.id === account.id) {
      return { ...a, lastLogin: new Date().toISOString() };
    }
    return a;
  });
  saveToStorage(STORAGE_KEYS.ACCOUNTS, updatedAccounts);

  return { success: true, session };
}

// Backward-compatible wrapper
export function authenticateAdmin(username: string, passwordAttempt: string): boolean {
  const res = authenticateUser(username, passwordAttempt);
  return res.success;
}

export function getCurrentUser(): UserSession | null {
  if (!isClient()) return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    if (raw) {
      return JSON.parse(raw) as UserSession;
    }
    if (sessionStorage.getItem(STORAGE_KEYS.AUTH) === "authenticated") {
      const accounts = getUserAccounts();
      const adminAcc = accounts.find((a) => a.id === "admin") || DEFAULT_ACCOUNTS[0];
      return {
        id: "admin",
        role: "admin",
        displayName: adminAcc.displayName,
        username: adminAcc.username,
        loginTime: new Date().toISOString(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function isUserAuthenticated(): boolean {
  if (!isClient()) return false;
  try {
    const session = sessionStorage.getItem(STORAGE_KEYS.AUTH);
    return session === "authenticated";
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  if (isClient()) {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export function getAdminCredentials(): AdminCredentials {
  const accounts = getUserAccounts();
  const adminAcc = accounts.find((a) => a.id === "admin") || DEFAULT_ACCOUNTS[0];
  return {
    username: adminAcc.username,
    passwordHash: adminAcc.passwordHash,
  };
}

/* ==========================================================================
   CAFE SETTINGS & FEATURE SWITCHES
   ========================================================================== */

export function getCafeSettings(): CafeSettings {
  const current = getFromStorage<CafeSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_CAFE_SETTINGS);
  return { ...DEFAULT_CAFE_SETTINGS, ...current };
}

export function updateCafeSettings(partial: Partial<CafeSettings>): CafeSettings {
  const current = getCafeSettings();
  const updated: CafeSettings = {
    ...current,
    ...partial,
  };
  saveToStorage(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

export function toggleMenuItemStock(itemId: string): boolean {
  const settings = getCafeSettings();
  const exists = settings.outOfStockItems.includes(itemId);
  const updatedList = exists
    ? settings.outOfStockItems.filter((id) => id !== itemId)
    : [...settings.outOfStockItems, itemId];
  updateCafeSettings({ outOfStockItems: updatedList });
  return !exists; // returns true if now out of stock
}

export function isMenuItemAvailable(itemId: string): boolean {
  const settings = getCafeSettings();
  return !settings.outOfStockItems.includes(itemId);
}

/* ==========================================================================
   SITE VISITOR TRACKING
   ========================================================================== */

export function trackSiteVisit(path?: string): void {
  if (!isClient()) return;

  // Debounce visits in the same tab within 30 seconds to prevent spam
  const now = Date.now();
  const lastVisit = parseInt(sessionStorage.getItem(STORAGE_KEYS.LAST_VISIT_TIME) || "0", 10);
  if (now - lastVisit < 25000) {
    return;
  }
  sessionStorage.setItem(STORAGE_KEYS.LAST_VISIT_TIME, now.toString());

  const currentVisits = getFromStorage<SiteVisit[]>(STORAGE_KEYS.VISITS, []);
  const newVisit: SiteVisit = {
    id: "vst_" + Math.random().toString(36).substring(2, 9),
    visitorId: getVisitorId(),
    timestamp: new Date().toISOString(),
    path: path || window.location.pathname || "/",
    referrer: document.referrer || "Direct / Bookmark",
    device: detectDevice(),
    browser: detectBrowser(),
  };

  // Keep last 1,000 visits
  const updated = [newVisit, ...currentVisits].slice(0, 1000);
  saveToStorage(STORAGE_KEYS.VISITS, updated);
}

export function getSiteVisits(): SiteVisit[] {
  return getFromStorage<SiteVisit[]>(STORAGE_KEYS.VISITS, []);
}

/* ==========================================================================
   CLICK EVENT TRACKING (WhatsApp, Email & Social Channels)
   ========================================================================== */

export function trackClick(type: ClickType, source: string, target?: string): void {
  if (!isClient()) return;

  const currentClicks = getFromStorage<ClickEvent[]>(STORAGE_KEYS.CLICKS, []);
  const newClick: ClickEvent = {
    id: "clk_" + Math.random().toString(36).substring(2, 9),
    type,
    source,
    target,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
  };

  const updated = [newClick, ...currentClicks].slice(0, 1000);
  saveToStorage(STORAGE_KEYS.CLICKS, updated);
}

export function getClickEvents(): ClickEvent[] {
  return getFromStorage<ClickEvent[]>(STORAGE_KEYS.CLICKS, []);
}

/* ==========================================================================
   TABLE RESERVATIONS MANAGEMENT
   ========================================================================== */

export function recordReservation(data: {
  name: string;
  phone: string;
  email: string;
  heads: number;
  date: string;
  time: string;
  notes?: string;
}): Reservation {
  const currentReservations = getFromStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, []);
  const seq = currentReservations.length + 101;
  const reservation: Reservation = {
    id: `KHW-${seq}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email.trim(),
    heads: data.heads,
    date: data.date,
    time: data.time,
    notes: data.notes?.trim() || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const updated = [reservation, ...currentReservations];
  saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
  return reservation;
}

export function getReservations(): Reservation[] {
  return getFromStorage<Reservation[]>(STORAGE_KEYS.RESERVATIONS, []);
}

export function updateReservationStatus(
  id: string,
  status: Reservation["status"]
): Reservation | null {
  const current = getReservations();
  const index = current.findIndex((r) => r.id === id);
  if (index === -1) return null;

  const updated = [...current];
  updated[index] = { ...updated[index], status };
  saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
  return updated[index];
}

export function deleteReservation(id: string): boolean {
  const current = getReservations();
  const filtered = current.filter((r) => r.id !== id);
  if (filtered.length === current.length) return false;
  saveToStorage(STORAGE_KEYS.RESERVATIONS, filtered);
  return true;
}

export function cancelReservation(
  id: string,
  cancelledBy: "customer" | "admin" = "customer",
  reason?: string
): Reservation | null {
  const current = getReservations();
  const index = current.findIndex(
    (r) => r.id.toLowerCase() === id.trim().toLowerCase()
  );
  if (index === -1) return null;

  const updated = [...current];
  updated[index] = {
    ...updated[index],
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
    cancelledBy,
    cancelReason:
      reason?.trim() ||
      (cancelledBy === "customer"
        ? "Cancelled by customer"
        : "Cancelled by cafe admin"),
  };
  saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
  return updated[index];
}

export function reactivateReservation(id: string): Reservation | null {
  const current = getReservations();
  const index = current.findIndex(
    (r) => r.id.toLowerCase() === id.trim().toLowerCase()
  );
  if (index === -1) return null;

  const updated = [...current];
  const { cancelledAt, cancelledBy, cancelReason, ...rest } = updated[index];
  updated[index] = {
    ...rest,
    status: "confirmed",
  };
  saveToStorage(STORAGE_KEYS.RESERVATIONS, updated);
  return updated[index];
}

export function findReservationsByContact(query: string): Reservation[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const digitsOnly = q.replace(/\D/g, "");
  const all = getReservations();

  return all.filter((r) => {
    // Match ID (e.g. KHW-101 or 101)
    if (
      r.id.toLowerCase() === q ||
      r.id.toLowerCase().replace("khw-", "") === q ||
      r.id.toLowerCase().replace("#", "") === q
    ) {
      return true;
    }
    // Match email
    if (r.email.toLowerCase().includes(q)) return true;
    // Match guest name
    if (r.name.toLowerCase().includes(q)) return true;
    // Match phone digits (at least 4 digits matched)
    if (digitsOnly.length >= 4) {
      const rDigits = r.phone.replace(/\D/g, "");
      if (rDigits.includes(digitsOnly)) return true;
    }
    return false;
  });
}

/* ==========================================================================
   IN-CAFE ORDERS MANAGEMENT (DISPATCHED TO ALL 3 ADMIN ACCOUNTS)
   ========================================================================== */

export function recordCafeOrder(data: {
  itemId: string;
  itemName: string;
  category: string;
  categoryName: string;
  price: string;
  image?: string;
  tableNumber?: string;
  orderType?: "dine-in" | "takeaway";
  customerName?: string;
  customerPhone?: string;
  notes?: string;
}): CafeOrder {
  const currentOrders = getFromStorage<CafeOrder[]>(STORAGE_KEYS.ORDERS, []);
  const seq = currentOrders.length + 101;
  const now = new Date().toISOString();

  // Retrieve current account names to stamp exact delivery identities
  const accounts = getUserAccounts();
  const adminAcc = accounts.find((a) => a.id === "admin");
  const sub1Acc = accounts.find((a) => a.id === "sub_1");
  const sub2Acc = accounts.find((a) => a.id === "sub_2");

  const sentToAccounts: OrderAccountDelivery[] = [
    {
      accountId: "admin",
      accountName: adminAcc ? adminAcc.displayName : "Primary Administrator",
      role: "admin",
      deliveredAt: now,
    },
    {
      accountId: "sub_1",
      accountName: sub1Acc ? sub1Acc.displayName : "Cafe Floor Manager",
      role: "sub_manager",
      deliveredAt: now,
    },
    {
      accountId: "sub_2",
      accountName: sub2Acc ? sub2Acc.displayName : "Shift Supervisor",
      role: "sub_manager",
      deliveredAt: now,
    },
  ];

  const newOrder: CafeOrder = {
    id: `ORD-${seq}`,
    itemId: data.itemId,
    itemName: data.itemName,
    category: data.category,
    categoryName: data.categoryName,
    price: data.price,
    image: data.image,
    customerName: data.customerName?.trim() || "",
    customerPhone: data.customerPhone?.trim() || "",
    tableNumber: data.tableNumber?.trim() || "Table 1",
    orderType: data.orderType || "dine-in",
    notes: data.notes?.trim() || "",
    timestamp: now,
    status: "new",
    device: detectDevice(),
    sentToAccounts,
  };

  const updated = [newOrder, ...currentOrders];
  saveToStorage(STORAGE_KEYS.ORDERS, updated);

  return newOrder;
}

export function getCafeOrders(): CafeOrder[] {
  return getFromStorage<CafeOrder[]>(STORAGE_KEYS.ORDERS, []);
}

export function updateCafeOrderStatus(
  id: string,
  status: CafeOrder["status"]
): CafeOrder | null {
  const current = getCafeOrders();
  const index = current.findIndex(
    (o) => o.id.toLowerCase() === id.trim().toLowerCase()
  );
  if (index === -1) return null;

  const updated = [...current];
  updated[index] = { ...updated[index], status };
  saveToStorage(STORAGE_KEYS.ORDERS, updated);
  return updated[index];
}

export function deleteCafeOrder(id: string): boolean {
  const current = getCafeOrders();
  const filtered = current.filter((o) => o.id !== id);
  if (filtered.length === current.length) return false;
  saveToStorage(STORAGE_KEYS.ORDERS, filtered);
  return true;
}

/* ==========================================================================
   SAMPLE / DEMO SEEDING & CLEARING
   ========================================================================== */

export function seedSampleData(): void {
  if (!isClient()) return;

  const now = Date.now();
  const hour = 3600 * 1000;
  const day = 24 * hour;

  // Realistic sample reservations
  const sampleReservations: Reservation[] = [
    {
      id: "KHW-101",
      name: "Sophia Martinez",
      phone: "+1 (587) 555-0192",
      email: "sophia.m@example.com",
      heads: 4,
      date: new Date(now + 1 * day).toISOString().split("T")[0],
      time: "18:30",
      notes: "Quiet booth under the olive tree please. Anniversary celebration.",
      status: "confirmed",
      createdAt: new Date(now - 3 * hour).toISOString(),
    },
    {
      id: "KHW-102",
      name: "Tariq Al-Mansoor",
      phone: "+1 (780) 441-8893",
      email: "tariq.mansoor@example.com",
      heads: 2,
      date: new Date(now + 2 * day).toISOString().split("T")[0],
      time: "14:00",
      notes: "First time visiting! Would love coffee pairing recommendations.",
      status: "pending",
      createdAt: new Date(now - 6 * hour).toISOString(),
    },
    {
      id: "KHW-103",
      name: "Liam O'Connor",
      phone: "+1 (587) 890-4421",
      email: "liam.oconnor@example.com",
      heads: 6,
      date: new Date(now + 3 * day).toISOString().split("T")[0],
      time: "19:00",
      notes: "Group study & artisan pastry tasting.",
      status: "confirmed",
      createdAt: new Date(now - 14 * hour).toISOString(),
    },
    {
      id: "KHW-104",
      name: "Elena Rostova",
      phone: "+1 (587) 321-9944",
      email: "elena.rostova@example.com",
      heads: 2,
      date: new Date(now - 1 * day).toISOString().split("T")[0],
      time: "17:00",
      notes: "Window seating preferred.",
      status: "completed",
      createdAt: new Date(now - 28 * hour).toISOString(),
    },
    {
      id: "KHW-105",
      name: "Marcus Vance",
      phone: "+1 (780) 612-3309",
      email: "marcus.vance@example.com",
      heads: 3,
      date: new Date(now + 4 * day).toISOString().split("T")[0],
      time: "12:30",
      notes: "Lunch meeting.",
      status: "pending",
      createdAt: new Date(now - 2 * hour).toISOString(),
    },
    {
      id: "KHW-106",
      name: "Amira Zahrani",
      phone: "+1 (587) 720-1188",
      email: "amira.z@example.com",
      heads: 2,
      date: new Date(now + 1 * day).toISOString().split("T")[0],
      time: "20:00",
      notes: "Anniversary dessert table.",
      status: "cancelled",
      cancelledAt: new Date(now - 1 * hour).toISOString(),
      cancelledBy: "customer",
      cancelReason: "Flight delayed / Rescheduling next week",
      createdAt: new Date(now - 5 * hour).toISOString(),
    },
  ];

  // Sample click events
  const sampleClicks: ClickEvent[] = [
    {
      id: "clk_w01",
      type: "whatsapp",
      source: "Floating WhatsApp Button",
      target: "+15874013212",
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      device: "Mobile",
    },
    {
      id: "clk_w02",
      type: "whatsapp",
      source: "Visit Section WhatsApp Button",
      target: "+15874013212",
      timestamp: new Date(now - 2 * hour).toISOString(),
      device: "Desktop",
    },
    {
      id: "clk_e01",
      type: "email",
      source: "Visit Section Email Button",
      target: "contact@kahwacafe.ca",
      timestamp: new Date(now - 3 * hour).toISOString(),
      device: "Desktop",
    },
    {
      id: "clk_w03",
      type: "whatsapp",
      source: "Floating WhatsApp Button",
      target: "+15874013212",
      timestamp: new Date(now - 5 * hour).toISOString(),
      device: "Mobile",
    },
    {
      id: "clk_e02",
      type: "email",
      source: "Footer Email Link",
      target: "contact@kahwacafe.ca",
      timestamp: new Date(now - 8 * hour).toISOString(),
      device: "Tablet",
    },
    {
      id: "clk_w04",
      type: "whatsapp",
      source: "Reservation Help Link",
      target: "+15874013212",
      timestamp: new Date(now - 12 * hour).toISOString(),
      device: "Mobile",
    },
  ];

  // Sample site visits
  const sampleVisits: SiteVisit[] = [
    {
      id: "vst_s01",
      visitorId: "vis_demo01",
      timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
      path: "/",
      referrer: "https://www.google.com/search?q=kahwa+raw+cafe+edmonton",
      device: "Mobile",
      browser: "Safari",
    },
    {
      id: "vst_s02",
      visitorId: "vis_demo02",
      timestamp: new Date(now - 40 * 60 * 1000).toISOString(),
      path: "/",
      referrer: "https://www.instagram.com/",
      device: "Mobile",
      browser: "Chrome",
    },
    {
      id: "vst_s03",
      visitorId: "vis_demo03",
      timestamp: new Date(now - 2 * hour).toISOString(),
      path: "/",
      referrer: "Direct / Bookmark",
      device: "Desktop",
      browser: "Chrome",
    },
    {
      id: "vst_s04",
      visitorId: "vis_demo04",
      timestamp: new Date(now - 4 * hour).toISOString(),
      path: "/",
      referrer: "https://maps.google.com/",
      device: "Mobile",
      browser: "Safari",
    },
    {
      id: "vst_s05",
      visitorId: "vis_demo05",
      timestamp: new Date(now - 7 * hour).toISOString(),
      path: "/",
      referrer: "https://facebook.com/",
      device: "Desktop",
      browser: "Edge",
    },
    {
      id: "vst_s06",
      visitorId: "vis_demo06",
      timestamp: new Date(now - 10 * hour).toISOString(),
      path: "/",
      referrer: "Direct / Bookmark",
      device: "Tablet",
      browser: "Safari",
    },
  ];

  saveToStorage(STORAGE_KEYS.RESERVATIONS, sampleReservations);
  saveToStorage(STORAGE_KEYS.CLICKS, sampleClicks);
  saveToStorage(STORAGE_KEYS.VISITS, sampleVisits);
  saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_CAFE_SETTINGS);

  // Sample in-cafe item orders dispatched to all 3 accounts
  const sampleOrders: CafeOrder[] = [
    {
      id: "ORD-101",
      itemId: "kahwa-signature-latte",
      itemName: "Kahwa Signature Latte",
      category: "coffee",
      categoryName: "Signature Coffee",
      price: "CAD $6.50",
      tableNumber: "Table 3",
      orderType: "dine-in",
      customerName: "Liam Vance",
      customerPhone: "+1 (587) 555-0182",
      notes: "Oat milk, extra hot, less foam",
      timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
      status: "preparing",
      device: "Mobile",
      sentToAccounts: [
        {
          accountId: "admin",
          accountName: "Primary Administrator",
          role: "admin",
          deliveredAt: new Date(now - 12 * 60 * 1000).toISOString(),
        },
        {
          accountId: "sub_1",
          accountName: "Cafe Floor Manager",
          role: "sub_manager",
          deliveredAt: new Date(now - 12 * 60 * 1000).toISOString(),
        },
        {
          accountId: "sub_2",
          accountName: "Shift Supervisor",
          role: "sub_manager",
          deliveredAt: new Date(now - 12 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "ORD-102",
      itemId: "pistachio-milk-cake",
      itemName: "Pistachio Milk Cake",
      category: "dessert",
      categoryName: "Artisanal Desserts",
      price: "CAD $8.75",
      tableNumber: "Table 5",
      orderType: "dine-in",
      customerName: "Amina K.",
      notes: "Please serve with extra sweet milk sauce",
      timestamp: new Date(now - 25 * 60 * 1000).toISOString(),
      status: "ready",
      device: "Mobile",
      sentToAccounts: [
        {
          accountId: "admin",
          accountName: "Primary Administrator",
          role: "admin",
          deliveredAt: new Date(now - 25 * 60 * 1000).toISOString(),
        },
        {
          accountId: "sub_1",
          accountName: "Cafe Floor Manager",
          role: "sub_manager",
          deliveredAt: new Date(now - 25 * 60 * 1000).toISOString(),
        },
        {
          accountId: "sub_2",
          accountName: "Shift Supervisor",
          role: "sub_manager",
          deliveredAt: new Date(now - 25 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: "ORD-103",
      itemId: "ceremonial-iced-matcha",
      itemName: "Ceremonial Iced Matcha",
      category: "tea-matcha",
      categoryName: "Tea & Matcha",
      price: "CAD $7.25",
      tableNumber: "Takeaway Counter",
      orderType: "takeaway",
      customerName: "David Chen",
      notes: "Light ice, almond milk",
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      status: "served",
      device: "Desktop",
      sentToAccounts: [
        {
          accountId: "admin",
          accountName: "Primary Administrator",
          role: "admin",
          deliveredAt: new Date(now - 45 * 60 * 1000).toISOString(),
        },
        {
          accountId: "sub_1",
          accountName: "Cafe Floor Manager",
          role: "sub_manager",
          deliveredAt: new Date(now - 45 * 60 * 1000).toISOString(),
        },
        {
          accountId: "sub_2",
          accountName: "Shift Supervisor",
          role: "sub_manager",
          deliveredAt: new Date(now - 45 * 60 * 1000).toISOString(),
        },
      ],
    },
  ];
  saveToStorage(STORAGE_KEYS.ORDERS, sampleOrders);
}

export function clearAllData(): void {
  if (!isClient()) return;
  saveToStorage(STORAGE_KEYS.ORDERS, []);
  saveToStorage(STORAGE_KEYS.RESERVATIONS, []);
  saveToStorage(STORAGE_KEYS.CLICKS, []);
  saveToStorage(STORAGE_KEYS.VISITS, []);
  saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_CAFE_SETTINGS);
}

/* ==========================================================================
   CSV EXPORT GENERATOR
   ========================================================================== */

export function exportDataToCSV(type: "orders" | "reservations" | "clicks" | "visits"): void {
  if (!isClient()) return;

  let csvContent = "";
  let filename = `kahwa-${type}-${new Date().toISOString().split("T")[0]}.csv`;

  if (type === "orders") {
    const list = getCafeOrders();
    const headers = [
      "Order ID",
      "Item Name",
      "Category",
      "Price",
      "Table / Type",
      "Customer Name",
      "Customer Phone",
      "Status",
      "Notes",
      "Device",
      "Timestamp",
      "Dispatched To Accounts",
    ];
    csvContent = [
      headers.join(","),
      ...list.map((o) =>
        [
          o.id,
          `"${o.itemName.replace(/"/g, '""')}"`,
          `"${o.categoryName}"`,
          `"${o.price}"`,
          `"${o.tableNumber} (${o.orderType})"`,
          `"${(o.customerName || "").replace(/"/g, '""')}"`,
          `"${o.customerPhone || ""}"`,
          o.status,
          `"${(o.notes || "").replace(/"/g, '""')}"`,
          o.device,
          o.timestamp,
          `"${o.sentToAccounts.map((a) => a.accountName).join("; ")}"`,
        ].join(",")
      ),
    ].join("\n");
  } else if (type === "reservations") {
    const list = getReservations();
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Email",
      "Guests",
      "Date",
      "Time",
      "Status",
      "Cancelled By",
      "Cancelled At",
      "Cancel Reason",
      "Notes",
      "Created At",
    ];
    csvContent = [
      headers.join(","),
      ...list.map((r) =>
        [
          r.id,
          `"${r.name.replace(/"/g, '""')}"`,
          `"${r.phone}"`,
          `"${r.email}"`,
          r.heads,
          r.date,
          r.time,
          r.status,
          `"${r.cancelledBy || ""}"`,
          `"${r.cancelledAt || ""}"`,
          `"${(r.cancelReason || "").replace(/"/g, '""')}"`,
          `"${(r.notes || "").replace(/"/g, '""')}"`,
          r.createdAt,
        ].join(",")
      ),
    ].join("\n");
  } else if (type === "clicks") {
    const list = getClickEvents();
    const headers = ["ID", "Type", "Button Source", "Target", "Device", "Timestamp"];
    csvContent = [
      headers.join(","),
      ...list.map((c) =>
        [
          c.id,
          c.type,
          `"${c.source.replace(/"/g, '""')}"`,
          `"${c.target || ""}"`,
          c.device,
          c.timestamp,
        ].join(",")
      ),
    ].join("\n");
  } else if (type === "visits") {
    const list = getSiteVisits();
    const headers = ["ID", "Visitor ID", "Path", "Device", "Browser", "Referrer", "Timestamp"];
    csvContent = [
      headers.join(","),
      ...list.map((v) =>
        [
          v.id,
          v.visitorId,
          `"${v.path}"`,
          v.device,
          v.browser,
          `"${v.referrer.replace(/"/g, '""')}"`,
          v.timestamp,
        ].join(",")
      ),
    ].join("\n");
  }

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
