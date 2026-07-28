"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function AddStockDialog() {
    const [open, setOpen] = useState(false);

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

                <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Symbol
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="INVE-B"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Company
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="Investor AB"
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
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Sector
                            </label>

                            <input 
                                className="w-full rounded-md border px-3 py-2"
                                placeholder="Financials"
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
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Currency
                            </label>

                            <select className="w-full rounded-md border px-3 py-2">
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