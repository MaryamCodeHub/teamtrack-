'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, getSession, setSession, getUserByEmail, saveUser, genId } from '@/lib/store';

interface AuthCtx {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    signup: (name: string, email: string, password: string, role: 'teacher' | 'student') => Promise<string | null>;
    logout: () => void;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(getSession());
        setLoading(false);
    }, []);

    const login = async (email: string, _password: string): Promise<string | null> => {
        const found = getUserByEmail(email);
        if (!found) return 'No account found with this email.';
        setSession(found);
        setUser(found);
        return null;
    };

    const signup = async (name: string, email: string, _password: string, role: 'teacher' | 'student'): Promise<string | null> => {
        if (getUserByEmail(email)) return 'An account with this email already exists.';
        const newUser: User = { id: genId(), name, email: email.toLowerCase(), role };
        saveUser(newUser);
        setSession(newUser);
        setUser(newUser);
        return null;
    };

    const logout = () => { setSession(null); setUser(null); };

    return <Ctx.Provider value={{ user, loading, login, signup, logout }}>{children}</Ctx.Provider>;
}
