'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 0', background: 'rgba(8,11,20,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32 }}>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⬡ TeamTrack</span>
          <div style={{ display: 'flex', gap: 28, marginLeft: 'auto', alignItems: 'center' }}>
            <a href="#features" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>Features</a>
            <a href="#how" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none' }}>How It Works</a>
            <Link href="/auth/login" style={{ color: '#94a3b8', fontSize: '0.9rem', textDecoration: 'none', padding: '8px 18px', border: '1px solid var(--border)', borderRadius: 8 }}>Log In</Link>
            <Link href="/auth/signup" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', fontSize: '0.9rem', textDecoration: 'none', padding: '8px 18px', borderRadius: 8, fontWeight: 600 }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 24px 80px', position: 'relative' }}>
        {/* Orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.35) 0%,transparent 70%)', top: -100, left: -100, filter: 'blur(80px)', animation: 'orb-float 8s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.25) 0%,transparent 70%)', bottom: -80, right: -80, filter: 'blur(80px)', animation: 'orb-float 10s ease-in-out infinite reverse' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 720, zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)', borderRadius: 999, fontSize: '0.82rem', color: '#818cf8', marginBottom: 28, fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8', display: 'inline-block' }} />
            Built for Universities & Colleges
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 24 }}>
            Group Projects.<br />
            <span style={{ background: 'linear-gradient(135deg,#818cf8 0%,#06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Real Accountability.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.7 }}>
            TeamTrack gives teachers full visibility into who actually contributed. Anonymous peer reviews, contribution tracking, and fair grade adjustment — finally.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <Link href="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
              Start Tracking Free →
            </Link>
            <a href="#how" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 32px', background: 'transparent', color: '#94a3b8', borderRadius: 12, fontWeight: 600, fontSize: '1rem', textDecoration: 'none', border: '1px solid var(--border)' }}>
              See How It Works
            </a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
            {[['100%', 'Anonymous Reviews'], ['Real-time', 'Contribution Logs'], ['1-click', 'Grade Adjustment']].map(([num, label], i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{num}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Card */}
        <div ref={cardRef} style={{ position: 'absolute', right: 'max(24px, calc(50% - 560px))', top: '50%', transform: 'translateY(-50%)', width: 300, background: 'var(--surface)', border: '1px solid var(--border-bright)', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.15)', overflow: 'hidden', animation: 'float 5s ease-in-out infinite' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: '0.83rem', fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            CS301 — Final Project
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: '#10b981', background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 999 }}>Live</span>
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { initials: 'AK', name: 'Ahmed K.', pct: 88, color: '#6366f1', textColor: '#818cf8', bar: 'linear-gradient(90deg,#6366f1,#06b6d4)', pctColor: '#10b981' },
              { initials: 'SR', name: 'Sara R.', pct: 72, color: '#a855f7', textColor: '#c084fc', bar: 'linear-gradient(90deg,#6366f1,#06b6d4)', pctColor: '#f59e0b' },
              { initials: 'MJ', name: 'Mike J.', pct: 12, color: '#ec4899', textColor: '#f472b6', bar: 'linear-gradient(90deg,#ef4444,#f97316)', pctColor: '#ef4444' },
              { initials: 'FZ', name: 'Fatima Z.', pct: 65, color: '#14b8a6', textColor: '#2dd4bf', bar: 'linear-gradient(90deg,#6366f1,#06b6d4)', pctColor: '#f59e0b' },
            ].map(m => (
              <div key={m.initials} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `rgba(${m.color === '#6366f1' ? '99,102,241' : m.color === '#a855f7' ? '168,85,247' : m.color === '#ec4899' ? '236,72,153' : '20,184,166'},0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700, color: m.textColor, flexShrink: 0 }}>{m.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 500, marginBottom: 4 }}>{m.name}</div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${m.pct}%`, height: '100%', background: m.bar, borderRadius: 999 }} />
                  </div>
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: m.pctColor, width: 32, textAlign: 'right' }}>{m.pct}%</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid var(--border)', background: 'rgba(239,68,68,0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>⚠️ Low contribution flagged</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', background: '#6366f1', color: '#fff', borderRadius: 6 }}>Adjust Grade</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '100px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#818cf8', marginBottom: 12 }}>Features</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12 }}>Everything You Need for<br />Group Project Fairness</h2>
            <p style={{ color: '#94a3b8', maxWidth: 420, margin: '0 auto' }}>Powerful insights without the complexity.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
            {[
              { icon: '📊', title: 'Contribution Dashboard', desc: 'Visual breakdown of each student\'s tasks, hours, and deliverables logged throughout the project.' },
              { icon: '🔒', title: 'Anonymous Peer Reviews', desc: 'Students rate teammates honestly with no names attached. Results visible only to the teacher.' },
              { icon: '✅', title: 'Task Logging', desc: 'Students log work with categories — Research, Coding, Design — creating a timestamped trail.' },
              { icon: '✏️', title: 'Grade Adjustment', desc: 'Teachers modify individual student grades directly in-platform based on contribution data.' },
              { icon: '⚠️', title: 'Free-Rider Detection', desc: 'Auto-flags when a student\'s logged tasks diverge significantly from peer review scores.' },
              { icon: '👥', title: 'Role-Based Access', desc: 'Teachers see everything. Students see only their own work — never peer review scores.' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: '2rem', marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 10, fontSize: '1rem' }}>{f.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" style={{ padding: '100px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 2, color: '#818cf8', marginBottom: 12 }}>How It Works</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 60 }}>Simple for Teachers.<br />Intuitive for Students.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Teacher Creates a Project', desc: 'Set up a project, define the deadline, and assign students to groups.' },
              { step: '02', title: 'Students Log Contributions', desc: 'Students log their tasks with categories and hours throughout the project.' },
              { step: '03', title: 'Peer Reviews Open', desc: 'Students anonymously rate every teammate on contribution, quality, and communication.' },
              { step: '04', title: 'Teacher Sees the Truth', desc: 'Full report showing who contributed, peer scores, flags — and grade adjustment.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -2, lineHeight: 1, marginBottom: 16 }}>{s.step}</div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(6,182,212,0.1))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 24, padding: '64px 40px', textAlign: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.3),transparent)', top: -100, left: -80, filter: 'blur(60px)', pointerEvents: 'none' }} />
          <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.2, marginBottom: 14, position: 'relative' }}>Stop rewarding free-riders.<br />Start tracking real contributions.</h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, position: 'relative' }}>Free to get started. No credit card required.</p>
          <Link href="/auth/signup" style={{ display: 'inline-flex', padding: '14px 36px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', position: 'relative' }}>
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', padding: '36px 24px', textAlign: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8, background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>⬡ TeamTrack</div>
        <p style={{ color: '#475569', fontSize: '0.82rem' }}>© 2026 TeamTrack. Fair grades for everyone.</p>
      </footer>
    </main>
  );
}
