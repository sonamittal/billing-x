// "use client";
// import * as React from "react";
// import { ThemeProvider as NextThemesProvider } from "next-themes";

// const ThemeProvider = ({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) => {
//   return (
//     <NextThemesProvider
//       attribute="class"
//       defaultTheme="system"
//       enableSystem
//       {...props}
//     >
//       {children}
//     </NextThemesProvider>
//   );
// };
// export default ThemeProvider;
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCookie, setCookie, removeCookie } from "@/lib/cookies";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const THEME_COOKIE = "vite-ui-theme";
const COOKIE_AGE = 60 * 60 * 24 * 365;

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  resetTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (getCookie(THEME_COOKIE) as Theme) || "system",
  );

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const getSystemTheme = (): ResolvedTheme =>
      mediaQuery.matches ? "dark" : "light";

    const applyTheme = (value: ResolvedTheme) => {
      root.classList.remove("light", "dark");
      root.classList.add(value);
      setResolvedTheme(value);
    };

    if (theme === "system") {
      applyTheme(getSystemTheme());
    } else {
      applyTheme(theme);
    }

    const handleChange = () => {
      if (theme === "system") {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (value: Theme) => {
    setCookie(THEME_COOKIE, value, COOKIE_AGE);
    setThemeState(value);
  };

  const resetTheme = () => {
    removeCookie(THEME_COOKIE);
    setThemeState("system");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, resetTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
