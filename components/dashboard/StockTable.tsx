import { Stock } from "@/src/lib/types";
import EditStockDialog from "./EditStockDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2 } from "lucide-react";

type Props = {
  stocks: Stock[];
};

export default function StockTable({ stocks }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Symbol</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Market</TableHead>
            <TableHead className="font-semibold">Sector</TableHead>
            <TableHead className="text-right font-semibold">Price</TableHead>
            <TableHead className="text center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {stocks.map((stock) => (
            <TableRow 
              key={stock.id}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-bold">
                {stock.symbol}
              </TableCell>

              <TableCell>{stock.companyName}</TableCell>

              <TableCell>{stock.market}</TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {stock.sector ?? "Unknown"}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Badge>
                  {stock.currentPrice
                    ? `${stock.currentPrice.toFixed(2)} ${stock.currency}`
                    : "-"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex justify-center gap-2">
          
                  <EditStockDialog stock={stock} />


                  <Button 
                    variant="destructive"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {stocks.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={6} 
                className="py-12 text-center text-muted-foreground"
              >
                No stocks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}