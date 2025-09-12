import { Form, data, Link, useLoaderData } from "react-router";
import {
  getSession,
  commitSession,
  setSuccessMessage,
} from "../.server/session";
import { getProducts } from "../models/product";

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

export async function loader({ request }) {
  let url = new URL(request.url);
  let searchQuery = url.searchParams.get("search") || "";

  let results = await getProducts();

  let products = results.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
    };
  });

  if (searchQuery) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return { products, searchQuery };
}

export default function AllProducts() {
  let { products, searchQuery } = useLoaderData();
  return (
    <main className="max-w-6xl mx-auto px-3 mt-10">
      <h1 className="text-3xl font-bold text-green-400 mb-6">
        Products {searchQuery && `(Search: ${searchQuery})`}
      </h1>

      <ul className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <li key={product._id}>
            <ProductCard
              id={product._id}
              name={product.name}
              category={product.category}
              price={product.price}
              imageSrc={product.imageUrl}
              currency="$"
            />
          </li>
        ))}
      </ul>
    </main>
  );
}

function ProductCard({ id, name, category, price, imageSrc, currency = "$" }) {
  return (
    <div className="group bg-neutral-950 border border-green-900/40 rounded-2xl shadow-lg hover:shadow-green-600/30 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-green-50/5 flex items-center justify-center overflow-hidden">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${id}`}>
            <h3 className="text-lg font-semibold text-green-400 group-hover:text-green-500 transition">
              {name}
            </h3>
          </Link>

          <p className="text-sm text-neutral-400">{category}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-xl font-bold text-green-500">
            {currency}
            {price}
          </p>

          {/* Add to Cart */}
          <Form method="post">
            <input type="hidden" name="id" value={id} />
            <button className="px-4 py-2 rounded-full bg-green-500 text-white font-medium hover:bg-green-600 active:scale-95 transition">
              Add to cart
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
