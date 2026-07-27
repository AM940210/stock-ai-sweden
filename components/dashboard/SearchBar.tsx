import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input 
                placeholder="Search by symbol or company..."
                className="pl-10"
            />
        </div>
    );
}