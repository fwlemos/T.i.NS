import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    SortingState,
    OnChangeFn,
    RowSelectionState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';
import { BulkActionsToolbar } from '@/features/database/components/bulk/BulkActionsToolbar';
import { BulkDeleteDialog } from '@/features/database/components/bulk/BulkDeleteDialog';
import { BulkExportDialog } from '@/features/database/components/bulk/BulkExportDialog';


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageCount: number;
    pagination: PaginationState;
    onPaginationChange: OnChangeFn<PaginationState>;
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    rowSelection?: RowSelectionState;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    isLoading?: boolean;
    onRowClick?: (row: TData) => void;
    enableSelection?: boolean;
    // Bulk Actions
    onBulkDelete?: (selectedRows: TData[]) => Promise<void>;
    onBulkExport?: (selectedRows: TData[]) => Promise<void>;
    onBulkEdit?: () => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    rowSelection,
    onRowSelectionChange,
    isLoading,
    onRowClick,
    enableSelection = false,
    onBulkDelete,
    onBulkExport,
    onBulkEdit,
}: DataTableProps<TData, TValue>) {
    const tableColumns: ColumnDef<TData, TValue>[] = enableSelection
        ? [
            {
                id: 'select',
                header: ({ table }) => (
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                        aria-label="Select all"
                        className="translate-y-[2px]"
                    />
                ),
                cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={(e) => row.toggleSelected(!!e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Select row"
                        className="translate-y-[2px]"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...columns,
        ]
        : columns;

    const table = useReactTable({
        data,
        columns: tableColumns,
        pageCount: pageCount,
        state: {
            pagination,
            sorting,
            ...(rowSelection !== undefined ? { rowSelection } : {}),
        },
        onPaginationChange,
        onSortingChange,
        onRowSelectionChange,
        enableRowSelection: true,
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    // Bulk Action State
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const selectedCount = Object.keys(rowSelection || {}).length;

    const handleBulkDelete = async () => {
        if (!onBulkDelete) return;
        setIsActionLoading(true);
        try {
            const selectedRowsData = table.getSelectedRowModel().rows.map(r => r.original);
            await onBulkDelete(selectedRowsData);
            setShowDeleteDialog(false);
            // Clear selection
            if (onRowSelectionChange) onRowSelectionChange({});
        } catch (error) {
            console.error("Bulk delete failed", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleBulkExport = async () => {
        if (!onBulkExport) return;
        setIsActionLoading(true);
        try {
            const selectedRowsData = table.getSelectedRowModel().rows.map(r => r.original);
            await onBulkExport(selectedRowsData);
            setShowExportDialog(false);
        } catch (error) {
            console.error("Bulk export failed", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="whitespace-nowrap">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick && onRowClick(row.original)}
                                    className={cn(onRowClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50")}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {enableSelection && selectedCount > 0 && (
                <>
                    <BulkActionsToolbar
                        selectedCount={selectedCount}
                        onClearSelection={() => onRowSelectionChange?.({})}
                        onDelete={() => setShowDeleteDialog(true)}
                        onExport={() => setShowExportDialog(true)}
                        onEdit={onBulkEdit}
                    />

                    {onBulkDelete && (
                        <BulkDeleteDialog
                            open={showDeleteDialog}
                            onOpenChange={setShowDeleteDialog}
                            selectedCount={selectedCount}
                            onConfirm={handleBulkDelete}
                            isDeleting={isActionLoading}
                        />
                    )}

                    {onBulkExport && (
                        <BulkExportDialog
                            open={showExportDialog}
                            onOpenChange={setShowExportDialog}
                            selectedCount={selectedCount}
                            onConfirm={handleBulkExport}
                            isExporting={isActionLoading}
                        />
                    )}
                </>
            )}
        </div>
    );
}
