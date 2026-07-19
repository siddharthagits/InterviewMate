function Features() {

  const features = [
    "AI Mock Interviews",
    "Coding Interviews",
    "HR Interview Practice",
    "Performance Analytics",
    "Resume Feedback",
    "Progress Tracking",
  ];

  return (
    <section className="bg-white py-20">

      <h2 className="text-center text-4xl font-bold mb-12">
        Platform Features
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">

        {features.map((item) => (
          <div
            key={item}
            className="bg-gray-100 p-8 rounded-xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">{item}</h3>

            <p className="mt-3 text-gray-600">
              Prepare better with AI-driven interview practice.
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default Features;