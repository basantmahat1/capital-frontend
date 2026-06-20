import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES_LIST } from '../../constants/services';
import '../../styles/Landing.css';

const Services = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Intersection Observer for reveal animations
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    
    return () => io.disconnect();
  }, []);

  const handleBookService = (serviceId) => {
    navigate(`/service-booking?service=${serviceId}`);
  };

  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="section-head reveal">
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-title">Complete IT Services</h2>
          <p className="section-sub">One stop for all your technology needs — from a cracked screen to a full business network setup.</p>
        </div>
        <div className="services-grid">
          {SERVICES_LIST.map((svc, i) => (
            <div key={svc.id} className={`svc-card reveal d${(i % 4) + 1}`}>
              <div className="svc-icon">{svc.icon}</div>
              <div className="svc-name">{svc.name}</div>
              <div className="svc-desc">{svc.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleBookService(svc.id)}
                  style={{ 
                    backgroundColor: '#F0585E', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#E0484E'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#F0585E'}
                >
                  Book Service →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
