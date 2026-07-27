import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
    title: string;
    value: string | number;
};

export default function DashboardCard({ title, value }: Props) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-3xl font-bold">
                    {value}
                </p>
            </CardContent>
        </Card>
    );
}