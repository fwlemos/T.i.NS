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
        const ignoredKeys = ['updated_at', 'created_at', 'profiles', 'companies', 'products', 'type', 'id'];

        allKeys.forEach(key => {
            if (ignoredKeys.includes(key)) return;

            const oldVal = original[key];
            const newVal = updated[key];

            // Handle undefined/null as equal
            if ((oldVal === null || oldVal === undefined) && (newVal === null || newVal === undefined)) return;

            // Handle empty strings and nulls interchangeably for simple fields (optional, depending on strictness)
            // if ((oldVal === '' || oldVal === null) && (newVal === '' || newVal === null)) return;

            // Deep comparison for objects
            if (typeof oldVal === 'object' && oldVal !== null && typeof newVal === 'object' && newVal !== null) {
                // Remove empty keys from objects for comparison to avoid {a: ''} vs {} issues
                const cleanOld = JSON.parse(JSON.stringify(oldVal));
                const cleanNew = JSON.parse(JSON.stringify(newVal));

                if (JSON.stringify(cleanOld) === JSON.stringify(cleanNew)) return;

                // Special handling for Address objects where empty strings might be considered "empty"
                const isEmpty = (obj: any) => Object.values(obj).every(x => x === '' || x === null || x === undefined);
                if (isEmpty(cleanOld) && isEmpty(cleanNew)) return;
            }

            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                // One last check: if both are falsy (e.g. mismatching null vs undefined vs empty string), 
                // we might want to skip if we want "loose" diffs. 
                // But for now, strict diff except for objects.
                diff[key] = { old: oldVal, new: newVal };
            }
        });

        return diff;
    }
};
