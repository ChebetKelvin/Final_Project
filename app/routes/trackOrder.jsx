import { useLoaderData } from "react-router";
import { getOrderById } from "../models/order";

export async function loader({ params }) {
  const { orderId } = params;
  const result = await getOrderById(orderId);

  if (!result) throw new Response("Order not found", { status: 404 });

  const order = {
    ...result,
    _id: result._id.toString(),
    item: result.item.map((i) => ({
      ...i,
      price: i.price ?? 0,
      quantity: i.quantity ?? 1,
      subtotal: (i.price ?? 0) * (i.quantity ?? 1),
    })),
  };

  return { order };
}

const STATUS_STEPS = ["pending", "shipped", "delivered"];

export default function TrackOrderPage() {
  const { order } = useLoaderData();

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gradient-to-br from-green-900 via-black to-green-950 text-white">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400 flex items-center gap-2">
        Track Order #{order._id}
      </h2>

      {/* Progress Tracker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        {STATUS_STEPS.map((status, idx) => {
          const isCompleted = idx <= currentStepIndex;
          return (
            <div
              key={status}
              className="flex flex-col sm:flex-row items-center w-full"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-white font-semibold text-sm sm:text-base ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : "border-green-700/50"
                }`}
              >
                {idx + 1}
              </div>
              {idx < STATUS_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 my-2 sm:my-0 sm:mx-2 rounded-full ${
                    idx < currentStepIndex ? "bg-green-500" : "bg-green-700/50"
                  }`}
                />
              )}
              <span className="capitalize text-sm sm:text-base mt-1 sm:mt-0">
                {status}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mb-4 text-green-300">
        Current Status:{" "}
        <span className="font-semibold capitalize text-white">
          {order.status}
        </span>
      </p>

      <p className="mb-4 text-green-300">
        Total Price:{" "}
        <span className="font-semibold text-white">
          ${order.totalPrice.toFixed(2)}
        </span>
      </p>

      {/* Items */}
      <h3 className="mt-6 text-xl font-semibold text-green-400 flex items-center gap-2">
        Items
      </h3>
      <ul className="mt-2 space-y-3">
        {order.item.map((i, idx) => (
          <li
            key={idx}
            className="bg-green-900/20 p-4 rounded-xl border border-green-700/40 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <p className="font-medium">{i.name}</p>
            <p>
              Price:{" "}
              <span className="font-semibold">
                ${(i.price ?? 0).toFixed(2)}
              </span>
            </p>
            <p>
              Qty: <span className="font-semibold">{i.quantity ?? 1}</span>
            </p>
            <p>
              Subtotal:{" "}
              <span className="font-semibold">
                ${(i.subtotal ?? 0).toFixed(2)}
              </span>
            </p>
          </li>
        ))}
      </ul>

      {/* Shipping Address */}
      <h3 className="mt-6 text-xl font-semibold text-green-400 flex items-center gap-2">
        Shipping Address
      </h3>
      <div className="mt-2 space-y-1 bg-green-900/20 p-4 rounded-xl border border-green-700/40 shadow-md">
        <p>{order.shippingAddress.name}</p>
        <p>{order.shippingAddress.email}</p>
        <p>
          {order.shippingAddress.address}, {order.shippingAddress.city}
        </p>
        <p>
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
}
