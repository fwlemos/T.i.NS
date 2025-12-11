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
    website: z.string().url().optional().or(z.literal('')),
    // Address fields will be handled separately or added here later
});

type CompanyFormValues = z.infer<typeof companySchema>;
type Company = Database['public']['Tables']['companies']['Row'];

interface CompanyFormProps {
    initialData?: Company;
    onSubmit: (data: CompanyFormValues) => Promise<void>;
    isLoading?: boolean;
}

export function CompanyForm({ initialData, onSubmit, isLoading }: CompanyFormProps) {
    const form = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            tax_id: '',
            phone: '',
            website: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                tax_id: initialData.tax_id || '',
                phone: initialData.phone || '',
                website: initialData.website || '',
            });
        }
    }, [initialData, form]);

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Company Details</h2>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="Acme Corp" />
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

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...form.register('website')} placeholder="https://acme.com" />
                    {form.formState.errors.website && (
                        <p className="text-sm text-red-500">{form.formState.errors.website.message}</p>
                    )}
                </div>
            </div>
        </form>
    );
}
