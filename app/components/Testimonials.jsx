import { useState } from "react";
import { Star } from "lucide-react"; // npm install lucide-react

export default function Testimonial() {
  let testimonials = [
    {
      id: 0,
      name: "James M.",
      role: "Loyal Customer",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      quote:
        "Best weed shop I’ve ever ordered from. The quality is top-notch and the delivery is always discreet and fast.",
      rating: 5,
    },
    {
      id: 1,
      name: "Michael",
      role: "Cannabis Enthusiast",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      quote:
        "I love the variety here—whether it’s edibles, flower, or concentrates, everything hits just right.",
      rating: 4,
    },
    {
      id: 2,
      name: "Emily",
      role: "Medical Cannabis Patient",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      quote:
        "Their CBD products have helped me manage my stress and sleep better. Super grateful for this shop!",
      rating: 5,
    },
    {
      id: 3,
      name: "John",
      role: "Regular Smoker",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      quote:
        "Every strain I’ve tried has been fire. The buds are fresh, potent, and exactly as described on the site.",
      rating: 5,
    },
  ];

  let [activeId, setActiveId] = useState(0);
  let [ratings, setRatings] = useState(
    testimonials.reduce((acc, t) => {
      acc[t.id] = t.rating;
      return acc;
    }, {})
  );

  let activeTestimonial =
    testimonials.find((t) => t.id === activeId) || testimonials[0];

  let handleRating = (id, value) => {
    setRatings((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <section className="relative py-24 bg-neutral-950 text-white overflow-hidden">
      {/* Glowing background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          70% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .active-ring::after {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(34, 197, 94, 0.6);
          animation: pulse 2s infinite;
        }
      `}</style>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
          What Our <span className="text-green-500">Stoners</span> Say
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Testimonial card */}
          <div className="w-full max-w-2xl mx-auto">
            <div
              key={activeId}
              className="relative bg-neutral-900/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border transition-all duration-500 border-green-500/20 hover:border-green-500/40 hover:shadow-green-500/20"
            >
              <p className="text-2xl italic mb-6 leading-relaxed font-serif text-gray-200">
                “{activeTestimonial.quote}”
              </p>

              {/* Clickable Star Rating */}
              <div className="flex mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleRating(activeTestimonial.id, i + 1)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`mr-1 cursor-pointer transition ${
                        i < (ratings[activeTestimonial.id] || 0)
                          ? "fill-green-500 text-green-500"
                          : "text-neutral-500 hover:text-green-400"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* User Info */}
              <div className="flex items-center">
                <img
                  src={activeTestimonial.avatar}
                  alt={activeTestimonial.name}
                  className="w-16 h-16 rounded-full border-4 border-green-200 dark:border-green-400 mr-4 shadow-md"
                />
                <div>
                  <p className="font-bold">{activeTestimonial.name}</p>
                  <p className="text-sm text-neutral-400">
                    {activeTestimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar selection */}
          <div className="flex items-center justify-start lg:justify-center gap-6 overflow-x-auto no-scrollbar py-4">
            {testimonials.map((user) => (
              <div
                key={user.id}
                onClick={() => setActiveId(user.id)}
                className={`relative group flex items-center justify-center cursor-pointer transition transform duration-300 ${
                  user.id === activeId ? "scale-110 active-ring" : ""
                }`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white dark:border-neutral-900 hover:-translate-y-1 hover:scale-105 transition duration-300 shadow-lg"
                />
                <p className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition duration-300 text-sm font-semibold text-gray-300">
                  {user.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
