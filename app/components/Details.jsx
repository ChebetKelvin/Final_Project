export default function LocationHours() {
  return (
    <div className="h-fit pt-24 px-4 sm:px-6 bg-neutral-950 text-white flex justify-center relative overflow-hidden pb-5">
      {/* Luminous background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-700/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 md:gap-12 items-center z-10">
        {/* Left side image */}
        <div className="mb-8 md:mb-0">
          <div className="overflow-hidden rounded-2xl shadow-xl border border-green-700/40 hover:border-green-400/60 transition">
            <img
              src="https://images.unsplash.com/photo-1615915468538-0fbd857888ca?w=800&auto=format&fit=crop&q=80"
              alt="Our Cannabis Shop"
              className="w-full h-64 sm:h-80 md:h-96 object-cover transform hover:scale-105 transition duration-500"
            />
          </div>
        </div>

        {/* Right side info */}
        <div className="bg-neutral-900/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-green-700/40 shadow-lg hover:shadow-green-500/20 transition">
          <h2 className="text-3xl font-bold text-green-400 mb-4 hover:text-green-300 transition">
            Visit Our Shop
          </h2>
          <p className="text-gray-300 mb-6 text-base leading-relaxed hover:text-gray-200 transition">
            We’re located in the heart of town and always ready to serve you
            with the best cannabis products. Whether you’re a first-time visitor
            or a loyal customer, our friendly staff will make sure you have a
            great experience.
          </p>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-green-300 mb-1">
              Location
            </h3>
            <p className="text-gray-400 hover:text-green-200 transition">
              123 Green Street, Nairobi, Kenya
            </p>
          </div>

          {/* Opening hours */}
          <div>
            <h3 className="text-xl font-semibold text-green-300 mb-2">
              Opening Hours
            </h3>
            <ul className="space-y-1 text-gray-400">
              <li className="hover:text-green-200 transition">
                Monday – Friday: 9:00 AM – 9:00 PM
              </li>
              <li className="hover:text-green-200 transition">
                Saturday: 10:00 AM – 6:00 PM
              </li>
              <li className="text-red-400 hover:text-red-300 transition">
                Sunday: Closed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
