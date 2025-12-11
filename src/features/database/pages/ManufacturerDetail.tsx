import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { ManufacturerForm } from '../components/forms/ManufacturerForm';
import { BankingAccountsSection } from '../components/manufacturers/BankingAccountsSection';
import { ContractUploadSection } from '../components/manufacturers/ContractUploadSection';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Manufacturer = Database['public']['Tables']['companies']['Row'];

export function ManufacturerDetail() {
    const { id } = useParams<{ id: string }>();
    const [manufacturer, setManufacturer] = useState<Manufacturer | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    async function fetchManufacturer() {
        if (!id) return;
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .eq('type', 'manufacturer')
            .single();

        if (error) {
            console.error('Error fetching manufacturer:', error);
        } else {
            setManufacturer(data);
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        fetchManufacturer();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !manufacturer) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('companies')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            if (error) throw error;

            toast.success('Manufacturer updated successfully');
            fetchManufacturer();
        } catch (err) {
            console.error('Error updating manufacturer:', err);
            toast.error('Failed to update manufacturer');
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

    if (!manufacturer) {
        return <div className="p-8">Manufacturer not found</div>;
    }

    return (
        <ThreeColumnLayout
            leftContent={
                <ActivityTimeline
                    entityId={id!}
                    entityType="manufacturers" // Changed from 'manufacturer' to match DB table name
                    createdAt={manufacturer?.created_at}
                    createdBy={manufacturer?.created_by}
                />
            }
            centerContent={
                <div className="space-y-8">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-semibold mb-4">Manufacturer Details</h2>
                        <ManufacturerForm initialData={manufacturer} onSubmit={handleSave} isLoading={saving} />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <BankingAccountsSection manufacturerId={id!} />
                    </div>
                </div>
            }
            rightContent={
                <div className="space-y-6 p-4">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <ContractUploadSection
                            manufacturerId={id!}
                            contractFileId={manufacturer.contract_file_id}
                            exclusivityFileId={manufacturer.exclusivity_file_id}
                            onUpdate={fetchManufacturer}
                        />
                    </div>
                    <RelatedOpportunities entityId={id!} entityType="company" />
                </div>
            }
        />
    );
}
