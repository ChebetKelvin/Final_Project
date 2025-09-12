import { Link } from "react-router";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-green-900 via-emerald-800 to-green-700 text-white py-24 sm:py-28 md:py-32 px-4 sm:px-8 lg:px-16 overflow-hidden">
      {/* Background image with dark overlay */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498671546682-94a232c26d17?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center -z-20"
        style={{ transform: "translateZ(0)" }}
      ></div>
      <div className="absolute inset-0 bg-black/50 -z-10"></div>

      {/* Floating leaf elements */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute w-20 h-20 bg-[url('https://cdn-icons-png.flaticon.com/512/616/616408.png')] bg-contain bg-no-repeat animate-float1 top-10 left-6 md:left-12"></span>
        <span className="absolute w-16 h-16 bg-[url('https://cdn-icons-png.flaticon.com/512/616/616408.png')] bg-contain bg-no-repeat animate-float2 top-1/2 right-10 md:right-20"></span>
        <span className="absolute w-24 h-24 bg-[url('https://cdn-icons-png.flaticon.com/512/616/616408.png')] bg-contain bg-no-repeat animate-float3 bottom-16 left-1/3"></span>
      </div>

      {/* Content box */}
      <div className="relative z-10 max-w-3xl mx-auto text-center backdrop-blur-md bg-white/10 rounded-3xl p-8 sm:p-10 border border-green-400/30 shadow-xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-md">
          Elevate Your Vibe
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          Premium cannabis products curated to relax, inspire, and elevate your
          lifestyle. Shop smarter, chill better.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            to="/products"
            className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 transform hover:scale-105 text-white font-semibold rounded-2xl shadow-lg shadow-green-500/30 transition-all duration-300"
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 bg-transparent border border-green-400 hover:bg-green-400 hover:text-black transform hover:scale-105 text-white font-semibold rounded-2xl transition-all duration-300"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
