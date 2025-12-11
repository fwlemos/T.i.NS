import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
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
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const {
        data,
        pageCount,
        isLoading,
        pagination,
        setPagination,
        sorting,
        setSorting
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
            const { data: newManufacturer, error } = await supabase
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
            navigate(`/database/manufacturers/${newManufacturer.id}`);
        } catch (err) {
            console.error('Error creating manufacturer:', err);
            toast.error('Failed to create manufacturer');
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
            />
        </ViewContainer>
    );
}
