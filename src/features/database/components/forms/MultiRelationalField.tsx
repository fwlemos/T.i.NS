import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";
import { supabase } from "@/lib/supabase/client";

interface MultiRelationalFieldProps {
    label: string;
    values: string[]; // Array of IDs
    onChange: (values: string[]) => void;
    entityType: "company" | "manufacturer" | "contact";
    placeholder?: string;
    className?: string;
}

export function MultiRelationalField({
    label,
    values = [],
    onChange,
    entityType,
    placeholder = "Select...",
    className,
}: MultiRelationalFieldProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [selectedItems, setSelectedItems] = useState<{ id: string; name: string }[]>([]);
    // const [isLoading, setIsLoading] = useState(false); // Removed unused, currently using local loading effect internally implicitly via await

    // Fetch details for initial values
    useEffect(() => {
        async function fetchDetails() {
            if (values.length > 0) {
                const table = entityType === 'contact' ? 'contacts' : 'companies';
                const { data } = await supabase
                    .from(table)
                    .select("id, name")
                    .in("id", values);

                if (data) setSelectedItems(data);
            } else {
                setSelectedItems([]);
            }
        }
        fetchDetails();
    }, [values.length, entityType]); // Only re-fetch if length changes or type, optimizing to avoid loops

    // Search items
    useEffect(() => {
        async function searchItems() {
            // setIsLoading(true);
            let query;
            const table = entityType === 'contact' ? 'contacts' : 'companies';

            query = supabase
                .from(table)
                .select("id, name")
                .ilike("name", `%${searchTerm}%`)
                .limit(10);

            if (entityType === "company") {
                query = query.eq("type", "company");
            } else if (entityType === "manufacturer") {
                query = query.eq("type", "manufacturer");
            }

            const { data } = await query;
            if (data) setItems(data);
            // setIsLoading(false);
        }

        const timer = setTimeout(searchItems, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, entityType]);

    const handleSelect = (item: { id: string; name: string }) => {
        const isSelected = values.includes(item.id);
        if (isSelected) {
            // Remove
            const newValues = values.filter(v => v !== item.id);
            onChange(newValues);
            setSelectedItems(prev => prev.filter(p => p.id !== item.id));
        } else {
            // Add
            const newValues = [...values, item.id];
            onChange(newValues);
            setSelectedItems(prev => [...prev, item]);
        }
    };

    const handleRemove = (id: string) => {
        const newValues = values.filter(v => v !== id);
        onChange(newValues);
        setSelectedItems(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium leading-none">{label}</label>

            <div className="flex flex-wrap gap-2 mb-2">
                {selectedItems.map(item => (
                    <Badge key={item.id} variant="secondary" className="flex items-center gap-1">
                        {item.name}
                        <button type="button" onClick={() => handleRemove(item.id)} className="ml-1 hover:text-red-500">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                        {placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${entityType}...`} onValueChange={setSearchTerm} />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => handleSelect(item)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                values.includes(item.id) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {item.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
