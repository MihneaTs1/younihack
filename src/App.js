import React from 'react';
import logo from './logo.svg';
import './App.css';
import RegistrationStats from './RegistrationStats';
import FormField from './FormField';
import LoadingSpinner from './LoadingSpinner';
import TopBar from './TopBar';
import Section from './Section';

function scrollToSection(e, id) {
  e.preventDefault();
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function App() {
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
  const [submitted, setSubmitted] = React.useState(false);
  const [countryPrefixes, setCountryPrefixes] = React.useState([]);
  const [prefixLoading, setPrefixLoading] = React.useState(true);

  const backendAddress = process.env.REACT_APP_BACKEND_ADDRESS || `http://${window.location.hostname}:5000`;

  React.useEffect(() => {
    async function fetchCountries() {
      setPrefixLoading(true);
      try {
        const res = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        const data = await res.json();
        // Filter and map to { name, code } objects
        const countries = data
          .filter(c => c.idd && c.idd.root)
          .map(c => ({
            name: c.name.common,
            code: c.idd.root + (c.idd.suffixes && c.idd.suffixes.length ? c.idd.suffixes[0] : '')
          }))
          .filter(c => /^\+[0-9]{1,4}$/.test(c.code))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryPrefixes(countries);
      } catch (e) {
        setCountryPrefixes([]);
      }
      setPrefixLoading(false);
    }
    fetchCountries();
  }, []);

  // --- Validation ---
  const validateForm = () => {
    if (!form.name.trim() || !form.surname.trim() || !form.email.trim() || !form.prefix.trim() || !form.phone.trim() || !form.country.trim() || !form.city.trim()) {
      setError('All fields are required.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!/^\+[0-9]{1,4}$/.test(form.prefix)) {
      setError('Phone prefix must be in the format +XX or +XXX or +XXXX.');
      return false;
    }
    if (!/^\([0-9]{3}\) [0-9]{3}-[0-9]{3,4}$/.test(form.phone)) {
      setError('Phone number must be in the format (123) 456-7890 or (123) 456-789.');
      return false;
    }
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await fetch(backendAddress + '/register', {
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
      <TopBar />
      <header className="App-header">
        <h1>YouniHack 2025</h1>
        <p>
          Join us for an exciting weekend of innovation, learning, and competition in the world of cybersecurity!
        </p>
        <Section id="event" title="Event Details">
          <ul>
            <li><strong>Date:</strong> September 6-7, 2025</li>
            <li><strong>Location:</strong> Universitatea Politehnica Bucuresti, Bucuresti, Romania</li>
            <li><strong>Open to:</strong> Students & Professionals</li>
            <li><strong>Prizes:</strong> 0$</li>
          </ul>
        </Section>
        <Section id="why" title="Why Participate?">
          <ul>
            <li>Test your cybersecurity skills in real-world challenges</li>
            <li>Network with industry experts and peers</li>
            <li>Win amazing prizes and recognition</li>
            <li>Workshops, talks, and hands-on activities</li>
          </ul>
        </Section>
        <Section id="register" title="Register">
          <RegistrationStats backendUrl={backendAddress} />
          <form className="register-form" onSubmit={handleSubmit}>
            <FormField label="First Name" id="name" required value={form.name} onChange={handleChange} placeholder="Enter your first name" />
            <FormField label="Last Name" id="surname" required value={form.surname} onChange={handleChange} placeholder="Enter your last name" />
            <FormField label="Email" id="email" type="email" required value={form.email} onChange={handleChange} placeholder="Enter your email" />
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label htmlFor="phone" style={{ marginBottom: '0.3rem', whiteSpace: 'nowrap' }}>Phone Number</label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                <select
                  id="prefix"
                  name="prefix"
                  required
                  style={{
                    width: '7.5rem',
                    padding: '0.5rem 0.7rem',
                    borderRadius: '8px',
                    border: '2px solid #009900',
                    background: '#181922',
                    color: form.prefix ? '#fff' : '#b2bec3',
                    fontSize: '1rem',
                    fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif',
                    fontWeight: 500,
                    outline: 'none',
                    boxShadow: '0 2px 8px #00990022',
                    transition: 'border 0.2s, box-shadow 0.2s',
                    appearance: 'none',
                    cursor: prefixLoading ? 'not-allowed' : 'pointer',
                    display: form.prefix ? 'none' : 'block',
                  }}
                  value={form.prefix}
                  onChange={e => setForm(f => ({ ...f, prefix: e.target.value }))}
                  disabled={prefixLoading}
                  aria-label="Country Prefix"
                  autoComplete="tel-country-code"
                >
                  <option value="" style={{ fontWeight: 400, fontSize: '0.93rem', color: '#b2bec3' }}>{prefixLoading ? 'Loading...' : 'Select country code'}</option>
                  {countryPrefixes.map(c => (
                    <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                  ))}
                </select>
                {form.prefix && (
                  <div
                    style={{
                      width: '7.5rem',
                      minWidth: '7.5rem',
                      maxWidth: '7.5rem',
                      boxSizing: 'border-box',
                      padding: '0.5rem 0.7rem',
                      borderRadius: '8px',
                      border: '2px solid #009900',
                      background: '#181922',
                      color: '#fff',
                      fontSize: '1rem',
                      fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      minHeight: '2.5rem',
                      letterSpacing: '1px',
                      userSelect: 'text',
                      boxShadow: '0 2px 8px #00990022',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => setForm(f => ({ ...f, prefix: '' }))}
                    title="Click to change country code"
                  >
                    {form.prefix}
                    <span style={{marginLeft: '0.5rem', color: '#b2bec3', fontSize: '1.1em', cursor: 'pointer'}} title="Change country code">✎</span>
                  </div>
                )}
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
            <FormField label="Country" id="country" required value={form.country} onChange={handleChange} placeholder="Enter your country" />
            <FormField label="City" id="city" required value={form.city} onChange={handleChange} placeholder="Enter your city" />
            <button className="App-link App-link-green" type="submit" style={{marginTop: '1.5rem', width: '100%'}} disabled={loading}>{loading ? <LoadingSpinner text="Submitting..." /> : 'Submit Registration'}</button>
            {error && <div style={{marginTop: '0.5rem', color: '#e17055', fontWeight: 'bold', textAlign: 'center', fontSize: '1.1rem'}}>{error}</div>}
            {submitted && (
              <div style={{marginTop: '0.5rem', color: '#00b894', fontWeight: 'bold', textAlign: 'center', fontSize: '1.35rem'}}>
                Thank you for registering! Please check your inbox (and spam folder) for a confirmation email.
              </div>
            )}
          </form>
        </Section>
      </header>
    </div>
  );
}

export default App;
