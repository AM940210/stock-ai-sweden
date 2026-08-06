"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import type { Stock } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

type DeleteStockDialogProps = {
    stock: Stock;
};

export default function DeleteStockDialog({
    stock,
}: DeleteStockDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const deleteStock = async () => {
        try {
            setLoading(true);

            const response = await fetch(`/api/stocks/${stock.symbol}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete stock");
            }

            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-Flex h-10 w-10 item-center justify-center rounded-md bg-red-100 text-red-600 hover:bg-red-200">
                <Trash2 className="h-5 w-5" />
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Stock</DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{""} 
                        
                        <strong>
                            {stock.companyName} ({stock.symbol})
                        </strong>
                        ? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={deleteStock}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}