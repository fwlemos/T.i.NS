import { useNavigate } from 'react-router-dom';
import { SearchResultItem } from '../hooks/useGlobalSearch';
import { Building, Users, Box, Factory } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SearchResultsProps {
    results: SearchResultItem[];
    isLoading: boolean;
    onClose: () => void;
}

export function SearchResults({ results, isLoading, onClose }: SearchResultsProps) {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="p-4 text-center text-gray-500">
                <div className="animate-pulse">Searching...</div>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No results found.
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'company': return <Building className="h-4 w-4" />;
            case 'manufacturer': return <Factory className="h-4 w-4" />;
            case 'contact': return <Users className="h-4 w-4" />;
            case 'product': return <Box className="h-4 w-4" />;
            default: return <Building className="h-4 w-4" />;
        }
    };

    const mapTypeToRoute = (type: string) => {
        switch (type) {
            case 'company': return 'companies';
            case 'manufacturer': return 'manufacturers';
            case 'contact': return 'contacts';
            case 'product': return 'products';
            default: return 'companies';
        }
    };

    const handleSelect = (item: SearchResultItem) => {
        navigate(`/database/${mapTypeToRoute(item.entity_type)}/${item.id}`);
        onClose();
    };

    // Group results by type for cleaner display
    // Or display flat list with badges? PRD says "grouped results". 
    // Let's keep it simple flat list with icons for MVP or group if many results.
    // The RPC limits 5 per category, so flat list is fine as they come ordered.

    return (
        <ul className="max-h-[300px] overflow-y-auto py-2">
            {results.map((item) => (
                <li key={`${item.entity_type}-${item.id}`}>
                    <button
                        onClick={() => handleSelect(item)}
                        className={cn(
                            "w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors",
                            "focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800"
                        )}
                    >
                        <div className="text-gray-500 dark:text-gray-400">
                            {getIcon(item.entity_type)}
                        </div>
                        <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {item.primary_text}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.secondary_text} • {item.entity_type.charAt(0).toUpperCase() + item.entity_type.slice(1)}
                            </div>
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
}
