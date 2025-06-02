import logo from './logo.svg';
import './App.css';

function scrollToSection(e, id) {
  e.preventDefault();
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function App() {
  return (
    <div className="App">
      <div className="TopBar">
        <a href="/" className="TopBar-logo" style={{textDecoration: 'none'}}>
          CyberHack 2025
        </a>
        <nav className="TopBar-nav">
          <a href="#event" onClick={e => scrollToSection(e, 'event')}>Event</a>
          <a href="#why" onClick={e => scrollToSection(e, 'why')}>Why Participate</a>
          <a href="#register" onClick={e => scrollToSection(e, 'register')}>Register</a>
        </nav>
      </div>
      <header className="App-header">
        <h1>Cybersecurity Hackathon 2025</h1>
        <p>
          Join us for an exciting weekend of innovation, learning, and competition in the world of cybersecurity!
        </p>
        <section id="event">
          <h2>Event Details</h2>
          <ul>
            <li><strong>Date:</strong> September 6-7, 2025</li>
            <li><strong>Location:</strong> Universitatea Politehnica Bucuresti, Bucuresti, Romania</li>
            <li><strong>Open to:</strong> Students & Professionals</li>
            <li><strong>Prizes:</strong> 0$</li>
          </ul>
        </section>
        <section id="why">
          <h2>Why Participate?</h2>
          <ul>
            <li>Test your cybersecurity skills in real-world challenges</li>
            <li>Network with industry experts and peers</li>
            <li>Win amazing prizes and recognition</li>
            <li>Workshops, talks, and hands-on activities</li>
          </ul>
        </section>
        <section id="register">
          <h2>Register</h2>
          <form className="register-form" onSubmit={e => { e.preventDefault(); alert('Registration submitted!'); }}>
            <div className="form-group">
              <label htmlFor="name">First Name</label>
              <input type="text" id="name" name="name" required placeholder="Enter your first name" />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Last Name</label>
              <input type="text" id="surname" name="surname" required placeholder="Enter your last name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" id="phone" name="phone" required placeholder="Enter your phone number" />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" name="country" required placeholder="Enter your country" />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" required placeholder="Enter your city" />
            </div>
            <button className="App-link App-link-green" type="submit" style={{marginTop: '1.5rem', width: '100%'}}>Submit Registration</button>
          </form>
        </section>
      </header>
    </div>
  );
}

export default App;
