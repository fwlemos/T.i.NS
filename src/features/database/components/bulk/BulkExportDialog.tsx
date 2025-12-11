import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Loader2, FileSpreadsheet } from 'lucide-react';

interface BulkExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onConfirm: () => Promise<void>;
    isExporting?: boolean;
}

export function BulkExportDialog({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
    isExporting = false,
}: BulkExportDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export {selectedCount} items</DialogTitle>
                    <DialogDescription>
                        Exporting {selectedCount} selected records to CSV.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50 dark:bg-gray-900/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                        <div className="h-10 w-10 bg-green-100 text-green-600 rounded-md flex items-center justify-center">
                            <FileSpreadsheet className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">CSV Export</p>
                            <p className="text-xs text-muted-foreground">Comma separated values</p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isExporting}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={onConfirm} disabled={isExporting}>
                        {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Export
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
