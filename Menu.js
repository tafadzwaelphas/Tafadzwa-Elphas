const menuTrigger = document.querySelector(".menu-trigger");
const menuOverlay = document.querySelector(".menu-overlay");

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuTrigger.textContent = "Menu";
  menuTrigger.setAttribute("aria-expanded", "false");
}

function openMenu() {
  document.body.classList.add("menu-open");
  menuTrigger.textContent = "Close";
  menuTrigger.setAttribute("aria-expanded", "true");
}

menuTrigger.addEventListener("click", () => {
  document.body.classList.contains("menu-open") ? closeMenu() : openMenu();
});

menuOverlay.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

const currentPage = location.pathname.split("/").pop() || "index.html";
menuOverlay.querySelectorAll(".menu-overlay-links a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});
