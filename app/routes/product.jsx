import { getProducts } from "../models/product";
import { Link } from "react-router";

export async function loader({ params }) {
  let id = params.id;

  let results = await getProducts();

  let product = results.find((item) => String(item._id) === id);

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  let related = results.filter(
    (item) => item.category === product.category && String(item._id) !== id
  );

  if (related.length === 0) {
    // fallback to random 4 other products
    related = results.filter((item) => String(item._id) !== id).slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  console.log({ product });

  return { product, related };
}

export default function Product({ loaderData }) {
  let { product, related } = loaderData;
  return (
    <div className="max-w-6xl mx-auto mt-40 px-6">
      <div className="bg-neutral-900 border border-green-900/40 rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row hover:shadow-green-700/40 hover:shadow-2xl transition-all duration-300">
        {/* Product Image */}
        <div className="lg:w-1/2 h-80 lg:h-auto">
          <img
            src={product.imageUrl}
            alt={`image of ${product.name}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-green-400 mb-3 tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm uppercase tracking-wide text-green-600 font-medium mb-2">
              {product.category}
            </p>
            <p className="text-3xl font-semibold text-green-300 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-neutral-400 mb-6">{product.description}</p>
            <p className="text-neutral-400 mb-6">{product.rating}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-green-400 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {related.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="group block bg-neutral-900 border border-green-900/40 rounded-xl shadow-md hover:shadow-green-700/40 hover:shadow-xl transition p-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4 group-hover:opacity-90 transition"
                />
                <h3 className="font-semibold text-green-300 group-hover:text-green-400 transition">
                  {item.name}
                </h3>
                <p className="text-green-600 text-sm">{item.category}</p>
                <p className="text-green-400 font-bold mt-2">${item.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
