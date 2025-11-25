(function() {
  // Add styles for interactive elements
  const css = `
    .btn {
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      transition: width 0.6s, height 0.6s;
    }

    .btn:active::before {
      width: 300px;
      height: 300px;
    }

    .fade-in {
      animation: fadeIn 0.8s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function pulse(el) {
    if (!el) return;
    el.classList.remove('active-glow');
    void el.offsetWidth;
    el.classList.add('active-glow');
    setTimeout(() => el.classList.remove('active-glow'), 1200);
  }

  document.addEventListener('DOMContentLoaded', function() {
    const btnBasics = document.getElementById('btnBasics');
    const btnFeatures = document.getElementById('btnFeatures');
    const basicsBox = document.querySelector('.boxp-container');
    const featuresBox = document.querySelector('.box');

    if (btnBasics) {
      btnBasics.addEventListener('click', function() {
        btnFeatures.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => pulse(featuresBox), 600);
      });
    }

    if (btnFeatures) {
      btnFeatures.addEventListener('click', function() {
        btnBasics.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => pulse(basicsBox), 600);
      });
    }

    // Add fade-in animation on page load
    if (basicsBox) {
      basicsBox.classList.add('fade-in');
    }
    if (featuresBox) {
      setTimeout(() => featuresBox.classList.add('fade-in'), 200);
    }
  });
})();
