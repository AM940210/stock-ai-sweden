import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
};

export default function SearchBar({
    value,
    onChange,
}: SearchBarProps) {
    return (
        <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by symbol, company or market..."
                className="h-11 pl-10"
            />
        </div>
    );
}