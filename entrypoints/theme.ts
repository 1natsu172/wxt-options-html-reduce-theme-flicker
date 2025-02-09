import { storage } from "wxt/storage";

export default defineUnlistedScript({
  async main() {
    enum THEME {
      dark = "dark",
      light = "light",
    }
    const STORE_KEY = 'theme' as const;

    // const themeStore = storage.defineItem<THEME>("local:theme");
    const themeStore = localStorage;

    function toggleTheme() {
      const isDark = htmlElement.classList.toggle(THEME.dark);
      themeStore.setItem(STORE_KEY, isDark ? THEME.dark : THEME.light);

      console.log("isDark", isDark);
      console.log("now theme", themeStore.getItem(STORE_KEY));
    }

    function preferTheme() {
      themeStore.removeItem(STORE_KEY);
      htmlElement.classList.toggle(
        THEME.dark,
        window.matchMedia(`(prefers-color-scheme: ${THEME.dark})`).matches
      );
    }

    window.addEventListener("DOMContentLoaded", () => {
      console.log("DOMContentLoaded");

      const themeToggleBtn = document.getElementById("theme-toggle");
      const themePreferColorSchemeBtn = document.getElementById(
        "theme-prefers-color-scheme"
      );

      themeToggleBtn?.addEventListener("click", () => {
        toggleTheme();
      });
      themePreferColorSchemeBtn?.addEventListener("click", () => {
        preferTheme();
      });
    });

    // ASAP resolve the theme
    const htmlElement = document.documentElement;
    const storedTheme = themeStore.getItem(STORE_KEY);
    const isDark = htmlElement.classList.toggle(
      THEME.dark,
      storedTheme === THEME.dark ||
        (storedTheme === null &&
          window.matchMedia(`(prefers-color-scheme: ${THEME.dark})`).matches)
    );
    console.log("onload theme", { isDark, storedTheme });
  },
});
