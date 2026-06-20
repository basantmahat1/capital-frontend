import '../../styles/Landing.css';

const WhyUs = () => {
  return (
    <section className="why" id="why">
      <div className="wrap">
        <div className="why-grid">
          <div>
            <div className="section-head reveal">
              <span className="section-eyebrow">Why Capital I.T Solution</span>
              <h2 className="section-title">Trusted by Hundreds<br />Across the Valley</h2>
              <p className="section-sub">We've built our reputation on fast, honest, and reliable service since day one.</p>
            </div>
            <div className="why-features">
              <div className="why-item reveal d1">
                <div className="why-icon-wrap">⏱</div>
                <div>
                  <h3>Same-Day Turnaround</h3>
                  <p>Most standard repairs are completed within hours. We know you need your device, so we move fast.</p>
                </div>
              </div>
              <div className="why-item reveal d2">
                <div className="why-icon-wrap">💰</div>
                <div>
                  <h3>Transparent Pricing</h3>
                  <p>No surprise charges. You get a full cost estimate and diagnosis report before we touch your device.</p>
                </div>
              </div>
              <div className="why-item reveal d3">
                <div className="why-icon-wrap">🎓</div>
                <div>
                  <h3>Certified Technicians</h3>
                  <p>Our engineers hold industry certifications and train regularly on the latest hardware and software.</p>
                </div>
              </div>
              <div className="why-item reveal d4">
                <div className="why-icon-wrap">🛡</div>
                <div>
                  <h3>90-Day Warranty</h3>
                  <p>Every repair comes with a 90-day warranty on parts and labor. If it breaks, we fix it free.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="review-stack reveal">
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <div className="review-quote">"My laptop was completely dead. They diagnosed and repaired the motherboard in one day — at a price I didn't expect. Incredible service."</div>
              <div className="review-author">
                <div className="avatar">RK</div>
                <div>
                  <div className="author-name">Rajan Koirala</div>
                  <div className="author-loc">Butwal, Rupandehi</div>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <div className="review-quote">"Set up CCTV for my shop and configured remote monitoring on my phone. Professional from start to finish. Highly recommended!"</div>
              <div className="review-author">
                <div className="avatar v2">SP</div>
                <div>
                  <div className="author-name">Sunita Pathak</div>
                  <div className="author-loc">Shop Owner, Butwal</div>
                </div>
              </div>
            </div>
            <div className="review-card">
              <div className="review-stars">★★★★★</div>
              <div className="review-quote">"Recovered all my business data from a crashed drive. I thought it was gone forever. These guys are lifesavers — literally saved my business."</div>
              <div className="review-author">
                <div className="avatar" style={{background: '#1A7A47'}}>BT</div>
                <div>
                  <div className="author-name">Binod Thapa</div>
                  <div className="author-loc">Business Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
