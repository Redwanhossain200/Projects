(function() {
  const slides = [];
  let currentIndex = 0;

  // ===== THEME TOGGLE (Light / Dark) =====
  function updateThemeToggleIcon() {
    const toggle = document.getElementById('darkModeToggle');
    if (!toggle) return;
    const icon = toggle.querySelector('.toggle-icon');
    if (!icon) return;
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || document.body.classList.contains('dark-mode')) {
      icon.textContent = '🌙';
    } else if (saved === 'light' || document.body.classList.contains('light-mode')) {
      icon.textContent = '☀️';
    } else {
      // system
      icon.textContent = '🖥️';
    }
  }

  function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme') || 'system';

    function applySystemTheme() {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    }

    function setTheme(theme) {
      if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      } else if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      } else {
        // system
        applySystemTheme();
        localStorage.setItem('theme', 'system');
      }
      updateThemeToggleIcon();
    }

    // initialize
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else {
      // default to system
      setTheme('system');
    }

    // If system chosen, listen for changes
    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener && mq.addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') applySystemTheme();
      });
    }

    if (toggle) {
      toggle.addEventListener('click', () => {
        // cycle: system -> light -> dark -> system
        const cur = localStorage.getItem('theme') || 'system';
        const next = cur === 'system' ? 'light' : (cur === 'light' ? 'dark' : 'system');
        setTheme(next);
        playSound();
      });
    }
  }

  // ===== FOOTER INTERSECTION OBSERVER (hide nav dots when footer visible) =====
  function initFooterObserver() {
    const footer = document.querySelector('.footer');
    const dots = document.querySelector('.nav-dots');
    if (!footer || !dots) return;

    // When footer appears, move the dots up so they don't overlap.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // distance from footer top to viewport bottom
          const footerTop = entry.boundingClientRect.top;
          const overlap = Math.max(0, window.innerHeight - footerTop);
          const extra = 20; // spacing above footer
          dots.style.transition = 'bottom 300ms ease, transform 300ms ease, opacity 200ms ease';
          dots.style.bottom = (overlap + extra) + 'px';
        } else {
          // reset to stylesheet default
          dots.style.bottom = '';
        }
      });
    }, { root: null, threshold: 0.01 });

    observer.observe(footer);
  }

  // ===== BACK TO TOP BUTTON =====
  function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSound();
    });
  }

  // ===== SCROLL INDICATOR =====
  function initScrollIndicator() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      const progressBar = document.getElementById('progressBar');
      if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
      }
    });
  }

  // ===== CERTIFICATE GENERATOR =====
  function initCertificate() {
    const modal = document.getElementById('certificateModal');
    const generateBtn = document.getElementById('generateCert');
    const downloadBtn = document.getElementById('downloadCert');
    const closeBtn = document.querySelector('.close');

    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
      const name = document.getElementById('certificateName').value.trim();
      if (!name) {
        showToast('Please enter your name!');
        return;
      }

      generateCertificate(name);
      if (modal) modal.style.display = 'block';
      playSound();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        const canvas = document.getElementById('certificateCanvas');
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'certificate.png';
        link.click();
        playSound();
        showToast('Certificate downloaded! 🎉');
      });
    }

    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        if (modal) modal.style.display = 'none';
      }
    });
  }

  function generateCertificate(name) {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1200;
    canvas.height = 800;

    // Minimal / light certificate style
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle outer border
    ctx.strokeStyle = '#e6e9ef';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Thin inner rule
    ctx.strokeStyle = '#f3f5f9';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Accent bar (small subtle color) for a light brand touch
    ctx.fillStyle = '#2c7be5';
    ctx.fillRect(80, 100, 140, 6);

    // Title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 48px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 170);

    // Small subtitle / lead-in
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px Helvetica, Arial, sans-serif';
    ctx.fillText('This certificate is presented to', canvas.width / 2, 230);

    // Recipient name
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 42px Helvetica, Arial, sans-serif';
    ctx.fillText(name, canvas.width / 2, 300);

    // Description / course text (wrap manually if needed)
    ctx.fillStyle = '#374151';
    ctx.font = '18px Helvetica, Arial, sans-serif';
    ctx.fillText('For successfully completing the Interactive Web Development course', canvas.width / 2, 360);

    // Date (centered)
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Helvetica, Arial, sans-serif';
    ctx.fillText(date, canvas.width / 2, 420);

    // Signature line (right side)
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 420, 620);
    ctx.lineTo(canvas.width - 220, 620);
    ctx.stroke();

    ctx.fillStyle = '#374151';
    ctx.font = '16px Helvetica, Arial, sans-serif';
    ctx.fillText('Instructor', canvas.width - 320, 650);
  }
  function playSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
  function initParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;

    const particleCount = 50;
    const colors = ['rgba(0, 80, 200, 0.5)', 'rgba(255, 90, 0, 0.5)', 'rgba(0, 150, 255, 0.4)'];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;
      const tx = (Math.random() - 0.5) * 100;
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = x + '%';
      particle.style.bottom = '-10px';
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
      particle.style.setProperty('--tx', tx + 'px');
      particle.style.animation = `float ${duration}s linear ${delay}s infinite`;

      container.appendChild(particle);
    }
  }

  // Initialize slides
  function initSlides() {
    document.querySelectorAll('[data-index]').forEach(slide => {
      slides.push(slide);
    });
  }

  // Update progress bar
  function updateProgressBar() {
    const progress = ((currentIndex + 1) / slides.length) * 100;
    const bar = document.getElementById('progressBar');
    if (bar) bar.style.width = progress + '%';
  }

  // Update progress counter
  function updateProgressCounter() {
    const counter = document.getElementById('progressCounter');
    if (counter) counter.textContent = `${currentIndex + 1} / ${slides.length}`;
  }

  // Update navigation dots
  function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  // Show toast notification
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  }

  // Pulse animation
  function pulse(el) {
    if (!el) return;
    el.classList.remove('active-glow');
    void el.offsetWidth;
    el.classList.add('active-glow');
    setTimeout(() => el.classList.remove('active-glow'), 1600);
  }

  // Navigate to slide
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    currentIndex = index;
    const targetSlide = slides[index];
    
    targetSlide.scrollIntoView({ behavior: 'smooth', block: 'center' });
    pulse(targetSlide.querySelector('.slide-content'));
    // restart title animation (typewriter CSS animation)
    const title = targetSlide.querySelector('.slide-title');
    if (title) {
      title.style.animation = 'none';
      void title.offsetWidth;
      title.style.animation = '';
    }
    
    updateProgressBar();
    updateProgressCounter();
    updateDots();
    // Show a short toast using the slide title (fallback to index)
    const slideTitle = targetSlide.querySelector('.slide-title');
    const toastText = slideTitle ? slideTitle.textContent : `Slide ${index + 1}`;
    showToast(toastText);
  }

  // Next slide
  function nextSlide() {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  }

  // Previous slide
  function prevSlide() {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Swipe navigation for touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  });

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initBackToTop();
    initScrollIndicator();
    initCertificate();
    initParticles();
    initSlides();
    initFooterObserver();
    
    // Delegated click handling for buttons with data-action
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      playSound();
      if (action === 'next') return nextSlide();
      if (action === 'prev') return prevSlide();
      if (action === 'first') return goToSlide(0);
    });

    // Generate navigation dots dynamically to match number of slides
    const dotsContainer = document.querySelector('.nav-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((s, idx) => {
        const btn = document.createElement('button');
        btn.className = 'dot';
        btn.setAttribute('aria-label', `Slide ${idx + 1}`);
        btn.title = `Slide ${idx + 1}`;
        btn.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(btn);
      });
    }

    // Also support swipe on each slide for more reliable touch behavior
    slides.forEach((s) => {
      let sx = 0;
      s.addEventListener('touchstart', (e) => { sx = e.changedTouches[0].screenX; });
      s.addEventListener('touchend', (e) => {
        const ex = e.changedTouches[0].screenX;
        if (sx - ex > 50) nextSlide();
        if (ex - sx > 50) prevSlide();
      });
    });

    // Initial update
    updateProgressBar();
    updateProgressCounter();
    updateDots();

    // Ensure the first slide is highlighted and its title animates
    goToSlide(0);

    // Typewriter: let CSS handle it; ensure titles animate on first slide
    const firstTitle = slides[0] && slides[0].querySelector('.slide-title');
    if (firstTitle) {
      firstTitle.style.animation = 'none';
      void firstTitle.offsetWidth;
      firstTitle.style.animation = '';
    }

    // Welcome message
    showToast('✨ Welcome! Use arrow keys or swipe to navigate');
  });
})();
