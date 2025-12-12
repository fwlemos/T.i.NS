
import { useDraggable } from '@dnd-kit/core';
import { Building2, User, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils/cn';
import { OpportunityWithRelations } from '../types';

interface KanbanCardProps {
    opportunity: OpportunityWithRelations;
    onClick?: () => void;
    isDragOverlay?: boolean;
}

export function KanbanCard({ opportunity, onClick, isDragOverlay = false }: KanbanCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: opportunity.id,
        data: opportunity,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    // Calculate days open
    const daysOpen = Math.floor(
        (new Date().getTime() - new Date(opportunity.created_at).getTime()) / (1000 * 3600 * 24)
    );

    // Get display values
    const salesValue = opportunity.total_sales_value || 0;
    const currency = opportunity.currency || 'USD';
    const entityName = opportunity.company?.name || opportunity.contact?.name || 'Unknown';
    const isCompany = !!opportunity.company;
    const ownerInitial = opportunity.owner_profile?.full_name?.charAt(0) || 'U';

    // Format currency
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
    }).format(salesValue);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="outline-none"
        >
            <div
                onClick={onClick}
                className={cn(
                    // Base styles
                    "bg-white rounded-xl p-4",
                    "border border-gray-100",
                    "shadow-sm",
                    "transition-all duration-200 ease-out",
                    // Interactive states
                    "hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5",
                    "cursor-grab active:cursor-grabbing",
                    // Drag states
                    isDragging && "opacity-0",
                    isDragOverlay && "shadow-xl ring-2 ring-gray-900/5"
                )}
            >
                {/* Title */}
                <h4 className="font-medium text-gray-900 text-sm leading-snug mb-2 line-clamp-2">
                    {opportunity.title}
                </h4>

                {/* Client info */}
                <div className="flex items-center gap-1.5 mb-3">
                    {isCompany ? (
                        <Building2 size={12} className="text-gray-400 shrink-0" />
                    ) : (
                        <User size={12} className="text-gray-400 shrink-0" />
                    )}
                    <span className="text-xs text-gray-500 truncate">{entityName}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    {/* Value and days */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 tracking-tight">
                            {formattedValue}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Clock size={10} className={cn(
                                "text-gray-300",
                                daysOpen > 30 && "text-amber-400"
                            )} />
                            <span className={cn(
                                "text-[10px] text-gray-400",
                                daysOpen > 30 && "text-amber-500 font-medium"
                            )}>
                                {daysOpen}d
                            </span>
                        </div>
                    </div>

                    {/* Owner avatar */}
                    <Avatar className="h-6 w-6 border border-gray-100">
                        <AvatarImage src={opportunity.owner_profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-[10px] bg-gray-50 text-gray-600 font-medium">
                            {ownerInitial}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    );
}
