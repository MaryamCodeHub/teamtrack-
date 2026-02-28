'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
    const { signup } = useAuth();
    const router = useRouter();
    const [role, setRole] = useState<'teacher' | 'student'>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) { setError('All fields are required.'); return; }
        setLoading(true);
        const err = await signup(name, email, password, role);
        setLoading(false);
        if (err) { setError(err); return; }
        router.push('/dashboard');
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.3),transparent)', top: -100, left: -100, filter: 'blur(80px)' }} />
                <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.2),transparent)', bottom: -80, right: -60, filter: 'blur(80px)' }} />
            </div>
            <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>⬡ TeamTrack</Link>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', marginTop: 16, marginBottom: 6 }}>Create your account</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Join TeamTrack and make group projects fair</p>
                </div>

                {/* Role selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    {(['teacher', 'student'] as const).map(r => (
                        <button key={r} onClick={() => setRole(r)} style={{ padding: '16px', borderRadius: 12, border: `2px solid ${role === r ? '#6366f1' : 'var(--border)'}`, background: role === r ? 'rgba(99,102,241,0.12)' : 'var(--surface)', color: role === r ? '#818cf8' : '#94a3b8', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                            <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{r === 'teacher' ? '👨‍🏫' : '👩‍🎓'}</div>
                            {r === 'teacher' ? 'I\'m a Teacher' : 'I\'m a Student'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
                    {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: '#ef4444', fontSize: '0.85rem' }}>{error}</div>}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Full Name</label>
                        <input className="input" type="text" placeholder="e.g. Ahmed Khan" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Email</label>
                        <input className="input" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>Password</label>
                        <input className="input" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        {loading ? 'Creating account...' : `Create ${role === 'teacher' ? 'Teacher' : 'Student'} Account`}
                    </button>
                </form>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: 20 }}>
                    Already have an account? <Link href="/auth/login" style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>Log in</Link>
                </p>
            </div>
        </div>
    );
}
