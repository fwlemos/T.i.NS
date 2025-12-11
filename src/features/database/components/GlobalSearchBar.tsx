import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import { SearchResults } from './SearchResults';
import { cn } from '@/lib/utils/cn';

export function GlobalSearchBar() {
    const { query, setQuery, results, setResults, isLoading, isOpen, setIsOpen } = useGlobalSearch();
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [setIsOpen]);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length >= 2) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.length >= 2) setIsOpen(true);
                    }}
                    className={cn(
                        "block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out",
                        isOpen && query.length >= 2 ? "rounded-b-none" : ""
                    )}
                    placeholder="Search... (Cmd+K)"
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('');
                            setResults([]);
                            inputRef.current?.focus();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {isOpen && query.length >= 2 && (
                <div className="absolute z-50 w-full bg-white dark:bg-gray-800 shadow-lg rounded-b-md border border-t-0 border-gray-300 dark:border-gray-600">
                    <SearchResults
                        results={results}
                        isLoading={isLoading}
                        onClose={() => {
                            setIsOpen(false);
                            setQuery('');
                        }}
                    />
                </div>
            )}
        </div>
    );
}
