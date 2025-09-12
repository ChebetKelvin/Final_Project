import {
  getSession,
  commitSession,
  setSuccessMessage,
} from "../.server/session";
import { getProducts } from "../models/product";
import { Form, data, Link } from "react-router";
import { EmptyIcon } from "../components/Icon";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let cartItems = session.get("cartItems") || [];
  let results = await getProducts();

  let products = results.map((item) => ({
    ...item,
    _id: item._id.toString(),
    price: item.price || 0, // ensure price exists
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

  return data(
    { cartProducts, total },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function cart({ loaderData }) {
  let { cartProducts, total } = loaderData;
  return (
    <main className="px-6 max-w-5xl mx-auto mt-24 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <h1 className="text-4xl font-extrabold text-green-400 drop-shadow-lg">
          Your Cart
        </h1>
        <span className="text-lg md:text-2xl font-medium text-green-200">
          {cartProducts.length} {cartProducts.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Empty state */}
      {cartProducts.length === 0 && (
        <div className="mt-12 flex flex-col items-center justify-center gap-4">
          <EmptyIcon className="w-24 h-24 text-green-400 animate-bounce" />
          <p className="text-gray-400 text-center text-lg">
            Your cart is empty. Add some products to get started!
          </p>
        </div>
      )}

      {/* Cart items */}
      <ul className="space-y-6 mt-10">
        {cartProducts.map((item) => (
          <li key={item._id}>
            <CartItem
              name={item.name}
              imageSrc={item.imageUrl}
              quantity={item.quantity}
              id={item._id}
              price={item.price}
              subtotal={item.subtotal}
              className="hover:scale-[1.02] transition-transform duration-300"
            />
          </li>
        ))}
      </ul>

      {/* Total & Checkout */}
      {cartProducts.length > 0 && (
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 p-6 border-t border-green-700/30 bg-green-900/10 rounded-2xl shadow-inner backdrop-blur-sm">
          <p className="text-2xl font-semibold text-green-300">
            Total: <span className="text-white">${total.toFixed(2)}</span>
          </p>
          <Link to="/checkout">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-transform transform hover:scale-105">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let id = formData.get("id");
  let action = formData.get("_action");
  let cartItems = session.get("cartItems") || [];

  switch (action) {
    case "alter_quantity":
      {
        let quantity = Number(formData.get("quantity"));

        let existingItemIndex = cartItems.findIndex((item) => item.id === id);

        if (quantity <= 0) {
          cartItems = cartItems.filter((item) => item.id !== id);
        } else {
          let existingItemIndex = cartItems.findIndex((item) => item.id === id);
        }

        if (existingItemIndex !== -1) {
          cartItems[existingItemIndex].quantity = quantity;
        } else {
          cartItems.push({ id, quantity });
        }
      }

      session.set("cartItems", cartItems);
      setSuccessMessage(session, "Quantity Updated");

      return data(
        { ok: true },
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    case "remove_item": {
      let existingItemIndex = cartItems.findIndex((item) => item.id === id);

      cartItems.splice(existingItemIndex, 1);

      session.set("cartItems", cartItems);
      setSuccessMessage(session, "Item removed!");
    }
  }
  return data(
    { ok: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

function CartItem({ name, imageSrc, quantity, id, price, subtotal }) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border border-green-200 shadow-md rounded-2xl p-5 bg-green-50 hover:shadow-lg transition-all duration-300 lg:max-w-2xl">
      {/* Product Info */}
      <div className="flex items-center gap-6 flex-1">
        <img
          src={imageSrc}
          alt={`Image of ${name}`}
          className="rounded-xl w-24 h-24 object-cover shadow-inner border-2 border-green-300"
        />
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-green-900">{name}</h2>

          {/* Price label */}
          <p className="text-green-700 text-sm mt-1">
            Price: <span className="font-semibold">${price}</span>
          </p>

          {/* Quantity Controls */}
          <Form method="post" className="flex items-center gap-3 mt-3">
            <input type="hidden" name="id" value={id} />
            <input type="hidden" name="_action" value="alter_quantity" />

            <button
              name="quantity"
              value={Math.max(Number(quantity) - 1, 0)}
              className="bg-green-100 text-green-800 hover:bg-red-400 hover:text-white active:scale-95 transition px-3 py-1.5 rounded-full shadow-md"
            >
              -
            </button>

            <span className="text-green-900 font-medium px-2">{quantity}</span>

            <button
              name="quantity"
              value={Number(quantity) + 1}
              className="bg-green-100 text-green-800 hover:bg-green-600 hover:text-white active:scale-95 transition px-3 py-1.5 rounded-full shadow-md"
            >
              +
            </button>
          </Form>
        </div>
      </div>

      {/* Subtotal + Remove */}
      <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
        <p className="text-green-900 text-sm">
          Subtotal: <span className="font-semibold">${subtotal}</span>
        </p>
        <Form method="post">
          <input type="hidden" name="_action" value="remove_item" />
          <input type="hidden" name="id" value={id} />
          <button className="p-2 rounded-full hover:bg-red-500 text-green-800 font-bold transition scale-105">
            X
          </button>
        </Form>
      </div>
    </div>
  );
}
