(() => {
  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const root = document.documentElement;
    const body = document.body;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const header = document.getElementById("siteHeader");
    const progress = document.querySelector(".page-progress");
    const menuButton = document.getElementById("menuToggle");
    const nav = document.getElementById("primaryNav");
    const themeButton = document.getElementById("themeToggle");
    const backToTop = document.getElementById("backToTop");
    let ticking = false;

    // A very short, non-blocking loading cue instead of a full-screen delay.
    if (progress && !reducedMotion.matches) {
      progress.classList.add("is-loading");
      window.setTimeout(() => progress.classList.remove("is-loading"), 900);
    }

    // Keep the prior theme preference when one has already been chosen.
    try {
      if (window.localStorage.getItem("awn-theme") === "light") {
        body.classList.add("theme-light");
      }
    } catch (_) {
      // The theme still works when storage is disabled.
    }

    const updateThemeLabel = () => {
      const switchesTo = body.classList.contains("theme-light") ? "dark" : "light";
      themeButton?.setAttribute("aria-label", `Switch to ${switchesTo} theme`);
      themeButton?.setAttribute("title", `Switch to ${switchesTo} theme`);
      root.style.colorScheme = body.classList.contains("theme-light") ? "light" : "dark";
    };
    updateThemeLabel();

    themeButton?.addEventListener("click", () => {
      const useLight = !body.classList.contains("theme-light");
      body.classList.toggle("theme-light", useLight);
      updateThemeLabel();
      try {
        window.localStorage.setItem("awn-theme", useLight ? "light" : "dark");
      } catch (_) {
        // A private or restricted browsing mode can reject storage writes.
      }
    });

    // Mobile menu is usable with touch, keyboard and assistive technology.
    const closeMenu = () => {
      menuButton?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation menu");
      nav?.classList.remove("is-open");
    };
    menuButton?.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.classList.toggle("is-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      nav?.classList.toggle("is-open", isOpen);
    });
    nav?.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 850) closeMenu();
    }, { passive: true });

    // Typewriting cycles through the existing professional introductions.
    const typewriter = document.getElementById("typewriter");
    const titles = [
      "Information Science Student",
      "Aspiring IT Professional",
      "Web Development Enthusiast",
      "Future Software Developer"
    ];
    if (typewriter) {
      if (reducedMotion.matches) {
        typewriter.textContent = titles[0];
      } else {
        let titleIndex = 0;
        let characterIndex = 0;
        let deleting = false;
        const write = () => {
          const title = titles[titleIndex];
          characterIndex += deleting ? -1 : 1;
          typewriter.textContent = title.slice(0, characterIndex);
          let delay = deleting ? 31 : 55;
          if (!deleting && characterIndex === title.length) {
            deleting = true;
            delay = 1550;
          } else if (deleting && characterIndex === 0) {
            deleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            delay = 260;
          }
          window.setTimeout(write, delay);
        };
        window.setTimeout(write, 500);
      }
    }

    // Reveal-on-scroll, with card groups entering in a gentle sequence.
    const reveals = Array.from(document.querySelectorAll(".reveal"));
    const staggerGroups = [".about-highlights", ".skills-grid", ".projects-grid", ".goals-list"];
    staggerGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        Array.from(group.querySelectorAll(":scope > .reveal")).forEach((item, index) => {
          item.style.setProperty("--reveal-delay", `${Math.min(index * 72, 216)}ms`);
        });
      });
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      reveals.forEach((element) => element.classList.add("is-visible"));
      body.classList.add("motion-ready");
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -45px 0px", threshold: 0.08 });
      reveals.forEach((element) => revealObserver.observe(element));
      // Apply the hiding class only once the observer is ready; no-JS content stays visible.
      body.classList.add("motion-ready");
      requestAnimationFrame(() => {
        reveals.filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        }).forEach((element) => element.classList.add("is-visible"));
      });
    }

    // Keep the active navigation item and scroll-to-top affordance in sync.
    const navLinks = Array.from(document.querySelectorAll(".nav__link"));
    const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const active = link.hash === `#${id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: "-43% 0px -48% 0px", threshold: 0 });
      sections.forEach((section) => sectionObserver.observe(section));
    }

    const updateScrollDecor = () => {
      const y = window.scrollY || 0;
      header?.classList.toggle("is-scrolled", y > 20);
      backToTop?.classList.toggle("is-visible", y > 600);
      if (progress && !reducedMotion.matches) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.setProperty("--scroll-progress", maxScroll > 0 ? `${y / maxScroll}` : "0");
      }
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateScrollDecor);
      }
    }, { passive: true });
    updateScrollDecor();

    // Respect a changed operating-system motion preference without reloading.
    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) {
        reveals.forEach((element) => element.classList.add("is-visible"));
        if (typewriter) typewriter.textContent = titles[0];
        progress?.classList.remove("is-loading");
        progress?.removeAttribute("style");
      }
    });

    // A restrained portrait parallax, limited to precise-pointer devices.
    const heroVisual = document.getElementById("heroVisual");
    const portraitCard = heroVisual?.querySelector(".portrait-card");
    if (heroVisual && portraitCard && finePointer.matches && !reducedMotion.matches) {
      heroVisual.addEventListener("pointermove", (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - .5;
        const ny = (event.clientY - rect.top) / rect.height - .5;
        portraitCard.style.transform = `rotateY(${(-nx * 4).toFixed(2)}deg) rotateX(${(ny * 3).toFixed(2)}deg)`;
      }, { passive: true });
      heroVisual.addEventListener("pointerleave", () => {
        portraitCard.style.removeProperty("transform");
      }, { passive: true });

      // Subtle cursor glow on the project cards; no 3D motion on touch devices.
      document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
        }, { passive: true });
      });
    }

    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  });
})();
