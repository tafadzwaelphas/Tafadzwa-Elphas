const THEME_KEY = "theme";
const themeToggle = document.querySelector(".theme-toggle");
const colorSchemeQuery = matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

colorSchemeQuery.addEventListener("change", (event) => {
  if (!localStorage.getItem(THEME_KEY)) {
    applyTheme(event.matches ? "dark" : "light");
  }
});
