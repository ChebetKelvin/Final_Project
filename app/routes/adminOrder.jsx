// app/routes/admin/orders.jsx
import { getSession, commitSession } from "../.server/session";
import { redirect, useLoaderData, Form, useNavigate } from "react-router";
import { getOrders, updateOrderStatus } from "../models/order";
import { getUserById } from "../models/user"; // add this function in your user model

// --- Action ---
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");

  let formData = await request.formData();
  let orderId = formData.get("orderId");
  let status = formData.get("status");

  if (!orderId || !status) return redirect("/admin/orders");

  await updateOrderStatus(orderId, status);

  session.set(
    "successMessage",
    `Order ${orderId.slice(-6).toUpperCase()} updated to ${status}`
  );

  return redirect("/admin/orders", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// --- Loader ---
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");
  let orders = await getOrders();

  // Fetch user info for each order
  let formattedOrders = await Promise.all(
    orders.map(async (o) => {
      let orderUser = await getUserById(o.user);
      return {
        ...o,
        _id: o._id.toString(),
        totalPrice: Number(o.totalPrice),
        userName: orderUser?.name || "Unknown",
        userEmail: orderUser?.email || "Unknown",
        item: o.item.map((i) => ({
          ...i,
          price: Number(i.price),
        })),
      };
    })
  );

  let successMessage = session.get("successMessage");
  if (successMessage) session.unset("successMessage");

  return {
    orders: formattedOrders,
    successMessage,
    cookie: await commitSession(session),
  };
}

// Status colors mapping
let statusColors = {
  pending: "bg-yellow-400 text-black",
  completed: "bg-green-500 text-white",
  shipped: "bg-blue-500 text-white",
  canceled: "bg-red-500 text-white",
};

// --- Component ---
export default function AdminOrdersPage() {
  let { orders, successMessage } = useLoaderData();
  let navigate = useNavigate();

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6">
      {/* Back Button */}
      <button
        className="  border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-900 transition"
        onClick={() => navigate(-1)}
      >
        ← Back to dashboard
      </button>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 text-center">
          All Orders
        </h1>

        {/* Success message */}
        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center font-semibold">
            {successMessage}
          </div>
        )}

        {(!orders || orders.length === 0) && (
          <p className="text-center text-neutral-400">No orders found.</p>
        )}

        {/* Orders Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-green-900/40 rounded-xl">
            <thead className="bg-neutral-900">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-green-900/20">
                  <td className="p-3">{order._id.slice(-6).toUpperCase()}</td>
                  <td className="p-3">{order.userName}</td>
                  <td className="p-3">{order.userEmail}</td>
                  <td className="p-3">
                    {order.item.map((i) => (
                      <div key={i.product} className="flex gap-2">
                        <span>
                          {i.name} x{i.quantity}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3">${order.totalPrice.toFixed(2)}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status] || "bg-gray-500 text-white"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 mt-6">
                    <Form method="post">
                      <input type="hidden" name="orderId" value={order._id} />
                      <input type="hidden" name="status" value="shipped" />
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition">
                        Ship
                      </button>
                    </Form>
                    <Form method="post">
                      <input type="hidden" name="orderId" value={order._id} />
                      <input type="hidden" name="status" value="canceled" />
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm transition">
                        Cancel
                      </button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards for Mobile */}
        <div className="md:hidden flex flex-col gap-6 mt-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-neutral-900 border border-green-900/40 p-6 rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-green-400">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    statusColors[order.status] || "bg-gray-500 text-white"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <p className="text-neutral-400 mb-2">
                User: {order.userName} ({order.userEmail})
              </p>

              <ul className="divide-y divide-green-900/20 mb-4">
                {order.item.map((i) => (
                  <li key={i.product} className="flex justify-between py-2">
                    <span>
                      {i.name} x{i.quantity}
                    </span>
                    <span>${(i.price * i.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between font-bold text-green-400 mb-3">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex gap-2">
                <Form method="post" className="flex-1">
                  <input type="hidden" name="orderId" value={order._id} />
                  <input type="hidden" name="status" value="shipped" />
                  <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition">
                    Ship
                  </button>
                </Form>

                <Form method="post" className="flex-1">
                  <input type="hidden" name="orderId" value={order._id} />
                  <input type="hidden" name="status" value="canceled" />
                  <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm transition">
                    Cancel
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
