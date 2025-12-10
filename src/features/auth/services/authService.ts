import { supabase } from '@/lib/supabase/client';

export const authService = {
    async signInWithGoogle() {
        return supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
                redirectTo: `${window.location.origin}/`,
            },
        });
    },

    async signOut() {
        return supabase.auth.signOut();
    }
};
