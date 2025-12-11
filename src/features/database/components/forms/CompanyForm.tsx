import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const companySchema = z.object({
    name: z.string().min(2, 'Name is required'),
    tax_id: z.string().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')).refine(val => {
        if (!val) return true;
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(val);
    }, 'Invalid URL'),
    address: z.object({
        street: z.string().optional().or(z.literal('')),
        city: z.string().optional().or(z.literal('')),
        state_province: z.string().optional().or(z.literal('')),
        postal_code: z.string().optional().or(z.literal('')),
        country: z.string().optional().or(z.literal('')),
    }).optional(),
    notes: z.string().optional().or(z.literal('')),
});

type CompanyFormValues = z.infer<typeof companySchema>;
type Company = Database['public']['Tables']['companies']['Row'];

interface CompanyFormProps {
    initialData?: Company;
    onSubmit: (data: CompanyFormValues) => Promise<void>;
    isLoading?: boolean;
    isNested?: boolean;
    readOnly?: boolean;
}

export function CompanyForm({ initialData, onSubmit, isLoading, isNested = false, readOnly = false }: CompanyFormProps) {
    const form = useForm<CompanyFormValues>({
        mode: 'onChange',
        resolver: zodResolver(companySchema),
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
            notes: '',
        },
    });

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
                notes: initialData.notes || '',
            });
        }
    }, [initialData, form]);

    return (
        <div className={isNested ? "space-y-6" : "space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border"}>
            {/* Wrap in form only if not nested to avoid HTML validation issues */}
            {isNested ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Company' : 'New Company'}</h2>
                    </div>
                    {renderFields()}
                    {!readOnly && (
                        <div className="pt-4 mt-6 border-t">
                            <Button
                                type="button"
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Company
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Company' : 'New Company'}</h2>
                    </div>
                    {renderFields()}
                    {!readOnly && (
                        <div className="pt-4 mt-6 border-t">
                            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Company
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </div>
    );

    function renderFields() {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="Acme Corp" disabled={readOnly} error={!!form.formState.errors.name} />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tax_id">Tax ID</Label>
                    <Input id="tax_id" {...form.register('tax_id')} placeholder="XX-XXXXXXX" disabled={readOnly} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+1 234 567 8900" disabled={readOnly} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...form.register('website')} placeholder="https://acme.com" disabled={readOnly} error={!!form.formState.errors.website} />
                    {form.formState.errors.website && (
                        <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>
                    )}
                </div>

                <div className="md:col-span-2 space-y-4 border rounded-md p-4 bg-muted/20">
                    <h3 className="font-medium text-sm">Address</h3>
                    <div className="space-y-2">
                        <Label htmlFor="address.street">Street</Label>
                        <Input id="address.street" {...form.register('address.street')} placeholder="123 Main St" disabled={readOnly} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address.city">City</Label>
                            <Input id="address.city" {...form.register('address.city')} placeholder="New York" disabled={readOnly} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address.state_province">State/Province</Label>
                            <Input id="address.state_province" {...form.register('address.state_province')} placeholder="NY" disabled={readOnly} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address.postal_code">Postal Code</Label>
                            <Input id="address.postal_code" {...form.register('address.postal_code')} placeholder="10001" disabled={readOnly} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address.country">Country</Label>
                            <Input id="address.country" {...form.register('address.country')} placeholder="USA" disabled={readOnly} />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" {...form.register('notes')} placeholder="Additional notes..." disabled={readOnly} />
                </div>
            </div>
        );
    }
}
