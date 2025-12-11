
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityHeader } from '../components/layout/EntityHeader';
import { ThreeColumnLayout } from '../components/layout/ThreeColumnLayout';
import { ActivityTimeline } from '../components/widgets/ActivityTimeline';
import { RelatedOpportunities } from '../components/widgets/RelatedOpportunities';
import { ContactForm } from '../components/forms/ContactForm';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AuditService } from '../services/AuditService';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';

type Contact = Database['public']['Tables']['contacts']['Row'];

export function ContactDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [contact, setContact] = useState<Contact | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
                let contactData = { ...data, profiles: { full_name: 'Unknown User' } };

                if (data.created_by) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('full_name')
                        .eq('id', data.created_by)
                        .single();

                    if (profileData) {
                        contactData.profiles = profileData;
                    }
                }
                setContact(contactData as any);
            }
            setLoading(false);
        }
        fetchContact();
    }, [id]);

    const handleSave = async (data: any) => {
        if (!id || !contact) return;
        setSaving(true);
        try {
            // Calculate changes for audit log
            const changes = AuditService.calculateDiff(contact, data);

            const { error } = await supabase
                .from('contacts')
                .update(data)
                .eq('id', id);

            if (error) throw error;

            // Log the update
            if (Object.keys(changes).length > 0) {
                await AuditService.logChange(
                    'contacts', // Must match entityType passed to ActivityTimeline
                    id,
                    'UPDATE',
                    changes
                );
            }

            toast.success('Contact updated successfully');
            setContact({ ...contact, ...data });
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating contact:', err);
            toast.error('Failed to update contact');
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
                .from('contacts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Contact deleted successfully');
            navigate('/database/contacts');
        } catch (err) {
            console.error('Error deleting contact:', err);
            toast.error('Failed to delete contact');
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

    if (!contact) {
        return <div className="p-8">Contact not found</div>;
    }

    return (
        <div className="flex flex-col h-full space-y-4 p-4 md:p-8 pt-6">
            <EntityHeader
                title={contact.name}
                subtitle={contact.job_title}
                createdAt={contact.created_at}
                createdById={contact.created_by}
                badgeText={contact.is_individual ? 'Individual' : 'Professional'}
                badgeColor={contact.is_individual ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
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
                            entityType="contacts"
                            createdAt={contact?.created_at}
                            createdBy={contact?.created_by}
                            creatorName={(contact as any)?.profiles?.full_name}
                        />
                    }
                    centerContent={
                        <ContactForm
                            initialData={contact}
                            onSubmit={handleSave}
                            isLoading={saving}
                            readOnly={!isEditing}
                        />
                    }
                    rightContent={<RelatedOpportunities entityId={id!} entityType="contact" />}
                />
            </div>
            <DeleteAlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Contact"
                description="Are you sure you want to delete this contact? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}
