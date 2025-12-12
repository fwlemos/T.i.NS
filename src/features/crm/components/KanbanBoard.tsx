import { useMemo, useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { OpportunityWithRelations, PipelineStage } from '../types';

interface KanbanBoardProps {
    stages: PipelineStage[];
    opportunities: OpportunityWithRelations[];
    onStageChange: (opportunityId: string, newStageId: string) => void;
    onCardClick?: (id: string) => void;
}

export function KanbanBoard({ stages, opportunities, onStageChange, onCardClick }: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Group opportunities by stage
    const opportunitiesByStage = useMemo(() => {
        const grouped: Record<string, OpportunityWithRelations[]> = {};
        stages.forEach(stage => {
            grouped[stage.id] = [];
        });
        opportunities.forEach(opp => {
            const stageId = opp.stage_id || '';
            if (grouped[stageId]) {
                grouped[stageId].push(opp);
            }
        });
        return grouped;
    }, [stages, opportunities]);

    // Find the active opportunity for drag overlay
    const activeOpportunity = useMemo(() => {
        return opportunities.find(opp => opp.id === activeId);
    }, [activeId, opportunities]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const newStageId = over.id as string;
            if (stages.some(s => s.id === newStageId)) {
                onStageChange(active.id as string, newStageId);
            }
        }
        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            {/* 
                Horizontal scroll container
                - h-full: takes full height from parent
                - overflow-x-auto: horizontal scroll when columns exceed width
                - overflow-y-hidden: prevent vertical scrollbar at this level
                - gap-4: 16px between columns
                - pb-4: bottom padding for scrollbar space
                - No negative margins!
            */}
            <div className="flex h-full gap-4 overflow-x-auto overflow-y-hidden pb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {stages.map(stage => (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        opportunities={opportunitiesByStage[stage.id] || []}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>

            {/* Drag Overlay - rendered in portal for proper z-index */}
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {activeOpportunity ? (
                        <div className="w-[300px] rotate-2 opacity-95 cursor-grabbing">
                            <KanbanCard opportunity={activeOpportunity} isDragOverlay />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
