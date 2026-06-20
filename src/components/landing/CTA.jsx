import '../../styles/Landing.css';

const CTA = () => {
  return (
    <section className="cta-sect" id="contact">
      <div className="wrap">
        <div className="cta-box reveal">
          <div>
            <div className="cta-label">Get in Touch</div>
            <h2 className="cta-title">Your Device Deserves<br />a Second Chance.</h2>
            <p className="cta-sub">Free diagnosis. No repair, no charge. Same-day service available.</p>
          </div>
          <div className="cta-actions">
            <button className="cta-btn cta-btn-primary" onClick={() => alert('📞 Call: +977-XXXXXXXXX')}>📞 Call Now</button>
            <button className="cta-btn cta-btn-secondary" onClick={() => alert('💬 WhatsApp: +977-XXXXXXXXX')}>💬 WhatsApp Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
