
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityHeader } from '../components/layout/EntityHeader';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { ManufacturerForm } from '../components/forms/ManufacturerForm';
import { BankingAccountsSection } from '../components/manufacturers/BankingAccountsSection';
import { ContractUploadSection } from '../components/manufacturers/ContractUploadSection';
import { ManufacturerProductsSection } from '../components/manufacturers/ManufacturerProductsSection';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuditService } from '../services/AuditService';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

type Manufacturer = Database['public']['Tables']['companies']['Row'];

export function ManufacturerDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [manufacturer, setManufacturer] = useState<Manufacturer | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
            let manufacturerData = { ...data, profiles: { full_name: 'Unknown User' } };

            if (data.created_by) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', data.created_by)
                    .single();

                if (profileData) {
                    manufacturerData.profiles = profileData;
                }
            }
            setManufacturer(manufacturerData as any);
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
            // Calculate changes for audit log
            const changes = AuditService.calculateDiff(manufacturer, data);

            const { error } = await supabase
                .from('companies')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Log the update
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange(
                    'manufacturers', // Must match entityType passed to ActivityTimeline
                    id,
                    'UPDATE',
                    changes
                );
            }

            toast.success('Manufacturer updated successfully');
            fetchManufacturer();
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating manufacturer:', err);
            toast.error('Failed to update manufacturer');
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
                .from('companies')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Manufacturer deleted successfully');
            navigate('/database/manufacturers');
        } catch (err) {
            console.error('Error deleting manufacturer:', err);
            toast.error('Failed to delete manufacturer');
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

    if (!manufacturer) {
        return <div className="p-8">Manufacturer not found</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">
            <EntityHeader
                title={manufacturer.name}
                createdAt={manufacturer.created_at}
                createdById={manufacturer.created_by}
                badgeText="Manufacturer"
                badgeColor="bg-purple-100 text-purple-800"
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
                            entityType="manufacturers"
                            createdAt={manufacturer?.created_at}
                            createdBy={manufacturer?.created_by}
                            creatorName={(manufacturer as any)?.profiles?.full_name}
                        />
                    }
                    centerContent={
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="details">Manufacturer Details</TabsTrigger>
                                <TabsTrigger value="products">Product List</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="space-y-6">
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <h2 className="text-lg font-semibold mb-4">Manufacturer Details</h2>
                                    <ManufacturerForm
                                        initialData={manufacturer}
                                        onSubmit={handleSave}
                                        isLoading={saving}
                                        readOnly={!isEditing}
                                    />
                                </div>

                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <BankingAccountsSection manufacturerId={id!} />
                                </div>
                            </TabsContent>

                            <TabsContent value="products">
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <ManufacturerProductsSection manufacturerId={id!} />
                                </div>
                            </TabsContent>
                        </Tabs>
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
            </div>
            <DeleteAlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Manufacturer"
                description="Are you sure you want to delete this manufacturer? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
