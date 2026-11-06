document.addEventListener("DOMContentLoaded", () => {
  // 1. Current Year
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // 2. Theme Toggle Logic
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  const updateThemeIcon = () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    themeToggle.textContent = isDark ? "☀" : "☾"; 
  };

  if (themeToggle) {
    updateThemeIcon();
    themeToggle.addEventListener("click", () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      const newTheme = isDark ? "light" : "dark";
      root.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon();
    });
  }

  // 3. Mobile Menu
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // 4. Project Filtering
  const filterButtons = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      const filterValue = button.getAttribute("data-filter");
      projects.forEach(project => {
        project.hidden = (filterValue !== "all" && project.getAttribute("data-cat") !== filterValue);
      });
    });
  });

  // 5. Form Validation
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); 
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      
      let isValid = true;
      document.getElementById("nameErr").textContent = "";
      document.getElementById("emailErr").textContent = "";
      document.getElementById("messageErr").textContent = "";

      if (name.value.trim() === "") {
        document.getElementById("nameErr").textContent = "Please enter your name.";
        isValid = false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        document.getElementById("emailErr").textContent = "Please enter a valid email.";
        isValid = false;
      }
      if (message.value.trim() === "") {
        document.getElementById("messageErr").textContent = "Please enter a message.";
        isValid = false;
      }

      if (isValid) {
        formStatus.textContent = "Message sent successfully!";
        form.reset();
        setTimeout(() => formStatus.textContent = "", 5000);
      }
    });
  }

  // 6. Back to Top Button
  const toTopBtn = document.getElementById("toTop");
  if (toTopBtn) {
    window.addEventListener("scroll", () => {
      toTopBtn.hidden = window.scrollY <= 300;
    });
    toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // 7. Background Music Logic
  const musicToggle = document.getElementById("musicToggle");
  const bgMusic = document.getElementById("bg-music");
  
  if (musicToggle && bgMusic) {
    bgMusic.volume = 0.4; 
    
    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.classList.add("playing");
        musicToggle.innerHTML = "⏸"; 
      } else {
        bgMusic.pause();
        musicToggle.classList.remove("playing");
        musicToggle.innerHTML = "🎵"; 
      }
    });
  }

  // ==========================================
  // 8. NEW: Interactive Particle Network Canvas
  // ==========================================
  const canvas = document.getElementById('network-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Track mouse for interaction
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Click to spawn new particles
    window.addEventListener('click', (e) => {
      for (let i = 0; i < 4; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
      // Keep particle count manageable
      if (particles.length > 150) {
        particles.splice(0, 4);
      }
    });

    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Repel from mouse
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= forceDirectionX * force * 4;
            this.y -= forceDirectionY * force * 4;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(234, 179, 8, 0.8)'; // Yellowish dots
        ctx.fill();
      }
    }

    // Start with 60 particles
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/130})`; // Faint white lines
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
    }

    animate();
  }
});