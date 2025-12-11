import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityHeader } from '../components/layout/EntityHeader';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { ProductForm } from '../components/forms/ProductForm';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuditService } from '../services/AuditService';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';

type Product = Database['public']['Tables']['products']['Row'];

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
                toast.error('Failed to load product');
            } else {
                let productData = { ...data, profiles: { full_name: 'Unknown User' } };

                if (data.created_by) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', data.created_by)
                        .single();

                    if (profileData) {
                        productData.profiles = profileData;
                    }
                }
                setProduct(productData as any);
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !product) return;
        setSaving(true);
        try {
            // Calculate changes for audit log
            const changes = AuditService.calculateDiff(product, data);

            const { error } = await supabase
                .from('products')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Log the update
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange(
                    'products', // Must match entityType passed to ActivityTimeline
                    id,
                    'UPDATE',
                    changes
                );
            }

            toast.success('Product updated successfully');
            setProduct({ ...product, ...data });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating product:', err);
            toast.error('Failed to update product');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!id) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Product deleted successfully');
            navigate('/database/products');
        } catch (err) {
            console.error('Error deleting product:', err);
            toast.error('Failed to delete product');
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return <div className="p-8">Product not found</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">
            <EntityHeader
                title={product.name}
                subtitle={`Part #: ${product.part_number || 'N/A'}`}
                createdAt={product.created_at}
                createdById={product.created_by}
                badgeText="Product"
                badgeColor="bg-orange-100 text-orange-800"
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeleteClick}
                isEditing={isEditing}
                onCancel={() => setIsEditing(false)}
            />
            <div className="flex-1 min-h-0">
                <ThreeColumnLayout
                    leftContent={
                        <ActivityTimeline
                            entityId={id!}
                            entityType="products"
                            createdAt={product?.created_at}
                            createdBy={product?.created_by}
                            creatorName={(product as any)?.profiles?.full_name}
                        />
                    }
                    centerContent={
                        <ProductForm
                            initialData={product}
                            onSubmit={handleSave}
                            isLoading={saving}
                            readOnly={!isEditing}
                        />
                    }
                    rightContent={<RelatedOpportunities entityId={id!} entityType="product" />}
                />
            </div>

            <DeleteAlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Product"
                description="Are you sure you want to delete this product? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
