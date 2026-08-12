document.querySelectorAll(".project-slider").forEach((slider) => {
  const track = slider.querySelector(".project-slider-track");
  const slides = Array.from(track.children);
  const counter = slider.querySelector(".project-slider-counter");
  const prevBtn = slider.querySelector(".project-slider-prev");
  const nextBtn = slider.querySelector(".project-slider-next");

  const currentIndex = () => Math.round(track.scrollLeft / track.clientWidth);

  const updateCounter = () => {
    if (!counter) return;
    const index = Math.min(Math.max(currentIndex(), 0), slides.length - 1);
    const pad = (n) => String(n).padStart(2, "0");
    counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
  };

  const goToSlide = (index) => {
    const clamped = Math.min(Math.max(index, 0), slides.length - 1);
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  };

  track.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateCounter);
  }, { passive: true });

  prevBtn?.addEventListener("click", () => goToSlide(currentIndex() - 1));
  nextBtn?.addEventListener("click", () => goToSlide(currentIndex() + 1));

  updateCounter();

  const AUTO_SLIDE_INTERVAL = 4000;
  let autoSlideTimer = null;

  const startAutoSlide = () => {
    if (slides.length <= 1) return;
    autoSlideTimer = setInterval(() => {
      goToSlide((currentIndex() + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
  };

  const stopAutoSlide = () => {
    clearInterval(autoSlideTimer);
  };

  startAutoSlide();
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
});
