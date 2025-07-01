export default function TopBar({ onLinkClick }) {
  const [open, setOpen] = React.useState(false);
  const links = [
    { id: 'event', label: 'Event' },
    { id: 'why', label: 'Why' },
    { id: 'register', label: 'Register' },
  ];

  return (
    <header className="TopBar">
      <div className="TopBar-logo">YouniHack</div>
      <button
        className="TopBar-hamburger"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={`TopBar-nav ${open ? 'active' : ''}`}>
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              onLinkClick(l.id);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
