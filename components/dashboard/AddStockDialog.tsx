"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    StockFormValues,
    stockSchema,
} from "@/lib/validators/stock";


export default function AddStockDialog() {
    const [open, setOpen] = useState(false);

    const form = useForm<StockFormValues>({
        resolver: zodResolver(stockSchema),
        defaultValues: {
            symbol: "",
            companyName: "",
            market: "",
            sector: "",
            currentPrice: 0,
            currency: "SEK",
        },
    });

    const router = useRouter();

    const onSubmit = async (values: StockFormValues) => {
        try {
            const response = await fetch("/api/stocks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to create stock");
            }

            form.reset();

            setOpen(false);

            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add New Stock</DialogTitle>
                </DialogHeader>

                <form 
                    className="space-y-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Symbol
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="INVE-B"
                                {...form.register("symbol")}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Company
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="Investor AB"
                                {...form.register("companyName")}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div >
                            <label className="mb-2 block text-sm font-medium">
                                Market
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="NASDAQ Stockholm"
                                {...form.register("market")}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Sector
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="Financials"
                                {...form.register("sector")}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Price
                            </label>

                            <input 
                                type="number"
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="322.50"
                                step="0.01"
                                {...form.register("currentPrice", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Currency
                            </label>

                            <select 
                                className="w-full rounded-md border px-3 py-2"
                                {...form.register("currency")}
                            >
                                <option>SEK</option>
                                <option>USD</option>
                                <option>EUR</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            Create Stock
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}