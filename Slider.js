document.querySelectorAll(".project-slider").forEach((slider) => {
  const track = slider.querySelector(".project-slider-track");
  const slides = Array.from(track.children);
  const counter = slider.querySelector(".project-slider-counter");
  const prevBtn = slider.querySelector(".project-slider-prev");
  const nextBtn = slider.querySelector(".project-slider-next");
  const groupLabel = slider.previousElementSibling?.matches("[data-slider-group-label]")
    ? slider.previousElementSibling
    : null;

  const currentIndex = () => Math.round(track.scrollLeft / track.clientWidth);

  const updateCounter = () => {
    const index = Math.min(Math.max(currentIndex(), 0), slides.length - 1);
    if (counter) {
      const pad = (n) => String(n).padStart(2, "0");
      counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
    }
    if (groupLabel) {
      const group = slides[index].dataset.group;
      if (group) groupLabel.textContent = group;
    }
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
  let isHovering = false;
  let isVideoPlaying = false;

  const stopAutoSlide = () => {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  };

  const startAutoSlide = () => {
    if (slides.length <= 1 || isHovering || isVideoPlaying || autoSlideTimer) return;
    autoSlideTimer = setInterval(() => {
      goToSlide((currentIndex() + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
  };

  startAutoSlide();
  slider.addEventListener("mouseenter", () => {
    isHovering = true;
    stopAutoSlide();
  });
  slider.addEventListener("mouseleave", () => {
    isHovering = false;
    startAutoSlide();
  });

  track.querySelectorAll("video").forEach((video) => {
    video.addEventListener("play", () => {
      isVideoPlaying = true;
      stopAutoSlide();
    });
    video.addEventListener("pause", () => {
      isVideoPlaying = false;
      startAutoSlide();
    });
    video.addEventListener("ended", () => {
      isVideoPlaying = false;
      startAutoSlide();
    });

    // No native controls on these (see markup) -- hover plays/loops the clip,
    // moving away pauses and rewinds so the next hover starts fresh. Devices
    // without real hover (touch) fall back to tap-to-toggle via `click`,
    // which also fires after a tap.
    video.addEventListener("mouseenter", () => {
      video.play().catch(() => {});
    });
    video.addEventListener("mouseleave", () => {
      video.pause();
      video.currentTime = 0;
    });
    video.addEventListener("click", () => {
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  });
});
