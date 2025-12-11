import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

interface MarkLostDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reasonId: string, notes?: string) => Promise<void>;
    isLoading?: boolean;
}

export function MarkLostDialog({ open, onOpenChange, onConfirm, isLoading }: MarkLostDialogProps) {
    const [reasonId, setReasonId] = useState<string>('');
    const [notes, setNotes] = useState('');

    const { data: reasons = [] } = useQuery({
        queryKey: ['lost-reasons'],
        queryFn: async () => {
            const { data, error } = await supabase.from('lost_reasons').select('*').eq('is_active', true);
            if (error) throw error;
            return data;
        },
        enabled: open // Only fetch when open
    });

    const handleConfirm = async () => {
        if (!reasonId) return;
        await onConfirm(reasonId, notes);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#1B1B1B] text-white border-white/10 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mark Opportunity as Lost</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Please specify the reason for losing this opportunity. This helps in future analysis.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Reason</label>
                        <Select onValueChange={setReasonId}>
                            <SelectTrigger className="bg-[#2A2A2A] border-white/10 text-white">
                                <SelectValue placeholder="Select reason..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#2A2A2A] border-white/10 text-white">
                                {reasons.map(reason => (
                                    <SelectItem key={reason.id} value={reason.id}>{reason.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Additional Notes</label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-[#2A2A2A] border-white/10 text-white"
                            placeholder="Details about why we lost..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400">Cancel</Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!reasonId || isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Mark as Lost
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
