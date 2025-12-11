import { Button } from '@/components/ui/Button';
import { X, Trash2, Download, Edit2 } from 'lucide-react';

interface BulkActionsToolbarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onDelete: () => void;
    onExport: () => void;
    onEdit?: () => void; // Optional if not all views support it yet
}

export function BulkActionsToolbar({
    selectedCount,
    onClearSelection,
    onDelete,
    onExport,
    onEdit,
}: BulkActionsToolbarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg px-4 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-2 border-r pr-4 border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">
                    {selectedCount}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">Selected</span>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onExport} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
                {onEdit && (
                    <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
                        <Edit2 className="h-4 w-4" />
                        Edit
                    </Button>
                )}
                <Button variant="destructive" size="sm" onClick={onDelete} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full h-8 w-8 p-0"
            >
                <X className="h-4 w-4 text-gray-500" />
            </Button>
        </div>
    );
}
