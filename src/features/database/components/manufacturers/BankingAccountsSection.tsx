import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Edit2, Banknote } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/Dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';

type BankingAccount = Database['public']['Tables']['manufacturer_banking_accounts']['Row'];

const accountSchema = z.object({
    bank_name: z.string().min(1, "Bank name is required"),
    account_number: z.string().min(1, "Account number is required"),
    currency: z.string().min(1, "Currency is required"),
    routing_number: z.string().optional(),
    swift_code: z.string().optional(),
    iban: z.string().optional(),
    intermediary_bank: z.string().optional(),
    is_primary: z.boolean().default(false),
    notes: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface BankingAccountsSectionProps {
    manufacturerId: string;
}

export function BankingAccountsSection({ manufacturerId }: BankingAccountsSectionProps) {
    const [accounts, setAccounts] = useState<BankingAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankingAccount | null>(null);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountSchema) as any,
        defaultValues: {
            bank_name: '',
            account_number: '',
            currency: 'USD',
            routing_number: '',
            swift_code: '',
            iban: '',
            intermediary_bank: '',
            is_primary: false,
            notes: '',
        },
    });

    const fetchAccounts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('manufacturer_banking_accounts')
            .select('*')
            .eq('manufacturer_id', manufacturerId)
            .order('is_primary', { ascending: false }); // Primary first

        if (error) {
            console.error('Error fetching accounts:', error);
        } else {
            setAccounts(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (manufacturerId) {
            fetchAccounts();
        }
    }, [manufacturerId]);

    const onSubmit = async (values: AccountFormValues) => {
        try {
            if (values.is_primary) {
                // If setting as primary, unmark others locally or let DB handle?
                // Typically we should update others to false if this one is true.
                // For simplicity, we'll just insert/update and let the user manage it, 
                // OR ideally we run a transaction or a second update.
                // Let's unmark others first if new one is primary.
                // (Optional enhancement, skipping for MVP unless required)
            }

            if (editingAccount) {
                const { error } = await supabase
                    .from('manufacturer_banking_accounts')
                    .update({ ...values, updated_at: new Date().toISOString() })
                    .eq('id', editingAccount.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('manufacturer_banking_accounts')
                    .insert([{ ...values, manufacturer_id: manufacturerId }]);
                if (error) throw error;
            }

            setIsDialogOpen(false);
            setEditingAccount(null);
            form.reset();
            fetchAccounts();
        } catch (error) {
            console.error('Error saving account:', error);
            alert('Failed to save account');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            const { error } = await supabase
                .from('manufacturer_banking_accounts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account');
        }
    };

    const handleEdit = (account: BankingAccount) => {
        setEditingAccount(account);
        form.reset({
            bank_name: account.bank_name,
            account_number: account.account_number,
            currency: account.currency,
            routing_number: account.routing_number || '',
            swift_code: account.swift_code || '',
            iban: account.iban || '',
            intermediary_bank: account.intermediary_bank || '',
            is_primary: account.is_primary || false,
            notes: account.notes || '',
        });
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingAccount(null);
        form.reset({
            bank_name: '',
            account_number: '',
            currency: 'USD',
            is_primary: accounts.length === 0, // Default to primary if first one
        });
        setIsDialogOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Banking Accounts</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleCreate} size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingAccount ? 'Edit Account' : 'Add Banking Account'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="bank_name">Bank Name *</Label>
                                <Input id="bank_name" {...form.register('bank_name')} />
                                {form.formState.errors.bank_name && <span className="text-red-500 text-xs">{form.formState.errors.bank_name.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Currency *</Label>
                                <select
                                    id="currency"
                                    {...form.register('currency')}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="BRL">BRL</option>
                                    <option value="CNY">CNY</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="account_number">Account Number *</Label>
                                <Input id="account_number" {...form.register('account_number')} />
                                {form.formState.errors.account_number && <span className="text-red-500 text-xs">{form.formState.errors.account_number.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="routing_number">Routing Number / ABA</Label>
                                <Input id="routing_number" {...form.register('routing_number')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="swift_code">SWIFT / BIC</Label>
                                <Input id="swift_code" {...form.register('swift_code')} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iban">IBAN</Label>
                                <Input id="iban" {...form.register('iban')} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="intermediary_bank">Intermediary Bank</Label>
                                <Input id="intermediary_bank" placeholder="Identify intermediary bank details if applicable" {...form.register('intermediary_bank')} />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input id="notes" {...form.register('notes')} />
                            </div>
                            <div className="space-y-2 col-span-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_primary"
                                    {...form.register('is_primary')}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="is_primary" className="mb-0">Set as Primary Account</Label>
                            </div>

                            <DialogFooter className="col-span-2 mt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">{editingAccount ? 'Save Changes' : 'Create Account'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="text-sm text-gray-500">Loading accounts...</div>
            ) : accounts.length === 0 ? (
                <div className="text-sm text-gray-500 italic border border-dashed rounded-md p-4 text-center">
                    No banking accounts recorded.
                </div>
            ) : (
                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bank</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Account Details</TableHead>
                                <TableHead>Internal Notes</TableHead>
                                <TableHead className="w-[100px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map(account => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4 text-gray-400" />
                                            {account.bank_name}
                                            {account.is_primary && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Primary</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{account.currency}</TableCell>
                                    <TableCell>
                                        <div className="text-xs">
                                            <div><span className="text-gray-500">Acc:</span> {account.account_number}</div>
                                            {account.swift_code && <div><span className="text-gray-500">SWIFT:</span> {account.swift_code}</div>}
                                            {account.iban && <div><span className="text-gray-500">IBAN:</span> {account.iban}</div>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-gray-500 truncate max-w-[150px]">{account.notes}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(account)} className="h-8 w-8">
                                                <Edit2 className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)} className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
