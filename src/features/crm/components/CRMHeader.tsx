import React from 'react';
import { Search, SlidersHorizontal, Plus, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/Select';
import { cn } from '@/lib/utils/cn';

interface CRMHeaderProps {
    view: 'kanban' | 'list';
    onViewChange: (view: 'kanban' | 'list') => void;
    onNewOpportunity: () => void;
}

export function CRMHeader({ view, onViewChange, onNewOpportunity }: CRMHeaderProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Top Row: Title & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Opportunities</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your sales pipeline and deals</p>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100 rounded-lg border border-gray-200/60">
                        <button
                            onClick={() => onViewChange('kanban')}
                            className={cn(
                                "p-2 rounded-md transition-all duration-200",
                                view === 'kanban'
                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            )}
                            title="Kanban View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => onViewChange('list')}
                            className={cn(
                                "p-2 rounded-md transition-all duration-200",
                                view === 'list'
                                    ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            )}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <Button
                        onClick={onNewOpportunity}
                        className="bg-gray-900 hover:bg-gray-800 text-white gap-2 shadow-sm whitespace-nowrap"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Opportunity</span>
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Search & Filter Bar */}
            <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        placeholder="Search opportunities..."
                        className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-gray-900/5 transition-all w-full"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-900 hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Owner:</span>
                                <SelectValue placeholder="All Users" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="me">My Deals</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-900 hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">Office:</span>
                                <SelectValue placeholder="All Locations" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            <SelectItem value="tia">TIA</SelectItem>
                            <SelectItem value="tic">TIC</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="outline" className="border-dashed border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 gap-2">
                        <SlidersHorizontal size={16} />
                        More Filters
                    </Button>
                </div>
            </div>
        </div>
    );
}
