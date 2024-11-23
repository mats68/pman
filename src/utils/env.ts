// src/utils/env.ts

// Prüft, ob die App in Tauri läuft
export const isTauri = () => {
    return typeof window !== "undefined" && !!window.__TAURI__;
  };
  