import TreatmentCardBootstrap from "./TreatmentCardBootstrap";

export default function TreatmentGridBootstrap({ treatments = [] }) {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          {treatments.map((treatment) => (
            <TreatmentCardBootstrap key={treatment._id} treatment={treatment} />
          ))}
        </div>
      </div>
    </section>
  );
}