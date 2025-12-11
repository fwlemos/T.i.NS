import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityHeader } from '../components/layout/EntityHeader';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { CompanyForm } from '../components/forms/CompanyForm';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuditService } from '../services/AuditService';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { CompanyEmployeesSection } from '../components/companies/CompanyEmployeesSection';

type Company = Database['public']['Tables']['companies']['Row'];

export function CompanyDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [company, setCompany] = useState<Company | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        async function fetchCompany() {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('companies')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching company:', error);
                toast.error('Failed to load company');
            } else {
                let companyData = { ...data, profiles: { full_name: 'Unknown User' } };

                if (data.created_by) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', data.created_by)
                        .single();

                    if (profileData) {
                        companyData.profiles = profileData;
                    }
                }
                setCompany(companyData as any);
            }
            setLoading(false);
        }
        fetchCompany();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !company) return;
        setSaving(true);
        try {
            // Calculate changes for audit log
            const changes = AuditService.calculateDiff(company, data);

            const { error } = await supabase
                .from('companies')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Log the update
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange(
                    'companies', // Must match entityType passed to ActivityTimeline
                    id,
                    'UPDATE',
                    changes
                );
            }

            toast.success('Company updated successfully');
            setCompany({ ...company, ...data });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating company:', err);
            toast.error('Failed to update company');
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

            toast.success('Company deleted successfully');
            navigate('/database/companies');
        } catch (err) {
            console.error('Error deleting company:', err);
            toast.error('Failed to delete company');
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

    if (!company) {
        return <div className="p-8">Company not found</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">
            <EntityHeader
                title={company.name}
                createdAt={company.created_at}
                createdById={company.created_by}
                badgeText={company.type === 'manufacturer' ? 'Manufacturer' : 'Company'}
                badgeColor="bg-blue-100 text-blue-800"
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
                            entityType="companies"
                            createdAt={company?.created_at}
                            createdBy={company?.created_by}
                            creatorName={(company as any)?.profiles?.full_name}
                        />
                    }
                    centerContent={
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="details">Company Details</TabsTrigger>
                                <TabsTrigger value="employees">Employees</TabsTrigger>
                            </TabsList>

                            <TabsContent value="details" className="bg-white rounded-lg shadow-sm border p-6">
                                <CompanyForm
                                    initialData={company}
                                    onSubmit={handleSave}
                                    isLoading={saving}
                                    readOnly={!isEditing}
                                />
                            </TabsContent>

                            <TabsContent value="employees">
                                <div className="bg-white rounded-lg shadow-sm border p-6">
                                    <CompanyEmployeesSection companyId={id!} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    }
                    rightContent={<RelatedOpportunities entityId={id!} entityType="company" />}
                />
            </div>
            <DeleteAlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Company"
                description="Are you sure you want to delete this company? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
