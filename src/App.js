import React from "react";
import "./App.css";
import RegistrationStats from "./RegistrationStats";
import FormField from "./FormField";
import LoadingSpinner from "./LoadingSpinner";
import TopBar from "./TopBar";
import Section from "./Section";
import ContactFooter from "./ContactFooter";
import { useScrollAnimation } from "./useScrollAnimation";
import { useTerminalLoader } from "./useTypewriter";

function App() {
  const [form, setForm] = React.useState({
    name: "",
    surname: "",
    email: "",
    prefix: "",
    phone: "",
    country: "",
    city: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [countryPrefixes, setCountryPrefixes] = React.useState([]);
  const [prefixLoading, setPrefixLoading] = React.useState(true);
  const typewriterRef = React.useRef(null);

  // Initialize scroll animations and terminal effects
  useScrollAnimation();
  useTerminalLoader(
    [".event-details-grid", ".benefits-grid", ".register-form"],
    200,
  );

  const backendAddress = ''; // Use relative URLs since frontend and backend are on same server

  // Smooth scrolling to sections
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Fetch country codes on mount
  React.useEffect(() => {
    async function fetchCountries() {
      setPrefixLoading(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd",
        );
        const data = await res.json();
        const countries = data
          .filter((c) => c.idd && c.idd.root)
          .map((c) => ({
            name: c.name.common,
            code:
              c.idd.root + (c.idd.suffixes?.length ? c.idd.suffixes[0] : ""),
          }))
          .filter((c) => /^\+[0-9]{1,4}$/.test(c.code))
          .reduce((unique, country) => {
            const exists = unique.find((u) => u.code === country.code);
            if (!exists) {
              unique.push({
                ...country,
                id: `${country.code}-${country.name.replace(/\s+/g, "-").toLowerCase()}`,
              });
            }
            return unique;
          }, [])
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryPrefixes(countries);
      } catch (err) {
        setCountryPrefixes([]);
      }
      setPrefixLoading(false);
    }
    fetchCountries();
  }, []);

  // Form validation
  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.surname.trim() ||
      !form.email.trim() ||
      !form.prefix.trim() ||
      !form.phone.trim() ||
      !form.country.trim() ||
      !form.city.trim()
    ) {
      setError("All fields are required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!/^\+[0-9]{1,4}$/.test(form.prefix)) {
      setError("Phone prefix must be in the format +XX or +XXX or +XXXX.");
      return false;
    }
    if (!/^\([0-9]{3}\) [0-9]{3}-[0-9]{3,4}$/.test(form.phone)) {
      setError(
        "Phone number must be in the format (123) 456-7890 or (123) 456-789.",
      );
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await fetch(backendAddress + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setError(
          "This email is already registered. Please check your inbox or spam for the confirmation email.",
        );
      } else if ((res.ok && data.success) || data.success) {
        setSubmitted(true);
        setForm({
          name: "",
          surname: "",
          email: "",
          prefix: "",
          phone: "",
          country: "",
          city: "",
        });
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (typewriterRef.current) {
      const text = "Join us for an intensive cybersecurity learning experience featuring three specialized conferences, hands-on full-stack development, and a thrilling 24-hour capture-the-flag competition!";
      typewriterRef.current.textContent = "";
      
      let i = 0;
      let typingInterval;
      
      const startDelay = setTimeout(() => {
        typingInterval = setInterval(() => {
          if (i < text.length) {
            typewriterRef.current.textContent += text.charAt(i);
            i++;
          } else {
            clearInterval(typingInterval);
          }
        }, 50);
      }, 3000);

      return () => {
        clearTimeout(startDelay);
        if (typingInterval) {
          clearInterval(typingInterval);
        }
      };
    }
  }, []);


  return (
    <div className="App">
      <div className="matrix-bg"></div>
      <TopBar onLinkClick={scrollToSection} />
      <header className="App-header">
        <h1>YouniHack 2025</h1>
        <div className="typewriter">
          <div 
            ref={typewriterRef}
            className="typewriter-text"
          ></div>
        </div>

        <Section id="event" title="Event Details">
          <div className="event-details-grid">
            <div className="event-info-card">
              <div className="event-icon">📅</div>
              <h4>Date</h4>
              <p>
                <a
                  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=YouniHack+2025&dates=20250906T090000Z/20250907T180000Z&details=Join+us+for+an+intensive+cybersecurity+learning+experience+featuring+three+specialized+conferences,+hands-on+full-stack+development,+and+a+thrilling+24-hour+capture-the-flag+competition!&location=Universitatea+Politehnica+Bucuresti,+Bucuresti,+Romania"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="calendar-link"
                  aria-label="Add YouniHack 2025 to Google Calendar"
                >
                  September TBD-TBD, 2025
                </a>
              </p>
            </div>
            <div className="event-info-card">
              <div className="event-icon">📍</div>
              <h4>Location</h4>
              <p>
                Universitatea Politehnica Bucuresti
                <br />
                Bucuresti, Romania
              </p>
            </div>
            <div className="event-info-card">
              <div className="event-icon">👥</div>
              <h4>Open to</h4>
              <p>Highscholers, Students & Professionals</p>
            </div>
            <div className="event-info-card">
              <div className="event-icon">⚡</div>
              <h4>Format</h4>
              <p>3 Conferences + 24h CTF Competition</p>
            </div>
          </div>

          <div className="schedule-section">
            <h3>🗓️ Schedule Overview</h3>
            <div className="schedule-timeline">
              <div className="timeline-item">
                <div className="timeline-marker frontend"></div>
                <div className="timeline-content">
                  <h4>Frontend Development Conference</h4>
                  <span className="timeline-day">Day 1</span>
                  <p>
                    Learn cutting-edge frontend technologies and best practices
                  </p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker backend"></div>
                <div className="timeline-content">
                  <h4>Backend Development Conference</h4>
                  <span className="timeline-day">Day 1</span>
                  <p>Dive deep into server-side architecture and security</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker workshop"></div>
                <div className="timeline-content">
                  <h4>Hands-on Full-Stack Workshop</h4>
                  <span className="timeline-day">Day 1</span>
                  <p>Build a complete web application from scratch</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker ctf"></div>
                <div className="timeline-content">
                  <h4>24-hour Cybersecurity CTF Competition</h4>
                  <span className="timeline-day">Day 1-2</span>
                  <p>Hunt vulnerabilities and defend against other teams</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="why" title="Why Participate?">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💻</div>
              <h4>Master Modern Development</h4>
              <p>
                Learn cutting-edge frontend and backend development techniques
                from industry experts
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🛠️</div>
              <h4>Hands-on Workshop</h4>
              <p>
                Build a complete full-stack website from scratch in our guided
                workshop session
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h4>CTF Competition</h4>
              <p>
                Compete in teams during an intense 24-hour cybersecurity
                capture-the-flag challenge
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔍</div>
              <h4>Vulnerability Hunting</h4>
              <p>
                Hunt for vulnerabilities in web servers and defend against other
                teams' attacks
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h4>Professional Networking</h4>
              <p>
                Connect with cybersecurity professionals and like-minded
                developers in the field
              </p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h4>Win & Recognition</h4>
              <p>
                Earn recognition and bragging rights in the ultimate hacking
                competition
              </p>
            </div>
          </div>
        </Section>

        <Section id="register" title="Register">
          <div className="registration-intro">
            <h3>🚀 Join the Ultimate Cybersecurity Experience</h3>
            <p>Ready to level up your skills? Register now for YouniHack 2025 and be part of Romania's premier cybersecurity event!</p>
          </div>
          <center>
            <RegistrationStats backendUrl={backendAddress} />
          </center>
          <form className="register-form" onSubmit={handleSubmit}>
            <FormField
              label="First Name"
              id="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
            <FormField
              label="Last Name"
              id="surname"
              required
              value={form.surname}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
            <FormField
              label="Email"
              id="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="phone-input-group">
                <select
                  id="prefix"
                  name="prefix"
                  required
                  value={form.prefix}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, prefix: e.target.value }))
                  }
                  disabled={prefixLoading}
                  aria-label="Country Prefix"
                  autoComplete="tel-country-code"
                >
                  <option value="">
                    {prefixLoading ? "Loading..." : "Select code"}
                  </option>
                  {countryPrefixes.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="(123) 456-7890"
                  maxLength={14}
                  value={form.phone}
                  onChange={handleChange}
                  onInput={(e) => {
                    let v = e.target.value.replace(/[^0-9]/g, "");
                    if (v.length > 10) v = v.slice(0, 10);
                    if (v.length > 6)
                      e.target.value = `(${v.slice(0, 3)}) ${v.slice(3, 6)}-${v.slice(6)}`;
                    else if (v.length > 3)
                      e.target.value = `(${v.slice(0, 3)}) ${v.slice(3)}`;
                    else if (v.length > 0) e.target.value = `(${v}`;
                    setForm((f) => ({ ...f, phone: e.target.value }));
                  }}
                />
              </div>
            </div>
            <FormField
              label="Country"
              id="country"
              required
              value={form.country}
              onChange={handleChange}
              placeholder="Enter your country"
            />
            <FormField
              label="City"
              id="city"
              required
              value={form.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
            <button
              className="App-link App-link-green"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner text="Submitting..." />
              ) : (
                "Submit Registration"
              )}
            </button>
            {error && <div className="form-error">{error}</div>}
            {submitted && (
              <div className="form-success">
                Thank you for registering! Please check your inbox (and spam
                folder) for a confirmation email.
              </div>
            )}
          </form>
        </Section>
      </header>
      <ContactFooter />
    </div>
  );
}

export default App;