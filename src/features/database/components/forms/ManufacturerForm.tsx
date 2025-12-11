import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
// import { Checkbox } from '@/components/ui/checkbox'; // Need to confirm if Checkbox component exists. I used input[type=checkbox] in DataTable.
// I'll use input checkbox for now or simple select.

const manufacturerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().optional().or(z.literal('')),
    contract_validity: z.string().optional().or(z.literal('')), // Date string YYYY-MM-DD
    has_exclusivity: z.boolean().optional(),
});

type ManufacturerFormValues = z.infer<typeof manufacturerSchema>;
type Manufacturer = Database['public']['Tables']['companies']['Row'];

interface ManufacturerFormProps {
    initialData?: Manufacturer;
    onSubmit: (data: ManufacturerFormValues) => Promise<void>;
    isLoading?: boolean;
}

export function ManufacturerForm({ initialData, onSubmit, isLoading }: ManufacturerFormProps) {
    const form = useForm<ManufacturerFormValues>({
        resolver: zodResolver(manufacturerSchema),
        defaultValues: {
            name: '',
            phone: '',
            contract_validity: '',
            has_exclusivity: false,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                phone: initialData.phone || '',
                contract_validity: initialData.contract_validity ? new Date(initialData.contract_validity).toISOString().split('T')[0] : '',
                has_exclusivity: initialData.has_exclusivity || false,
            });
        }
    }, [initialData, form]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manufacturer Details</h2>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="Factory Inc." />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>


                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+1 234 567 8900" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contract_validity">Contract Valid Until</Label>
                    <Input type="date" id="contract_validity" {...form.register('contract_validity')} />
                </div>

                <div className="space-y-2 flex items-center pt-6">
                    <input
                        type="checkbox"
                        id="has_exclusivity"
                        {...form.register('has_exclusivity')}
                        className="mr-2 h-4 w-4"
                    />
                    <Label htmlFor="has_exclusivity">Has Exclusivity Agreement</Label>
                </div>
            </div>
        </form>
    );
}
