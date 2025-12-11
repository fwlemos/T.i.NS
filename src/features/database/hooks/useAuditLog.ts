import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuditLogWithUser extends AuditLog {
    user?: {
        full_name: string;
        avatar_url: string | null;
    };
}

export function useAuditLog(entityType: string, entityId: string) {
    const [logs, setLogs] = useState<AuditLogWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchLogs() {
            if (!entityId || !entityType) return;

            setIsLoading(true);
            try {
                // Fetch logs
                const { data: logData, error: logError } = await supabase
                    .from('audit_logs')
                    .select('*')
                    .eq('entity_type', entityType)
                    .eq('entity_id', entityId)
                    .order('created_at', { ascending: false });

                if (logError) throw logError;

                if (!logData || logData.length === 0) {
                    setLogs([]);
                    return;
                }

                // Collect User IDs to fetch profiles
                // Since we can't always join auth.users directly or easily if no FK to public.profiles is explicit in PostgREST for this table 
                // (unless we added one), manual fetch is safe.
                const userIds = Array.from(new Set(logData.map(l => l.user_id).filter(Boolean))) as string[];

                let profilesMap: Record<string, Profile> = {};

                if (userIds.length > 0) {
                    const { data: profiles, error: profilesError } = await supabase
                        .from('profiles')
                        .select('*')
                        .in('id', userIds);

                    if (!profilesError && profiles) {
                        profiles.forEach(p => {
                            profilesMap[p.id] = p;
                        });
                    }
                }

                // Combine
                const combinedData: AuditLogWithUser[] = logData.map(log => ({
                    ...log,
                    user: log.user_id && profilesMap[log.user_id] ? {
                        full_name: profilesMap[log.user_id].full_name,
                        avatar_url: profilesMap[log.user_id].avatar_url
                    } : undefined
                }));

                setLogs(combinedData);
            } catch (err: any) {
                console.error('Error fetching audit logs:', err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLogs();
    }, [entityType, entityId]);

    return { logs, isLoading, error };
}
