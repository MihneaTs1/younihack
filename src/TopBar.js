// src/TopBar.js
import React, { useState, useEffect } from 'react';

export default function TopBar({ onLinkClick }) {
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const links = [
    { id: 'event', label: 'Event Details' },
    { id: 'why', label: 'Why Participate?' },
    { id: 'register', label: 'Register' },
  ];

  // Scroll detection to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map(link => document.getElementById(link.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => {
    setNavOpen(open => !open);
  };

  const handleLinkClick = (id) => {
    onLinkClick(id);
    setNavOpen(false);
  };

  return (
    <header className="TopBar">
      <a href="/" className="TopBar-logo">YouniHack</a>

      <button
        className="TopBar-hamburger"
        aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
        onClick={toggleNav}
      >
        <svg viewBox="0 0 100 80" width="24" height="24">
          <rect width="100" height="15"></rect>
          <rect y="30" width="100" height="15"></rect>
          <rect y="60" width="100" height="15"></rect>
        </svg>
      </button>

      <nav className={`TopBar-nav${navOpen ? ' active' : ''}`}>
        {links.map(link => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={activeSection === link.id ? 'active' : ''}
            onClick={e => {
              e.preventDefault();
              handleLinkClick(link.id);
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
