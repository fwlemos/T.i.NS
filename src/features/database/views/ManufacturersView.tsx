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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/Sheet';
import { ManufacturerForm } from '../components/forms/ManufacturerForm';

type Manufacturer = Database['public']['Tables']['companies']['Row'] & {
    products: [{ count: number }];
};

export function ManufacturersView() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
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
    } = useTableData<Manufacturer>({
        tableName: 'companies',
        select: '*, products(count)',
        filters: { type: 'manufacturer' },
        searchQuery: searchTerm,
        searchColumns: ['name']
    });

    const columns: ColumnDef<Manufacturer>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <span className="font-medium">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'has_exclusivity',
            header: 'Exclusivity',
            cell: info => (
                <span className={`px-2 py-1 rounded-full text-xs ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {info.getValue() ? 'Exclusive' : 'Standard'}
                </span>
            )
        },
        {
            accessorKey: 'contract_validity',
            header: 'Contract Valid Until',
            cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : '-',
        },
        {
            id: 'products_count',
            header: 'Products',
            accessorFn: (row: any) => row.products?.[0]?.count || 0,
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        }
    ];

    const handleCreateSubmit = async (data: any) => {
        try {
            const { error } = await supabase
                .from('companies')
                .insert({
                    ...data,
                    type: 'manufacturer',
                    created_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (error) throw error;
            setIsCreateOpen(false);
            toast.success('Manufacturer created successfully');
            fetchData();
        } catch (err) {
            console.error('Error creating manufacturer:', err);
            toast.error('Failed to create manufacturer');
        }
    };

    const handleBulkDelete = async (selectedRows: Manufacturer[]) => {
        const ids = selectedRows.map(r => r.id);
        const { error } = await supabase.from('companies').delete().in('id', ids);
        if (error) {
            console.error('Error deleting manufacturers:', error);
            toast.error('Failed to delete manufacturers');
        } else {
            fetchData();
            setRowSelection({});
            toast.success('Manufacturers deleted successfully');
        }
    };

    const handleBulkExport = async (selectedRows: Manufacturer[]) => {
        const headers = ['ID', 'Name', 'Exclusivity', 'Contract Valid Until', 'Products Count', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...selectedRows.map(row => [
                row.id,
                `"${row.name}"`,
                row.has_exclusivity ? 'Yes' : 'No',
                row.contract_validity || '',
                row.products?.[0]?.count || 0,
                row.created_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `manufacturers_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <ViewContainer
            title="Manufacturers"
            description="Manage your manufacturers and partners."
            onCreate={() => setIsCreateOpen(true)}
        >
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent
                    className="overflow-y-auto"
                    container={document.getElementById('database-drawer-container')}
                >
                    <SheetHeader>
                        <SheetTitle>Create New Manufacturer</SheetTitle>
                        <SheetDescription>
                            Add a new manufacturer to the database. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <ManufacturerForm onSubmit={handleCreateSubmit} isLoading={false} />
                    </div>
                </SheetContent>
            </Sheet>
            <div className="mb-4 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search manufacturers..."
                    autoComplete="off"
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
                onRowClick={(row) => navigate(`/database/manufacturers/${row.id}`)}
                enableSelection={true}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
            />
        </ViewContainer>
    );
}
