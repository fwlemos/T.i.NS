import { useAuditLog, AuditLogWithUser } from '@/features/database/hooks/useAuditLog';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Plus, Trash, FileText } from 'lucide-react';
// import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityTimelineProps {
    entityId: string;
    entityType: string;
    createdAt?: string;
    createdBy?: string | null;
}

export function ActivityTimeline({ entityId, entityType, createdAt, createdBy }: ActivityTimelineProps) {
    const { logs, isLoading } = useAuditLog(entityType, entityId);

    if (isLoading) {
        return <div className="p-4 text-sm text-gray-500">Loading timeline...</div>;
    }

    // Merge Audit Logs with Initial Creation Event if needed
    // If logs don't include a 'CREATE' action, append a fake log for creation based on entity metadata
    const hasCreateLog = logs.some(l => l.action === 'CREATE');
    const displayLogs = [...logs];

    if (!hasCreateLog && createdAt) {
        displayLogs.push({
            id: 'initial-create',
            entity_type: entityType,
            entity_id: entityId,
            action: 'CREATE',
            changes: {} as any,
            user_id: createdBy || null,
            created_at: createdAt,
            user: createdBy ? { full_name: 'Unknown User', avatar_url: null } : undefined // We might fetch user name if we had createdBy ID resolving, assuming generated logs handles it.
            // For now, if we pass createdBy ID, we don't have the name unless we fetch it. 
            // Simplification: Display "Record Created" with date.
        });
    }

    // Re-sort just in case
    displayLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (displayLogs.length === 0) {
        return <div className="p-4 text-sm text-gray-500">No activity recorded for this {entityType}.</div>;
    }

    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            <h3 className="font-semibold text-lg px-2">Timeline</h3>

            <div className="flex-1 pr-4 overflow-y-auto">
                <div className="space-y-6">
                    {displayLogs.map((log) => (
                        <TimelineItem key={log.id} log={log} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ log }: { log: AuditLogWithUser }) {
    const actionIcon = () => {
        switch (log.action) {
            case 'CREATE': return <Plus className="h-3 w-3 text-white" />;
            case 'UPDATE': return <Edit className="h-3 w-3 text-white" />;
            case 'DELETE': return <Trash className="h-3 w-3 text-white" />;
            default: return <FileText className="h-3 w-3 text-white" />;
        }
    };

    const actionColor = () => {
        switch (log.action) {
            case 'CREATE': return 'bg-green-500';
            case 'UPDATE': return 'bg-blue-500';
            case 'DELETE': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    const formatChanges = (changes: any) => {
        if (!changes || Object.keys(changes).length === 0) return null;

        return (
            <div className="mt-2 text-xs bg-gray-50 dark:bg-muted p-2 rounded border space-y-1">
                {Object.entries(changes).map(([key, val]: [string, any]) => (
                    <div key={key} className="flex flex-col sm:flex-row gap-1">
                        <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>
                        <div className="flex gap-1 text-gray-600 dark:text-gray-400">
                            <span className="line-through opacity-70">{formatVal(val?.old)}</span>
                            <span>→</span>
                            <span className="font-medium text-foreground">{formatVal(val?.new)}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const formatVal = (v: any) => {
        if (v === null || v === undefined) return 'Empty';
        if (typeof v === 'boolean') return v ? 'Yes' : 'No';
        if (typeof v === 'object') return JSON.stringify(v);
        return String(v);
    };

    return (
        <div className="border-l-2 border-gray-200 ml-2 pl-4 pb-1 relative">
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${actionColor()} ring-4 ring-white dark:ring-gray-950 mb-1 flex items-center justify-center shadow-sm`}>
                {actionIcon()}
            </div>
            <div className="flex flex-col">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">
                        {log.action === 'CREATE' ? 'Created' : log.action === 'UPDATE' ? 'Updated' : log.action}
                        {log.user && <span className="font-normal text-gray-500"> by {log.user.full_name}</span>}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                </div>

                {formatChanges(log.changes)}
            </div>
        </div>
    );
}
