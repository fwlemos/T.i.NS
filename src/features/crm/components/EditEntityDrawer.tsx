import React from 'react';
import { AppDrawer } from '@/components/ui/AppDrawer';
import { ContactForm } from '@/features/database/components/forms/ContactForm';
import { CompanyForm } from '@/features/database/components/forms/CompanyForm';
import { ProductForm } from '@/features/database/components/forms/ProductForm';
import { Contact, Company, OpportunityWithRelations } from '../types';

export type EntityType = 'contact' | 'company' | 'product';

interface EditEntityDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    entityType: EntityType | null;
    entityId: string | null;
    initialData?: any;
    onSuccess?: () => void;
}

import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function EditEntityDrawer({ isOpen, onClose, entityType, entityId, initialData, onSuccess }: EditEntityDrawerProps) {
    const getTitle = () => {
        switch (entityType) {
            case 'contact': return 'Edit Contact';
            case 'company': return 'Edit Company';
            case 'product': return 'Edit Product';
            default: return 'Edit Entity';
        }
    };

    const handleUpdate = async (table: string, data: any) => {
        try {
            // Filter out undefined/nulls if needed, or rely on form values
            const { error } = await supabase
                .from(table)
                .update(data)
                .eq('id', entityId);

            if (error) throw error;

            toast.success(`${getTitle()} updated successfully`);
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update entity');
        }
    };

    const renderForm = () => {
        if (!entityId) return null;

        const commonProps = {
            onCancel: onClose,
            initialData, // We need to pass initial data here. RelatedEntitiesPanel needs to pass it or we fetch it.
            // For now assuming RelatedEntitiesPanel passes object as initialData or we rely on form fetching if ID provided?
            // Forms usually expect initialData object.
            isNested: true
        };

        switch (entityType) {
            case 'contact':
                // ContactForm fetches data if not provided? No, usually expects initialData for edit.
                // We'll trust initialData is passed correctly from panel.
                return (
                    <ContactForm
                        {...commonProps}
                        initialData={initialData}
                        onSubmit={(data) => handleUpdate('contacts', data)}
                    />
                );
            case 'company':
                return (
                    <CompanyForm
                        {...commonProps}
                        initialData={initialData}
                        onSubmit={(data) => handleUpdate('companies', data)}
                    />
                );
            case 'product':
                return (
                    <ProductForm
                        {...commonProps}
                        initialData={initialData}
                        onSubmit={(data) => handleUpdate('products', data)} // Warning: Product update might be on opportunity_products or products table?
                    // Context: "Edit Product" usually means editing the product definition itself in the library.
                    // If user wants to edit quantity/price on opportunity, that's different.
                    // Requirement says "Entities... Edit/Remove".
                    // Use case: Changing a typo in a contact name.
                    // So updating 'products' table is correct.
                    />
                );
            default:
                return null;
        }
    };

    return (
        <AppDrawer
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title={getTitle()}
            description={`Update the ${entityType} details below.`}
        >
            <div className="p-4">
                {renderForm()}
            </div>
        </AppDrawer>
    );
}
