import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { OpportunityWithRelations, PipelineStage } from '../types';
import { useOpportunities } from '../hooks/useOpportunities';
import { useCRMOptions } from '../hooks/useCRMOptions';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
// import { Button } from '@/components/ui/Button';

interface StageAccordionProps {
    opportunity: OpportunityWithRelations;
    stages: PipelineStage[];
    readOnly?: boolean;
}

export function StageAccordion({ opportunity, stages, expandedStages, onToggle, readOnly }: StageAccordionProps & { expandedStages: string[]; onToggle: (id: string) => void }) {
    const currentStageIdx = stages.findIndex(s => s.id === opportunity.stage_id);

    return (
        <div className="space-y-4">
            {stages.map((stage, index) => {
                const isActive = stage.id === opportunity.stage_id;
                const isPast = currentStageIdx > index;
                const isExpanded = expandedStages.includes(stage.id);

                return (
                    <div
                        key={stage.id}
                        className={cn(
                            "rounded-xl border transition-all duration-300",
                            isActive
                                ? "bg-white border-emerald-500 shadow-[0_4px_20px_-2px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/10"
                                : "bg-white border-gray-200 hover:border-gray-300",
                            isPast && "bg-gray-50/50 border-gray-200 opacity-80"
                        )}
                    >
                        <div
                            className="p-5 flex items-center justify-between cursor-pointer select-none"
                            onClick={() => onToggle(stage.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                    isPast
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : isActive
                                            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                            : "bg-gray-100 text-gray-500"
                                )}>
                                    {isPast ? <Check size={14} strokeWidth={3} /> : index + 1}
                                </div>
                                <span className={cn(
                                    "font-semibold text-sm",
                                    isActive ? "text-gray-900" : "text-gray-500"
                                )}>
                                    {stage.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {isActive && <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wide">Current</span>}
                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                            </div>
                        </div>

                        {isExpanded && (
                            <div className="px-5 pb-6 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="h-px bg-gray-100 w-full mb-6" />
                                <StageContent stage={stage} opportunity={opportunity} readOnly={readOnly} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function StageContent({ stage, opportunity, readOnly }: { stage: PipelineStage, opportunity: OpportunityWithRelations, readOnly?: boolean }) {
    const { updateOpportunity } = useOpportunities();
    const { incoterms, saleTypes, paymentTerms } = useCRMOptions();
    const [saving, setSaving] = useState(false);

    const handleSave = async (field: string, value: any) => {
        if (readOnly) return;
        setSaving(true);
        try {
            await updateOpportunity.mutateAsync({
                id: opportunity.id,
                data: { [field]: value }
            });
        } catch (e) {
            console.error('Save failed', e);
        } finally {
            setSaving(false);
        }
    };

    // Generic field renderer
    const renderField = (label: string, field: keyof OpportunityWithRelations, type: 'text' | 'textarea' | 'date' | 'number' | 'select', options?: any[]) => {
        const value = opportunity[field] as any || '';

        return (
            <div className="space-y-2" key={field as string}>
                <Label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</Label>
                {type === 'textarea' ? (
                    <Textarea
                        defaultValue={value}
                        onBlur={(e) => handleSave(field as string, e.target.value)}
                        className="bg-white border-gray-200 text-gray-900 text-sm min-h-[100px] focus:border-gray-900 focus:ring-gray-900/5 resize-none shadow-sm"
                        disabled={readOnly}
                    />
                ) : type === 'select' ? (
                    <Select onValueChange={(val) => handleSave(field as string, val)} defaultValue={value} disabled={readOnly}>
                        <SelectTrigger className="bg-white border-gray-200 text-gray-900 h-10 shadow-sm hover:bg-gray-50 focus:ring-gray-900/5">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900 shadow-md">
                            {options?.map(opt => (
                                <SelectItem key={opt.id} value={opt.id}>{opt.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <Input
                        type={type}
                        defaultValue={value}
                        onBlur={(e) => handleSave(field as string, e.target.value)}
                        className="bg-white border-gray-200 text-gray-900 h-10 shadow-sm focus:border-gray-900 focus:ring-gray-900/5"
                        disabled={readOnly}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stage.position === 1 && (
                <>
                    {renderField('Usage Description', 'usage_description', 'textarea')}
                    <div className="col-span-2 p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2 border border-blue-100/50">
                        <AlertCircle size={16} className="mt-0.5" />
                        Capture the initial requirements and customer pain points here.
                    </div>
                </>
            )}

            {stage.position === 2 && (
                <>
                    {renderField('Usage Description (Refined)', 'usage_description', 'textarea')}
                </>
            )}

            {stage.position === 3 && (
                <>
                    {renderField('Type of Sale', 'type_of_sale_id', 'select', saleTypes)}
                    {renderField('Incoterm', 'incoterm_id', 'select', incoterms)}
                    {renderField('Payment Terms (Client)', 'client_payment_terms_id', 'select', paymentTerms)}
                    {renderField('Est. Close Date', 'estimated_close_date', 'date')}
                    {renderField('Est. Delivery (Weeks)', 'estimated_delivery_weeks', 'number')}
                </>
            )}

            {stage.position === 4 && (
                <>
                    {renderField('PO Justification', 'purchase_order_justification', 'textarea')}
                    {renderField('Payment Terms (Manufacturer)', 'manufacturer_payment_terms_id', 'select', paymentTerms)}
                    {renderField('Client Delivery Deadline', 'client_delivery_deadline', 'date')}
                    {renderField('Mfg Delivery Deadline', 'manufacturer_delivery_deadline', 'date')}
                </>
            )}

            {stage.position > 4 && (
                <div className="col-span-2 text-sm text-gray-400 italic text-center py-4">
                    Stage outcomes are recorded in the Won/Lost analysis.
                </div>
            )}
        </div>
    );
}
