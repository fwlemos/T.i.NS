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
    tax_id: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    website: z.string().url().optional().or(z.literal('')),
    address: z.object({
        street: z.string().optional().or(z.literal('')),
        city: z.string().optional().or(z.literal('')),
        state_province: z.string().optional().or(z.literal('')),
        postal_code: z.string().optional().or(z.literal('')),
        country: z.string().optional().or(z.literal('')),
    }).optional(),
    contract_validity: z.string().optional().or(z.literal('')), // Date string YYYY-MM-DD
    contract_file_id: z.string().optional().or(z.literal('')), // Placeholder for now
    has_exclusivity: z.boolean().optional(),
    exclusivity_file_id: z.string().optional().or(z.literal('')), // Placeholder
    notes: z.string().optional().or(z.literal('')),
});

type ManufacturerFormValues = z.infer<typeof manufacturerSchema>;
type Manufacturer = Database['public']['Tables']['companies']['Row'];

interface ManufacturerFormProps {
    initialData?: Manufacturer;
    onSubmit: (data: ManufacturerFormValues) => Promise<void>;
    isLoading?: boolean;
    isNested?: boolean;
}

export function ManufacturerForm({ initialData, onSubmit, isLoading, isNested = false }: ManufacturerFormProps) {
    const form = useForm<ManufacturerFormValues>({
        resolver: zodResolver(manufacturerSchema),
        defaultValues: {
            name: '',
            tax_id: '',
            phone: '',
            website: '',
            address: {
                street: '',
                city: '',
                state_province: '',
                postal_code: '',
                country: '',
            },
            contract_validity: '',
            contract_file_id: '',
            has_exclusivity: false,
            exclusivity_file_id: '',
            notes: '',
        },
    });

    const hasExclusivity = form.watch('has_exclusivity');

    useEffect(() => {
        if (initialData) {
            const address = initialData.address as any || {};
            form.reset({
                name: initialData.name || '',
                tax_id: initialData.tax_id || '',
                phone: initialData.phone || '',
                website: initialData.website || '',
                address: {
                    street: address.street || '',
                    city: address.city || '',
                    state_province: address.state_province || '',
                    postal_code: address.postal_code || '',
                    country: address.country || '',
                },
                contract_validity: initialData.contract_validity ? new Date(initialData.contract_validity).toISOString().split('T')[0] : '',
                contract_file_id: initialData.contract_file_id || '',
                has_exclusivity: initialData.has_exclusivity || false,
                exclusivity_file_id: initialData.exclusivity_file_id || '',
                notes: initialData.notes || '',
            });
        }
    }, [initialData, form]);

    return (
        <div className={isNested ? "space-y-6" : "space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border"}>
            {isNested ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Manufacturer' : 'New Manufacturer'}</h2>
                    </div>
                    {renderFields()}
                    <div className="pt-4 mt-6 border-t">
                        <Button
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isLoading}
                            className="w-full"
                            size="lg"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Manufacturer
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Manufacturer' : 'New Manufacturer'}</h2>
                    </div>
                    {renderFields()}
                    <div className="pt-4 mt-6 border-t">
                        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Manufacturer
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );

    function renderFields() {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="Factory Inc." />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tax_id">Tax ID</Label>
                    <Input id="tax_id" {...form.register('tax_id')} placeholder="XX-XXXXXXX" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+1 234 567 8900" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...form.register('website')} placeholder="https://factory.com" />
                    {form.formState.errors.website && (
                        <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>
                    )}
                </div>

                <div className="md:col-span-2 space-y-4 border rounded-md p-4 bg-muted/20">
                    <h3 className="font-medium text-sm">Address</h3>
                    <div className="space-y-2">
                        <Label htmlFor="address.street">Street</Label>
                        <Input id="address.street" {...form.register('address.street')} placeholder="123 Industrial Rd" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address.city">City</Label>
                            <Input id="address.city" {...form.register('address.city')} placeholder="Shenzhen" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address.state_province">State/Province</Label>
                            <Input id="address.state_province" {...form.register('address.state_province')} placeholder="Guangdong" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address.postal_code">Postal Code</Label>
                            <Input id="address.postal_code" {...form.register('address.postal_code')} placeholder="518000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address.country">Country</Label>
                            <Input id="address.country" {...form.register('address.country')} placeholder="China" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contract_validity">Contract Valid Until</Label>
                    <Input type="date" id="contract_validity" {...form.register('contract_validity')} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contract_file_id">Contract File (Upload Placeholder)</Label>
                    <Input id="contract_file_id" {...form.register('contract_file_id')} placeholder="Select file..." disabled />
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

                {hasExclusivity && (
                    <div className="space-y-2">
                        <Label htmlFor="exclusivity_file_id">Exclusivity File (Upload Placeholder)</Label>
                        <Input id="exclusivity_file_id" {...form.register('exclusivity_file_id')} placeholder="Select file..." disabled />
                    </div>
                )}

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" {...form.register('notes')} placeholder="Additional notes..." />
                </div>
            </div>
        );
    }
}
