import { ActivityTimeline as SharedActivityTimeline } from '@/features/database/components/widgets/ActivityTimeline';

interface ActivityTimelineProps {
    entityId?: string;
    entityType?: string; // e.g. 'opportunity'
    createdAt?: string;
    createdBy?: string | null;
    creatorName?: string | null;
}

export function ActivityTimeline({ entityId, entityType = 'opportunity', createdAt, createdBy, creatorName }: ActivityTimelineProps) {
    if (!entityId) return <div className="text-sm text-gray-400 p-4">No entity ID provided for timeline.</div>;

    return (
        <SharedActivityTimeline
            entityId={entityId}
            entityType={entityType}
            createdAt={createdAt}
            createdBy={createdBy}
            creatorName={creatorName}
        />
    );
}
