import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AuthContext from "./context/AuthContext.tsx";
import { SidebarProvider } from "./context/SidebarContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContext>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </AuthContext>
  </StrictMode>
);
