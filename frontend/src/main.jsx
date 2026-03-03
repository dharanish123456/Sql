import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import QueryProvider from "./providers/QueryProvider";
import ErrorBoundary from "./components/system/ErrorBoundary";
import ToastProvider from "./components/system/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <QueryProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ErrorBoundary>
        </QueryProvider>
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>
);
