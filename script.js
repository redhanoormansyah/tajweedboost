    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = +counter.getAttribute('data-target');
          const duration = 2000; // 2 seconds
          const start = 0;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            
            const currentCount = Math.floor(easeProgress * (target - start) + start);
            counter.innerText = currentCount;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              counter.innerText = target;
            }
          };

          requestAnimationFrame(animate);
          statsObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.counter').forEach(counter => statsObserver.observe(counter));

    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    const overlay = document.querySelector('.mobile-overlay');

    if (menuToggle && navUl && overlay) {
      const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navUl.classList.toggle('active');
        overlay.classList.toggle('active');
      };

      menuToggle.addEventListener('click', toggleMenu);
      overlay.addEventListener('click', toggleMenu);
      navUl.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          navUl.classList.remove('active');
          overlay.classList.remove('active');
        });
      });
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const btn = item.querySelector('.faq-question');
      btn.addEventListener('click', () => {
        const isCurrentlyActive = item.classList.contains('active');

        // Close all items
        faqItems.forEach(faq => faq.classList.remove('active'));

        // Open the clicked item if it was not already open
        if (!isCurrentlyActive) {
          item.classList.add('active');
        }
      });
    });

    // Testimonial Carousel - Dynamic grouping + Fish-eye dots
    (function () {
      const track = document.querySelector('.testi-carousel-track');
      const dotsContainer = document.querySelector('.testi-dots');
      if (!track || !dotsContainer) return;

      // Collect ALL testi-card elements from any structure
      const allCards = Array.from(track.querySelectorAll('.testi-card'));
      if (!allCards.length) return;

      // Group into pages of 3 cards each
      const CARDS_PER_PAGE = 3;
      const pages = [];
      for (let i = 0; i < allCards.length; i += CARDS_PER_PAGE) {
        pages.push(allCards.slice(i, i + CARDS_PER_PAGE));
      }
      const total = pages.length;

      // Rebuild track with clean slide structure
      track.innerHTML = '';
      pages.forEach((pageCards, idx) => {
        const slide = document.createElement('div');
        slide.classList.add('testi-slide');
        pageCards.forEach(card => slide.appendChild(card));
        track.appendChild(slide);
      });

      const slides = track.querySelectorAll('.testi-slide');
      let current = 0;

      // Fish-eye dots: always show exactly 3 dots (left-small, center-big, right-small)
      function renderDots() {
        dotsContainer.innerHTML = '';

        // Left dot (previous)
        if (current > 0) {
          const leftDot = document.createElement('button');
          leftDot.classList.add('testi-dot', 'dot-side');
          leftDot.setAttribute('aria-label', 'Previous');
          leftDot.addEventListener('click', () => goTo(current - 1));
          dotsContainer.appendChild(leftDot);
        }

        // Center dot (current - active/big)
        const centerDot = document.createElement('button');
        centerDot.classList.add('testi-dot', 'dot-center');
        centerDot.setAttribute('aria-label', 'Slide ' + (current + 1));
        dotsContainer.appendChild(centerDot);

        // Right dot (next)
        if (current < total - 1) {
          const rightDot = document.createElement('button');
          rightDot.classList.add('testi-dot', 'dot-side');
          rightDot.setAttribute('aria-label', 'Next');
          rightDot.addEventListener('click', () => goTo(current + 1));
          dotsContainer.appendChild(rightDot);
        }
      }

      function goTo(index) {
        current = index;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        renderDots();
      }

      // Initialize
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      goTo(0);

      // Auto-play every 4 seconds
      let autoPlay = setInterval(() => {
        goTo((current + 1) % total);
      }, 4000);

      // Pause on hover
      const carousel = document.querySelector('.testi-carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carousel.addEventListener('mouseleave', () => {
          autoPlay = setInterval(() => {
            goTo((current + 1) % total);
          }, 4000);
        });
      }

      // Swipe support for mobile
      let startX = 0;
      if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
        }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
          const endX = e.changedTouches[0].clientX;
          const diff = startX - endX;
          if (Math.abs(diff) > 50) {
            if (diff > 0 && current < total - 1) goTo(current + 1);
            else if (diff < 0 && current > 0) goTo(current - 1);
          }
        }, { passive: true });
      }
    })();
