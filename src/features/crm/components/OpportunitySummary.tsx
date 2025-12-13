import { OpportunityWithRelations } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Building2, User, DollarSign, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface OpportunitySummaryProps {
    opportunity: OpportunityWithRelations;
}

export function OpportunitySummary({ opportunity }: OpportunitySummaryProps) {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: opportunity.currency || 'USD',
        maximumFractionDigits: 0
    });

    const companyAddress = opportunity.company?.address as any;
    const city = companyAddress?.city;
    const country = companyAddress?.country;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">General Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 font-medium">Title</label>
                            <p className="text-gray-900 font-medium">{opportunity.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Estimated Value</label>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <DollarSign size={14} className="text-gray-400" />
                                    <span className="text-gray-900 font-medium">
                                        {currencyFormatter.format(opportunity.total_sales_value || 0)}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Created Date</label>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className="text-gray-900">
                                        {format(new Date(opportunity.created_at), 'PPP')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Related Entities */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {opportunity.company && (
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Company</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Building2 size={16} className="text-gray-400" />
                                    <span className="text-gray-900 font-medium">{opportunity.company.name}</span>
                                </div>
                                {(city || country) && (
                                    <div className="flex items-center gap-1.5 mt-1 ml-6 text-xs text-gray-500">
                                        <MapPin size={12} />
                                        <span>
                                            {[city, country].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {opportunity.contact && (
                            <div>
                                <label className="text-xs text-gray-500 font-medium">Contact Person</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <User size={16} className="text-gray-400" />
                                    <span className="text-gray-900 font-medium">{opportunity.contact.name}</span>
                                </div>
                                {opportunity.contact.email && (
                                    <div className="ml-6 mt-0.5 text-xs text-gray-500">
                                        {opportunity.contact.email}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Products Table */}
            {opportunity.products && opportunity.products.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500">Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Product</th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Manufacturer</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-500">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {opportunity.products.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 text-gray-900">{item.product?.name}</td>
                                            <td className="px-4 py-3 text-gray-600">{item.product?.manufacturer?.name || '-'}</td>
                                            <td className="px-4 py-3 text-right text-gray-900">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
