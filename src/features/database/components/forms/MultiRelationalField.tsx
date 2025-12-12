import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
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
    value?: string[];
    onChange: (value: string[]) => void;
    entityType: "company" | "manufacturer" | "contact" | "product";
    formComponent: React.ComponentType<{
        onSubmit: (data: any) => Promise<void>;
        isLoading?: boolean;
        initialData?: any;
        isNested?: boolean;
    }>;
    onNestedCreate: (data: any) => Promise<string>; // Must return the new ID
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function MultiRelationalField({
    label,
    value = [],
    onChange,
    entityType,
    formComponent: FormComponent,
    onNestedCreate,
    className,
    disabled = false,
}: MultiRelationalFieldProps) {
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItemsDetails, setSelectedItemsDetails] = useState<any[]>([]);

    // Fetch details for all selected IDs
    useEffect(() => {
        async function fetchDetails() {
            if (value && value.length > 0) {
                let table = 'companies';
                if (entityType === 'contact') table = 'contacts';
                if (entityType === 'product') table = 'products';

                let selectQuery = "id, name";
                if (entityType === 'contact') {
                    selectQuery += ", city, state_province, country";
                } else if (entityType === 'product') {
                    selectQuery += ", part_number";
                } else {
                    selectQuery += ", address";
                }

                const { data, error } = await supabase
                    .from(table)
                    .select(selectQuery)
                    .in("id", value);

                if (data && !error) {
                    setSelectedItemsDetails(data);
                }
            } else {
                setSelectedItemsDetails([]);
            }
        }
        fetchDetails();
    }, [value, entityType]);

    // Search items
    useEffect(() => {
        async function searchItems() {
            setIsLoading(true);

            let query;
            if (entityType === "company") {
                query = supabase
                    .from("companies")
                    .select("id, name")
                    .eq("type", "company")
                    .ilike("name", `%${searchTerm}%`)
                    .limit(10);
            } else if (entityType === "manufacturer") {
                query = supabase
                    .from("companies")
                    .select("id, name")
                    .eq("type", "manufacturer")
                    .ilike("name", `%${searchTerm}%`)
                    .limit(10);
            } else if (entityType === "product") {
                query = supabase
                    .from("products")
                    .select("id, name")
                    .ilike("name", `%${searchTerm}%`)
                    .limit(10);
            } else {
                query = supabase
                    .from("contacts")
                    .select("id, name")
                    .ilike("name", `%${searchTerm}%`)
                    .limit(10);
            }

            const { data } = await query;
            if (data) setItems(data);
            setIsLoading(false);
        }

        const timer = setTimeout(searchItems, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, entityType]);

    const handleNestedSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const resultId = await onNestedCreate(data);

            if (resultId) {
                const newValue = [...value, resultId];
                onChange(newValue);

                // Fetch new item details to update UI immediately
                let table = 'companies';
                if (entityType === 'contact') table = 'contacts';
                if (entityType === 'product') table = 'products';

                let selectQuery = "id, name";
                if (entityType === 'contact') selectQuery += ", city, state_province, country";
                else if (entityType === 'product') selectQuery += ", part_number";
                else selectQuery += ", address";

                const { data: newData } = await supabase.from(table).select(selectQuery).eq('id', resultId).single();
                if (newData) {
                    setSelectedItemsDetails(prev => [...prev, newData]);
                }

                setIsCreating(false);
                setOpen(false);
            }
        } catch (error: any) {
            console.error("Failed to save nested entity", error);
            if (error?.code === '23505') {
                alert('A record with this name already exists.');
            } else {
                alert(`Failed to save: ${error?.message || 'Unknown error'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = (idToRemove: string) => {
        const newValue = value.filter(id => id !== idToRemove);
        onChange(newValue);
        setSelectedItemsDetails(prev => prev.filter(item => item.id !== idToRemove));
    };

    const getLocationString = (details: any) => {
        if (!details) return "";
        if (entityType === 'product') {
            return details.part_number ? `Part: ${details.part_number}` : "";
        }

        const parts = [];
        if (entityType === 'contact') {
            if (details.city) parts.push(details.city);
            if (details.state_province) parts.push(details.state_province);
            if (details.country) parts.push(details.country);
        } else {
            const addr = details.address;
            if (addr) {
                if (addr.city) parts.push(addr.city);
                if (addr.state_province) parts.push(addr.state_province);
                if (addr.country) parts.push(addr.country);
            }
        }
        return parts.join(", ");
    };

    return (
        <div className={cn("space-y-3", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>

            {/* List of selected items */}
            {selectedItemsDetails.length > 0 && (
                <div className="space-y-2">
                    {selectedItemsDetails.map(item => (
                        <div key={item.id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-3 flex items-center justify-between animate-in fade-in">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <div className="h-4 w-4 bg-primary rounded-full opacity-20" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm">{item.name}</h4>
                                    <p className="text-xs text-muted-foreground">{getLocationString(item)}</p>
                                </div>
                            </div>
                            {!disabled && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemove(item.id)}
                                    type="button"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add button / Popover */}
            {!isCreating ? (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            disabled={disabled}
                            className="w-full justify-between font-normal text-muted-foreground hover:text-foreground"
                        >
                            <span className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Add {entityType}
                            </span>
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                        <Command shouldFilter={false}>
                            <CommandInput placeholder={`Search ${entityType}...`} onValueChange={setSearchTerm} />
                            <CommandList>
                                <CommandEmpty>
                                    <div className="py-6 text-center text-sm">
                                        No {entityType} found.
                                    </div>
                                </CommandEmpty>
                                <CommandGroup>
                                    {items.map((item) => {
                                        const isSelected = value.includes(item.id);
                                        if (isSelected) return null; // Logic: don't show already selected items in dropdown? Or show but disabled?
                                        // Better to filter out or disable.
                                        return (
                                            <CommandItem
                                                key={item.id}
                                                value={item.id}
                                                onSelect={() => {
                                                    const newValue = [...value, item.id];
                                                    onChange(newValue);
                                                    setSelectedItemsDetails(prev => [...prev, { id: item.id, name: item.name }]);
                                                    setOpen(false);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        "opacity-0" // Always hidden since we don't show selected ones
                                                    )}
                                                />
                                                {item.name}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            </CommandList>
                            <div className="border-t p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start font-normal text-primary"
                                    onClick={() => {
                                        setIsCreating(true);
                                        setOpen(false);
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New {entityType}
                                </Button>
                            </div>
                        </Command>
                    </PopoverContent>
                </Popover>
            ) : (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold leading-none tracking-tight">
                                New {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
                            </h3>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCreating(false)}
                                type="button"
                                className="h-8 w-8"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div className="p-6 pt-2">
                        <FormComponent
                            onSubmit={handleNestedSubmit}
                            isLoading={isLoading}
                            isNested={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
