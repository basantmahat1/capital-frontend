import '../../styles/Landing.css';

const TrustBar = () => {
  return (
    <div className="trust-bar">
      <div className="trust-inner">
        <span className="trust-label">Trusted for:</span>
        <div className="trust-items">
          <span className="trust-item">Free Diagnosis</span>
          <span className="trust-item">90-Day Warranty</span>
          <span className="trust-item">Genuine Parts</span>
          <span className="trust-item">Certified Technicians</span>
          <span className="trust-item">Same-Day Service</span>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
