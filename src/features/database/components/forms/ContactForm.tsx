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
import { CompanyForm } from './CompanyForm';

// Schema
const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional().or(z.literal('')),
    job_title: z.string().optional().or(z.literal('')),
    company_id: z.string().optional().or(z.literal('')),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type Contact = Database['public']['Tables']['contacts']['Row'];

interface ContactFormProps {
    initialData?: Contact;
    onSubmit: (data: ContactFormValues) => Promise<void>;
    isLoading?: boolean;
    isNested?: boolean;
}

export function ContactForm({ initialData, onSubmit, isLoading, isNested = false }: ContactFormProps) {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            job_title: '',
            company_id: '',
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                job_title: initialData.job_title || '',
                company_id: initialData.company_id || '',
            });
        }
    }, [initialData, form]);

    const handleCreateCompany = async (data: any): Promise<string> => {
        const { data: newCompany, error } = await supabase
            .from('companies')
            .insert({
                ...data,
                type: 'company',
                updated_at: new Date().toISOString(),
            })
            .select('id')
            .single();

        if (error) throw error;
        return newCompany.id;
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={isNested ? "space-y-6" : "space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border"}
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{isNested ? '' : 'Contact Details'}</h2>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="John Doe" />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input id="job_title" {...form.register('job_title')} placeholder="Software Engineer" />
                </div>

                <div className="space-y-2">
                    <Controller
                        control={form.control}
                        name="company_id"
                        render={({ field }) => (
                            <RelationalField
                                label="Company"
                                entityType="company"
                                value={field.value ?? ''}
                                onChange={(val: string) => field.onChange(val)}
                                formComponent={CompanyForm}
                                onNestedCreate={handleCreateCompany}
                                placeholder="Select Company..."
                            />
                        )}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...form.register('email')} placeholder="john@example.com" />
                    {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+1 234 567 8900" />
                </div>
            </div>
        </form>
    );
}
