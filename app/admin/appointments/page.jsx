export default function AppointmentsPage() {
  const appointments = [
    {
      id: 1,
      name: "Riya Sharma",
      phone: "9876543210",
      service: "Hydrafacial",
      date: "2026-03-18",
      time: "11:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      name: "Aman Verma",
      phone: "9123456780",
      service: "Laser Hair Reduction",
      date: "2026-03-19",
      time: "2:00 PM",
      status: "Confirmed",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Appointments</h2>

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-zinc-100">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Service</th>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Time</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.service}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.time}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}