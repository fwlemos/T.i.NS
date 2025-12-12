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
    is_individual: z.boolean().optional(),
    street: z.string().optional().or(z.literal('')),
    city: z.string().optional().or(z.literal('')),
    state_province: z.string().optional().or(z.literal('')),
    postal_code: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    notes: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
    if (!data.is_individual && (!data.company_id || data.company_id === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Company is required for non-individuals",
            path: ["company_id"],
        });
    }
});

type ContactFormValues = z.infer<typeof contactSchema>;
type Contact = Database['public']['Tables']['contacts']['Row'];

interface ContactFormProps {
    initialData?: Contact;
    onSubmit: (data: ContactFormValues) => Promise<void>;
    isLoading?: boolean;
    isNested?: boolean;
    readOnly?: boolean;
}

export function ContactForm({ initialData, onSubmit, isLoading, isNested = false, readOnly = false }: ContactFormProps) {
    const form = useForm<ContactFormValues>({
        mode: 'onChange',
        resolver: zodResolver(contactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            job_title: '',
            company_id: '',
            is_individual: false,
            street: '',
            city: '',
            state_province: '',
            postal_code: '',
            country: '',
            notes: '',
        },
    });

    const isIndividual = form.watch('is_individual');

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                job_title: initialData.job_title || '',
                company_id: initialData.company_id || '',
                is_individual: initialData.is_individual || false,
                street: initialData.street || '',
                city: initialData.city || '',
                state_province: initialData.state_province || '',
                postal_code: initialData.postal_code || '',
                country: initialData.country || '',
                notes: initialData.notes || '',
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
                created_by: (await supabase.auth.getUser()).data.user?.id
            })
            .select('id')
            .single();

        if (error) throw error;
        return newCompany.id;
    };

    return (
        <div className={isNested ? "space-y-6" : "space-y-6 bg-white dark:bg-card p-6 rounded-lg shadow-sm border"}>
            {isNested ? (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Contact' : 'New Contact'}</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_individual"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                {...form.register('is_individual')}
                                disabled={readOnly}
                            />
                            <Label htmlFor="is_individual" className="cursor-pointer font-normal">Is Individual (Direct Client)</Label>
                        </div>
                    </div>
                    {renderFields()}
                    {!readOnly && (
                        <div className="pt-4 mt-6 border-t">
                            <Button
                                type="button"
                                onClick={form.handleSubmit(onSubmit, (errors) => console.error("Nested Form Validation Errors:", errors))}
                                disabled={isLoading}
                                className="w-full"
                                size="lg"
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Contact
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => console.error("Form Validation Errors:", errors))} className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{initialData ? 'Edit Contact' : 'New Contact'}</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_individual"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                {...form.register('is_individual')}
                                disabled={readOnly}
                            />
                            <Label htmlFor="is_individual" className="cursor-pointer font-normal">Is Individual (Direct Client)</Label>
                        </div>
                    </div>
                    {renderFields()}
                    {!readOnly && (
                        <div className="pt-4 mt-6 border-t">
                            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Contact
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </div>
    );

    function renderFields() {
        return (
            <div className="space-y-4">
                {/* Basic Info */}
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...form.register('name')} placeholder="John Doe" autoComplete="off" disabled={readOnly} error={!!form.formState.errors.name} />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input id="job_title" {...form.register('job_title')} placeholder="Software Engineer" autoComplete="organization-title" disabled={readOnly} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" {...form.register('email')} placeholder="john@example.com" autoComplete="new-password" disabled={readOnly} error={!!form.formState.errors.email} />
                    {form.formState.errors.email && (
                        <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...form.register('phone')} placeholder="+1 234 567 8900" autoComplete="off" disabled={readOnly} />
                </div>

                {/* Individual Checkbox moved to header */}

                {/* Conditional Company Selection */}
                {!isIndividual && (
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
                                    disabled={readOnly}
                                    required={!isIndividual}
                                    error={form.formState.errors.company_id?.message}
                                />
                            )}
                        />
                    </div>
                )}

                {/* Conditional Address Fields */}
                {isIndividual && (
                    <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                        <h3 className="font-medium text-sm">Address</h3>
                        <div className="space-y-2">
                            <Label htmlFor="street">Street</Label>
                            <Input id="street" {...form.register('street')} placeholder="123 Main St" disabled={readOnly} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...form.register('city')} placeholder="New York" disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state_province">State/Province</Label>
                                <Input id="state_province" {...form.register('state_province')} placeholder="NY" disabled={readOnly} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postal_code">Postal Code</Label>
                                <Input id="postal_code" {...form.register('postal_code')} placeholder="10001" disabled={readOnly} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input id="country" {...form.register('country')} placeholder="USA" disabled={readOnly} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input id="notes" {...form.register('notes')} placeholder="Additional notes..." disabled={readOnly} />
                </div>
            </div>
        );
    }
}
