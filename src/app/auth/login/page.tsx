'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError('Both fields are required.'); return; }
        setLoading(true);
        const err = await login(email, password);
        setLoading(false);
        if (err) { setError(err); return; }
        router.push('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.3),transparent)', top: -100, right: -100, filter: 'blur(80px)' }} />
            </div>
            <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>⬡ TeamTrack</Link>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', marginTop: 16, marginBottom: 6 }}>Welcome back</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Log in to your TeamTrack account</p>
                </div>
                <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
                    {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Email</label>
                        <input className="input" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Password</label>
                        <input className="input" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: 20 }}>
                    Don&apos;t have an account? <Link href="/auth/signup" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
}
