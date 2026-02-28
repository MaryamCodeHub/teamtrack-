'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import AppLayout from './AppLayout';
import { Project, getProjectById, getGroupsForStudent, getGroupById, getTasksByStudent, Task } from '@/lib/store';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [studentGroups, setStudentGroups] = useState<{ group: any, project: Project }[]>([]);

    useEffect(() => {
        if (!user?.id) return;
        const groupIds = getGroupsForStudent(user.id);
        const loaded = groupIds.map(gId => {
            const g = getGroupById(gId);
            if (!g) return null;
            const p = getProjectById(g.projectId);
            if (!p) return null;
            return { group: g, project: p };
        }).filter(Boolean) as { group: any, project: Project }[];
        setStudentGroups(loaded);
    }, [user]);

    return (
        <AppLayout title="Student Dashboard" subtitle="Track your contributions and review teammates.">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>Your Active Projects</h2>

            {studentGroups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--surface)', borderRadius: 16, border: '1px dashed var(--border)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📚</div>
                    <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No assigned projects</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>You will see projects here once a teacher adds you to a group.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                    {studentGroups.map(({ group, project }) => (
                        <StudentGroupCard key={group.id} group={group} project={project} studentId={user!.id} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}

function StudentGroupCard({ group, project, studentId }: { group: any, project: Project, studentId: string }) {
    const tasks = getTasksByStudent(studentId, group.id);
    const totalHours = tasks.reduce((sum, t) => sum + (t.hours || 0), 0);

    return (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginBottom: 4 }}>Group: {group.name}</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{project.title}</h3>
                </div>
                {project.reviewOpen && (
                    <span className="badge badge-orange">Review Open</span>
                )}
            </div>

            <div style={{ flex: 1, marginBottom: 20, background: 'var(--surface2)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: 4 }}>Your Contributions</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6366f1' }}>{tasks.length} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>tasks</span></div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{totalHours} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>hrs</span></div>
                </div>
            </div>

            <a href={`/student/projects/${project.id}?groupId=${group.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', border: 'none' }}>
                Open Workspace
            </a>
        </div>
    );
}
