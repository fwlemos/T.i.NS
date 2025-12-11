import React from 'react';
import { OpportunityWithRelations } from '../types';
import { User, Building2, Package } from 'lucide-react';

interface RelatedEntitiesPanelProps {
    opportunity: OpportunityWithRelations;
}

export function RelatedEntitiesPanel({ opportunity }: RelatedEntitiesPanelProps) {
    return (
        <div className="space-y-6">
            {/* Contact */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <User size={16} className="text-gray-400" />
                    <h3>Primary Contact</h3>
                </div>
                {opportunity.contact ? (
                    <div className="text-sm space-y-1">
                        <p className="text-gray-900 font-medium">{opportunity.contact.name}</p>
                        <p className="text-gray-500">{opportunity.contact.email}</p>
                        <p className="text-gray-500">{opportunity.contact.phone}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No contact assigned</p>
                )}
            </div>

            {/* Company */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <Building2 size={16} className="text-gray-400" />
                    <h3>Company</h3>
                </div>
                {opportunity.company ? (
                    <div className="text-sm">
                        <p className="text-gray-900 font-medium">{opportunity.company.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{opportunity.company.industry || 'Industry N/A'}</p>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No company assigned</p>
                )}
            </div>

            {/* Products */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                    <Package size={16} className="text-gray-400" />
                    <h3>Products</h3>
                </div>
                {opportunity.products && opportunity.products.length > 0 ? (
                    <div className="space-y-3">
                        {opportunity.products.map(op => (
                            <div key={op.id} className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-start">
                                <div>
                                    <p className="text-gray-900 font-medium">{op.product?.name || 'Unknown Product'}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">Quantity: {op.quantity}</p>
                                </div>
                                <div className="text-xs font-medium text-emerald-600">
                                    {/* Price logic could go here */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 italic">No products added yet.</p>
                )}
                <button className="text-xs font-medium text-gray-900 mt-4 hover:underline flex items-center gap-1">
                    + Add Product
                </button>
            </div>
        </div>
    );
}
