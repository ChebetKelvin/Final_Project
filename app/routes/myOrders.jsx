// app/routes/my-orders.jsx
import { getSession } from "../.server/session";
import { redirect, useLoaderData, Link } from "react-router";
import { useState } from "react";
import { getOrdersByUser } from "../models/order";

// Loader: fetch orders for logged-in user
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");

  if (!user) return redirect("/login");

  let ordersDb = await getOrdersByUser(user.id);

  let orders = ordersDb.map((order) => {
    return {
      ...order,
      _id: order._id.toString(),
    };
  });

  return { orders };
}

export default function MyOrdersPage() {
  let { orders } = useLoaderData();
  let [openOrderId, setOpenOrderId] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-400 mb-6">My Orders</h1>
          <p className="text-neutral-400 mb-4">
            You haven’t placed any orders yet.
          </p>
          <Link
            to="/products"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  let statusColors = {
    pending: "bg-yellow-400 text-black",
    completed: "bg-green-500 text-white",
    shipped: "bg-blue-500 text-white",
    canceled: "bg-red-500 text-white",
  };

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-12 text-center">
          My Orders
        </h1>

        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            let isOpen = openOrderId === order._id;
            return (
              <div
                key={order._id}
                className="bg-neutral-900 border border-green-900/40 rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Order Header */}
                <button
                  className="flex justify-between items-center w-full px-6 py-4 hover:bg-green-900 transition"
                  onClick={() => setOpenOrderId(isOpen ? null : order._id)}
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-green-400">
                      Order #{order._id.toString().slice(-6).toUpperCase()}
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                      Placed: {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      statusColors[order.status] || "bg-gray-500 text-white"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </button>

                {/* Collapsible Content */}
                {isOpen && (
                  <div className="px-6 py-4 border-t border-green-900/40">
                    {/* Order Items */}
                    <ul className="divide-y divide-green-900/20 mb-4">
                      {order.item.map((product) => (
                        <li
                          key={product.product}
                          className="flex items-center justify-between py-3"
                        >
                          <div className="flex items-center gap-4">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-xl"
                              />
                            )}
                            <div>
                              <p className="font-medium text-neutral-200">
                                {product.name}
                              </p>
                              <p className="text-neutral-400 text-sm">
                                ${product.price.toFixed(2)} each
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="bg-green-700 text-white px-2 py-1 rounded-full text-sm">
                              x{product.quantity}
                            </span>
                            <span className="font-semibold text-green-400">
                              ${(product.price * product.quantity).toFixed(2)}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Total */}
                    <div className="flex justify-between text-xl font-bold text-green-400 mb-2">
                      <span>Total</span>
                      <span>${order.totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Optional: Track Order Button */}
                    <Link
                      to={`/track-order/${order._id}`}
                      className="inline-block mt-2 text-sm text-green-500 hover:text-green-400 font-medium underline"
                    >
                      Track Order
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
