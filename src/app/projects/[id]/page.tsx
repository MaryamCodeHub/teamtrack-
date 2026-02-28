'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import {
    getProjectById, Project, getGroupsByProject, Group,
    getMembersByGroup, User, getUsers, saveGroup, genId,
    saveGroupMember, saveProject, getTasksByGroup, getPeerReviews, PeerReview
} from '@/lib/store';

export default function TeacherProjectView() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [groups, setGroups] = useState<{ group: Group, members: User[] }[]>([]);
    const [allStudents, setAllStudents] = useState<User[]>([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [activeTab, setActiveTab] = useState<'groups' | 'reports'>('groups');
    const [projectReviews, setProjectReviews] = useState<PeerReview[]>([]);

    useEffect(() => {
        if (!user) return;
        const p = getProjectById(projectId);
        if (!p || p.teacherId !== user.id) {
            router.push('/dashboard');
            return;
        }
        setProject(p);
        loadData(p.id);
    }, [user, projectId, router]);

    const loadData = (pId: string) => {
        const rawGroups = getGroupsByProject(pId);
        const users = getUsers();
        setAllStudents(users.filter(u => u.role === 'student'));

        const enriched = rawGroups.map(g => {
            const gMembers = getMembersByGroup(g.id);
            const members = gMembers.map(gm => users.find(u => u.id === gm.studentId)).filter(Boolean) as User[];
            return { group: g, members };
        });
        setGroups(enriched);
        setProjectReviews(getPeerReviews().filter(r => r.projectId === pId));
    };

    const handleCreateGroup = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName || !project) return;
        saveGroup({ id: genId(), projectId: project.id, name: newGroupName });
        setNewGroupName('');
        loadData(project.id);
    };

    const handleAssignStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId || !selectedGroupId) return;
        saveGroupMember({ id: genId(), groupId: selectedGroupId, studentId: selectedStudentId });
        setSelectedStudentId('');
        loadData(project!.id);
    };

    const toggleReviews = () => {
        if (!project) return;
        saveProject({ ...project, reviewOpen: !project.reviewOpen });
        setProject({ ...project, reviewOpen: !project.reviewOpen });
    };

    if (!project) return <div>Loading...</div>;

    return (
        <AppLayout title={project.title} subtitle={project.subject + ' • Deadline: ' + new Date(project.deadline).toLocaleDateString()}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
                <button onClick={() => setActiveTab('groups')} style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: activeTab === 'groups' ? '#818cf8' : '#94a3b8', borderBottom: activeTab === 'groups' ? '2px solid #6366f1' : 'none', fontWeight: 600, cursor: 'pointer' }}>Groups & Students</button>
                <button onClick={() => setActiveTab('reports')} style={{ padding: '12px 16px', background: 'transparent', border: 'none', color: activeTab === 'reports' ? '#818cf8' : '#94a3b8', borderBottom: activeTab === 'reports' ? '2px solid #6366f1' : 'none', fontWeight: 600, cursor: 'pointer' }}>Contribution Reports</button>
            </div>

            {activeTab === 'groups' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
                    {/* Groups List */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Project Groups</h3>
                            <button onClick={toggleReviews} style={{ padding: '6px 14px', background: project.reviewOpen ? 'transparent' : '#f59e0b', color: project.reviewOpen ? '#f59e0b' : '#fff', border: `1px solid #f59e0b`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                                {project.reviewOpen ? 'Close Peer Reviews' : 'Open Peer Reviews'}
                            </button>
                        </div>

                        {groups.length === 0 ? (
                            <p style={{ color: '#94a3b8' }}>No groups created yet. Use the panel on the right to add some.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {groups.map(({ group, members }) => (
                                    <div key={group.id} className="card" style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#10b981' }}>●</span> {group.name}
                                            </h4>
                                            <span className="badge badge-blue">{members.length} members</span>
                                        </div>
                                        {members.length === 0 ? (
                                            <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>No students assigned yet.</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {members.map(m => (
                                                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8 }}>
                                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{m.name.charAt(0)}</div>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{m.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>{m.email}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Management Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div className="card" style={{ padding: 20 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Create Group</h4>
                            <form onSubmit={handleCreateGroup} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <input className="input" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="e.g. Group A" required />
                                <button type="submit" style={{ padding: '8px', background: 'var(--surface2)', color: '#f1f5f9', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Add Group</button>
                            </form>
                        </div>

                        <div className="card" style={{ padding: 20 }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Assign Student</h4>
                            <form onSubmit={handleAssignStudent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <select className="input" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} required>
                                    <option value="" disabled>Select Student</option>
                                    {allStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
                                </select>
                                <select className="input" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)} required>
                                    <option value="" disabled>Select Group</option>
                                    {groups.map(g => <option key={g.group.id} value={g.group.id}>{g.group.name}</option>)}
                                </select>
                                <button type="submit" style={{ padding: '8px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Assign to Group</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Group Contribution Reports</h3>
                    <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: '0.9rem' }}>See aggregated task logs and average peer review scores for each student.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {groups.map(({ group, members }) => {
                            const groupTasks = getTasksByGroup(group.id);
                            const groupTotalTasks = groupTasks.length;
                            const groupTotalHours = groupTasks.reduce((s, t) => s + (t.hours || 0), 0);

                            return (
                                <div key={group.id} className="card" style={{ padding: 24 }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16, color: '#10b981' }}>{group.name}</h4>

                                    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                                        <div style={{ background: 'var(--surface2)', padding: '12px 20px', borderRadius: 12 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Total Tasks</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{groupTotalTasks}</div>
                                        </div>
                                        <div style={{ background: 'var(--surface2)', padding: '12px 20px', borderRadius: 12 }}>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Total Hours</div>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{groupTotalHours}</div>
                                        </div>
                                    </div>

                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border)', color: '#94a3b8', textAlign: 'left' }}>
                                                <th style={{ padding: '12px 8px' }}>Student</th>
                                                <th style={{ padding: '12px 8px' }}>Tasks</th>
                                                <th style={{ padding: '12px 8px' }}>Hours</th>
                                                <th style={{ padding: '12px 8px' }}>% of Group</th>
                                                <th style={{ padding: '12px 8px' }}>Peer Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {members.map(std => {
                                                const studentTasks = groupTasks.filter(t => t.studentId === std.id);
                                                const sTasks = studentTasks.length;
                                                const sHours = studentTasks.reduce((s, t) => s + (t.hours || 0), 0);
                                                const pct = groupTotalHours ? Math.round((sHours / groupTotalHours) * 100) : 0;

                                                // aggregate peer reviews FOR this student
                                                const reviews = projectReviews.filter(r => r.revieweeId === std.id);
                                                const avgContrib = reviews.length ? (reviews.reduce((s, r) => s + r.contributionScore, 0) / reviews.length).toFixed(1) : '-';

                                                // free-rider flag heuristic: high peer review rating but low actual logging, or very low peer review rating
                                                const isFlagged = (reviews.length > 0 && Number(avgContrib) < 2.5) || (pct < 10 && groupTotalTasks > 5);

                                                return (
                                                    <tr key={std.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                        <td style={{ padding: '12px 8px', fontWeight: 600 }}>
                                                            {std.name} {isFlagged && <span title="Potential free-rider or discrepancy" style={{ cursor: 'help' }}>⚠️</span>}
                                                        </td>
                                                        <td style={{ padding: '12px 8px' }}>{sTasks}</td>
                                                        <td style={{ padding: '12px 8px' }}>{sHours}</td>
                                                        <td style={{ padding: '12px 8px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                                <div style={{ flex: 1, height: 6, background: 'var(--surface2)', borderRadius: 999, overflow: 'hidden' }}>
                                                                    <div style={{ width: `${pct}%`, height: '100%', background: pct < 20 ? 'var(--red)' : pct > 40 ? 'var(--green)' : 'var(--primary)', borderRadius: 999 }} />
                                                                </div>
                                                                <span style={{ width: '28px' }}>{pct}%</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ padding: '12px 8px' }}>
                                                            <span style={{ color: avgContrib !== '-' && Number(avgContrib) < 3 ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>★ {avgContrib}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {members.length === 0 && (
                                                <tr><td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No members in this group</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
