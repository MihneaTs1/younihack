import { useEffect, useRef } from 'react';

export const useTypewriter = (text, speed = 50, startDelay = 0) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current || !text) return;

    const element = elementRef.current;
    element.innerHTML = '';

    const timeoutId = setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          const char = text[index];
          if (char === '\n') {
            element.innerHTML += '<br>';
          } else {
            element.innerHTML += char;
          }
          index++;
        } else {
          clearInterval(timer);
          element.classList.add('typing-complete');
        }
      }, speed);

      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, startDelay]);

  return elementRef;
};

export const useTerminalLoader = (selectors = [], delayMs = 100) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('terminal-loaded');
          }, delayMs);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px'
    });

    const observeElements = () => {
      selectors.forEach(selector => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            if (el) observer.observe(el);
          });
        } catch (error) {
          console.warn(`Could not observe selector: ${selector}`, error);
        }
      });
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', observeElements);
    } else {
      observeElements();
    }

    return () => {
      observer.disconnect();
      document.removeEventListener('DOMContentLoaded', observeElements);
    };
  }, [selectors, delayMs]);
};