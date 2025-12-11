import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { ProductForm } from '../components/forms/ProductForm';
import { AuditService } from '../services/AuditService';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Product = Database['public']['Tables']['products']['Row'];

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                setProduct(data);
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !product) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('products')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Audit logging
            const changes = AuditService.calculateDiff(product, data);
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange('product', id, 'UPDATE', changes);
            }

            toast.success('Product updated successfully');
            setProduct({ ...product, ...data });
        } catch (err) {
            console.error('Error updating product:', err);
            toast.error('Failed to update product');
        } finally {
            setSaving(false);
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
        <ThreeColumnLayout
            leftContent={
                <ActivityTimeline
                    entityId={id!}
                    entityType="product"
                    createdAt={product?.created_at}
                    createdBy={product?.created_by}
                />
            }
            centerContent={<ProductForm initialData={product} onSubmit={handleSave} isLoading={saving} />}
            rightContent={<RelatedOpportunities entityId={id!} entityType="product" />}
        />
    );
}
