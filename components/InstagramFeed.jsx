export default function InstagramFeed() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-pink-500 font-medium uppercase tracking-wider">
            Follow Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            @siamawellness on Instagram
          </h2>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <iframe
            src="https://cdn.lightwidget.com/widgets/YOUR_WIDGET_ID.html"
            scrolling="no"
            allowTransparency="true"
            title="Siama Wellness Instagram Feed"
            className="w-full border-0"
            style={{ minHeight: "550px" }}
          />
        </div>
      </div>
    </section>
  );
}