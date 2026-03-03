import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import { adminPhpRoutes } from "./adminPhpRoutes";
import PageLoader from "./components/common/PageLoader";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/common/LoginPage";
import UnauthorizedPage from "./pages/common/UnauthorizedPage";
import RouteProgress, {
  beginRouteProgress,
  endRouteProgress,
} from "./components/system/RouteProgress";
import BootstrapInitializer from "./components/system/BootstrapInitializer";
import { useAuth } from "./context/AuthContext";

const adminPageModules = import.meta.glob("./pages/admin/*Page.jsx");

const ActivityPage = lazy(() => import("./pages/admin/ActivityPage"));
const AdminDashboardPage = lazy(
  () => import("./pages/admin/AdminDashboardPage"),
);
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
const AttendanceAdminPage = lazy(
  () => import("./pages/admin/AttendanceAdminPage"),
);
const AttendanceEmployeePage = lazy(
  () => import("./pages/admin/AttendanceEmployeePage"),
);

const explicitLazyComponents = {
  ActivityPage,
  AdminDashboardPage,
  AnalyticsPage,
  AttendanceAdminPage,
  AttendanceEmployeePage,
};

const lazyComponentCache = { ...explicitLazyComponents };

const publicRoutePaths = new Set([
  "login.php",
  "login-2.php",
  "login-3.php",
  "register.php",
  "register-2.php",
  "register-3.php",
  "forgot-password.php",
  "forgot-password-2.php",
  "forgot-password-3.php",
  "reset-password.php",
  "reset-password-2.php",
  "reset-password-3.php",
  "error-404.php",
  "error-500.php",
]);

const adminOnlyPaths = new Set([
  "useradmin",
  "user-edit/:id",
  "usergroups",
  "usergroups/edit/:id",
  "registration",
  "security",
  "security-settings",
  "session-settings",
  "user-settings",
  "logs",
]);

function RouteFallback() {
  useEffect(() => {
    beginRouteProgress();
    return () => endRouteProgress();
  }, []);
  return <PageLoader />;
}

function RoleRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const role = String(user?.role || "").toUpperCase();
  if (role === "EMPLOYEE") {
    return <Navigate to="/employee-dashboard" replace />;
  }
  return <Navigate to="/admin-dashboard" replace />;
}

function resolveLazyComponent(componentName) {
  if (lazyComponentCache[componentName]) {
    return lazyComponentCache[componentName];
  }
  const moduleImporter = adminPageModules[`./pages/admin/${componentName}.jsx`];
  if (!moduleImporter) return null;
  const LazyComponent = lazy(moduleImporter);
  lazyComponentCache[componentName] = LazyComponent;
  return LazyComponent;
}

function getRouteElement(routePath, componentName) {
  const LazyComponent = resolveLazyComponent(componentName);

  if (!LazyComponent) {
    return (
      <div className="card">
        <div className="card-body">
          <h4 className="mb-2">Route Component Missing</h4>
          <p className="mb-0">No component found for: {componentName}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      {publicRoutePaths.has(routePath) ? (
        <LazyComponent />
      ) : (
        <ProtectedRoute role={adminOnlyPaths.has(routePath) ? "admin" : null}>
          <LazyComponent />
        </ProtectedRoute>
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <>
      <BootstrapInitializer />
      <RouteProgress />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/login" replace />} />
          {adminPhpRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={getRouteElement(route.path, route.component)}
            />
          ))}
          <Route
            path="*"
            element={<RoleRedirect />}
          />
        </Route>
      </Routes>
    </>
  );
}
