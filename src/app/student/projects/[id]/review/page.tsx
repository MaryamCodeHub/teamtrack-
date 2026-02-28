'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { getProjectById, getGroupById, getMembersByGroup, User, getUsers, hasReviewed, savePeerReview, genId } from '@/lib/store';

export default function PeerReviewForm() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id as string;
    const groupId = searchParams.get('groupId');

    const [teammates, setTeammates] = useState<User[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Form state
    const [contrib, setContrib] = useState(3);
    const [quality, setQuality] = useState(3);
    const [comm, setComm] = useState(3);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!user || !groupId) return;
        const p = getProjectById(projectId);
        if (!p || !p.reviewOpen) { router.push('/dashboard'); return; }

        const allUsers = getUsers();
        const gMembers = getMembersByGroup(groupId).map(gm => allUsers.find(u => u.id === gm.studentId)).filter(Boolean) as User[];

        const pending = gMembers.filter(m => m.id !== user.id && !hasReviewed(p.id, user.id, m.id));

        if (pending.length === 0) {
            router.push(`/student/projects/${projectId}?groupId=${groupId}`);
        } else {
            setTeammates(pending);
        }
    }, [user, projectId, groupId, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !groupId) return;
        const reviewee = teammates[currentIndex];

        savePeerReview({
            id: genId(),
            projectId,
            groupId,
            reviewerId: user.id,
            revieweeId: reviewee.id,
            contributionScore: contrib,
            qualityScore: quality,
            communicationScore: comm,
            comment,
            submittedAt: new Date().toISOString()
        });

        if (currentIndex < teammates.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setContrib(3); setQuality(3); setComm(3); setComment('');
            window.scrollTo(0, 0);
        } else {
            router.push(`/student/projects/${projectId}?groupId=${groupId}`);
        }
    };

    const StarRating = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700 }}>{value} / 5</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => onChange(star)}
                        style={{
                            fontSize: '2rem',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: star <= value ? '#f59e0b' : 'var(--surface2)',
                            transition: 'color 0.2s',
                            lineHeight: 1
                        }}
                    >★</button>
                ))}
            </div>
        </div>
    );

    if (teammates.length === 0) return <div>Loading...</div>;

    const currentTeammate = teammates[currentIndex];

    return (
        <AppLayout title="Anonymous Peer Review" subtitle="Your ratings are completely anonymous and only visible to the teacher.">
            <div style={{ maxWidth: 600, margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, padding: '12px 16px', background: 'var(--surface2)', borderRadius: 12 }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Reviewing</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#818cf8' }}>{currentTeammate.name}</span>
                    <span style={{ fontSize: '0.8rem', background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '4px 10px', borderRadius: 999, fontWeight: 700 }}>
                        {currentIndex + 1} of {teammates.length}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="card" style={{ padding: 32 }}>
                    <StarRating label="Overall Contribution & Workload" value={contrib} onChange={setContrib} />
                    <StarRating label="Quality of Work Submitted" value={quality} onChange={setQuality} />
                    <StarRating label="Communication & Teamwork" value={comm} onChange={setComm} />

                    <div style={{ marginTop: 24, marginBottom: 32 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>Private Comments to Teacher (Optional)</label>
                        <textarea
                            className="input"
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="E.g. They did great work but missed several deadlines..."
                            rows={4}
                        />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(245,158,11,0.4)', transition: 'transform 0.2s' }}>
                        Submit Review for {currentTeammate.name.split(' ')[0]}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
