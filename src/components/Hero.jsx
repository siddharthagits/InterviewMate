function Hero() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center items-center text-center bg-slate-900 text-white px-6">

      <h1 className="text-6xl font-bold">
        Ace Your Next
        <span className="text-blue-500"> Interview</span>
      </h1>

      <p className="mt-8 max-w-2xl text-gray-300 text-xl">
        Practice AI-powered mock interviews, receive instant feedback,
        improve communication skills, and land your dream job.
      </p>

      <div className="mt-10 flex gap-5">
        <button className="bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700">
          Start Free
        </button>

        <button className="border border-gray-500 px-8 py-3 rounded-lg hover:bg-slate-800">
          Learn More
        </button>
      </div>

    </section>
  );
}

export default Hero;