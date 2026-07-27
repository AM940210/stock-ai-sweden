export default function DashboardHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
                <h1 className="text-4xl font-bold">
                    Swedish Stock Dashboard
                </h1>

                <p className="next-gray-500 mt-2">
                    Manage and monitor Swedish stocks.
                </p>
            </div>

            <button className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition">
                + Add Stock
            </button>
        </div>
    );
}