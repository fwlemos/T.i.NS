import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { OpportunityWithRelations } from '../types';

interface OpportunityListProps {
    data: OpportunityWithRelations[];
    onRowClick?: (id: string) => void;
}

export function OpportunityList({ data, onRowClick }: OpportunityListProps) {
    const columns: ColumnDef<OpportunityWithRelations>[] = [
        // Title
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="pl-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900"
                    >
                        Title
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex flex-col max-w-[200px]">
                    <span className="font-semibold text-gray-900 truncate" title={row.getValue('title')}>
                        {row.getValue('title')}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                        {row.original.lead_origin?.name || 'Unknown Origin'}
                    </span>
                </div>
            ),
        },
        // Company / Contact
        {
            id: 'entity',
            header: () => <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Client</div>,
            cell: ({ row }) => {
                const companyName = row.original.company?.name;
                const contactName = row.original.contact?.name;
                return (
                    <div className="flex flex-col">
                        {companyName ? (
                            <>
                                <span className="font-medium text-gray-900">{companyName}</span>
                                <span className="text-xs text-gray-500">{contactName}</span>
                            </>
                        ) : (
                            <span className="font-medium text-gray-900">{contactName || '-'}</span>
                        )}
                    </div>
                );
            },
        },
        // Stage
        {
            accessorKey: 'stage.name',
            header: () => <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stage</div>,
            cell: ({ row }) => {
                const color = row.original.stage?.color || '#9ca3af';
                return (
                    <Badge
                        variant="outline"
                        style={{ borderColor: color, color: color, backgroundColor: `${color}08` }}
                        className="font-medium whitespace-nowrap"
                    >
                        {row.original.stage?.name}
                    </Badge>
                );
            },
        },
        // Values (Net / Sales)
        {
            accessorKey: 'total_sales_value',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="pl-0 hover:bg-transparent text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900"
                >
                    Value
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
            ),
            cell: ({ row }) => {
                const sales = row.original.total_sales_value || 0;
                const net = row.original.total_net_value || 0;
                const currency = row.original.currency || 'USD';

                return (
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-gray-900">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(sales)}
                        </span>
                        {net > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(net)}
                            </span>
                        )}
                    </div>
                );
            },
        },
        // Days Open
        {
            id: 'timing',
            header: () => <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Timeline</div>,
            cell: ({ row }) => {
                const created = new Date(row.original.created_at);
                const daysOpen = Math.floor((new Date().getTime() - created.getTime()) / (1000 * 3600 * 24));
                const closeDate = row.original.estimated_close_date ? new Date(row.original.estimated_close_date) : null;

                return (
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5" title="Days Open">
                            <Clock size={12} className={daysOpen > 30 ? "text-amber-500" : "text-gray-400"} />
                            <span className={daysOpen > 30 ? "font-medium text-amber-600" : ""}>{daysOpen} days</span>
                        </div>
                        {closeDate && (
                            <div className="flex items-center gap-1.5" title="Estimated Close">
                                <Calendar size={12} className="text-gray-400" />
                                <span>{closeDate.toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                )
            }
        },
        // Owner
        {
            accessorKey: 'owner_profile.full_name',
            header: () => <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Owner</div>,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={row.original.owner_profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-[10px] bg-gray-100 text-gray-600">
                            {row.original.owner_profile?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700 truncate max-w-[120px]">
                        {row.original.owner_profile?.full_name || 'Unassigned'}
                    </span>
                </div>
            ),
        },
        // Actions
        {
            id: 'actions',
            cell: ({ row }) => {
                const opportunity = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-900">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] bg-white border-gray-200 text-gray-900 shadow-lg ring-1 ring-black/5">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => onRowClick?.(opportunity.id)}
                                className="cursor-pointer font-medium"
                            >
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                Edit Opportunity
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <DataTable<OpportunityWithRelations, unknown>
            columns={columns}
            data={data}
            pageCount={1}
            pagination={{ pageIndex: 0, pageSize: 20 }}
            onPaginationChange={() => { }}
            sorting={[]}
            onSortingChange={() => { }}
            onRowClick={(row) => onRowClick?.(row.id)}
        />
    );
}
