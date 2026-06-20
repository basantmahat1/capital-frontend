import '../../styles/Landing.css';

const Process = () => {
  return (
    <section className="process" id="process">
      <div className="wrap">
        <div className="section-head reveal" style={{textAlign: 'center', marginBottom: '3rem'}}>
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">Fixed in Four Simple Steps</h2>
          <p className="section-sub" style={{margin: '0 auto'}}>No jargon, no surprises — just a clear process from drop-off to pick-up.</p>
        </div>
        <div className="process-row">
          <div className="proc-step reveal d1">
            <div className="proc-num">1</div>
            <h3>Drop Off</h3>
            <p>Bring your device in or request a pickup from your location.</p>
          </div>
          <div className="proc-step reveal d2">
            <div className="proc-num">2</div>
            <h3>Free Diagnosis</h3>
            <p>Detailed report and cost estimate within 1 hour — at no charge.</p>
          </div>
          <div className="proc-step reveal d3">
            <div className="proc-num">3</div>
            <h3>Expert Repair</h3>
            <p>We fix it using quality parts, only after your approval.</p>
          </div>
          <div className="proc-step reveal d4">
            <div className="proc-num">4</div>
            <h3>Pick Up</h3>
            <p>Collect your device fully tested and ready to go.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
