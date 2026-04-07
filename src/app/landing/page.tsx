'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ekzuplrsptshriwazeur.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrenVwbHJzcHRzaHJpd2F6ZXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NjI4NTUsImV4cCI6MjA5MDUzODg1NX0.cAzLzlJUQSaYV8NtpEoZQoov39trGcELjt0G9GGNHzM'
);

export default function LandingPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      business: (form.elements.namedItem('business') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      trade: (form.elements.namedItem('trade') as HTMLInputElement).value,
    };

    const { error } = await supabase.from('waitlist').insert([data]);
    if (error) {
      alert('Something went wrong: ' + error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ff6b35' }}>
        <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
          <h1 style={{ fontSize: '48px', marginBottom: '1rem' }}>You're on the list! 🎉</h1>
          <p style={{ fontSize: '20px' }}>We'll be in touch soon. Spread the word if you love it.</p>
          <Link href="/app" style={{ display: 'inline-block', marginTop: '2rem', color: 'white', textDecoration: 'underline' }}>
            Go to your dashboard →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { padding: 20px 0; position: fixed; width: 100%; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid #eee; }
        header .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: 800; color: #ff6b35; }
        .logo span { color: #1a1a1a; }
        .cta-button { background: #ff6b35; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.3s; }
        .cta-button:hover { background: #e55a2b; }
        .hero { padding: 140px 0 80px; background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%); }
        .hero .container { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .hero-content { }
        .hero h1 { font-size: 64px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: #1a1a1a; }
        .hero h1 .line1 { display: block; color: #ff6b35; }
        .hero p { font-size: 22px; color: #666; margin: 0 0 40px; }
        .hero-buttons { display: flex; gap: 16px; }
        .hero-image { }
        .hero-image img { width: 100%; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .hero h1 { font-size: 72px; font-weight: 800; line-height: 1.1; margin-bottom: 24px; color: #1a1a1a; }
        .hero h1 .line1 { display: block; color: #ff6b35; }
        .hero p { font-size: 24px; color: #666; max-width: 600px; margin: 0 auto 40px; }
        .hero-buttons { display: flex; gap: 16px; justify-content: center; }
        .btn-primary { background: #ff6b35; color: white; padding: 18px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; transition: all 0.3s; }
        .btn-primary:hover { background: #e55a2b; transform: translateY(-2px); }
        .pain-band { background: #1a1a1a; padding: 60px 0; }
        .pain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
        .pain-point { color: white; padding: 20px; border-left: 4px solid #ff6b35; }
        .pain-point h3 { font-size: 20px; margin-bottom: 8px; }
        .pain-point p { color: #999; font-size: 16px; margin: 0; }
        .quote-break { padding: 80px 0; text-align: center; background: #fff; }
        .quote-break blockquote { font-size: 32px; font-weight: 600; max-width: 800px; margin: 0 auto; color: #1a1a1a; line-height: 1.4; }
        .quote-break cite { display: block; margin-top: 20px; color: #666; font-size: 18px; font-style: normal; }
        .features { padding: 100px 0; background: #f9f9f9; }
        .features h2 { text-align: center; font-size: 48px; margin-bottom: 60px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
        .feature-card { padding: 32px; background: white; border-radius: 16px; transition: all 0.3s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        .feature-icon { font-size: 40px; margin-bottom: 16px; }
        .feature-card h3 { font-size: 22px; margin-bottom: 12px; }
        .feature-card p { color: #666; }
        .pricing { padding: 100px 0; background: #1a1a1a; }
        .pricing h2 { text-align: center; font-size: 48px; color: white; margin-bottom: 16px; }
        .pricing-intro { text-align: center; color: #999; font-size: 20px; max-width: 600px; margin: 0 auto 60px; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; max-width: 1000px; margin: 0 auto; }
        .pricing-card { background: white; padding: 40px; border-radius: 16px; text-align: center; transition: all 0.3s; }
        .pricing-card.featured { border: 3px solid #ff6b35; transform: scale(1.05); }
        .pricing-card h3 { font-size: 24px; margin-bottom: 8px; }
        .price { font-size: 48px; font-weight: 800; color: #ff6b35; margin-bottom: 8px; }
        .price span { font-size: 16px; color: #666; font-weight: 400; }
        .pricing-card ul { list-style: none; margin: 24px 0; text-align: left; }
        .pricing-card li { padding: 8px 0; color: #444; }
        .pricing-card li::before { content: '✓'; color: #ff6b35; margin-right: 12px; font-weight: bold; }
        .signup { padding: 100px 0; background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%); }
        .signup h2 { text-align: center; font-size: 48px; color: white; margin-bottom: 16px; }
        .signup .subtitle { text-align: center; color: rgba(255,255,255,0.9); font-size: 20px; margin-bottom: 40px; }
        .signup-form { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 8px; }
        .form-group input { width: 100%; padding: 14px; border: 2px solid #eee; border-radius: 8px; font-size: 16px; transition: border-color 0.3s; }
        .form-group input:focus { outline: none; border-color: #ff6b35; }
        .form-submit { width: 100%; background: #ff6b35; color: white; padding: 16px; border: none; border-radius: 8px; font-size: 18px; font-weight: 600; cursor: pointer; transition: background 0.3s; }
        .form-submit:hover { background: #e55a2b; }
        .assurance { text-align: center; margin-top: 16px; color: rgba(255,255,255,0.8); font-size: 14px; }
        footer { padding: 40px 0; text-align: center; color: #666; }
        @media (max-width: 768px) {
          .hero .container { grid-template-columns: 1fr; gap: 30px; }
          .hero h1 { font-size: 42px; }
          .hero p { font-size: 18px; }
          .hero-buttons { flex-direction: column; }
          .features h2, .pricing h2, .signup h2 { font-size: 36px; }
          .quote-break blockquote { font-size: 24px; }
        }
      `}</style>

      <header>
        <div className="container">
          <div className="logo">TradeMate<span>AI</span></div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="/opportunities" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>🦄 Opportunities</Link>
            <Link href="/app" className="cta-button">Go to Dashboard</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1><span className="line1">Your admin sorted.</span> Every call answered, every quote sent, every invoice chased.</h1>
            <p>You didn't start a business to do spreadsheets at 11pm. But here you are. 8 hours a week of admin is taking you away from the actual work — and burning you out. This fixes it.</p>
            <div className="hero-buttons">
              <a href="#signup" className="btn-primary">Get Early Access</a>
            </div>
          </div>
          <div className="hero-image">
            <img src="/tradie-hero.png" alt="Tradie checking phone" />
          </div>
        </div>
      </section>

      <section className="pain-band">
        <div className="container">
          <div className="pain-grid">
            <div className="pain-point">
              <h3>📋 8 hours a week on admin</h3>
              <p>Quotes, invoices, payment chasing. The real work keeps getting interrupted by paperwork. And you do most of it after hours.</p>
            </div>
            <div className="pain-point">
              <h3>😰 9 in 10 tradespeople felt stressed last year</h3>
              <p>Admin overload is a major driver. You trained for the work, not the spreadsheets. The business side is eating you alive.</p>
            </div>
            <div className="pain-point">
              <h3>📱 Social media keeps getting mentioned</h3>
              <p>You know it's true. But finding time to post when you're running jobs is a different sport entirely.</p>
            </div>
            <div className="pain-point">
              <h3>💸 Quoting takes 2.5 hours a week before you've turned a wrench</h3>
              <p>Measure up, write the quote, follow up, chase payment. That's a real job's worth of time — gone.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-break">
        <div className="container">
          <blockquote>"You trained for the hands-on work. The admin wasn't part of the plan."</blockquote>
          <cite>— The reason most tradespeople are exhausted by Friday</cite>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>What It Does</h2>
          <div className="features-grid">
            {[
              { icon: '📞', title: 'Phone receptionist built in', desc: 'Never miss a call again. Every enquiry gets logged and followed up — even when you\'re on a job.' },
              { icon: '📋', title: 'Quotes and invoices in seconds', desc: 'Stop spending 2.5 hours a week writing what you could send in 30 seconds.' },
              { icon: '📱', title: 'Schedule social posts in advance', desc: 'Your pages stay active. Queue content for the week in minutes, post while you\'re on the tools.' },
              { icon: '💰', title: 'Track income and expenses', desc: 'See what\'s coming in, what\'s going out, and what\'s actually profit. No more guessing.' },
              { icon: '🛡️', title: 'Customer history at a glance', desc: 'Every job, every invoice, every note — all in one place. Know who you\'re dealing with before you quote.' },
              { icon: '🧠', title: 'Job calendar that actually works', desc: 'Book jobs, set reminders, see your week at a glance. No more WhatsApp threading with yourself.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pricing">
        <div className="container">
          <h2>Simple Pricing</h2>
          <p className="pricing-intro">One place for your jobs, quotes, invoices, calls, and calendar. No more juggling six different apps. No setup fees, no gotchas — just the admin side sorted properly.</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">£99<span>/mo</span></div>
              <ul>
                <li>Phone receptionist</li>
                <li>Up to 50 contacts</li>
                <li>Quotes & invoices</li>
                <li>Email support</li>
              </ul>
              <a href="#signup" className="cta-button" style={{ display: 'block', textDecoration: 'none' }}>Join Waitlist</a>
            </div>
            <div className="pricing-card featured">
              <h3>Pro</h3>
              <div className="price">£199<span>/mo</span></div>
              <ul>
                <li>Everything in Starter</li>
                <li>Unlimited contacts</li>
                <li>Job scheduling & calendar</li>
                <li>Social media scheduling</li>
                <li>Financial tracking</li>
                <li>Priority support</li>
              </ul>
              <a href="#signup" className="cta-button" style={{ display: 'block', textDecoration: 'none' }}>Join Waitlist</a>
            </div>
            <div className="pricing-card">
              <h3>Business</h3>
              <div className="price">£499<span>/mo</span></div>
              <ul>
                <li>Everything in Pro</li>
                <li>Multiple users</li>
                <li>API access</li>
                <li>Custom integrations</li>
                <li>Dedicated account manager</li>
              </ul>
              <a href="#signup" className="cta-button" style={{ display: 'block', textDecoration: 'none' }}>Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      <section className="signup" id="signup">
        <div className="container">
          <h2>Get Early Access</h2>
          <p className="subtitle">Join the waitlist and we'll be in touch to get you set up.</p>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="name" required placeholder="John" />
            </div>
            <div className="form-group">
              <label>Business Name</label>
              <input type="text" name="business" required placeholder="J Smith Plumbing" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="phone" required placeholder="07123 456789" />
            </div>
            <div className="form-group">
              <label>What trade are you in?</label>
              <input type="text" name="trade" required placeholder="Plumber, Electrician, etc." />
            </div>
            <button type="submit" className="form-submit">Claim My Spot</button>
          </form>
          <p className="assurance">No funny business. Unsubscribe anytime. We won't share your details.</p>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>© 2026 TradeMate AI. Built by tradespeople, for tradespeople.</p>
        </div>
      </footer>
    </div>
  );
}
