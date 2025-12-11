import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';

interface BulkEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedCount: number;
    // Fields available for bulk edit
    fields: {
        name: string;
        label: string;
        type: 'text' | 'select' | 'number';
        options?: { label: string; value: string }[];
    }[];
    onApply: (field: string, value: any) => Promise<void>;
}

export function BulkEditDialog({
    open,
    onOpenChange,
    selectedCount,
    fields,
    onApply,
}: BulkEditDialogProps) {
    const [selectedField, setSelectedField] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const fieldConfig = fields.find(f => f.name === selectedField);

    const handleSubmit = async () => {
        if (!selectedField) return;
        setIsLoading(true);
        try {
            await onApply(selectedField, value);
            onOpenChange(false);
            // Reset
            setSelectedField('');
            setValue('');
        } catch (error) {
            console.error("Bulk edit failed", error);
            // Parent handles toast
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Bulk Edit Records</DialogTitle>
                    <DialogDescription>
                        You are about to edit {selectedCount} records. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Field to Update</Label>
                        <Select value={selectedField} onValueChange={setSelectedField}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select field..." />
                            </SelectTrigger>
                            <SelectContent>
                                {fields.map(field => (
                                    <SelectItem key={field.name} value={field.name}>
                                        {field.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {fieldConfig && (
                        <div className="space-y-2">
                            <Label>New Value</Label>
                            {fieldConfig.type === 'select' ? (
                                <Select value={value} onValueChange={setValue}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select value..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fieldConfig.options?.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    type={fieldConfig.type}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder={`Enter new ${fieldConfig.label}`}
                                />
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !selectedField}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Apply Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
