/* ==========================================================================
   ABDULWEHAB NESRU · CINEMATIC PORTFOLIO SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================
     1. PRELOADER (Bulletproof Timing)
     ========================================== */
  const preloader = document.getElementById("preloader");
  
  // Wait 2.5 seconds (matching the CSS animation), then slide it up
  setTimeout(() => {
    gsap.to(preloader, {
      y: "-100%", 
      duration: 0.8,
      ease: "power4.inOut",
      onComplete: () => {
        preloader.style.display = "none";
        // Trigger hero animations only AFTER preloader is gone
        initHeroAnimations();
      }
    });
  }, 2500); 

  /* ==========================================
     2. SMOOTH SCROLL (LENIS)
     ========================================== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  /* ==========================================
     3. CUSTOM CURSOR
     ========================================== */
  const cursorDot = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");

  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      gsap.to(cursorDot, { x: posX, y: posY, duration: 0 });
      gsap.to(cursorRing, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
    });

    const interactiveElements = document.querySelectorAll("a, button, .skill-item");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("hovered"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("hovered"));
    });
  }

  /* ==========================================
     4. SCROLL PROGRESS BAR
     ========================================== */
  const scrollProgress = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.height = `${scrollPercent}%`;
  });

  /* ==========================================
     5. NAVBAR & MOBILE MENU
     ========================================== */
  const navHeader = document.getElementById("navHeader");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navHeader.classList.add("scrolled");
    } else {
      navHeader.classList.remove("scrolled");
    }
  });

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });

  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  });

  /* ==========================================
     6. HERO TYPING EFFECT
     ========================================== */
  const typingText = document.getElementById("typing-text");
  const roles = [
    "Information Science Student",
    "Aspiring IT Professional",
    "Web Development Enthusiast",
    "Future Software Developer"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typingText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  /* ==========================================
     7. HERO ANIMATIONS
     ========================================== */
  function initHeroAnimations() {
    const heroTl = gsap.timeline();
    
    heroTl.to(".fade-up", {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    })
    .to(".fade-in", {
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      onComplete: typeEffect
    }, "-=0.6");
  }

  /* ==========================================
     8. 3D TILT EFFECT ON PROFILE IMAGE
     ========================================== */
  const profileFrame = document.querySelector(".parallax-tilt");
  if (profileFrame && window.matchMedia("(pointer: fine)").matches) {
    profileFrame.addEventListener("mousemove", (e) => {
      const rect = profileFrame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      gsap.to(profileFrame, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    profileFrame.addEventListener("mouseleave", () => {
      gsap.to(profileFrame, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }

  /* ==========================================
     9. MAGNETIC BUTTONS
     ========================================== */
  const magneticBtns = document.querySelectorAll(".magnetic");
  if (window.matchMedia("(pointer: fine)").matches) {
    magneticBtns.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)"
        });
      });
    });
  }

  /* ==========================================
     10. SCROLL ANIMATIONS (GSAP ScrollTrigger)
     ========================================== */
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 50 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  const wordRevealContainers = document.querySelectorAll(".reveal-word");
  wordRevealContainers.forEach((container) => {
    const textHTML = container.innerHTML;
    container.innerHTML = textHTML.replace(/([^\s<]+)/g, "<span>$1</span>");

    gsap.fromTo(container.querySelectorAll("span"),
      { opacity: 0.1, filter: "blur(4px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  });

  gsap.to(".bg-glow", {
    y: 200,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

});
