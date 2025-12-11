import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MoreVertical, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { RelatedEntitiesPanel } from '../components/RelatedEntitiesPanel';
import { StageAccordion } from '../components/StageAccordion';
import { MarkLostDialog } from '../components/MarkLostDialog';
import { useOpportunities } from '../hooks/useOpportunities';

export function OpportunityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useOpportunity, stages, updateStage, updateOpportunity } = useOpportunities();
    const { data: opportunity, isLoading, error } = useOpportunity(id || '');
    const [isLostDialogOpen, setIsLostDialogOpen] = useState(false);

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>;
    if (error || !opportunity) return <div className="h-full flex items-center justify-center text-red-500 font-medium">Opportunity not found</div>;

    const daysOpen = Math.floor((Date.now() - new Date(opportunity.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const stageColor = opportunity.stage?.color || '#9ca3af';

    const handleAdvanceStage = async () => {
        const currentStageIdx = stages.findIndex(s => s.id === opportunity.stage_id);
        if (currentStageIdx === -1 || currentStageIdx === stages.length - 1) return;
        const nextStage = stages[currentStageIdx + 1];
        await updateStage.mutateAsync({ id: opportunity.id, stage_id: nextStage.id });
    };

    const handleMarkLost = async (reasonId: string) => {
        const lostStage = stages.find(s => s.name === 'Lost');
        if (!lostStage) return;
        await updateOpportunity.mutateAsync({
            id: opportunity.id,
            data: { stage_id: lostStage.id, lost_reason_id: reasonId, lost_at: new Date().toISOString() }
        });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header - Fixed Height */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/crm')} className="text-gray-500 hover:text-gray-900 -ml-2">
                        <ArrowLeft size={20} />
                    </Button>
                    {/* Title & Stage */}
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900 truncate max-w-md" title={opportunity.title}>
                            {opportunity.title}
                        </h1>
                        <Badge variant="outline" style={{ borderColor: stageColor, color: stageColor, backgroundColor: `${stageColor}15` }}>
                            {opportunity.stage?.name}
                        </Badge>
                        <div className="h-4 w-px bg-gray-200 mx-1" />
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{daysOpen} days</span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 pr-4 border-r border-gray-100 mr-1">
                        <Avatar className="h-8 w-8 ring-2 ring-white">
                            <AvatarImage src={opportunity.owner_profile?.avatar_url || undefined} />
                            <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                                {opportunity.owner_profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Owner</span>
                            <span className="text-xs text-gray-900 font-semibold">{opportunity.owner_profile?.full_name}</span>
                        </div>
                    </div>

                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setIsLostDialogOpen(true)}>
                        <XCircle size={18} className="mr-2" />
                        Lost
                    </Button>
                    <Button onClick={handleAdvanceStage} className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm">
                        <CheckCircle2 size={18} className="mr-2" />
                        Advance
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                        <MoreVertical size={18} />
                    </Button>
                </div>
            </div>

            {/* 3-Column Layout Container */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Timeline - Sticky/Scrollable independent */}
                <div className="w-[300px] border-r border-gray-200 bg-gray-50/50 flex flex-col overflow-hidden shrink-0 hidden xl:flex">
                    <div className="p-4 border-b border-gray-200 font-semibold text-gray-900 text-sm bg-white/50 backdrop-blur">
                        Activity & History
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ActivityTimeline />
                    </div>
                </div>

                {/* Center: Main Form - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <div className="max-w-3xl mx-auto p-8 space-y-8 min-h-full">
                        <StageAccordion opportunity={opportunity} stages={stages} />
                    </div>
                </div>

                {/* Right: Related - Sticky/Scrollable independent */}
                <div className="w-[320px] border-l border-gray-200 bg-gray-50/50 flex flex-col overflow-hidden shrink-0 hidden lg:flex">
                    <div className="p-4 border-b border-gray-200 font-semibold text-gray-900 text-sm bg-white/50 backdrop-blur">
                        Related Entities
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <RelatedEntitiesPanel opportunity={opportunity} />
                    </div>
                </div>
            </div>

            <MarkLostDialog
                open={isLostDialogOpen}
                onOpenChange={setIsLostDialogOpen}
                onConfirm={handleMarkLost}
                isLoading={isLoading}
            />
        </div>
    );
}
