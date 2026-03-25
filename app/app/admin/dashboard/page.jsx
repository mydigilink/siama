import React from "react";

const stats = [
    { label: "Users", value: 1240 },
    { label: "Sales", value: 320 },
    { label: "Revenue", value: "$12,400" },
    { label: "Active Sessions", value: 87 },
];

export default function DashboardPage() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white rounded shadow p-6 flex flex-col items-center"
                    >
                        <span className="text-2xl font-semibold">{stat.value}</span>
                        <span className="text-gray-500">{stat.label}</span>
                    </div>
                ))}
            </div>
        </main>
    );
}