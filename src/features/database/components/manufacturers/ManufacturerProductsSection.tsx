import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2, Package, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/Button';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/Sheet';
import { ProductForm } from '../forms/ProductForm';
import { toast } from 'sonner';

type Product = Database['public']['Tables']['products']['Row'];

interface ManufacturerProductsSectionProps {
    manufacturerId: string;
}

export function ManufacturerProductsSection({ manufacturerId }: ManufacturerProductsSectionProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    async function fetchProducts() {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('manufacturer_id', manufacturerId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching manufacturer products:', error);
        } else {
            setProducts(data || []);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (manufacturerId) {
            fetchProducts();
        }
    }, [manufacturerId]);

    const handleDeleteClick = (product: Product) => {
        setDeletingProductId(product.id);
    };

    const handleConfirmDelete = async () => {
        if (!deletingProductId) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase.from('products').delete().eq('id', deletingProductId);
            if (error) throw error;
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        } finally {
            setIsDeleting(false);
            setDeletingProductId(null);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
    };

    const handleUpdateSubmit = async (data: any) => {
        if (!editingProduct) return;
        try {
            const { error } = await supabase
                .from('products')
                .update(data)
                .eq('id', editingProduct.id);

            if (error) throw error;
            toast.success('Product updated successfully');
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Failed to update product');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products ({products.length})
                </h3>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Part Number</TableHead>
                            <TableHead>Warranty</TableHead>
                            <TableHead className="w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No products found for this manufacturer.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-muted/50 group">
                                    <TableCell className="font-medium">
                                        <Link
                                            to={`/database/products/${product.id}`}
                                            className="text-primary hover:underline"
                                        >
                                            {product.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{product.part_number || '-'}</TableCell>
                                    <TableCell>{product.default_warranty_years ? `${product.default_warranty_years} yrs` : '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleEditClick(product)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(product)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteAlertDialog
                open={!!deletingProductId}
                onOpenChange={(open) => !open && setDeletingProductId(null)}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            <Sheet open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
                <SheetContent className="overflow-y-auto" container={document.getElementById('database-drawer-container')}>
                    <SheetHeader>
                        <SheetTitle>Edit Product</SheetTitle>
                        <SheetDescription>Make changes to the product details.</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        {editingProduct && (
                            <ProductForm
                                initialData={editingProduct}
                                onSubmit={handleUpdateSubmit}
                                isLoading={false}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
