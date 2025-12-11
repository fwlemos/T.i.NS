import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { RelationalField } from './RelationalField';
import { ManufacturerForm } from './ManufacturerForm';

const productSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    part_number: z.string().optional().or(z.literal('')),
    manufacturer_id: z.string().min(1, 'Manufacturer is required'),
    default_warranty_years: z.number().optional(),
    description: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;
type Product = Database['public']['Tables']['products']['Row'];

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: ProductFormValues) => Promise<void>;
    isLoading?: boolean;
    isNested?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading, isNested = false }: ProductFormProps) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            part_number: '',
            manufacturer_id: '',
            default_warranty_years: 1,
            description: '',
            notes: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                part_number: initialData.part_number || '',
                manufacturer_id: initialData.manufacturer_id || '',
                default_warranty_years: initialData.default_warranty_years || 1,
                description: initialData.description || '',
                notes: initialData.notes || '',
            });
        }
    }, [initialData, form]);

    const handleCreateManufacturer = async (data: any): Promise<string> => {
        // Create manufacturer with type='manufacturer'
        const { data: newManufacturer, error } = await supabase
            .from('companies')
            .insert({
                ...data,
                type: 'manufacturer',
                updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (error) throw error;
        return newManufacturer.id;
    };

    const renderFields = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="Super Widget" />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="part_number">Part Number</Label>
                    <Input id="part_number" {...form.register('part_number')} placeholder="PN-123456" />
                </div>

                <div className="space-y-2">
                    <Controller
                        control={form.control}
                        name="manufacturer_id"
                        render={({ field }) => (
                            <RelationalField
                                label="Manufacturer"
                                entityType="manufacturer"
                                value={field.value}
                                onChange={field.onChange}
                                formComponent={ManufacturerForm}
                                onNestedCreate={handleCreateManufacturer}
                                placeholder="Select Manufacturer..."
                            />
                        )}
                    />
                    {form.formState.errors.manufacturer_id && (
                        <p className="text-sm text-red-500">{form.formState.errors.manufacturer_id.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="default_warranty_years">Warranty (Years)</Label>
                    <Input
                        type="number"
                        id="default_warranty_years"
                        {...form.register('default_warranty_years', { valueAsNumber: true })}
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        {...form.register('description')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Product description..."
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                        id="notes"
                        {...form.register('notes')}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Internal notes..."
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={isNested ? "space-y-6" : "space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border"}>
            {isNested ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Product' : 'New Product'}</h2>
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
                            Save Product
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Product' : 'New Product'}</h2>
                    </div>
                    {renderFields()}
                    <div className="pt-4 mt-6 border-t">
                        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Product
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}
