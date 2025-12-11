import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface RelatedOpportunitiesProps {
    entityId: string;
    entityType: 'company' | 'contact' | 'product';
}

export function RelatedOpportunities({ entityId: _entityId, entityType: _entityType }: RelatedOpportunitiesProps) {
    return (
        <div className="h-full flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="font-semibold text-lg">Opportunities</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {/* Placeholder items */}
                <Card>
                    <CardContent className="p-3">
                        <p className="font-medium text-sm">Software License Deal</p>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>Qualification</span>
                            <span>$12,000</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-3">
                        <p className="font-medium text-sm">Service Contract Q4</p>
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>Negotiation</span>
                            <span>$45,000</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
