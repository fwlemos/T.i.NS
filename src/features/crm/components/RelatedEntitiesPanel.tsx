import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { OpportunityWithRelations, Company, Contact } from '../types';
import { User, Building2, Package, Factory, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditEntityDrawer, EntityType } from './EditEntityDrawer';
import { AddOpportunityProduct } from './AddOpportunityProduct';
import { DeleteAlertDialog } from '@/components/ui/DeleteAlertDialog';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface RelatedEntitiesPanelProps {
    opportunity: OpportunityWithRelations;
}

export function RelatedEntitiesPanel({ opportunity }: RelatedEntitiesPanelProps) {
    const queryClient = useQueryClient();
    const [editingEntity, setEditingEntity] = useState<{ type: EntityType; id: string; data?: any } | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; type: EntityType | null; id: string | null; isDeleting: boolean }>({
        open: false,
        type: null,
        id: null,
        isDeleting: false
    });

    // Logic: Use opportunity company, fallback to contact's company
    const displayedCompany = opportunity.company || opportunity.contact?.company;
    const isFallbackCompany = !opportunity.company && !!opportunity.contact?.company;

    // Logic: Deduce unique manufacturers from products
    const manufacturersMap = new Map();
    opportunity.products?.forEach(op => {
        if (op.product?.manufacturer) {
            manufacturersMap.set(op.product.manufacturer_id, {
                id: op.product.manufacturer_id,
                ...op.product.manufacturer
            });
        }
    });
    const uniqueManufacturers = Array.from(manufacturersMap.values());

    const handleEdit = (type: EntityType, id: string, data?: any) => {
        setEditingEntity({ type, id, data });
    };

    const handleRemoveClick = (type: EntityType, id: string) => {
        setDeleteConfirmation({ open: true, type, id, isDeleting: false });
    };

    const handleConfirmDelete = async () => {
        const { type, id } = deleteConfirmation;
        if (!type || !id) return;

        setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));

        try {
            let error;
            if (type === 'contact') {
                ({ error } = await supabase.from('opportunities').update({ contact_id: null }).eq('id', opportunity.id));
            } else if (type === 'company') {
                ({ error } = await supabase.from('opportunities').update({ company_id: null }).eq('id', opportunity.id));
            } else if (type === 'product') {
                // Assuming 'id' passed here is the opportunity_product id (op.id) not product.id
                ({ error } = await supabase.from('opportunity_products').delete().eq('id', id));
            }

            if (error) throw error;
            toast.success('Removed successfully');
            queryClient.invalidateQueries({ queryKey: ['opportunity', opportunity.id] });
            setDeleteConfirmation({ open: false, type: null, id: null, isDeleting: false });
        } catch (err) {
            console.error(err);
            toast.error('Failed to remove');
            setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
        }
    };

    const getTypeLabel = (type: EntityType | null) => {
        switch (type) {
            case 'contact': return 'Contact';
            case 'company': return 'Company';
            case 'product': return 'Product';
            default: return 'Item';
        }
    };

    return (
        <div className="space-y-6">
            {/* Contact */}
            <EntityCard
                title="Primary Contact"
                icon={<User size={16} className="text-gray-400" />}
                entity={opportunity.contact}
                onEdit={() => opportunity.contact && handleEdit('contact', opportunity.contact.id, opportunity.contact)}
                onRemove={() => opportunity.contact && handleRemoveClick('contact', opportunity.contact.id)}
                renderContent={(contact: Contact) => (
                    <>
                        <p className="text-gray-900 font-medium">{contact.name}</p>
                        <p className="text-gray-500">{contact.email}</p>
                        <p className="text-gray-500">{contact.phone}</p>
                    </>
                )}
            />

            {/* Company */}
            {(!opportunity.contact?.is_individual || displayedCompany) && (
                <EntityCard
                    title="Company"
                    icon={<Building2 size={16} className="text-gray-400" />}
                    entity={displayedCompany}
                    badge={isFallbackCompany ? "From Contact" : undefined}
                    onEdit={() => displayedCompany && handleEdit('company', displayedCompany.id, displayedCompany)}
                    onRemove={!isFallbackCompany ? () => displayedCompany && handleRemoveClick('company', displayedCompany.id) : undefined}
                    renderContent={(company: Company) => (
                        <>
                            <p className="text-gray-900 font-medium">{company.name}</p>
                            {/* Industry field removed as it does not exist on Company type */}
                        </>
                    )}
                />
            )}

            {/* Manufacturers (Derived) */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <Factory size={16} className="text-gray-400" />
                    <h3>Manufacturers</h3>
                </div>
                {uniqueManufacturers.length > 0 ? (
                    <div className="space-y-3">
                        {uniqueManufacturers.map((manufacturer: any) => (
                            <div key={manufacturer.id} className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-start group">
                                <div>
                                    <p className="text-gray-900 font-medium">{manufacturer.name}</p>
                                    <p className="text-xs text-gray-500">{manufacturer.country || 'No Country'}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-md p-0.5 border border-gray-100">
                                    {/* Manufacturer edit - edits the company record of type manufacturer */}
                                    <button
                                        onClick={() => handleEdit('company', manufacturer.id, manufacturer)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900"
                                        title="Edit Manufacturer Details"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No manufacturers linked.</p>
                )}
            </div>

            {/* Products */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-900 font-semibold">
                        <Package size={16} className="text-gray-400" />
                        <h3>Products</h3>
                    </div>
                    <AddOpportunityProduct
                        opportunityId={opportunity.id}
                        existingProductIds={opportunity.products?.map(op => op.product?.id).filter(Boolean) as string[] || []}
                        onProductAdded={() => queryClient.invalidateQueries({ queryKey: ['opportunity', opportunity.id] })}
                    />
                </div>
                {opportunity.products && opportunity.products.length > 0 ? (
                    <div className="space-y-3">
                        {opportunity.products.map(op => (
                            <div key={op.id} className="group relative text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-start hover:border-emerald-200 transition-colors">
                                <div>
                                    <p className="text-gray-900 font-medium">{op.product?.name || 'Unknown Product'}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Quantity: {op.quantity}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 flex gap-1 bg-white shadow-sm rounded-md p-0.5 border border-gray-100">
                                    <button
                                        onClick={() => op.product && handleEdit('product', op.product.id, op.product)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-900"
                                    >
                                        <Pencil size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveClick('product', op.id)}
                                        className="p-1 hover:bg-red-50 rounded text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No products added yet.</p>
                )}
            </div>

            <EditEntityDrawer
                isOpen={!!editingEntity}
                onClose={() => setEditingEntity(null)}
                entityType={editingEntity?.type || null}
                entityId={editingEntity?.id || null}
                initialData={editingEntity?.data}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['opportunity', opportunity.id] })}
            />

            <DeleteAlertDialog
                open={deleteConfirmation.open}
                onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, open }))}
                title={`Remove ${getTypeLabel(deleteConfirmation.type)}`}
                description={`Are you sure you want to remove this ${getTypeLabel(deleteConfirmation.type).toLowerCase()} from the opportunity? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                isDeleting={deleteConfirmation.isDeleting}
            />
        </div>
    );
}

// Helper Card Component for layout & hover effects
function EntityCard({ title, icon, entity, renderContent, onEdit, onRemove, badge }: any) {
    return (
        <div className="group relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    {icon}
                    <h3>{title}</h3>
                    {badge && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium ml-2">{badge}</span>}
                </div>
                {entity && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-md border border-gray-100 p-0.5 absolute top-4 right-4">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-900" onClick={onEdit}>
                            <Pencil size={12} />
                        </Button>
                        {onRemove && (
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-600" onClick={onRemove}>
                                <Trash2 size={12} />
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {entity ? (
                <div className="text-sm space-y-1">
                    {renderContent(entity)}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic">No {title.toLowerCase()} assigned</p>
            )}
        </div>
    );
}
