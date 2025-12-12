import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { ViewContainer } from '../components/ViewContainer';
import { useTableData } from '../hooks/useTableData';
import { Search } from 'lucide-react';
import { Database } from '@/lib/supabase/types';

import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { AppDrawer } from '@/components/ui/AppDrawer';
import { ProductForm } from '../components/forms/ProductForm';

type Product = Database['public']['Tables']['products']['Row'] & {
    companies: { name: string } | null; // Joined manufacturer
};

export function ProductsView() {
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
    } = useTableData<Product>({
        tableName: 'products',
        select: '*, companies(name)',
        searchQuery: searchTerm,
        searchColumns: ['name', 'part_number']
    });

    const columns = useMemo<ColumnDef<Product>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: info => <span className="font-medium">{info.getValue() as string}</span>
        },
        {
            accessorKey: 'part_number',
            header: 'Part Number',
        },
        {
            id: 'manufacturer',
            header: 'Manufacturer',
            accessorFn: (row) => row.companies?.name || '-',
        },
        {
            accessorKey: 'default_warranty_years',
            header: 'Warranty (Years)',
            cell: info => info.getValue() ? `${info.getValue()} yrs` : '-',
        },
        {
            accessorKey: 'created_at',
            header: 'Created',
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        }
    ], []);

    const handleCreateSubmit = async (data: any) => {
        try {
            const { error } = await supabase
                .from('products')
                .insert({
                    ...data,
                    created_by: (await supabase.auth.getUser()).data.user?.id
                })
                .select()
                .single();

            if (error) throw error;
            setIsCreateOpen(false);
            toast.success('Product created successfully');
            fetchData();
        } catch (err) {
            console.error('Error creating product:', err);
            toast.error('Failed to create product');
        }
    };

    const handleBulkDelete = async (selectedRows: Product[]) => {
        const ids = selectedRows.map(r => r.id);
        const { error } = await supabase.from('products').delete().in('id', ids);
        if (error) {
            console.error('Error deleting products:', error);
            toast.error('Failed to delete products');
        } else {
            fetchData();
            setRowSelection({});
            toast.success('Products deleted successfully');
        }
    };

    const handleBulkExport = async (selectedRows: Product[]) => {
        const headers = ['ID', 'Name', 'Part Number', 'Manufacturer', 'Warranty', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...selectedRows.map(row => [
                row.id,
                `"${row.name}"`,
                row.part_number || '',
                `"${row.companies?.name || ''}"`,
                row.default_warranty_years || '',
                row.created_at
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <ViewContainer
            title="Products"
            description="Catalog of products from manufacturers."
            onCreate={() => setIsCreateOpen(true)}
        >
            <AppDrawer
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                title="Create New Product"
                description="Add a new product to the catalog. Click save when you're done."
            >
                <div className="mt-6">
                    <ProductForm onSubmit={handleCreateSubmit} isLoading={false} isNested={true} />
                </div>
            </AppDrawer>
            <div className="mb-4 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search products..."
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
                onRowClick={(row) => navigate(`/database/products/${row.id}`)}
                enableSelection={true}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
            />
        </ViewContainer>
    );
}
