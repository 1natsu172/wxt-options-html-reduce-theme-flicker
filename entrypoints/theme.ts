import { storage } from "wxt/storage";

export default defineUnlistedScript({
  async main() {
    enum THEME {
      dark = "dark",
      light = "light",
    }
    const LOCAL_KEY = "theme" as const;
    const SYNCED_KEY = "sync:theme" as const;
    const themeStore = storage.defineItem<THEME>(SYNCED_KEY);

    // Sync storage with local storage
    themeStore.watch((value) => {
      if (typeof value === "string") {
        localStorage.setItem(LOCAL_KEY, value);
      } else {
        localStorage.removeItem(LOCAL_KEY);
      }
    });

    async function toggleTheme() {
      const isDark = htmlElement.classList.toggle(THEME.dark);
      const storeValue = isDark ? THEME.dark : THEME.light;
      await themeStore.setValue(storeValue);

      console.log("isDark", isDark);
      console.log("now storage", {
        sync: await themeStore.getValue(),
        local: localStorage.getItem(LOCAL_KEY),
      });
    }

    async function preferTheme() {
      await themeStore.removeValue();
      const isDark = htmlElement.classList.toggle(
        THEME.dark,
        window.matchMedia(`(prefers-color-scheme: ${THEME.dark})`).matches
      );

      console.log("isDark", isDark);
      console.log("now storage", {
        sync: await themeStore.getValue(),
        local: localStorage.getItem(LOCAL_KEY),
      });
    }

    window.addEventListener("DOMContentLoaded", () => {
      console.log("DOMContentLoaded");

      const themeToggleBtn = document.getElementById("theme-toggle");
      const themePreferColorSchemeBtn = document.getElementById(
        "theme-prefers-color-scheme"
      );

      themeToggleBtn?.addEventListener("click", async () => {
        await toggleTheme();
      });
      themePreferColorSchemeBtn?.addEventListener("click", async () => {
        await preferTheme();
      });
    });

    // ASAP resolve the theme
    const htmlElement = document.documentElement;
    const storedTheme = localStorage.getItem(LOCAL_KEY);
    const isDark = htmlElement.classList.toggle(
      THEME.dark,
      storedTheme === THEME.dark ||
        (storedTheme === null &&
          window.matchMedia(`(prefers-color-scheme: ${THEME.dark})`).matches)
    );
    console.log("onload theme", { isDark, storedTheme });
  },
});
