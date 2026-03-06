import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, {
  attachAuthHandlers,
  clearTokens,
  setAccessToken,
} from "../utils/api";

export const AuthContext = createContext(null);

function normalizeRole(value) {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/^ROLE_/, "")
    .replace(/[\s-]+/g, "_");
  if (!raw) return "EMPLOYEE";
  if (raw === "SUPERADMIN") return "SUPER_ADMIN";
  return raw;
}

function parseTokenPayload(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

function userFromToken(token, fallbackEmail = "", responseData = null) {
  const payload = parseTokenPayload(token);
  const responseUser = responseData?.user || null;
  const username =
    responseUser?.username ||
    responseData?.username ||
    payload?.username ||
    responseUser?.userName ||
    responseData?.userName ||
    payload?.userName ||
    "";
  const firstName =
    responseUser?.firstName || responseData?.firstName || payload?.firstName || "";
  const lastName =
    responseUser?.lastName || responseData?.lastName || payload?.lastName || "";
  return {
    id: payload?.userId || responseUser?.id || responseData?.userId || null,
    email:
      payload?.email ||
      responseUser?.email ||
      responseData?.email ||
      payload?.sub ||
      fallbackEmail ||
      "",
    username,
    firstName,
    lastName,
    role: normalizeRole(responseData?.role || payload?.role || "EMPLOYEE"),
    institution: responseData?.institution || "",
    institutionCategory: responseData?.institutionCategory || "",
    institutionType: responseData?.institutionType || "",
    departmentName: responseData?.departmentName || "",
    team: responseData?.team || "",
    forcePasswordChange:
      responseData?.forcePasswordChange !== undefined
        ? Boolean(responseData.forcePasswordChange)
        : Boolean(payload?.forcePasswordChange),
    isProfileIncomplete: Boolean(responseData?.isProfileIncomplete),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Attach auth failure/refresh handlers to the api interceptor
  useEffect(() => {
    attachAuthHandlers({
      handleAuthFailure: () => {
        setUser(null);
        setAccessTokenState(null);
        clearTokens();
        if (window.location.pathname !== "/login") {
          window.location.assign("/login");
        }
      },
      handleTokenRefreshed: (data) => {
        const token = data?.accessToken;
        if (!token) return;
        setAccessToken(token);
        setAccessTokenState(token);
        setUser(userFromToken(token, user?.email || "", data));
      },
    });
  }, [user?.email]);

  // Restore session on every page load via the refresh cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await api.post("/api/auth/refresh", {});
        const nextAccess = response.data?.accessToken;
        if (!nextAccess) throw new Error("Unable to restore session");
        setAccessToken(nextAccess);
        setAccessTokenState(nextAccess);
        setUser(userFromToken(nextAccess, "", response.data));
      } catch {
        clearTokens();
        setUser(null);
        setAccessTokenState(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (identifier, password) => {
    const response = await api.post("/api/auth/login", {
      identifier,
      password,
    });
    const nextAccess = response.data?.accessToken;
    if (!nextAccess) throw new Error("Invalid login response");
    setAccessToken(nextAccess);
    setAccessTokenState(nextAccess);
    setUser(userFromToken(nextAccess, identifier, response.data));
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout", {});
    } finally {
      clearTokens();
      setUser(null);
      setAccessTokenState(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
    }),
    [user, accessToken, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
