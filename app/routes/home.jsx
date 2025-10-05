import {
  getSession,
  commitSession,
  setSuccessMessage,
} from "../.server/session";
import { getProducts } from "../models/product";
import { Form, data, Link, useNavigate } from "react-router";
import Hero from "../components/Hero";
import Testimonial from "../components/Testimonials";
import Services from "../components/Services";
import Details from "../components/Details";

export function meta() {
  return [
    { title: "WeedShop" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let id = formData.get("id");

  let cartItem = {
    id,
    quantity: 1,
  };

  let cartItems = session.get("cartItems") || [];

  let existingItem = cartItems.find((item) => item.id === id);

  if (existingItem) {
    return;
  } else {
    cartItems.push(cartItem);
  }

  session.set("cartItems", cartItems);
  setSuccessMessage(session, "Added to cart!");

  return data(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function loader() {
  let results = await getProducts();

  let products = results.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
    };
  });

  return { products };
}

export default function Home({ loaderData }) {
  let { products } = loaderData || [];
  let navigate = useNavigate();
  return (
    <>
      {/* Hero Section */}
      <div className="mt-4">
        <Hero />
      </div>

      {/* Main Content */}
      <main className="px-6 max-w-6xl mx-auto mt-10">
        {/* Section Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 mb-6">
          Best Sellers
        </h1>

        {/* Products Grid */}
        <ul className="mt-8 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <li key={product._id}>
              <Product
                name={product.name}
                category={product.category}
                price={product.price}
                imageSrc={product.imageUrl}
                id={product._id}
                currency="$"
              />
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/products")}
            className="relative inline-flex items-center px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg overflow-hidden group transition-all duration-300
               hover:bg-green-600 hover:scale-105 hover:shadow-2xl animate-bounce-slow"
          >
            {/* Glowing overlay effect */}
            <span className="absolute inset-0 bg-white opacity-10 rounded-lg blur-xl animate-pulse-slow"></span>
            <span className="relative z-10 flex items-center gap-2">
              View More Products
              <span className="transform transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </span>
          </button>
        </div>
      </main>

      <Testimonial />

      <Services />

      <Details />

      {/* Optional Background Gradient or Pattern */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-80"></div>
    </>
  );
}

function Product({ name, category, price, imageSrc, id, currency }) {
  return (
    <article className="relative bg-neutral-900 border border-green-900/40 rounded-2xl overflow-hidden shadow-md hover:shadow-green-700/40 hover:shadow-2xl transition-all duration-300 flex flex-col">
      {/* Image Section */}
      <div className="relative group">
        <img
          src={imageSrc}
          alt={`Image of ${name}`}
          className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
        />
        <Form method="post">
          <input type="hidden" name="id" value={id} />
          <button
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-green-700 active:scale-95 transition-all"
            type="submit"
          >
            Add to Cart
          </button>
        </Form>
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-2 p-4">
        <Link to={`product/${id}`}>
          <h2 className="text-xl font-bold text-green-300 hover:text-green-400 transition">
            {name}
          </h2>
        </Link>
        <p className="text-green-600 italic text-sm">{category}</p>
        <p className="text-green-400 font-semibold text-lg">
          {currency}
          {price}
        </p>
      </div>

      {/* Optional Tag / Badge */}
      <span className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
        🔥 Popular
      </span>
    </article>
  );
}
