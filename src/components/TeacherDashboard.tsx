'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import AppLayout from './AppLayout';
import { Project, getProjectsByTeacher, saveProject, genId, getGroupsByProject, Group, getMembersByGroup, getTasksByGroup, getContributionScore } from '@/lib/store';

export default function TeacherDashboard() {
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        if (user?.id) setProjects(getProjectsByTeacher(user.id));
    }, [user]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle || !user) return;
        const p: Project = {
            id: genId(),
            teacherId: user.id,
            title: newTitle,
            subject: newSubject,
            description: '',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            reviewOpen: false,
            createdAt: new Date().toISOString()
        };
        saveProject(p);
        setProjects(getProjectsByTeacher(user.id));
        setIsCreating(false);
        setNewTitle('');
        setNewSubject('');
    };

    return (
        <AppLayout title="Teacher Dashboard" subtitle="Manage your classes and group projects.">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Your Projects</h2>
                <button onClick={() => setIsCreating(true)} style={{ padding: '8px 16px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>+ New Project</button>
            </div>

            {isCreating && (
                <form onSubmit={handleCreate} style={{ background: 'var(--surface2)', padding: 24, borderRadius: 12, marginBottom: 24, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Project Title</label>
                            <input className="input" autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Final Web App" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: 6 }}>Subject / Course</label>
                            <input className="input" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="e.g. CS301" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setIsCreating(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                        <button type="submit" style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', borderRadius: 8, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Create</button>
                    </div>
                </form>
            )}

            {projects.length === 0 && !isCreating ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--surface)', borderRadius: 16, border: '1px dashed var(--border)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📁</div>
                    <h3 style={{ fontWeight: 600, marginBottom: 8 }}>No projects yet</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create your first project to start tracking group work.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                    {projects.map(p => (
                        <ProjectCard key={p.id} project={p} />
                    ))}
                </div>
            )}
        </AppLayout>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        setGroups(getGroupsByProject(project.id));
    }, [project.id]);

    return (
        <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 600, marginBottom: 4 }}>{project.subject || 'No Subject'}</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{project.title}</h3>
                </div>
                {project.reviewOpen ? (
                    <span className="badge badge-orange">Reviews Open</span>
                ) : (
                    <span className="badge badge-blue">Active</span>
                )}
            </div>

            <div style={{ flex: 1, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', marginBottom: 8 }}>
                    <span>Groups: {groups.length}</span>
                    <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
            </div>

            <a href={`/projects/${project.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px', background: 'var(--surface2)', color: '#fff', borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--border)', transition: 'background 0.2s' }}>
                Manage Project
            </a>
        </div>
    );
}
