import { Link } from "react-router";

export default function About() {
  return (
    <section className="relative bg-gradient-to-b from-neutral-950 via-green-950 to-emerald-900 text-neutral-100 overflow-hidden">
      {/* Floating leaf icons */}
      <span className="absolute w-16 h-16 bg-[url('https://cdn-icons-png.flaticon.com/512/616/616408.png')] bg-contain bg-no-repeat animate-float1 top-10 left-10 opacity-30"></span>
      <span className="absolute w-20 h-20 bg-[url('https://cdn-icons-png.flaticon.com/512/616/616408.png')] bg-contain bg-no-repeat animate-float2 top-1/2 right-20 opacity-20"></span>
      <span className="absolute w-24 h-24 bg-[url('https://cdn-icons-png.flaticon.com/512/616/616408.png')] bg-contain bg-no-repeat animate-float3 bottom-16 left-1/3 opacity-25"></span>

      {/* Hero Section */}
      <div className="relative z-10 py-24 px-6 lg:px-16 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg text-green-400">
          About <span className="text-green-500">GreenLeaf Collective</span> 🌿
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-8">
          Premium cannabis products for adults 18+ curated to elevate your
          wellness, relaxation, and lifestyle. Safe, responsible, and lab-tested
          for quality.
        </p>
        <Link
          to="/products"
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-lg shadow-green-900/40 transition-all duration-300"
        >
          Explore Products
        </Link>
      </div>

      {/* Introduction / What We Do */}
      <div className="relative z-10 max-w-5xl mx-auto mt-20 grid md:grid-cols-2 gap-12 items-center px-6">
        <img
          src="https://plus.unsplash.com/premium_photo-1695229820979-0f60c873d1d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d2VlZHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Cannabis wellness"
          className="rounded-3xl shadow-green-900/50 shadow-xl"
        />
        <div className="flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-green-400 text-center">
            What We Do
          </h2>
          <p className="text-neutral-300 text-center max-w-3xl mx-auto text-lg md:text-xl">
            At{" "}
            <span className="font-semibold text-green-400">
              GreenLeaf Collective
            </span>
            , we provide a curated selection of cannabis products designed for
            medicinal and recreational use. Our goal is to provide safe,
            high-quality cannabis for adults 18+ to enjoy responsibly.
          </p>
        </div>
      </div>

      {/* Age Restriction Notice */}
      <div className="relative z-10 mt-16 max-w-3xl mx-auto bg-red-900/40 border border-red-600/70 text-red-200 p-6 rounded-2xl text-center shadow-md shadow-red-950/40">
        <p className="font-semibold">
          ⚠️ All cannabis products are strictly for adults 18 years and older.
        </p>
      </div>

      {/* Team / Brand Story */}
      <div className="relative z-10 mt-24 max-w-5xl mx-auto text-center px-6 lg:px-0">
        <h2 className="text-3xl font-bold text-green-400 mb-6">Our Mission</h2>
        <p className="text-neutral-300 mb-8">
          GreenLeaf Collective is dedicated to providing safe, premium cannabis
          for both medicinal and recreational use. We aim to educate, inspire,
          and help adults make informed choices about cannabis.
        </p>
        <img
          src="https://images.unsplash.com/photo-1536795335207-28f63e2352f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d2VlZHxlbnwwfHwwfHx8MA%3D%3D"
          alt="Team"
          className="rounded-3xl shadow-green-900/50 shadow-xl mx-auto"
        />
      </div>

      {/* Call to Action */}
      <div className="relative z-10 mt-24 text-center mb-24">
        <Link
          to="/products"
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl shadow-lg shadow-green-900/40 transition-all duration-300"
        >
          Shop Our Collection
        </Link>
      </div>
    </section>
  );
}
