import { getPublicServices, type PublicService } from "@/utils/api/public";
import BestTreatmentsSlider from "./Slider";

export default async function BestTreatments() {
  const response = await getPublicServices({
    page: 1,
    limit: 40,
    sortBy: "created_at",
    sortOrder: "desc",
  }).catch(() => ({ status: "error" as const }));

  const services: PublicService[] =
    response.status === "success" && response.data ? response.data : [];

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="space-y-3 max-w-3xl">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Best Treatments — handpicked for you
          </h3>
          <p className="text-sm md:text-base text-gray-600">
            Curated popular and best-rated services with upfront pricing. Browse the top picks and book quickly.
          </p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="bg-white/80 border border-dashed border-blue-200 rounded-xl px-6 py-10 text-center text-gray-600 shadow-sm">
          No best treatments found right now.
        </div>
      ) : (
        <BestTreatmentsSlider services={services} />
      )}
    </section>
  );
}

