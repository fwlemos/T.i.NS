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
        isNested?: boolean;
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
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [items, setItems] = useState<{ id: string; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItemName, setSelectedItemName] = useState<string>("");
    const [selectedItemDetails, setSelectedItemDetails] = useState<any>(null);

    // Fetch initial value details if value exists
    useEffect(() => {
        async function fetchDetails() {
            if (value) {
                const table = entityType === 'contact' ? 'contacts' : 'companies';

                // Construct query based on entity type to get address info
                let selectQuery = "id, name";
                if (entityType === 'contact') {
                    selectQuery += ", city, state_province, country";
                } else {
                    // companies/manufacturers have address json column
                    selectQuery += ", address";
                }

                const { data, error } = await supabase
                    .from(table)
                    .select(selectQuery)
                    .eq("id", value)
                    .single();

                if (data && !error) {
                    setSelectedItemName((data as any).name);
                    setSelectedItemDetails(data);
                }
            } else {
                setSelectedItemName("");
                setSelectedItemDetails(null);
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
            // Call the parent provided creator - for Edit it might be different, but for now we assume Create/Update logic is handled or we just re-select
            // Actually, for EDIT we need to UPDATE, not CREATE. 
            // Since onNestedCreate is currently designed for CREATE, we strictly need an onNestedUpdate prop or logic.
            // However, the prompt asked for "maybe editable". 
            // For now, let's implement the UI and simple re-selection or "Edit" opening the form.
            // If we are editing, we likely need to use a different Supabase call (update) instead of insert.
            // Given the limitations of current props, let's assume we reuse the form for viewing/editing but 
            // we might need to inject an 'update' handler or just rely on 'onNestedCreate' for now if the user sends a new one?
            // Wait, if we edit an existing company, we shouldn't create a NEW one.
            // Let's implement a rudimentary "Update" support if possible, otherwise just UI.

            // NOTE: The current `onNestedCreate` ONLY inserts. 
            // We need to support UPDATING the entity if we are in edit mode.
            // For this iteration, I will support the UI flow: Opening the form with data.
            // But the actual SAVE needs to perform an UPDATE.
            // I'll add a check. If `isEditing` is true, we need to UPDATE.

            let resultId = "";
            if (isEditing && selectedItemDetails?.id) {
                const table = entityType === 'contact' ? 'contacts' : 'companies';
                const { error } = await supabase
                    .from(table)
                    .update({ ...data, updated_at: new Date().toISOString() })
                    .eq('id', selectedItemDetails.id);

                if (error) throw error;
                resultId = selectedItemDetails.id;
            } else {
                resultId = await onNestedCreate(data);
            }

            if (resultId) {
                onChange(resultId);
                // Refetch details to update card immediately
                const table = entityType === 'contact' ? 'contacts' : 'companies';
                let selectQuery = "id, name";
                if (entityType === 'contact') selectQuery += ", city, state_province, country";
                else selectQuery += ", address";

                const { data: newData } = await supabase.from(table).select(selectQuery).eq('id', resultId).single();
                if (data && !error) {
                    setSelectedItemName((data as any).name);
                    setSelectedItemDetails(data);
                }

                setIsCreating(false);
                setIsEditing(false);
                setOpen(false);
            }
        } catch (error) {
            console.error("Failed to save nested entity", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setSelectedItemName("");
        setSelectedItemDetails(null);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsCreating(true); // Re-use the creation / form view
    };

    // Helper to format location
    const getLocationString = (details: any) => {
        if (!details) return "";
        const parts = [];
        if (entityType === 'contact') {
            if (details.city) parts.push(details.city);
            if (details.state_province) parts.push(details.state_province);
            if (details.country) parts.push(details.country);
        } else {
            // Company/Manufacturer address is JSON
            const addr = details.address;
            if (addr) {
                if (addr.city) parts.push(addr.city);
                if (addr.state_province) parts.push(addr.state_province);
                if (addr.country) parts.push(addr.country);
            }
        }
        return parts.join(", ");
    };

    const renderCard = () => (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    {/* Icon placeholder */}
                    <div className="h-5 w-5 bg-primary rounded-full opacity-20" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm">{selectedItemDetails?.name}</h4>
                    <p className="text-xs text-muted-foreground">{getLocationString(selectedItemDetails)}</p>
                </div>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={handleEdit} type="button">
                    {/* Edit Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleRemove} type="button">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>

            {selectedItemDetails && !isCreating && !open ? (
                renderCard()
            ) : (
                !isCreating ? (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className={cn(
                                    "w-full justify-between font-normal text-left",
                                    !selectedItemName && "text-muted-foreground"
                                )}
                            >
                                {selectedItemName || placeholder}
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
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.id} // Use ID for uniqueness
                                                onSelect={() => {
                                                    onChange(item.id);
                                                    setSelectedItemName(item.name);
                                                    // Optimistic update so card shows immediately
                                                    // Ensure we cast or construct the object safely, we know items has id and name
                                                    setSelectedItemDetails({ id: item.id, name: item.name });
                                                    setOpen(false);
                                                }}
                                                // Force enable pointer events and remove opacity reduction even if cmdk thinks it's disabled
                                                className="cursor-pointer data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
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
                                <div className="border-t p-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start font-normal text-primary"
                                        onClick={() => {
                                            setIsCreating(true);
                                            setIsEditing(false);
                                            setOpen(false);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add {entityType}
                                    </Button>
                                </div>
                            </Command>
                        </PopoverContent>
                    </Popover>
                ) : (
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col space-y-1.5 p-6 pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-primary/10 rounded-full">
                                        <Plus className="h-4 w-4 text-primary" />
                                    </div>
                                    <h3 className="font-semibold leading-none tracking-tight">
                                        {isEditing ? `Edit ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}` : `New ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`}
                                    </h3>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setIsEditing(false);
                                    }}
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
                                initialData={isEditing ? selectedItemDetails : undefined}
                            />
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
