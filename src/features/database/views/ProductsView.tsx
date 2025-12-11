import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/DataTable';
import { ViewContainer } from '../components/ViewContainer';
import { useTableData } from '../hooks/useTableData';
import { Search } from 'lucide-react';
import { Database } from '@/lib/supabase/types';

type Product = Database['public']['Tables']['products']['Row'] & {
    companies: { name: string } | null; // Joined manufacturer
};

export function ProductsView() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data,
        pageCount,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting
    } = useTableData<Product>({
        tableName: 'products',
        select: '*, companies(name)',
        searchQuery: searchTerm,
        searchColumns: ['name', 'part_number']
    });

    const columns: ColumnDef<Product>[] = [
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
    ];

    return (
        <ViewContainer
            title="Products"
            description="Catalog of products from manufacturers."
            onCreate={() => console.log('Create Product')}
        >
            <div className="mb-4 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search products..."
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
            />
        </ViewContainer>
    );
}
