'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import {
    getProjectById, Project, getGroupById, Group,
    getTasksByGroup, Task, saveTask, genId,
    TaskCategory, getMembersByGroup, User, getUsers, hasReviewed
} from '@/lib/store';

export default function StudentProjectView() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const projectId = params.id as string;
    const groupId = searchParams.get('groupId');

    const [project, setProject] = useState<Project | null>(null);
    const [group, setGroup] = useState<Group | null>(null);
    const [tasks, setTasks] = useState<(Task & { studentName: string })[]>([]);
    const [members, setMembers] = useState<User[]>([]);

    // Task form
    const [isLogging, setIsLogging] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TaskCategory>('Research');
    const [hours, setHours] = useState(1);
    const [desc, setDesc] = useState('');

    const [pendingReviews, setPendingReviews] = useState(0);

    useEffect(() => {
        if (!user || !groupId) return;
        const p = getProjectById(projectId);
        const g = getGroupById(groupId);
        if (!p || !g) {
            router.push('/dashboard');
            return;
        }
        setProject(p);
        setGroup(g);
        loadData(g.id, p);
    }, [user, projectId, groupId, router]);

    const loadData = (gId: string, p: Project) => {
        const allUsers = getUsers();
        const gMembers = getMembersByGroup(gId).map(gm => allUsers.find(u => u.id === gm.studentId)).filter(Boolean) as User[];
        setMembers(gMembers);

        const groupTasks = getTasksByGroup(gId).map(t => ({
            ...t,
            studentName: allUsers.find(u => u.id === t.studentId)?.name || 'Unknown'
        })).sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
        setTasks(groupTasks);

        if (p.reviewOpen && user) {
            const teammates = gMembers.filter(m => m.id !== user.id);
            const pending = teammates.filter(m => !hasReviewed(p.id, user.id, m.id));
            setPendingReviews(pending.length);
        }
    };

    const handleLogTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !user || !group) return;
        saveTask({
            id: genId(),
            groupId: group.id,
            studentId: user.id,
            title,
            description: desc,
            category,
            hours: Number(hours),
            loggedAt: new Date().toISOString()
        });
        setIsLogging(false);
        setTitle('');
        setDesc('');
        setHours(1);
        loadData(group.id, project!);
    };

    if (!project || !group) return <div>Loading...</div>;

    return (
        <AppLayout title={`${project.title} - Workspace`} subtitle={`Group: ${group.name} | Due: ${new Date(project.deadline).toLocaleDateString()}`}>

            {project.reviewOpen && pendingReviews > 0 && (
                <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.15))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 12, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h4 style={{ fontWeight: 700, color: '#f59e0b', fontSize: '1.05rem', marginBottom: 4 }}>🚨 Peer Reviews are Open</h4>
                        <p style={{ color: '#f1f5f9', fontSize: '0.85rem' }}>You have {pendingReviews} teammate(s) left to review. Your ratings are anonymous.</p>
                    </div>
                    <button onClick={() => router.push(`/student/projects/${project.id}/review?groupId=${group.id}`)} style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
                        Start Reviews
                    </button>
                </div>
            )}

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>

                {/* Left: Task Log */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Activity Log</h3>
                        <button onClick={() => setIsLogging(true)} style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}>
                            + Log Task
                        </button>
                    </div>

                    {isLogging && (
                        <form onSubmit={handleLogTask} className="card" style={{ padding: 24, marginBottom: 24, border: '1px solid #10b981' }}>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16 }}>Log a Contribution</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Task Title</label>
                                    <input className="input" autoFocus required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Built Login API" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Category</label>
                                    <select className="input" value={category} onChange={e => setCategory(e.target.value as TaskCategory)}>
                                        {['Research', 'Coding', 'Design', 'Writing', 'Presentation', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Hours Spent</label>
                                    <input className="input" type="number" step="0.5" min="0.5" required value={hours} onChange={e => setHours(Number(e.target.value))} />
                                </div>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Details / Links (Optional)</label>
                                <textarea className="input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe what you did..." rows={2} />
                            </div>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setIsLogging(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', background: '#10b981', color: '#fff', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save Task</button>
                            </div>
                        </form>
                    )}

                    {tasks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--surface)', borderRadius: 16, border: '1px dashed var(--border)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📝</div>
                            <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No tasks logged yet</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Be the first to log a contribution for your group!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {tasks.map(t => (
                                <div key={t.id} style={{ background: 'var(--surface)', padding: '16px 20px', borderRadius: 12, border: '1px solid var(--border)', borderLeft: `4px solid ${t.studentId === user?.id ? '#10b981' : '#6366f1'}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                        <div>
                                            <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#f1f5f9' }}>{t.title}</h4>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 4 }}>
                                                <span style={{ color: t.studentId === user?.id ? '#10b981' : '#818cf8', fontWeight: 600 }}>{t.studentName}</span> • {new Date(t.loggedAt).toLocaleString()}
                                            </div>
                                        </div>
                                        <span className="badge badge-blue">{t.category}</span>
                                    </div>
                                    {t.description && <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: 12 }}>{t.description}</p>}
                                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>⏱️ {t.hours} hrs</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Group Info */}
                <div>
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>Team Members</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {members.map(m => {
                                const sTasks = tasks.filter(t => t.studentId === m.id);
                                const sHours = sTasks.reduce((s, t) => s + (t.hours || 0), 0);
                                return (
                                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 8 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.id === user?.id ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', color: m.id === user?.id ? '#10b981' : '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{m.name.charAt(0)}</div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{m.name} {m.id === user?.id && '(You)'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{sHours} hrs logged</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

            </div>

        </AppLayout>
    );
}
