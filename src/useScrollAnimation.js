
import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Add visible class to trigger animation
          target.classList.add('visible');
          
          // Handle section titles with delay
          const sectionTitle = target.querySelector('h2');
          if (sectionTitle) {
            setTimeout(() => {
              sectionTitle.classList.add('visible');
            }, 200);
          }
          
          // Handle staggered animations for child elements
          const staggerElements = target.querySelectorAll(
            '.form-group, .event-info-card, .benefit-card, .timeline-item, p, ul, li, .footer-section'
          );
          
          if (staggerElements.length > 0) {
            staggerElements.forEach((child, index) => {
              const delay = index * 0.1;
              child.style.setProperty('--stagger-delay', `${delay}s`);
              setTimeout(() => {
                child.classList.add('visible');
              }, delay * 1000 + 300);
            });
          }
          
          // Handle buttons and links with delay
          const buttons = target.querySelectorAll('.App-link, button[type="submit"]');
          buttons.forEach((button, index) => {
            setTimeout(() => {
              button.classList.add('visible');
            }, (staggerElements.length * 100) + 500 + (index * 100));
          });
          
          // Stop observing once animated
          observer.unobserve(target);
        }
      });
    }, observerOptions);

    // Wait for DOM to be ready
    const initializeAnimations = () => {
      // Observe all sections
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        section.classList.add('fade-in-up');
        observer.observe(section);
      });

      // Observe header elements
      const headerElements = document.querySelectorAll('.App-header h1, .App-header p');
      headerElements.forEach((element) => {
        element.classList.add('fade-in-up');
        observer.observe(element);
      });

      // Observe typewriter container
      const typewriter = document.querySelector('.typewriter');
      if (typewriter) {
        typewriter.classList.add('fade-in-scale');
        observer.observe(typewriter);
      }

      // Observe registration stats
      const stats = document.querySelector('.RegistrationStats');
      if (stats) {
        stats.classList.add('fade-in-scale');
        observer.observe(stats);
      }

      // Observe footer
      const footer = document.querySelector('.contact-footer');
      if (footer) {
        footer.classList.add('fade-in-up');
        observer.observe(footer);
        
        // Observe footer sections for staggered animation
        const footerSections = footer.querySelectorAll('.footer-section');
        footerSections.forEach((section, index) => {
          section.style.setProperty('--stagger-delay', `${index * 0.2}s`);
          section.classList.add('fade-in-up');
          observer.observe(section);
        });
      }

      // Observe individual form elements
      const formGroups = document.querySelectorAll('.form-group');
      formGroups.forEach((group) => {
        group.classList.add('stagger-animation');
      });

      // Observe all paragraphs and lists
      const textElements = document.querySelectorAll('section p:not(.visible), section ul:not(.visible), section li:not(.visible)');
      textElements.forEach((element) => {
        element.classList.add('stagger-animation');
      });

      // Observe cards and special elements
      const cardElements = document.querySelectorAll(
        '.event-info-card, .benefit-card, .timeline-item, .register-form'
      );
      cardElements.forEach((element) => {
        element.classList.add('fade-in-scale');
        observer.observe(element);
      });

      // Observe buttons and links
      const interactiveElements = document.querySelectorAll('.App-link, button[type="submit"]');
      interactiveElements.forEach((element) => {
        element.classList.add('fade-in-up');
      });
    };

    // Initialize animations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeAnimations, 300);
      });
    } else {
      setTimeout(initializeAnimations, 300);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
};
