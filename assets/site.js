(() => {
  const root = document.getElementById("try-home");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    theme: "miasma",
    platform: "mac",
    motion: !reduce.matches,
    spacing: 64,
  };
  const names = { tokyo: "Tokyo Night", miasma: "Miasma", latte: "Latte" };
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem("tryomarchy-preferences"));
  } catch {}
  if (saved && names[saved.theme]) state.theme = saved.theme;
  if (saved && ["mac", "windows"].includes(saved.platform))
    state.platform = saved.platform;
  if (saved && typeof saved.motion === "boolean")
    state.motion = saved.motion && !reduce.matches;
  const q = (s) => root.querySelector(s);
  const canvas = q(".to-particles"),
    context = canvas.getContext("2d");
  let frame = 0,
    visible = true,
    width = 1,
    height = 1,
    particles = [],
    start = performance.now(),
    last = 0;
  function seed(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  function resize() {
    if (!context) return;
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = [];
    for (let i = 0; i < 150; i++) {
      const x = seed(i + 1) * width,
        y = seed(i + 501) * height;
      const edge = x < width * 0.16 || x > width * 0.84 || y > height * 0.9;
      if (edge)
        particles.push({
          x,
          y,
          size: seed(i + 81) > 0.8 ? 6 : 3,
          a: 0.15 + seed(i + 202) * 0.45,
          p: seed(i + 15) * 6.28,
        });
    }
    draw(performance.now());
  }
  function draw(now) {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    context.fillStyle = getComputedStyle(root)
      .getPropertyValue("--to-green")
      .trim();
    const t = state.motion && !reduce.matches ? (now - start) / 1800 : 0;
    for (const p of particles) {
      context.globalAlpha = p.a * (0.72 + 0.28 * Math.sin(t + p.p));
      context.fillRect(
        Math.round(p.x),
        Math.round(p.y + (state.motion ? Math.sin(t * 0.4 + p.p) * 3 : 0)),
        p.size,
        p.size,
      );
    }
    context.globalAlpha = 1;
  }
  function tick(now) {
    frame = 0;
    if (now - last > 45) {
      draw(now);
      last = now;
    }
    if (state.motion && !reduce.matches && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    draw(performance.now());
    if (state.motion && !reduce.matches && visible && !document.hidden)
      frame = requestAnimationFrame(tick);
  }
  function render() {
    root.dataset.theme = state.theme;
    root.dataset.motion = state.motion && !reduce.matches ? "on" : "off";
    q("#to-theme-select").value = state.theme;
    root
      .querySelectorAll("[data-theme-choice]")
      .forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.themeChoice === state.theme),
        ),
      );
    root.querySelectorAll("[data-platform]").forEach((b) => {
      b.setAttribute(
        "aria-selected",
        String(b.dataset.platform === state.platform),
      );
      b.tabIndex = b.dataset.platform === state.platform ? 0 : -1;
    });
    q("#to-mac-image").hidden = state.platform !== "mac";
    q("#to-windows-image").hidden = state.platform !== "windows";
    if (state.platform !== "windows") q("#to-windows-image").pause();
    q("#to-preview").setAttribute(
      "aria-labelledby",
      "to-" + state.platform + "-tab",
    );
    q("#to-platform-caption").textContent =
      state.platform === "mac"
        ? "Omarchy on macOS. Your Mac is still your Mac."
        : "Omarchy on Windows. Your Windows setup stays in place.";
    q("#to-source").href =
      state.platform === "mac"
        ? "https://github.com/omacom/try-omarchy"
        : "https://github.com/omacom/try-omarchy-windows";
    q("#to-source").textContent =
      state.platform === "mac" ? "Screenshot source ↗" : "Windows project ↗";
    q(".to-motion").setAttribute(
      "aria-pressed",
      String(state.motion && !reduce.matches),
    );
    q(".to-motion span").textContent =
      state.motion && !reduce.matches ? "Motion on" : "Motion off";
    syncMotion();
  }
  function save() {
    try {
      localStorage.setItem(
        "tryomarchy-preferences",
        JSON.stringify({
          theme: state.theme,
          platform: state.platform,
          motion: state.motion,
        }),
      );
    } catch {}
  }
  q("#to-theme-select").addEventListener("change", (e) => {
    state.theme = e.target.value;
    render();
    save();
  });
  q("#to-theme-button").addEventListener("click", () => {
    const menu = q("#to-theme-menu");
    menu.hidden = !menu.hidden;
    q("#to-theme-button").setAttribute("aria-expanded", String(!menu.hidden));
  });
  q(".to-mobile-menu").addEventListener("click", () => {
    const menu = q("#to-mobile-navigation");
    menu.hidden = !menu.hidden;
    q(".to-mobile-menu").setAttribute("aria-expanded", String(!menu.hidden));
  });
  root.querySelectorAll("[data-theme-choice]").forEach((b) =>
    b.addEventListener("click", () => {
      state.theme = b.dataset.themeChoice;
      render();
      save();
    }),
  );
  root.querySelectorAll("[data-platform]").forEach((b) => {
    b.addEventListener("click", () => {
      state.platform = b.dataset.platform;
      render();
      save();
    });
    b.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        e.preventDefault();
        state.platform =
          e.key === "Home"
            ? "mac"
            : e.key === "End"
              ? "windows"
              : state.platform === "mac"
                ? "windows"
                : "mac";
        render();
        q("#to-" + state.platform + "-tab").focus();
        save();
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const theme = q("#to-theme-menu");
    if (!theme.hidden) {
      theme.hidden = true;
      q("#to-theme-button").setAttribute("aria-expanded", "false");
      q("#to-theme-button").focus();
    }
    const menu = q("#to-mobile-navigation");
    if (!menu.hidden) {
      menu.hidden = true;
      q(".to-mobile-menu").setAttribute("aria-expanded", "false");
      q(".to-mobile-menu").focus();
    }
  });
  q(".to-motion").addEventListener("click", () => {
    state.motion = !state.motion;
    render();
    save();
  });
  root.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const target = root.querySelector(a.getAttribute("href"));
      if (
        target &&
        !e.defaultPrevented &&
        e.button === 0 &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        history.replaceState(history.state, "", a.getAttribute("href"));
        target.scrollIntoView({
          behavior: reduce.matches ? "instant" : "smooth",
          block: "start",
        });
      }
    }),
  );
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      syncMotion();
    },
    { threshold: 0 },
  ).observe(canvas);
  document.addEventListener("visibilitychange", syncMotion);
  reduce.addEventListener("change", () => {
    if (reduce.matches) state.motion = false;
    render();
  });
  render();
})();
