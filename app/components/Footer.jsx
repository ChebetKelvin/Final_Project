import { Leaf, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-green-900/40">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-7 h-7 text-green-500" />
              <span className="text-xl font-bold text-green-400">WeedShop</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Shop smarter, live better. Premium cannabis products delivered
              safely and discreetly to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="hover:text-green-400 transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-green-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-green-400 transition">
                  Login / Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="hover:text-green-400 transition">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/shipping" className="hover:text-green-400 transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="hover:text-green-400 transition">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-800 hover:bg-green-500 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-800 hover:bg-green-500 transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-800 hover:bg-green-500 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 mt-10 pt-6 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} WeedShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
