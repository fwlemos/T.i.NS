import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { ViewContainer } from '../components/ViewContainer';
import { useTableData } from '../hooks/useTableData';
import { Search } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/Sheet';
import { ContactForm } from '../components/forms/ContactForm';

type Contact = Database['public']['Tables']['contacts']['Row'] & {
    companies: { name: string } | null; // Joined company name
};

export function ContactsView() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const {
        data,
        pageCount,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
        fetchData // Need this to refresh after delete
    } = useTableData<Contact>({
        tableName: 'contacts',
        select: '*, companies(name)',
        searchQuery: searchTerm,
        searchColumns: ['name', 'email']
    });

    const columns: ColumnDef<Contact>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <span className="font-medium">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
        },
        {
            id: 'company',
            header: 'Company',
            accessorFn: (row) => row.companies?.name || '-',
        },
        {
            accessorKey: 'is_individual',
            header: 'Type',
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.original.is_individual ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.original.is_individual ? 'Individual' : 'Professional'}
                </span>
            )
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        }
    ];

    const handleBulkDelete = async (selectedRows: Contact[]) => {
        const ids = selectedRows.map(r => r.id);
        const { error } = await supabase.from('contacts').delete().in('id', ids);
        if (error) {
            console.error('Error deleting contacts:', error);
            // Ideally show toast
            alert('Failed to delete items');
        } else {
            // Refresh data
            fetchData();
        }
    };

    const handleBulkExport = async (selectedRows: Contact[]) => {
        // Simple CSV export
        const headers = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Type', 'Created At'];

        const csvContent = [
            headers.join(','),
            ...selectedRows.map(row => [
                row.id,
                `"${row.name}"`,
                row.email || '',
                row.phone || '',
                `"${row.companies?.name || ''}"`,
                row.is_individual ? 'Individual' : 'Professional',
                row.created_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `contacts_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const handleCreateSubmit = async (data: any) => {
        try {
            const { data: newContact, error } = await supabase
                .from('contacts')
                .insert({
                    ...data,
                    created_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (error) throw error;
            setIsCreateOpen(false);
            navigate(`/database/contacts/${newContact.id}`);
        } catch (err: any) {
            console.error('Error creating contact:', JSON.stringify(err, null, 2));
            // toast.error('Failed to create contact');
            alert(`Failed to create contact: ${err?.message || err?.error_description || JSON.stringify(err)}`);
        }
    };

    return (
        <ViewContainer
            title="Contacts"
            description="Manage all your contacts and individuals."
            onCreate={() => setIsCreateOpen(true)}
        >
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent
                    className="overflow-y-auto"
                    container={document.getElementById('database-drawer-container')}
                >
                    <SheetHeader>
                        <SheetTitle>Create New Contact</SheetTitle>
                        <SheetDescription>
                            Add a new contact to the database. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <ContactForm onSubmit={handleCreateSubmit} isLoading={false} />
                    </div>
                </SheetContent>
            </Sheet>

            <div className="mb-4 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <DataTable
                columns={columns}
                data={data}
                pageCount={pageCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                isLoading={isLoading}
                onRowClick={(row) => navigate(`/database/contacts/${row.id}`)}
                enableSelection={true}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
            />
        </ViewContainer>
    );
}
