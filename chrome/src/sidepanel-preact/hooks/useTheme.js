/**
 * useTheme — three-way theme selector (auto / light / dark).
 *
 * Persists the user's preference to localStorage. Sets `data-theme="dark"`
 * on document.documentElement when the resolved theme is dark; CSS uses
 * that attribute selector to swap CSS variable values.
 *
 * "auto" follows `prefers-color-scheme` and reacts to system changes.
 */

import { useEffect, useState, useCallback } from "preact/hooks";

const STORAGE_KEY = "browser-memex.theme";

function loadInitial() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "auto") return v;
  } catch {
    /* ignore */
  }
  return "auto";
}

function resolvedDarkFor(pref, mediaPrefersDark) {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  return mediaPrefersDark;
}

export function useTheme() {
  const [pref, setPref] = useState(loadInitial);
  const [systemDark, setSystemDark] = useState(() => {
    if (typeof matchMedia === "undefined") return false;
    return matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (typeof matchMedia === "undefined") return undefined;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const isDark = resolvedDarkFor(pref, systemDark);
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    }
  }, [pref, systemDark]);

  const setTheme = useCallback((value) => {
    if (!["auto", "light", "dark"].includes(value)) return;
    setPref(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    pref,
    isDark: resolvedDarkFor(pref, systemDark),
    setTheme,
  };
}
