type Props = {
    title: string;
    value: string | number;
};

export default function DashboardCard({
    title,
    value,
}: Props) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-gray-500">{title}</p>

            <h2 className="mt-2 text-3xl fond-bold">
                {value}
            </h2>
        </div>
    );
}