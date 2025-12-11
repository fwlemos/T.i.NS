import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

type AuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];
type EntityType = 'company' | 'manufacturer' | 'contact' | 'product';
type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

export const AuditService = {
    /**
     * Log a change to the audit_logs table.
     */
    logChange: async (
        entityType: EntityType | string,
        entityId: string,
        action: ActionType,
        changes: Record<string, any>,
        userId?: string
    ) => {
        try {
            // If userId is not provided, try to get current user
            let actorId = userId;
            if (!actorId) {
                const { data: { session } } = await supabase.auth.getSession();
                actorId = session?.user?.id;
            }

            if (!actorId) {
                console.warn('AuditService: No user ID found for logging');
                return;
            }

            const logEntry: AuditLogInsert = {
                entity_type: entityType,
                entity_id: entityId,
                action: action,
                changes: changes,
                user_id: actorId,
            };

            const { error } = await supabase
                .from('audit_logs')
                .insert(logEntry);

            if (error) {
                console.error('AuditService: Failed to insert log', error);
            }
        } catch (err) {
            console.error('AuditService: Unexpected error', err);
        }
    },

    /**
     * Calculate differences between original and updated objects.
     * Returns a format suitable for the 'changes' column: { field: { old: val, new: val } }
     */
    calculateDiff: (original: Record<string, any>, updated: Record<string, any>): Record<string, { old: any, new: any }> => {
        const diff: Record<string, { old: any, new: any }> = {};

        const allKeys = new Set([...Object.keys(original), ...Object.keys(updated)]);

        allKeys.forEach(key => {
            const oldVal = original[key];
            const newVal = updated[key];

            // Skip if both are undefined/null or equal
            // Simple strict equality for primitives. 
            // For objects/arrays, we might need deep comparison, but for this level let's stick to shallow or specific fields.
            // We ignore 'updated_at' usually.
            if (key === 'updated_at' || key === 'created_at') return;

            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                diff[key] = { old: oldVal, new: newVal };
            }
        });

        return diff;
    }
};
