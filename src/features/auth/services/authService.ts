import { supabase } from '@/lib/supabase/client';

export const authService = {
    async signInWithGoogle() {
        return supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                    hd: 'tennessine.com.br', // Restricts to this Google Workspace domain
                },
            },
        });
    },

    async signInWithPassword(email: string, password: string) {
        return supabase.auth.signInWithPassword({
            email,
            password,
        });
    },

    async signOut() {
        return supabase.auth.signOut();
    }
};
