
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppDrawer } from '@/components/ui/AppDrawer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { RelationalField } from '@/features/database/components/forms/RelationalField';
import { ContactForm } from '@/features/database/components/forms/ContactForm';
import { MultiRelationalField } from '@/features/database/components/forms/MultiRelationalField';
import { ProductForm } from '@/features/database/components/forms/ProductForm';

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
    leadOrigins?: { id: string; name: string }[];
}

export function NewOpportunityDrawer({
    open,
    onOpenChange,
    onSubmit,
    isLoading,
    leadOrigins = [],
}: NewOpportunityDrawerProps) {
    const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<FormData>({
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

    const handleCreateContact = async (data: any): Promise<string> => {
        const { data: newContact, error } = await supabase
            .from('contacts')
            .insert({ ...data, updated_at: new Date().toISOString() })
            .select('id')
            .single();

        if (error) throw error;
        return newContact.id;
    };

    const handleCreateProduct = async (data: any): Promise<string> => {
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert({ ...data, updated_at: new Date().toISOString() })
            .select('id')
            .single();

        if (error) throw error;
        return newProduct.id;
    };

    return (
        <AppDrawer
            open={open}
            onOpenChange={onOpenChange}
            title="New Opportunity"
            description="Create a new sales opportunity. Fill in the details below."
        >
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
                    <Controller
                        control={control}
                        name="contact_id"
                        render={({ field }) => (
                            <RelationalField
                                label=""
                                entityType="contact"
                                value={field.value}
                                onChange={field.onChange}
                                formComponent={ContactForm}
                                onNestedCreate={handleCreateContact}
                                placeholder="Select or create contact..."
                                className="text-white"
                            />
                        )}
                    />
                    {errors.contact_id && <span className="text-xs text-red-400">{errors.contact_id.message}</span>}
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Interested Products <span className="text-red-400">*</span></Label>
                    <Controller
                        control={control}
                        name="product_ids"
                        render={({ field }) => (
                            <MultiRelationalField
                                label=""
                                entityType="product"
                                value={field.value}
                                onChange={field.onChange}
                                formComponent={ProductForm}
                                onNestedCreate={handleCreateProduct}
                                placeholder="Select products..."
                                className="text-white"
                            />
                        )}
                    />
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

                <div className="mt-8">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black hover:bg-gray-200"
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Opportunity
                    </Button>
                </div>
            </form>
        </AppDrawer>
    );
}
