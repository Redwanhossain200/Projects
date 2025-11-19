(function() {
  const slides = [];
  let currentIndex = 0;

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
    initSlides();
    
    // Delegated click handling for buttons with data-action
    document.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
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
