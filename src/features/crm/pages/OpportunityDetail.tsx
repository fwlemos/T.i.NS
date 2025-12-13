import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, MoreVertical, Loader2, Calendar, ChevronsDown, ChevronsUp, Timer, Copy, Trash } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { RelatedEntitiesPanel } from '../components/RelatedEntitiesPanel';
import { StageAccordion } from '../components/StageAccordion';
import { MarkLostDialog } from '../components/MarkLostDialog';
import { OpportunitySummary } from '../components/OpportunitySummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useOpportunities } from '../hooks/useOpportunities';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/Command';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';
import { supabase } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils/cn';
import { toast } from 'sonner';

export function OpportunityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useOpportunity, stages, updateStage, updateOpportunity } = useOpportunities();
    const { data: opportunity, isLoading, error } = useOpportunity(id || '');
    const [isLostDialogOpen, setIsLostDialogOpen] = useState(false);
    const [expandedStages, setExpandedStages] = useState<string[]>([]);
    const [isOwnerOpen, setIsOwnerOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data: profiles } = useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            const { data, error } = await supabase.from('profiles').select('*').order('full_name');
            if (error) throw error;
            return data;
        }
    });

    // Initialize open stage when opportunity loads
    React.useEffect(() => {
        if (opportunity?.stage_id && expandedStages.length === 0) {
            setExpandedStages([opportunity.stage_id]);
        }
    }, [opportunity?.stage_id]);

    if (isLoading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500 w-8 h-8" /></div>;
    if (error || !opportunity) return <div className="h-full flex items-center justify-center text-red-500 font-medium">Opportunity not found</div>;

    const daysOpen = Math.abs(differenceInCalendarDays(new Date(), new Date(opportunity.created_at)));
    const daysInStage = opportunity.stage_changed_at
        ? Math.abs(differenceInCalendarDays(new Date(), new Date(opportunity.stage_changed_at)))
        : 0;
    const stageColor = opportunity.stage?.color || '#9ca3af';
    const isLost = opportunity.stage?.name === 'Lost';

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

    const handleDeleteConfirm = async () => {
        if (!opportunity) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('opportunities').delete().eq('id', opportunity.id);
            if (error) throw error;
            toast.success('Opportunity deleted successfully');
            navigate('/crm');
        } catch (error) {
            console.error('Error deleting opportunity:', error);
            toast.error('Failed to delete opportunity');
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleDuplicate = () => {
        toast.info("Duplicate functionality coming soon");
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header - Fixed Height */}
            <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0 sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/crm')} className="text-gray-500 hover:text-gray-900 -ml-2">
                        <ArrowLeft size={20} />
                    </Button>
                    {/* Title & info */}
                    <div className="flex flex-col gap-1">
                        <h1 className="text-xl font-bold text-gray-900 truncate max-w-md leading-tight" title={opportunity.title}>
                            {opportunity.title}
                        </h1>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="rounded-md px-2 py-0.5 text-xs font-medium border-0 ring-1 ring-inset" style={{ color: stageColor, backgroundColor: `${stageColor}10`, boxShadow: `inset 0 0 0 1px ${stageColor}20` }}>
                                {opportunity.stage?.name}
                            </Badge>

                            <div className="h-3 w-px bg-gray-200" />

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar size={12} className="text-gray-400" />
                                <span>
                                    {daysOpen === 0 ? 'Opened today' : daysOpen === 1 ? 'Opened yesterday' : `Opened ${daysOpen} days ago`}
                                </span>
                            </div>

                            <div className="h-3 w-px bg-gray-200" />

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Timer size={12} className="text-gray-400" />
                                <span>
                                    {daysInStage === 0 ? 'Started today in current phase' : `${daysInStage} days in current phase`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Popover open={isOwnerOpen} onOpenChange={(open) => !isLost && setIsOwnerOpen(open)}>
                        <PopoverTrigger asChild>
                            <div className={cn(
                                "flex items-center gap-2 pr-4 border-r border-gray-100 mr-1 p-1 rounded-md transition-colors",
                                isLost ? "cursor-default opacity-70" : "cursor-pointer hover:bg-gray-50"
                            )}>
                                <Avatar className="h-8 w-8 ring-2 ring-white">
                                    <AvatarImage src={opportunity.owner_profile?.avatar_url || undefined} />
                                    <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                                        {opportunity.owner_profile?.full_name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-left">
                                    <span className="text-xs text-gray-500 font-medium">Owner</span>
                                    <span className="text-xs text-gray-900 font-semibold">{opportunity.owner_profile?.full_name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="end">
                            <Command>
                                <CommandInput placeholder="Search owner..." />
                                <CommandList>
                                    <CommandEmpty>No users found.</CommandEmpty>
                                    <CommandGroup>
                                        {profiles?.map((profile: any) => (
                                            <CommandItem
                                                key={profile.id}
                                                value={profile.full_name}
                                                onSelect={async () => {
                                                    await updateOpportunity.mutateAsync({
                                                        id: opportunity.id,
                                                        data: { owner_id: profile.id }
                                                    });
                                                    setIsOwnerOpen(false);
                                                }}
                                            >
                                                <CheckCircle2
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        opportunity.owner_id === profile.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {profile.full_name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setIsLostDialogOpen(true)}
                        disabled={isLost}
                    >
                        <XCircle size={18} className="mr-2" />
                        Lost
                    </Button>
                    <Button
                        onClick={handleAdvanceStage}
                        className="bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                        disabled={isLost}
                    >
                        <CheckCircle2 size={18} className="mr-2" />
                        Advance
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-gray-500">
                                <MoreVertical size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="mr-2 h-4 w-4 text-gray-500" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                        <ActivityTimeline
                            entityId={opportunity.id}
                            entityType="opportunity"
                            createdAt={opportunity.created_at}
                            createdBy={opportunity.owner_id} // Fallback if no specific creator field
                            creatorName={opportunity.owner_profile?.full_name}
                        />
                    </div>
                </div>

                {/* Center: Main Form - Scrollable */}
                <div className="flex-1 overflow-y-auto bg-white">
                    <Tabs defaultValue={opportunity.stage?.name === 'Won' || opportunity.stage?.name === 'Lost' ? 'summary' : 'stages'} className="h-full flex flex-col">
                        <div className="px-8 pt-4">
                            <TabsList className="grid w-[400px] grid-cols-2">
                                <TabsTrigger value="stages">Stage Details</TabsTrigger>
                                <TabsTrigger value="summary">Summary</TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 pt-6 min-h-0">
                            <TabsContent value="stages" className="mt-0 space-y-8 h-full m-0 border-0 p-0 data-[state=inactive]:hidden text-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Stage Details</h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            const allIds = stages.map(s => s.id);
                                            const areAllExpanded = allIds.every(id => expandedStages.includes(id));
                                            setExpandedStages(areAllExpanded ? [] : allIds);
                                        }}
                                        className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                        title={stages.every(s => expandedStages.includes(s.id)) ? "Collapse All" : "Expand All"}
                                    >
                                        {stages.every(s => expandedStages.includes(s.id)) ? (
                                            <ChevronsUp size={16} />
                                        ) : (
                                            <ChevronsDown size={16} />
                                        )}
                                    </Button>
                                </div>

                                <StageAccordion
                                    opportunity={opportunity}
                                    stages={stages}
                                    expandedStages={expandedStages}
                                    onToggle={(id) => {
                                        setExpandedStages(prev =>
                                            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
                                        );
                                    }}
                                    readOnly={opportunity.stage?.name === 'Lost'}
                                />
                            </TabsContent>

                            <TabsContent value="summary" className="mt-0 m-0 border-0 p-0 text-slate-800 h-full data-[state=inactive]:hidden">
                                <OpportunitySummary opportunity={opportunity} />
                            </TabsContent>
                        </div>
                    </Tabs>
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

            <DeleteAlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Opportunity"
                description="Are you sure you want to delete this opportunity? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />
        </div>
    );
}
