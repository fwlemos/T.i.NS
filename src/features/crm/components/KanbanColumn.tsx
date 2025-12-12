
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

    // Calculate total value for the column
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.total_sales_value || 0), 0);
    const currency = opportunities[0]?.currency || 'USD';

    return (
        <div className="flex flex-col h-full w-[300px] shrink-0">
            {/* Column Header - Minimal Design */}
            <div className="flex items-center justify-between mb-4 py-2">
                <div className="flex items-center gap-2.5">
                    {/* Color indicator dot */}
                    <div
                        className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm"
                        style={{ backgroundColor: stage.color || '#6B7280' }}
                    />
                    <h3 className="text-sm font-semibold text-gray-800 tracking-tight">
                        {stage.name}
                    </h3>
                </div>

                {/* Count badge */}
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {opportunities.length}
                </span>
            </div>

            {/* Optional: Total value summary */}
            {totalValue > 0 && (
                <div className="text-xs text-gray-400 mb-3 -mt-2">
                    {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency,
                        maximumFractionDigits: 0
                    }).format(totalValue)}
                </div>
            )}

            {/* Cards Container - Scrollable */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 -mr-1",
                    "scrollbar-thin scrollbar-thumb-gray-200/60 scrollbar-track-transparent",
                    "transition-colors duration-200 rounded-lg",
                    // Drop zone feedback
                    isOver && "bg-gray-50/80"
                )}
            >
                {opportunities.length === 0 ? (
                    <div className={cn(
                        "flex items-center justify-center h-24 rounded-xl border-2 border-dashed",
                        isOver ? "border-gray-300 bg-gray-50" : "border-gray-100"
                    )}>
                        <span className="text-xs text-gray-400">
                            {isOver ? "Drop here" : "No opportunities"}
                        </span>
                    </div>
                ) : (
                    opportunities.map(opp => (
                        <KanbanCard
                            key={opp.id}
                            opportunity={opp}
                            onClick={() => onCardClick?.(opp.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
