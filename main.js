/**
 * M.Sc AI & Data Science Landing Page
 * Interactions: carousels, FAQ accordion, form handling
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Benefits Carousel
     -------------------------------------------------------------------------- */
  function initCarousel(trackId, prevSelector, nextSelector, dotsContainerId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.querySelector(prevSelector);
    const nextBtn = document.querySelector(nextSelector);
    const dotsContainer = dotsContainerId ? document.getElementById(dotsContainerId) : null;

    if (!track) return;

    const slides = track.children;
    const slideCount = slides.length;
    let currentIndex = 0;

    function getSlideWidth() {
      if (!slides[0]) return 0;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return slides[0].offsetWidth + gap;
    }

    function scrollToIndex(index) {
      currentIndex = Math.max(0, Math.min(index, slideCount - 1));
      track.scrollTo({ left: currentIndex * getSlideWidth(), behavior: 'smooth' });
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
        dot.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
      });
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => scrollToIndex(i));
        dotsContainer.appendChild(dot);
      }
      updateDots();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollToIndex(currentIndex + 1));
    }

    track.addEventListener('scroll', () => {
      const slideWidth = getSlideWidth();
      if (slideWidth === 0) return;
      currentIndex = Math.round(track.scrollLeft / slideWidth);
      updateDots();
    }, { passive: true });

    buildDots();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => scrollToIndex(currentIndex), 150);
    });
  }

  initCarousel('benefitsTrack', '.benefits__nav--prev', '.benefits__nav--next', 'benefitsDots');
  initCarousel('facultyTrack', '.faculty__nav--prev', '.faculty__nav--next', null);

  /* --------------------------------------------------------------------------
     FAQ Accordion
     -------------------------------------------------------------------------- */
  const faqGrid = document.getElementById('faqGrid');

  if (faqGrid) {
    const faqItems = faqGrid.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-item__question');
      const icon = item.querySelector('.faq-item__icon');

      if (!question) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('faq-item--open');

        faqItems.forEach((other) => {
          other.classList.remove('faq-item--open');
          const otherBtn = other.querySelector('.faq-item__question');
          const otherIcon = other.querySelector('.faq-item__icon');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherIcon) {
            otherIcon.textContent = '↓';
            otherIcon.classList.remove('faq-item__icon--close');
          }
        });

        if (!isOpen) {
          item.classList.add('faq-item--open');
          question.setAttribute('aria-expanded', 'true');
          if (icon) {
            icon.textContent = '×';
            icon.classList.add('faq-item__icon--close');
          }
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Hero Enquire Form
     -------------------------------------------------------------------------- */
  const heroEnquireForm = document.getElementById('heroEnquireForm');

  if (heroEnquireForm) {
    heroEnquireForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('heroName');
      const email = document.getElementById('heroEmail');
      const phone = document.getElementById('heroPhone');
      const consent = document.getElementById('heroConsent');

      if (!name?.value.trim()) {
        alert('Please enter your name.');
        name?.focus();
        return;
      }

      if (!email?.value.trim() || !email.validity.valid) {
        alert('Please enter a valid email address.');
        email?.focus();
        return;
      }

      if (!phone?.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
        alert('Please enter a valid mobile number.');
        phone?.focus();
        return;
      }

      if (!consent?.checked) {
        alert('Please accept the consent terms to proceed.');
        consent?.focus();
        return;
      }

      const submitBtn = heroEnquireForm.querySelector('.hero-enquire-form__submit');
      if (submitBtn) {
        submitBtn.textContent = 'SUBMITTED!';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        heroEnquireForm.reset();
        if (submitBtn) {
          submitBtn.textContent = 'SUBMIT';
          submitBtn.disabled = false;
        }
      }, 3000);
    });
  }

  /* --------------------------------------------------------------------------
     Enquire Form (footer section)
     -------------------------------------------------------------------------- */
  const enquireForm = document.getElementById('enquireForm');

  if (enquireForm) {
    enquireForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const consent = document.getElementById('consent');

      if (!name?.value.trim()) {
        alert('Please enter your name.');
        name?.focus();
        return;
      }

      if (!email?.value.trim() || !email.validity.valid) {
        alert('Please enter a valid email address.');
        email?.focus();
        return;
      }

      if (!phone?.value.trim() || phone.value.replace(/\D/g, '').length < 10) {
        alert('Please enter a valid mobile number.');
        phone?.focus();
        return;
      }

      if (!consent?.checked) {
        alert('Please accept the consent terms to proceed.');
        consent?.focus();
        return;
      }

      const submitBtn = enquireForm.querySelector('.btn--submit');
      if (submitBtn) {
        submitBtn.textContent = 'SUBMITTED!';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        enquireForm.reset();
        if (submitBtn) {
          submitBtn.textContent = 'SUBMIT';
          submitBtn.disabled = false;
        }
      }, 3000);
    });
  }

  /* --------------------------------------------------------------------------
     Brochure Download
     -------------------------------------------------------------------------- */
  const downloadBtn = document.getElementById('downloadBrochure');

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Brochure download will be available soon. Please use the enquiry form below to request a copy.');
    });
  }

  /* --------------------------------------------------------------------------
     Smooth scroll for anchor links
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
