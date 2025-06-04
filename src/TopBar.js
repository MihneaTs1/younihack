import React from 'react';

export default function TopBar() {
  return (
    <div className="TopBar">
      <a href="/" className="TopBar-logo" style={{textDecoration: 'none'}}>
        YouniHack
      </a>
      <nav className="TopBar-nav">
        <a href="#event" onClick={e => { e.preventDefault(); document.getElementById('event')?.scrollIntoView({ behavior: 'smooth' }); }}>Event</a>
        <a href="#why" onClick={e => { e.preventDefault(); document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' }); }}>Why Participate</a>
        <a href="#register" onClick={e => { e.preventDefault(); document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' }); }}>Register</a>
      </nav>
    </div>
  );
}
