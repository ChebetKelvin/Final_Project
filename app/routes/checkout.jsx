// app/routes/checkout.jsx
import { Form, useLoaderData, useActionData, redirect } from "react-router";
import { getSession, commitSession, setErrorMessage } from "../.server/session";
import { getProducts } from "../models/product";
import { createOrder } from "../models/order";
import { getOrdersByUser } from "../models/order";
import { useState } from "react";
import { stkPush, normalizePhone } from "../.server/stkPush";

// --- Action: handle checkout ---
export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let user = session.get("user");

  if (!user) return redirect("/login");

  let name = formData.get("name");
  let email = formData.get("email");
  let address = formData.get("address");
  let city = formData.get("city");
  let postalCode = formData.get("postalCode");
  let country = formData.get("country");
  let paymentMethod = formData.get("paymentMethod");
  let phoneNumber = normalizePhone(formData.get("phoneNumber"));

  // ✅ Check required fields
  if (
    !name ||
    !email ||
    !address ||
    !city ||
    !postalCode ||
    !country ||
    !paymentMethod
  ) {
    setErrorMessage(session, "All fields are required.");
    return redirect("/checkout", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  let cartProducts = session.get("cartProducts") || [];
  if (cartProducts.length === 0) {
    setErrorMessage(session, "Your cart is empty.");
    return redirect("/checkout", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  let totalPrice = session.get("total") || 0;
  let checkoutId = null;

  if (paymentMethod === "mobile") {
    let safResponse = await stkPush({
      phone: phoneNumber,
      amount: totalPrice,
    });

    if (safResponse.error) {
      setErrorMessage(session, safResponse.error);
      return redirect("/checkout", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }
    if (!safResponse.CheckoutRequestID) {
      setErrorMessage(session, "Failed to initiate payment.");
      return redirect("/checkout", {
        headers: { "Set-Cookie": await commitSession(session) },
      });
    }

    checkoutId = safResponse.CheckoutRequestID;
  }

  // For other payment methods, you may want to generate a unique ID or leave checkoutId null

  // ✅ Create order data
  let orderData = {
    user: user.id,
    item: cartProducts.map((product) => ({
      product: product._id.toString(),
      name: product.name,
      quantity: product.quantity,
      price: Number(product.price),
      subtotal: Number(product.price) * product.quantity,
      imageUrl: product.imageUrl || null,
    })),
    totalPrice,
    status: "pending",
    paymentMethod,
    paymentId: checkoutId || null, // Save the checkoutId if available
    shippingAddress: {
      name,
      email,
      address,
      city,
      postalCode,
      country,
      phoneNumber,
    },
    createdAt: new Date(),
  };

  let results = await createOrder(orderData);

  if (!results.acknowledged) {
    setErrorMessage(session, "Failed to place order.");
    return redirect("/checkout", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  // ✅ Clear cart session
  session.set("cartProducts", []);
  session.set("total", 0);

  return redirect("/my-orders", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

// --- Loader ---
export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let cartItems = session.get("cartItems") || [];
  let user = session.get("user");

  if (!user) return redirect("/login");

  let results = await getProducts();
  let products = results.map((p) => ({
    ...p,
    _id: p._id.toString(),
    price: p.price || 0,
  }));

  let cartProducts = cartItems
    .map((item) => {
      let product = products.find((p) => p._id === item.id);
      if (!product) return null;
      return {
        ...product,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    })
    .filter(Boolean);

  let total = cartProducts.reduce((sum, item) => sum + item.subtotal, 0);

  session.set("cartProducts", cartProducts);
  session.set("total", total);

  let orders = await getOrdersByUser(user.id);
  let lastAddress = null;
  if (orders && orders.length > 0) {
    // Assuming orders have `createdAt` or `_id` for sorting
    let lastOrder = orders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    lastAddress = lastOrder.shippingAddress;
  }

  return { cartProducts, total, user, lastAddress };
}

// --- Component ---
export default function CheckoutPage() {
  let { cartProducts, total, user, lastAddress } = useLoaderData();
  let actionData = useActionData();
  let [selectedMethod, setSelectedMethod] = useState("");

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-400 mb-12">
          Checkout
        </h1>

        {/* Flash Messages */}
        {actionData?.error && (
          <p className="mb-6 text-red-500 text-center font-semibold">
            {actionData.error}
          </p>
        )}
        {actionData?.success && (
          <p className="mb-6 text-green-400 text-center font-semibold">
            {actionData.success}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Billing & Payment Form */}
          <Form
            method="post"
            className="bg-neutral-900 border border-green-900/40 p-8 rounded-2xl shadow-lg flex flex-col gap-6"
          >
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Billing Information
            </h2>

            {/* Name & Email side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                defaultValue={user.name}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={user.email}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Address */}
            <input
              type="text"
              name="address"
              placeholder="Address"
              defaultValue={lastAddress?.address || ""}
              required
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* City & Postal Code side by side */}
            <div className="flex gap-5">
              <input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={lastAddress?.city || ""}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Postal Code"
                defaultValue={lastAddress?.postalCode || ""}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Country */}
            <input
              type="text"
              name="country"
              placeholder="Country"
              defaultValue={lastAddress?.country || ""}
              required
              className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Payment Method */}
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-green-400 mb-4">
                Payment Method
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                {[
                  { id: "card", label: "Card", icon: "💳" },
                  { id: "mobile", label: "Mobile", icon: "📱" },
                  { id: "crypto", label: "Crypto", icon: "🪙" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      className="hidden peer"
                      onChange={() => setSelectedMethod(method.id)}
                      required
                    />
                    <span
                      className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-neutral-800 border-green-800 text-neutral-200
                      peer-checked:bg-green-500 peer-checked:text-white peer-checked:border-green-500
                      peer-checked:ring-2 peer-checked:ring-green-400 hover:bg-green-600 hover:text-white hover:shadow-lg transition-all duration-200"
                    >
                      <span className="text-xl">{method.icon}</span>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {selectedMethod === "mobile" && (
              <input
                type="tel"
                name="phoneNumber"
                placeholder="M-Pesa Phone Number (e.g. 2547XXXXXXXX)"
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-800 border border-green-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            )}

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Place Order
            </button>
          </Form>

          {/* Order Summary */}
          <div className="bg-neutral-900 border border-green-900/40 p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Order Summary
            </h2>
            <ul className="divide-y divide-green-900/20 mb-4">
              {cartProducts.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center justify-between py-3"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl"
                      />
                    )}
                    <div>
                      <p className="font-medium text-neutral-200">
                        {item.name}
                      </p>
                      <p className="text-neutral-400 text-sm">
                        ${item.price} each
                      </p>
                    </div>
                  </div>
                  {/* Quantity & Subtotal */}
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-green-700 text-white px-2 py-1 rounded-full text-sm">
                      x{item.quantity}
                    </span>
                    <span className="font-semibold text-green-400">
                      ${item.subtotal}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-xl font-bold text-green-400">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
