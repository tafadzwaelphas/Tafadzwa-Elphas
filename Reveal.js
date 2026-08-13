gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

gsap.utils.toArray(".name-reveal-line").forEach((line) => {
  gsap.to(line, {
    opacity: 1,
    y: 0,
    ease: "none",
    scrollTrigger: {
      trigger: line,
      start: "top 90%",
      end: "top 40%",
      scrub: true,
    },
  });
});

const bannerImg = document.querySelector(".banner img");
if (bannerImg) {
  gsap.fromTo(
    bannerImg,
    { yPercent: -10 },
    {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: bannerImg.closest(".banner"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    }
  );
}

gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    }
  );
});
