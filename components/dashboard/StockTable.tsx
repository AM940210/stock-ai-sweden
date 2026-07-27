import { Stock } from "@/src/lib/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
          </TableRow>
        </TableHeader>

        <TableBody>
          {stocks.map((stock) => (
            <TableRow key={stock.id}>
              <TableCell className="font-bold">
                {stock.symbol}
              </TableCell>

              <TableCell>{stock.companyName}</TableCell>

              <TableCell>{stock.market}</TableCell>

              <TableCell>{stock.sector ?? "-"}</TableCell>

              <TableCell className="text-right font-semibold">
                {stock.currentPrice
                  ? `${stock.currentPrice.toFixed(2)} ${stock.currency}`
                  : "-"}
              </TableCell>
            </TableRow>
          ))}

          {stocks.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                No stocks found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}