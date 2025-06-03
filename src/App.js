import React from 'react';
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
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    surname: '',
    email: '',
    prefix: '',
    phone: '',
    country: '',
    city: ''
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch((process.env.REACT_APP_BACKEND_ADDRESS || 'http://localhost:5000') + '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError('This email is already registered. Please check your inbox or spam for the confirmation email.');
      } else if ((res.ok && data && data.success) || (data && data.success)) {
        setSubmitted(true);
        setForm({ name: '', surname: '', email: '', prefix: '', phone: '', country: '', city: '' });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

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
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">First Name</label>
              <input type="text" id="name" name="name" required placeholder="Enter your first name" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="surname">Last Name</label>
              <input type="text" id="surname" name="surname" required placeholder="Enter your last name" value={form.surname} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required placeholder="Enter your email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label htmlFor="phone" style={{ marginBottom: '0.3rem', whiteSpace: 'nowrap' }}>Phone Number</label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <input 
                  type="text" 
                  id="prefix" 
                  name="prefix" 
                  required 
                  placeholder="+40" 
                  maxLength="4" 
                  style={{ width: '5rem' }} 
                  pattern="\+[0-9]{1,3}" 
                  aria-label="Country Prefix"
                  value={form.prefix}
                  onChange={handleChange}
                />
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  placeholder="(123) 456-7890" 
                  maxLength="14"
                  style={{ flex: 1, minWidth: '150px' }}
                  value={form.phone}
                  onChange={handleChange}
                  onInput={e => {
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length > 10) value = value.slice(0, 10);
                    let formatted = value;
                    if (value.length > 6) {
                      formatted = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
                    } else if (value.length > 3) {
                      formatted = `(${value.slice(0,3)}) ${value.slice(3)}`;
                    } else if (value.length > 0) {
                      formatted = `(${value}`;
                    }
                    e.target.value = formatted;
                    setForm(f => ({ ...f, phone: formatted }));
                  }}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <input type="text" id="country" name="country" required placeholder="Enter your country" value={form.country} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" name="city" required placeholder="Enter your city" value={form.city} onChange={handleChange} />
            </div>
            <button className="App-link App-link-green" type="submit" style={{marginTop: '1.5rem', width: '100%'}} disabled={loading}>{loading ? 'Submitting...' : 'Submit Registration'}</button>
            {error && <div style={{marginTop: '0.5rem', color: '#e17055', fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem'}}>{error}</div>}
            {submitted && (
              <div style={{marginTop: '0.5rem', color: '#00b894', fontWeight: 'bold', textAlign: 'center', fontSize: '1.35rem'}}>
                Thank you for registering! Please check your inbox (and spam folder) for a confirmation email.
              </div>
            )}
          </form>
        </section>
      </header>
    </div>
  );
}

export default App;
