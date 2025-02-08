import { storage } from "wxt/storage";

enum THEME {
  dark = "dark",
  light = "light",
}

const themeStore = storage.defineItem<THEME>("local:theme");

async function toggleTheme() {
  const isDark = htmlElement.classList.toggle(THEME.dark);
  await themeStore.setValue(isDark ? THEME.dark : THEME.light);

  console.log("isDark", isDark);
  console.log("now theme", await themeStore.getValue());
}

async function preferTheme() {
  await themeStore.setValue(null);
  htmlElement.classList.toggle(
    THEME.dark,
    window.matchMedia(`(prefers-color-scheme: ${THEME.dark})`).matches
  );
}

// init
const htmlElement = document.documentElement;
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

const storedTheme = await themeStore.getValue();
const isDark = htmlElement.classList.toggle(
  THEME.dark,
  storedTheme === THEME.dark ||
    (storedTheme === null &&
      window.matchMedia(`(prefers-color-scheme: ${THEME.dark})`).matches)
);
console.log("init theme", { storedTheme, isDark });
