'use client';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

export default function AppLayout({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => { logout(); router.push('/'); };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
            {/* Top Nav */}
            <nav style={{ background: 'rgba(8,11,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '14px 0', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                    <Link href="/dashboard" style={{ fontWeight: 800, fontSize: '1.1rem', background: 'linear-gradient(135deg,#818cf8,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>⬡ TeamTrack</Link>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} style={{ padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 8, color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}>Log out</button>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            {title && (
                <div style={{ borderBottom: '1px solid var(--border)', padding: '28px 0', background: 'var(--bg2)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: subtitle ? 4 : 0 }}>{title}</h1>
                        {subtitle && <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{subtitle}</p>}
                    </div>
                </div>
            )}

            {/* Content */}
            <div style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '32px 24px', width: '100%' }}>
                {children}
            </div>
        </div>
    );
}
