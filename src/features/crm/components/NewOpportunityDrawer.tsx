import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    contact_id: z.string().min(1, 'Contact is required'),
    company_id: z.string().optional(), // Auto-filled from contact usually
    lead_origin_id: z.string().min(1, 'Lead Origin is required'),
    office: z.enum(['TIA', 'TIC']),
    notes: z.string().optional(),
    product_ids: z.array(z.string()).min(1, 'Select at least one product'),
});

type FormData = z.infer<typeof formSchema>;

interface NewOpportunityDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading?: boolean;
    // Options
    contacts?: { id: string; name: string }[];
    leadOrigins?: { id: string; name: string }[];
    products?: { id: string; name: string }[];
}

export function NewOpportunityDrawer({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
    contacts = [],
    leadOrigins = [],
    products = []
}: NewOpportunityDrawerProps) {
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            office: 'TIA',
            product_ids: [],
        },
    });

    const handleFormSubmit = async (data: FormData) => {
        await onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-[600px] overflow-y-auto bg-[#1B1B1B] text-white border-l border-white/10">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold text-white">New Opportunity</SheetTitle>
                    <SheetDescription className="text-gray-400">
                        Create a new sales opportunity. Fill in the details below.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Opportunity Title <span className="text-red-400">*</span></Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="e.g. Q4 Lab Equipment Upgrade"
                            className="bg-[#2A2A2A] border-white/10 text-white placeholder:text-gray-500"
                        />
                        {errors.title && <span className="text-xs text-red-400">{errors.title.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white">Lead Origin <span className="text-red-400">*</span></Label>
                            <Select onValueChange={(val) => setValue('lead_origin_id', val)}>
                                <SelectTrigger className="bg-[#2A2A2A] border-white/10 text-white">
                                    <SelectValue placeholder="Select origin" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                                    {leadOrigins.map(origin => (
                                        <SelectItem key={origin.id} value={origin.id}>{origin.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.lead_origin_id && <span className="text-xs text-red-400">{errors.lead_origin_id.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Office <span className="text-red-400">*</span></Label>
                            <Select onValueChange={(val: 'TIA' | 'TIC') => setValue('office', val)} defaultValue="TIA">
                                <SelectTrigger className="bg-[#2A2A2A] border-white/10 text-white">
                                    <SelectValue placeholder="Select office" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                                    <SelectItem value="TIA">TIA</SelectItem>
                                    <SelectItem value="TIC">TIC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Contact <span className="text-red-400">*</span></Label>
                        <Select onValueChange={(val) => setValue('contact_id', val)}>
                            <SelectTrigger className="bg-[#2A2A2A] border-white/10 text-white">
                                <SelectValue placeholder="Select contact" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1B1B1B] border-white/10 text-white">
                                {contacts.map(contact => (
                                    <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.contact_id && <span className="text-xs text-red-400">{errors.contact_id.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white">Interested Products <span className="text-red-400">*</span></Label>
                        <div className="p-3 rounded-md bg-[#2A2A2A] border border-white/10 max-h-[150px] overflow-y-auto space-y-2">
                            {products.length === 0 ? (
                                <p className="text-xs text-gray-500">No products available.</p>
                            ) : products.map(product => (
                                <label key={product.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded">
                                    <input
                                        type="checkbox"
                                        value={product.id}
                                        {...register('product_ids')}
                                        className="rounded border-white/20 bg-[#1B1B1B] text-emerald-500 focus:ring-emerald-500/50"
                                    />
                                    <span className="text-sm text-gray-300">{product.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.product_ids && <span className="text-xs text-red-400">{errors.product_ids.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-white">Notes</Label>
                        <Textarea
                            id="notes"
                            {...register('notes')}
                            placeholder="Initial call notes..."
                            className="bg-[#2A2A2A] border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                        />
                    </div>

                    <SheetFooter className="mt-8">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Opportunity
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
