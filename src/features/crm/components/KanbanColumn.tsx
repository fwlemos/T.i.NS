import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils/cn';
import { KanbanCard } from './KanbanCard';
import { OpportunityWithRelations, PipelineStage } from '../types';

interface KanbanColumnProps {
    stage: PipelineStage;
    opportunities: OpportunityWithRelations[];
    onCardClick?: (id: string) => void;
}

export function KanbanColumn({ stage, opportunities, onCardClick }: KanbanColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.id,
        data: { stage },
    });

    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.total_sales_value || 0), 0);
    const currency = opportunities[0]?.currency || 'USD';
    const isNegative = stage.name.toLowerCase() === 'lost';
    const isPositive = stage.name.toLowerCase() === 'won';

    return (
        <div className="flex flex-col h-full min-w-[340px] max-w-[340px] snap-start">
            {/* Clean Rounded Header */}
            <div className={cn(
                "mb-4 p-3 rounded-lg border-l-4 flex flex-col gap-1 transition-colors",
                "bg-gray-50/50 border-gray-200",
                isOver && "bg-gray-100 ring-2 ring-gray-900/5 ring-inset"
            )}
                style={{ borderLeftColor: stage.color }}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide truncate max-w-[200px]" title={stage.name}>
                        {stage.name}
                    </h3>
                    <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">
                        {opportunities.length}
                    </span>
                </div>

                {/* Total Value Summary */}
                {totalValue > 0 && (
                    <div className="text-xs font-medium text-gray-500 mt-1">
                        Total: <span className="text-gray-900">{new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(totalValue)}</span>
                    </div>
                )}
            </div>

            {/* Scrollable Card Area */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 overflow-y-auto px-1 -mx-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent flex flex-col gap-3",
                    isOver && "bg-gray-50/50 rounded-lg"
                )}
            >
                {opportunities.map(opp => (
                    <KanbanCard
                        key={opp.id}
                        opportunity={opp}
                        onClick={() => onCardClick?.(opp.id)}
                    />
                ))}
            </div>
        </div>
    );
}
