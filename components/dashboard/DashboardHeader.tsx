import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardHeader() {
    return (
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-4xl font-bold tracking-tight">
                    Swedish Stock Dashboard
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Manage and monitor Swedish stocks.
                </p>
            </div>

            <Button size="lg">
                <Plus className="mr-2 h-5 2-5" />
                Add Stock
            </Button>
        </div>
    );
}