export default function ServicesPage() {
  const services = [
    "Hydrafacial",
    "Laser Hair Reduction",
    "Chemical Peel",
    "PRP Treatment",
    "Body Slimming",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Services</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border">
            <h3 className="font-semibold text-lg">{service}</h3>
            <p className="text-gray-500 mt-2">Manage service details here.</p>
          </div>
        ))}
      </div>
    </div>
  );
}