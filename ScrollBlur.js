const scrollBlurTargets = document.querySelectorAll("[data-scroll-blur]");

if (scrollBlurTargets.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && window.lenis) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svgRoot = document.createElementNS(svgNS, "svg");
  svgRoot.setAttribute("width", "0");
  svgRoot.setAttribute("height", "0");
  svgRoot.style.position = "absolute";
  document.body.appendChild(svgRoot);

  const defs = document.createElementNS(svgNS, "defs");
  svgRoot.appendChild(defs);

  const filter = document.createElementNS(svgNS, "filter");
  filter.setAttribute("id", "scroll-blur");
  filter.setAttribute("x", "-20%");
  filter.setAttribute("y", "-50%");
  filter.setAttribute("width", "140%");
  filter.setAttribute("height", "200%");

  const blur = document.createElementNS(svgNS, "feGaussianBlur");
  blur.setAttribute("stdDeviation", "0 0");
  filter.appendChild(blur);
  defs.appendChild(filter);

  scrollBlurTargets.forEach((el) => {
    el.style.filter = "url(#scroll-blur)";
  });

  const MAX_BLUR = 6;
  const VELOCITY_MAX = 20;

  window.lenis.on("scroll", ({ velocity }) => {
    const intensity = Math.abs(velocity) < 0.05 ? 0 : Math.min(Math.abs(velocity) / VELOCITY_MAX, 1);
    blur.setAttribute("stdDeviation", `0 ${(intensity * MAX_BLUR).toFixed(2)}`);
  });
}
