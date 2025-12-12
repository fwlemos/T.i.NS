import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
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
import { AppDrawer } from "@/components/ui/AppDrawer";
import { ProductForm } from "@/features/database/components/forms/ProductForm";
import { supabase } from "@/lib/supabase/client";
import { toast } from 'sonner';

interface AddOpportunityProductProps {
    opportunityId: string;
    existingProductIds: string[];
    onProductAdded: () => void;
}

export function AddOpportunityProduct({ opportunityId, existingProductIds, onProductAdded }: AddOpportunityProductProps) {
    const [open, setOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<{ id: string; name: string; part_number?: string }[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('products')
                .select('id, name, part_number')
                .ilike('name', `%${searchTerm}%`)
                .limit(20);

            if (data) {
                setProducts(data);
            }
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleAdd = async (productId: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('opportunity_products')
                .insert({
                    opportunity_id: opportunityId,
                    product_id: productId,
                    quantity: 1
                });

            if (error) throw error;

            toast.success('Product added successfully');
            onProductAdded();
            setOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            // 1. Create product
            const { data: newProduct, error: productError } = await supabase
                .from('products')
                .insert({
                    ...data,
                    updated_at: new Date().toISOString()
                })
                .select('id')
                .single();

            if (productError) throw productError;

            // 2. Link to opportunity
            const { error: linkError } = await supabase
                .from('opportunity_products')
                .insert({
                    opportunity_id: opportunityId,
                    product_id: newProduct.id,
                    quantity: 1
                });

            if (linkError) throw linkError;

            toast.success('Product created and added');
            onProductAdded();
            setIsCreating(false);
            setOpen(false);
        } catch (error) {
            console.error('Error creating product:', error);
            toast.error('Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-900">
                        <Plus size={16} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Search products..." onValueChange={setSearchTerm} />
                        <CommandList>
                            <CommandEmpty>No products found.</CommandEmpty>
                            <CommandGroup>
                                {products.map((product) => {
                                    const isAdded = existingProductIds.includes(product.id);
                                    return (
                                        <div
                                            key={product.id}
                                            className={`relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer ${isAdded ? 'opacity-50 pointer-events-none' : ''}`}
                                            onClick={() => !isAdded && !isLoading && handleAdd(product.id)}
                                        >
                                            <div className="flex flex-col">
                                                <span>{product.name}</span>
                                                {product.part_number && (
                                                    <span className="text-xs text-gray-500">{product.part_number}</span>
                                                )}
                                            </div>
                                            {isAdded && <Check className="ml-auto h-4 w-4 opacity-50" />}
                                        </div>
                                    );
                                })}
                            </CommandGroup>
                            <div className="border-t p-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start font-normal text-primary"
                                    onClick={() => {
                                        setIsCreating(true);
                                        setOpen(false); // Close popover when opening drawer
                                    }}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create New Product
                                </Button>
                            </div>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <AppDrawer
                open={isCreating}
                onOpenChange={setIsCreating}
                title="Create New Product"
                description="Add a new product to the database and this opportunity."
            >
                <ProductForm
                    onSubmit={handleCreate}
                    isLoading={isLoading}
                    isNested={true}
                />
            </AppDrawer>
        </>
    );
}
