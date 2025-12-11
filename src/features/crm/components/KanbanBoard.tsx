import React, { useMemo } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
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
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevent accidental drags
            },
        })
    );

    const opportunitiesByStage = useMemo(() => {
        const acc: Record<string, OpportunityWithRelations[]> = {};
        stages.forEach(stage => {
            acc[stage.id] = [];
        });
        opportunities.forEach(opp => {
            if (acc[opp.stage_id || '']) {
                acc[opp.stage_id || ''].push(opp);
            }
        });
        return acc;
    }, [stages, opportunities]);

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
            // Basic validation
            if (stages.some(s => s.id === newStageId)) {
                onStageChange(active.id as string, newStageId);
            }
        }
        setActiveId(null);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Horizontal Scroll Container */}
            <div className="flex h-full gap-6 overflow-x-auto pb-4 px-1 snap-x">
                {stages.map(stage => (
                    <KanbanColumn
                        key={stage.id}
                        stage={stage}
                        opportunities={opportunitiesByStage[stage.id] || []}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>

            {/* Drag Overlay Portal */}
            {createPortal(
                <DragOverlay>
                    {activeOpportunity ? (
                        <div className="w-[340px] opacity-90 rotate-2 cursor-grabbing">
                            <KanbanCard opportunity={activeOpportunity} />
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
