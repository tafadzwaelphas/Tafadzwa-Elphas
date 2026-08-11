const currentPage = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".site-nav a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

const siteMenu = document.querySelector(".site-menu");
const SCROLL_THRESHOLD = 24;

if (siteMenu) {
  const setScrolledState = () => {
    siteMenu.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
  };

  setScrolledState();
  window.addEventListener("scroll", setScrolledState, { passive: true });
}
