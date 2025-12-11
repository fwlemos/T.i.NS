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

interface RelationalFieldProps {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    entityType: "company" | "manufacturer" | "contact";
    formComponent: React.ComponentType<{
        onSubmit: (data: any) => Promise<void>;
        isLoading?: boolean;
        initialData?: any;
    }>;
    onNestedCreate: (data: any) => Promise<string>; // Must return the new ID
    placeholder?: string;
    className?: string;
}

export function RelationalField({
    label,
    value,
    onChange,
    entityType,
    formComponent: FormComponent,
    onNestedCreate,
    placeholder = "Select...",
    className,
}: RelationalFieldProps) {
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItemName, setSelectedItemName] = useState<string>("");

    // Fetch initial value name if value exists
    useEffect(() => {
        async function fetchName() {
            if (value) {
                const table = entityType === 'contact' ? 'contacts' : 'companies';
                const { data, error } = await supabase
                    .from(table)
                    .select("name")
                    .eq("id", value)
                    .single();

                if (data && !error) {
                    setSelectedItemName(data.name);
                }
            } else {
                setSelectedItemName("");
            }
        }
        fetchName();
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

        const timer = setTimeout(searchItems, 300); // 300ms debounce
        return () => clearTimeout(timer);
    }, [searchTerm, entityType]);

    const handleNestedSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            // Call the parent provided creator, which should return the ID
            const newId = await onNestedCreate(data);

            if (newId) {
                onChange(newId);
                // Optionally fetch the name or assume data.name exists
                if (data.name) setSelectedItemName(data.name);
                setIsCreating(false);
                setOpen(false);
            }
        } catch (error) {
            console.error("Failed to create nested entity", error);
            // Error handling should be managed by UI components (toast)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>

            {!isCreating ? (
                <div className="flex gap-2">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between"
                            >
                                {selectedItemName || placeholder}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder={`Search ${entityType}...`} onValueChange={setSearchTerm} />
                                <CommandList>
                                    <CommandEmpty>No {entityType} found.</CommandEmpty>
                                    <CommandGroup>
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.name}
                                                onSelect={() => {
                                                    onChange(item.id);
                                                    setSelectedItemName(item.name);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === item.id ? "opacity-100" : "opacity-0"
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
                    <Button variant="outline" size="icon" onClick={() => setIsCreating(true)} type="button">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900/50 relative animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-sm">New {entityType}</h4>
                        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)} type="button">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <FormComponent
                        onSubmit={handleNestedSubmit}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}
