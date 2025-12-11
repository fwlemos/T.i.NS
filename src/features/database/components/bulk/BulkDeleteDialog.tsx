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
import { Loader2 } from 'lucide-react';

interface BulkDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    onConfirm: () => Promise<void>;
    isDeleting?: boolean;
}

export function BulkDeleteDialog({
    open,
    onOpenChange,
    selectedCount,
    onConfirm,
    isDeleting = false,
}: BulkDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete {selectedCount} items?</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete these {selectedCount} records? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isDeleting}>Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
