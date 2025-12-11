import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Calendar, Clock, Building2, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils/cn';
import { OpportunityWithRelations } from '../types';

interface KanbanCardProps {
    opportunity: OpportunityWithRelations;
    onClick?: () => void;
}

export function KanbanCard({ opportunity, onClick }: KanbanCardProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: opportunity.id,
        data: opportunity,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const daysOpen = Math.floor((new Date().getTime() - new Date(opportunity.created_at).getTime()) / (1000 * 3600 * 24));

    // Fallback Mock values
    const salesValue = opportunity.total_sales_value || 0;
    const currency = opportunity.currency || 'USD';
    const entityName = opportunity.company?.name || opportunity.contact?.name || 'Unknown Client';
    const isCompany = !!opportunity.company;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="group outline-none"
        >
            <div
                onClick={onClick}
                className={cn(
                    "relative bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-200",
                    "hover:shadow-md hover:border-gray-300 cursor-grab active:cursor-grabbing",
                    isDragging && "opacity-0" // We hide the original while dragging the overlay
                )}
            >
                {/* Header: Title & Client */}
                <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-emerald-600 transition-colors">
                        {opportunity.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        {isCompany ? <Building2 size={12} /> : <User size={12} />}
                        <span className="truncate max-w-[200px]">{entityName}</span>
                    </div>
                </div>

                {/* Value Divider */}
                <div className="w-full h-px bg-gray-50 mb-3" />

                {/* Footer: Value & Meta */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-900 tracking-tight">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(salesValue)}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Clock size={12} className={daysOpen > 30 ? "text-amber-500" : ""} />
                                <span className={daysOpen > 30 ? "text-amber-600 font-medium" : ""}>{daysOpen} days</span>
                            </div>
                        </div>
                    </div>

                    {/* Owner Avatar */}
                    <div className="flex -space-x-2">
                        <Avatar className="h-7 w-7 border-2 border-white ring-1 ring-gray-100">
                            <AvatarImage src={opportunity.owner_profile?.avatar_url || undefined} />
                            <AvatarFallback className="text-[10px] bg-gray-100 font-semibold text-gray-600">
                                {opportunity.owner_profile?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </div>
    );
}
