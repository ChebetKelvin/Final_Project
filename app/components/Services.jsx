import { Leaf, Package, Truck, ShieldCheck } from "lucide-react";

export default function Services() {
  let services = [
    {
      id: 1,
      title: "Premium Cannabis",
      description:
        "Top-shelf flower, edibles, and concentrates curated for both recreational and medical use.",
      icon: <Leaf className="w-10 h-10 text-green-500" />,
    },
    {
      id: 2,
      title: "Discreet Packaging",
      description:
        "Your privacy is our priority. All orders are sealed and delivered in smell-proof, discreet packaging.",
      icon: <Package className="w-10 h-10 text-green-500" />,
    },
    {
      id: 3,
      title: "Fast Delivery",
      description:
        "Same-day delivery available in select areas. Nationwide shipping with trusted couriers.",
      icon: <Truck className="w-10 h-10 text-green-500" />,
    },
    {
      id: 4,
      title: "Safe & Tested",
      description:
        "All our products are lab-tested to ensure purity, potency, and compliance with safety standards.",
      icon: <ShieldCheck className="w-10 h-10 text-green-500" />,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-100">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
          Our{" "}
          <span className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]">
            Services
          </span>
        </h2>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative bg-neutral-800 p-8 rounded-2xl shadow-lg border border-green-500/10 hover:border-green-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-green-600/20 hover:-translate-y-2"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-green-500/10 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>

              {/* Content */}
              <div className="relative flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-green-500/10 text-green-400 group-hover:scale-110 group-hover:bg-green-500/20 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
