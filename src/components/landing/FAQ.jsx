import { useState } from 'react';
import '../../styles/Landing.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { q: 'How long does a typical repair take?', a: 'Most standard repairs — screen replacement, RAM/SSD upgrades, software issues — are completed the same day, usually within 1 to 4 hours. Motherboard-level repairs or parts that need ordering may take 1 to 3 days, and we\'ll always give you a clear timeline upfront.' },
    { q: 'Is the diagnosis really free?', a: 'Yes. We inspect your device and give you a full report with the issue and cost estimate at no charge. You only pay once you approve the repair — no diagnosis means no fee, no obligation.' },
    { q: 'Do you use genuine and original parts?', a: 'We only use genuine or manufacturer-grade compatible parts, never low-quality clones. Every part we install is covered under our 90-day warranty, so you can trust what goes inside your device.' },
    { q: 'What if my device can\'t be repaired?', a: 'If a device is beyond economical repair, we\'ll tell you honestly during the free diagnosis instead of charging you for a fix that won\'t last. We can also advise on data recovery or upgrade options in that case.' },
    { q: 'Do you offer pickup and drop-off?', a: 'Yes, for customers within Butwal we offer pickup and drop-off service. Just message us on WhatsApp or call ahead and we\'ll arrange a convenient time to collect your device.' },
    { q: 'Is my data safe during repair?', a: 'Absolutely. We treat every device with strict confidentiality and never access personal files beyond what\'s needed for the repair. For extra peace of mind, we recommend backing up important data before drop-off.' }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq" id="faq">
      <div className="faq-wrap">
        <div className="section-head reveal" style={{textAlign: 'center', marginBottom: '3rem'}}>
          <span className="section-eyebrow">Got Questions?</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-sub" style={{margin: '0 auto'}}>Everything you need to know before bringing in your device.</p>
        </div>
        <div className="faq-list reveal">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggleFaq(i)}>
                {item.q}
                <span className="faq-plus"></span>
              </button>
              <div className="faq-a" style={{maxHeight: openIndex === i ? '200px' : '0px'}}>
                <div className="faq-a-inner">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
