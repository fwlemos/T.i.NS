
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
        <div className="space-y-5">
            {/* Top Row: Title & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        Opportunities
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage your sales pipeline
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center p-1 bg-gray-100/80 rounded-lg">
                        <button
                            onClick={() => onViewChange('kanban')}
                            className={cn(
                                "p-2 rounded-md transition-all duration-150",
                                view === 'kanban'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            title="Kanban View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => onViewChange('list')}
                            className={cn(
                                "p-2 rounded-md transition-all duration-150",
                                view === 'list'
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                    </div>

                    {/* New Opportunity Button */}
                    <Button
                        onClick={onNewOpportunity}
                        className="bg-gray-900 hover:bg-gray-800 text-white gap-2 shadow-sm"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">New Opportunity</span>
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Search & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                        placeholder="Search opportunities..."
                        className="pl-9 h-9 bg-white border-gray-200 text-sm placeholder:text-gray-400 focus:border-gray-400"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[140px] h-9 bg-white border-gray-200 text-sm">
                            <SelectValue placeholder="Owner" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="me">My Deals</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="all">
                        <SelectTrigger className="w-[120px] h-9 bg-white border-gray-200 text-sm">
                            <SelectValue placeholder="Office" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="tia">TIA</SelectItem>
                            <SelectItem value="tic">TIC</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 gap-1.5"
                    >
                        <SlidersHorizontal size={14} />
                        <span className="hidden sm:inline">Filters</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
