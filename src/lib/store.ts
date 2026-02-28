// ============================================================
// TeamTrack — LocalStorage Store (no backend needed)
// ============================================================

export type Role = 'teacher' | 'student';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Project {
    id: string;
    teacherId: string;
    title: string;
    description: string;
    subject: string;
    deadline: string;
    reviewOpen: boolean;
    createdAt: string;
}

export interface Group {
    id: string;
    projectId: string;
    name: string;
}

export interface GroupMember {
    id: string;
    groupId: string;
    studentId: string;
}

export type TaskCategory = 'Research' | 'Coding' | 'Design' | 'Writing' | 'Presentation' | 'Other';

export interface Task {
    id: string;
    groupId: string;
    studentId: string;
    title: string;
    description: string;
    category: TaskCategory;
    hours: number;
    loggedAt: string;
}

export interface PeerReview {
    id: string;
    projectId: string;
    groupId: string;
    reviewerId: string;
    revieweeId: string;
    contributionScore: number;
    qualityScore: number;
    communicationScore: number;
    comment: string;
    submittedAt: string;
}

export interface Grade {
    id: string;
    projectId: string;
    studentId: string;
    baseGrade: number;
    adjustedGrade: number;
    adjustmentNote: string;
    gradedAt: string;
}

// ---- Helpers ----
export const genId = () => Math.random().toString(36).slice(2, 10);

function get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}
function set<T>(key: string, data: T[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
}

// ---- Users ----
export const getUsers = (): User[] => get<User>('tt_users');
export const saveUser = (u: User) => { const all = getUsers().filter(x => x.id !== u.id); set('tt_users', [...all, u]); };
export const getUserById = (id: string) => getUsers().find(u => u.id === id);
export const getUserByEmail = (email: string) => getUsers().find(u => u.email === email.toLowerCase());

// ---- Auth session ----
export const getSession = (): User | null => {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem('tt_session') || 'null'); } catch { return null; }
};
export const setSession = (u: User | null) => {
    if (typeof window === 'undefined') return;
    if (u) localStorage.setItem('tt_session', JSON.stringify(u));
    else localStorage.removeItem('tt_session');
};

// ---- Projects ----
export const getProjects = (): Project[] => get<Project>('tt_projects');
export const saveProject = (p: Project) => { const all = getProjects().filter(x => x.id !== p.id); set('tt_projects', [...all, p]); };
export const getProjectById = (id: string) => getProjects().find(p => p.id === id);
export const getProjectsByTeacher = (tId: string) => getProjects().filter(p => p.teacherId === tId);

// ---- Groups ----
export const getGroups = (): Group[] => get<Group>('tt_groups');
export const saveGroup = (g: Group) => { const all = getGroups().filter(x => x.id !== g.id); set('tt_groups', [...all, g]); };
export const getGroupsByProject = (pId: string) => getGroups().filter(g => g.projectId === pId);
export const getGroupById = (id: string) => getGroups().find(g => g.id === id);

// ---- Group Members ----
export const getGroupMembers = (): GroupMember[] => get<GroupMember>('tt_members');
export const saveGroupMember = (m: GroupMember) => { const all = getGroupMembers().filter(x => x.id !== m.id); set('tt_members', [...all, m]); };
export const getMembersByGroup = (gId: string) => getGroupMembers().filter(m => m.groupId === gId);
export const getGroupsForStudent = (sId: string) => getGroupMembers().filter(m => m.studentId === sId).map(m => m.groupId);
export const removeGroupMember = (id: string) => { set('tt_members', getGroupMembers().filter(m => m.id !== id)); };

// ---- Tasks ----
export const getTasks = (): Task[] => get<Task>('tt_tasks');
export const saveTask = (t: Task) => { const all = getTasks().filter(x => x.id !== t.id); set('tt_tasks', [...all, t]); };
export const getTasksByGroup = (gId: string) => getTasks().filter(t => t.groupId === gId);
export const getTasksByStudent = (sId: string, gId: string) => getTasks().filter(t => t.studentId === sId && t.groupId === gId);

// ---- Peer Reviews ----
export const getPeerReviews = (): PeerReview[] => get<PeerReview>('tt_reviews');
export const savePeerReview = (r: PeerReview) => { const all = getPeerReviews().filter(x => x.id !== r.id); set('tt_reviews', [...all, r]); };
export const getReviewsByProject = (pId: string) => getPeerReviews().filter(r => r.projectId === pId);
export const hasReviewed = (pId: string, reviewerId: string, revieweeId: string) =>
    getPeerReviews().some(r => r.projectId === pId && r.reviewerId === reviewerId && r.revieweeId === revieweeId);

// ---- Grades ----
export const getGrades = (): Grade[] => get<Grade>('tt_grades');
export const saveGrade = (g: Grade) => { const all = getGrades().filter(x => x.id !== g.id); set('tt_grades', [...all, g]); };
export const getGradesByProject = (pId: string) => getGrades().filter(g => g.projectId === pId);
export const getGradeForStudent = (pId: string, sId: string) => getGrades().find(g => g.projectId === pId && g.studentId === sId);

// ---- Contribution score (0-100) ----
export const getContributionScore = (studentId: string, groupId: string): number => {
    const tasks = getTasksByStudent(studentId, groupId);
    const totalHours = tasks.reduce((s, t) => s + (t.hours || 1), 0);
    const allTasks = getTasksByGroup(groupId);
    const groupTotal = allTasks.reduce((s, t) => s + (t.hours || 1), 0);
    if (groupTotal === 0) return 0;
    return Math.round((totalHours / groupTotal) * 100);
};
