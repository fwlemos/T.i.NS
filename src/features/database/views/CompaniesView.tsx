import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { ViewContainer } from '../components/ViewContainer';
import { useTableData } from '../hooks/useTableData';
import { Search } from 'lucide-react';
import { Database } from '@/lib/supabase/types';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { BulkEditDialog } from '../components/bulk/BulkEditDialog';

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/Sheet';
import { CompanyForm } from '../components/forms/CompanyForm';

type Company = Database['public']['Tables']['companies']['Row'] & {
    contacts: [{ count: number }]; // Count of related contacts
};

export function CompaniesView() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const {
        data,
        pageCount,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting,
        fetchData
    } = useTableData<Company>({
        tableName: 'companies',
        select: '*, contacts(count)',
        filters: { type: 'company' },
        searchQuery: searchTerm,
        searchColumns: ['name', 'tax_id']
    });

    const columns: ColumnDef<Company>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <span className="font-medium">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'tax_id',
            header: 'Tax ID',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
        },
        {
            accessorKey: 'website',
            header: 'Website',
            cell: info => {
                const val = info.getValue() as string;
                return val ? <a href={val} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{val}</a> : '-';
            }
        },
        {
            id: 'contacts_count',
            header: 'Contacts',
            accessorFn: (row: any) => row.contacts?.[0]?.count || 0,
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        }
    ];

    const handleBulkDelete = async (selectedRows: Company[]) => {
        const ids = selectedRows.map(r => r.id);
        const { error } = await supabase.from('companies').delete().in('id', ids);
        if (error) {
            console.error('Error deleting companies:', error);
            // alert('Failed to delete items. Ensure they have no related records.');
            toast.error(`Failed to delete items: ${error.message}. Ensure they have no related records.`);
        } else {
            toast.success(`Deleted ${ids.length} companies`);
            setRowSelection({});
            fetchData();
        }
    };

    const handleBulkExport = async (selectedRows: Company[]) => {
        const headers = ['ID', 'Name', 'Tax ID', 'Phone', 'Website', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...selectedRows.map(row => [
                row.id,
                `"${row.name}"`,
                row.tax_id || '',
                row.phone || '',
                row.website || '',
                row.created_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `companies_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Export initiated');
        }
    };

    const handleBulkEdit = async (field: string, value: any) => {
        const selectedIds = Object.keys(rowSelection);
        if (selectedIds.length === 0) return;

        const { error } = await supabase
            .from('companies')
            .update({ [field]: value })
            .in('id', selectedIds);

        if (error) {
            console.error('Bulk edit error:', error);
            toast.error(`Failed to update items: ${error.message}`);
            throw error;
        } else {
            toast.success(`Updated ${selectedIds.length} companies`);
            setRowSelection({});
            fetchData();
        }
    };

    const handleCreateSubmit = async (data: any) => {
        try {
            const { data: newCompany, error } = await supabase
                .from('companies')
                .insert({
                    ...data,
                    type: 'company',
                    created_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (error) throw error;
            setIsCreateOpen(false);
            navigate(`/database/companies/${newCompany.id}`);
        } catch (err) {
            console.error('Error creating company:', err);
            toast.error('Failed to create company');
        }
    };

    return (
        <ViewContainer
            title="Companies"
            description="Manage your client companies."
            onCreate={() => setIsCreateOpen(true)}
        >
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent
                    className="overflow-y-auto"
                    container={document.getElementById('database-drawer-container')}
                >
                    <SheetHeader>
                        <SheetTitle>Create New Company</SheetTitle>
                        <SheetDescription>
                            Add a new client company. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <CompanyForm onSubmit={handleCreateSubmit} isLoading={false} />
                    </div>
                </SheetContent>
            </Sheet>
            <div className="mb-4 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search companies..."
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
                onRowClick={(row) => navigate(`/database/companies/${row.id}`)}
                enableSelection={true}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkEdit={() => setIsBulkEditOpen(true)}
            />

            <BulkEditDialog
                open={isBulkEditOpen}
                onOpenChange={setIsBulkEditOpen}
                selectedCount={Object.keys(rowSelection).length}
                fields={[
                    { name: 'website', label: 'Website', type: 'text' },
                    { name: 'phone', label: 'Phone', type: 'text' },
                ]}
                onApply={handleBulkEdit}
            />
        </ViewContainer>
    );
}
