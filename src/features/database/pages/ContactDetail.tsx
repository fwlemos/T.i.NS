import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { ContactForm } from '../components/forms/ContactForm';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuditService } from '../services/AuditService';

type Contact = Database['public']['Tables']['contacts']['Row'];

export function ContactDetail() {
    const { id } = useParams<{ id: string }>();
    const [contact, setContact] = useState<Contact | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchContact() {
            if (!id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching contact:', error);
                toast.error('Failed to load contact');
            } else {
                setContact(data);
            }
            setLoading(false);
        }
        fetchContact();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !contact) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('contacts')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Audit logging
            const changes = AuditService.calculateDiff(contact, data);
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange('contact', id, 'UPDATE', changes);
            }

            toast.success('Contact updated successfully');
            setContact({ ...contact, ...data });
        } catch (err) {
            console.error('Error updating contact:', err);
            toast.error('Failed to update contact');
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

    if (!contact) {
        return <div className="p-8">Contact not found</div>;
    }

    return (
        <ThreeColumnLayout
            leftContent={
                <ActivityTimeline
                    entityId={id!}
                    entityType="contact"
                    createdAt={contact?.created_at}
                    createdBy={contact?.created_by}
                />
            }
            centerContent={<ContactForm initialData={contact} onSubmit={handleSave} isLoading={saving} />}
            rightContent={<RelatedOpportunities entityId={id!} entityType="contact" />}
        />
    );
}
