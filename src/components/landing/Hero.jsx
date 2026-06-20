import { Link } from 'react-router-dom';
import '../../styles/Landing.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-eyebrow">Precision-Driven Repair &amp; Diagnostics</div>
          <h1 className="hero-title">Professional Care You Can <em>Rely On.</em></h1>
          <p className="hero-desc">Laptop repair to CCTV installation — fast, guaranteed IT solutions for homes and businesses across Butwal, Rupandehi.</p>
          <div className="hero-badges">
            <div className="hb-item">
              <div className="hb-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l7 3v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V5l7-3z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h4>Certified Experts</h4>
              <p>Accredited and experienced technicians.</p>
            </div>
            <div className="hb-item">
              <div className="hb-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
              </div>
              <h4>Express Service</h4>
              <p>Rapid turnaround, minimal downtime.</p>
            </div>
            <div className="hb-item">
              <div className="hb-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L7 21l5-2.5L17 21l-1.5-8.5"/></svg>
              </div>
              <h4>Full Guarantee</h4>
              <p>90-day parts &amp; labor warranty.</p>
            </div>
          </div>
          <div className="hero-actions">
            <Link to="/services" className="btn-primary">Book Services →</Link>
             <Link to="/products" className="btn-ghost" style={{ padding: '0.9rem 1.25rem', border:
         '1px solid rgba(255,255,255,0.3)', borderRadius: '8px' }}>Our Products</Link>
            <button className="btn-ghost" onClick={() => document.getElementById('process').scrollIntoView({behavior:'smooth'})}>
              <span className="play-circle">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </span>
              How It Works
            </button>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
