import { Link, useLoaderData, useNavigation, useNavigate } from "react-router";
import { getProducts } from "../models/product";
import { Package } from "lucide-react";

export async function loader() {
  let results = await getProducts();
  let products = results.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return { products };
}

export default function AdminProducts() {
  let { products } = useLoaderData();
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";
  let navigate = useNavigate();

  return (
    <div className="p-6 bg-neutral-900 min-h-screen">
      <h1 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
        <Package /> Products Management
      </h1>

      <div className="flex justify-between ">
        <div className="mb-6 flex justify-center md:justify-start">
          <Link
            to="/admin/products/add"
            className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center"
          >
            + Add New Product
          </Link>
        </div>

        <button
          className="  border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-900 transition mb-10"
          onClick={() => navigate(-1)}
        >
          ← Back to dashboard
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-neutral-400 text-center">No products found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product._id}
              className="bg-neutral-800 rounded-xl p-4 flex justify-between items-center shadow hover:shadow-lg transition"
            >
              <div>
                <p className="text-green-400 font-medium">{product.name}</p>
                <p className="text-neutral-300">
                  Price: ${product.price} | Stock: {product.stock}
                </p>
                <p className="text-neutral-400 text-xs">ID: {product._id}</p>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/admin/products/${product._id}/edit`}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  {isSubmitting ? "Editting.." : "Edit"}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
