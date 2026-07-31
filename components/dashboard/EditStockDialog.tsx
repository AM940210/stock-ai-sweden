"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    stockSchema,
    type StockFormValues,
} from "@/lib/validators/stock";

import type { Stock } from "@/lib/types";

type EditStockDialogProps = {
    stock: Stock;
};

export default function EditStockDialog({
    stock,
}: EditStockDialogProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();

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

    useEffect(() => {
        if (open) {
            form.reset({
                symbol: stock.symbol,
                companyName: stock.companyName,
                market: stock.market,
                sector: stock.sector ?? "",
                currentPrice: stock.currentPrice ?? 0,
                currency: stock.currency ?? "SEK",
            });
        }
    }, [open, stock, form]);

    const onSubmit = async (values: StockFormValues) => {
        try {
            const response = await fetch(`/api/stocks/${stock.symbol}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error("Failed to update stock");
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md border hover:bg-accent">
                <Pencil className="h-4 w-4" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Stock</DialogTitle>
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
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}