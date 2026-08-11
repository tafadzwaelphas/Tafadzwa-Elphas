const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

const siteMenu = document.querySelector(".site-menu");
const menuToggle = document.querySelector(".site-menu-toggle");
const SCROLL_THRESHOLD = 24;

if (siteMenu) {
  const setScrolledState = () => {
    const isScrolled = window.scrollY > SCROLL_THRESHOLD;
    siteMenu.classList.toggle("scrolled", isScrolled);
    if (!isScrolled) {
      siteMenu.classList.remove("menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  };

  setScrolledState();
  window.addEventListener("scroll", setScrolledState, { passive: true });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteMenu.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
