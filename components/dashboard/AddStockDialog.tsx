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
            <DialogTrigger>
                <Button size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Stock
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Add New Stock</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Form coming next...
                </p>
            </DialogContent>
        </Dialog>
    )
}