import {
  Form,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  data,
  redirect,
} from "react-router";

import "./app.css";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { getSession, commitSession } from "./.server/session";
import Footer from "./components/Footer";
import { Toaster, toast } from "react-hot-toast";

export let links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function action({ request }) {
  let formData = await request.formData();
  let searchQuery = formData.get("search") || "";

  // Redirect to /products with query param
  return redirect(`/products?search=${encodeURIComponent(searchQuery)}`);
}

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let cartItems = session.get("cartItems") || [];
  let user = session.get("user") || {};
  let toastMessage = session.get("toastMessage");

  return data(
    { cartItems, user, toastMessage },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export function Layout({ children }) {
  let { user, cartItems, toastMessage } = useLoaderData();
  let [isOpen, setIsOpen] = useState(false);
  let [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    let { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="bg-neutral-950 shadow-md fixed top-0 left-0 right-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl font-bold text-green-400 flex items-center gap-1"
            >
              WeedShop
            </Link>

            {/* Right side: Cart + Hamburger + Desktop Menu */}
            <div className="flex items-center gap-4">
              {/* Cart - always visible */}
              <Link
                to="/cart"
                className="relative hover:text-green-400 transition"
              >
                <ShoppingCart size={24} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full px-1">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Hamburger Button - mobile only */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-green-400 relative z-50 focus:outline-none md:hidden"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              {/* Desktop Menu - hidden on mobile */}
              <div className="hidden md:flex gap-4 items-center  text-neutral-300">
                <Link
                  to="/products"
                  className="hover:text-green-400 transition"
                >
                  Products
                </Link>
                <Link to="/about" className="hover:text-green-400 transition">
                  About Us
                </Link>
                <Link
                  to="/contacts"
                  className="hover:text-green-400 transition"
                >
                  Contacts
                </Link>

                {/* Search Form */}
                <Form method="post" className="relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="bg-neutral-800 text-white placeholder-green-400 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-white font-semibold"
                  >
                    Go
                  </button>
                </Form>

                {/* User Menu */}
                {user?.name ? (
                  <div className="relative">
                    <button
                      onClick={() => setPopoverOpen(!popoverOpen)}
                      className="p-2 rounded-full hover:bg-green-700 transition"
                      title={user.name}
                    >
                      <User className="w-6 h-6 text-green-400" />
                    </button>
                    {popoverOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gradient-to-b from-green-900 via-green-800 to-green-950 border border-green-700 rounded-xl shadow-xl flex flex-col z-50 ring-1 ring-green-500">
                        <Link
                          to="/profile"
                          className="px-4 py-2 hover:bg-green-700 hover:text-white rounded-lg"
                          onClick={() => setPopoverOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/my-orders"
                          className="px-4 py-2 hover:bg-green-700 hover:text-white rounded-lg"
                          onClick={() => setPopoverOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/logout"
                          className="px-4 py-2 hover:bg-red-600 hover:text-white rounded-lg"
                          onClick={() => setPopoverOpen(false)}
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 md:hidden z-30"
              />
              <div
                className={`fixed top-0 right-0 h-full w-64 bg-neutral-950 text-neutral-300 shadow-lg px-6 pt-24 pb-8 flex flex-col space-y-4 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
              >
                {/* Search Form */}
                <Form method="post" className="mb-4">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products..."
                    className="bg-neutral-800 text-white placeholder-green-400 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-2 rounded-lg"
                  >
                    Search
                  </button>
                </Form>

                {/* Links */}
                <Link
                  to="/products"
                  className="px-4 py-2 rounded-lg hover:bg-green-700/40 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 rounded-lg hover:bg-green-700/40 transition"
                  onClick={() => setIsOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contacts"
                  className="px-4 py-2 rounded-lg hover:bg-green-700/40 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Contacts
                </Link>

                {user?.name ? (
                  <>
                    <Link
                      to="/profile"
                      className="px-4 py-2 rounded-lg hover:bg-green-700/40 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/my-orders"
                      className="px-4 py-2 rounded-lg hover:bg-green-700/40 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/logout"
                      className="px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </>
          )}
        </nav>

        {children}
        <Toaster />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
