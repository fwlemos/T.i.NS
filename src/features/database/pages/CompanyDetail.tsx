import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { CompanyForm } from '../components/forms/CompanyForm';
import { AuditService } from '../services/AuditService';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Company = Database['public']['Tables']['companies']['Row'];

export function CompanyDetail() {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                setCompany(data);
            }
            setLoading(false);
        }
        fetchCompany();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !company) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('companies')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Audit logging
            const changes = AuditService.calculateDiff(company, data);
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange('company', id, 'UPDATE', changes);
            }

            toast.success('Company updated successfully');
            setCompany({ ...company, ...data });
        } catch (err) {
            console.error('Error updating company:', err);
            toast.error('Failed to update company');
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

    if (!company) {
        return <div className="p-8">Company not found</div>;
    }

    return (
        <ThreeColumnLayout
            leftContent={
                <ActivityTimeline
                    entityId={id!}
                    entityType="company"
                    createdAt={company?.created_at}
                    createdBy={company?.created_by}
                />
            }
            centerContent={<CompanyForm initialData={company} onSubmit={handleSave} isLoading={saving} />}
            rightContent={<RelatedOpportunities entityId={id!} entityType="company" />}
        />
    );
}
