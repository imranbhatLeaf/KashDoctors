import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout title="About KashDoc" actionLabel="Get Started" onAction={() => navigate('/register')}>
      <div className="section-padding" style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 22px' }}>
        <div style={{ marginBottom: '80px', textAlign: 'center' }}>
          <h1 className="display-xl" style={{ marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Healthcare for the <span className="text-gradient">Modern Age.</span>
          </h1>
          <p className="lead" style={{ fontSize: '20px', color: 'var(--color-ink-muted-80)', lineHeight: '1.6' }}>
            We started KashDoc with a simple mission: to bridge the gap between quality healthcare providers and the people who need them most in Srinagar.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', marginBottom: '100px' }}>
          <div>
            <h2 className="display-sm" style={{ marginBottom: '20px' }}>Our Mission</h2>
            <p className="body" style={{ color: 'var(--color-ink-muted-80)', lineHeight: '1.7' }}>
              We believe that access to specialized medical care should be as simple as booking a taxi. By leveraging modern technology, we remove the friction from the booking process, allowing patients to focus on what matters most: their health.
            </p>
          </div>
          <div>
            <h2 className="display-sm" style={{ marginBottom: '20px' }}>Privacy First</h2>
            <p className="body" style={{ color: 'var(--color-ink-muted-80)', lineHeight: '1.7' }}>
              Your medical journey is deeply personal. That's why KashDoc is built with a privacy-first architecture. We don't just protect your data; we ensure you have complete control over who sees your health history.
            </p>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'var(--color-surface-pearl)', 
          padding: '60px', 
          borderRadius: 'var(--rounded-lg)', 
          textAlign: 'center',
          border: '1px solid var(--color-hairline)'
        }}>
          <h2 className="display-md" style={{ marginBottom: '24px' }}>Join Our Community</h2>
          <p className="body" style={{ marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Whether you're a doctor looking to expand your practice or a patient seeking the best care, KashDoc is built for you.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="button-primary-elevated" onClick={() => navigate('/register')}>Sign Up as Patient</button>
            <button className="button-secondary-outline" onClick={() => navigate('/register-doctor')}>Join as Specialist</button>
          </div>
        </div>

        <div style={{ marginTop: '100px', borderTop: '1px solid var(--color-hairline)', paddingTop: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            <div>
              <p className="caption-strong" style={{ textTransform: 'uppercase', color: 'var(--color-primary)' }}>Contact Us</p>
              <h3 className="display-xs" style={{ marginTop: '8px' }}>Get in touch with our team.</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <p className="body-strong">General Inquiries</p>
                <p className="body" style={{ color: 'var(--color-ink-muted-80)' }}>hello@kashdoc.com</p>
              </div>
              <div>
                <p className="body-strong">Support</p>
                <p className="body" style={{ color: 'var(--color-ink-muted-80)' }}>support@kashdoc.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
