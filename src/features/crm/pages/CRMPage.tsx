import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { CRMHeader } from '../components/CRMHeader';
import { KanbanBoard } from '../components/KanbanBoard';
import { OpportunityList } from '../components/OpportunityList';
import { NewOpportunityDrawer } from '../components/NewOpportunityDrawer';
import { useOpportunities } from '../hooks/useOpportunities';
import { useCRMOptions } from '../hooks/useCRMOptions';

export function CRMPage() {
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const { opportunities, stages, isLoading, updateStage, createOpportunity } = useOpportunities();
    const { leadOrigins } = useCRMOptions();

    const handleCardClick = (id: string) => {
        navigate(`/crm/opportunity/${id}`);
    };

    const handleStageChange = async (opportunityId: string, newStageId: string) => {
        await updateStage.mutateAsync({ id: opportunityId, stage_id: newStageId });
    };

    const handleCreateOpportunity = async (data: {
        title: string;
        contact_id: string;
        lead_origin_id: string;
        notes?: string;
        product_ids: string[];
    }) => {
        const firstStage = stages[0];
        if (!firstStage) {
            throw new Error('No pipeline stages configured');
        }

        await createOpportunity.mutateAsync({
            ...data,
            stage_id: firstStage.id,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header section - auto height */}
            <div className="shrink-0 mb-6">
                <CRMHeader
                    view={view}
                    onViewChange={setView}
                    onNewOpportunity={() => setIsDrawerOpen(true)}
                />
            </div>

            {/* Main content - fills remaining space */}
            <div className="flex-1 min-h-0">
                {view === 'kanban' ? (
                    <KanbanBoard
                        stages={stages}
                        opportunities={opportunities}
                        onStageChange={handleStageChange}
                        onCardClick={handleCardClick}
                    />
                ) : (
                    <OpportunityList
                        data={opportunities}
                        onRowClick={handleCardClick}
                    />
                )}
            </div>

            {/* Drawer */}
            <NewOpportunityDrawer
                open={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                onSubmit={handleCreateOpportunity}
                isLoading={createOpportunity.isPending}
                leadOrigins={leadOrigins}
            />
        </div>
    );
}
