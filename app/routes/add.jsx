import { Form, redirect, useNavigation } from "react-router";
import { FormSpacer } from "../components/FormSpacer";
import { Input } from "../components/Input";
import { validatePrice, validateText } from "../.server/validation";
import { createProduct } from "../models/product";
import {
  commitSession,
  getSession,
  setSuccessMessage,
} from "../.server/session";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let name = formData.get("name");
  let price = formData.get("price");
  let category = formData.get("category");
  let imageUrl = formData.get("image-src");
  let description = formData.get("description");

  // Validation

  let fieldErrors = {
    name: validateText(name),
    price: validatePrice(price),
    category: validateText(category),
    imageUrl: validateText(imageSrc),
    description: validateText(description),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  let product = {
    name,
    price,
    category,
    imageUrl,
    description,
    stock: "50",
  };

  //   Save it to the db

  await createProduct(product);

  setSuccessMessage(session, "Added successfully!");

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function AddProduct({ actionData }) {
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";
  return (
    <main className="px-6 max-w-2xl mx-auto mt-36 py-8 bg-neutral-900 rounded-xl shadow-lg border border-green-700/40">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-green-400">
        Add Product
      </h1>

      {/* Add Product Form */}
      <Form method="post" className="space-y-6 mt-8">
        <FormSpacer>
          <label htmlFor="name" className="text-neutral-300 font-medium">
            Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            className="bg-neutral-800 text-white border border-green-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {actionData?.fieldErrors.name && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.name}
            </span>
          )}
        </FormSpacer>

        <FormSpacer>
          <label htmlFor="price" className="text-neutral-300 font-medium">
            Price
          </label>
          <Input
            type="number"
            name="price"
            id="price"
            className="bg-neutral-800 text-white border border-green-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {actionData?.fieldErrors.price && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.price}
            </span>
          )}
        </FormSpacer>

        <FormSpacer>
          <label htmlFor="category" className="text-neutral-300 font-medium">
            Category
          </label>
          <Input
            type="text"
            name="category"
            id="category"
            className="bg-neutral-800 text-white border border-green-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {actionData?.fieldErrors.category && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.category}
            </span>
          )}
        </FormSpacer>

        <FormSpacer>
          <label htmlFor="image-src" className="text-neutral-300 font-medium">
            Image URL
          </label>
          <Input
            type="text"
            name="imageUrl"
            id="imageUrl"
            className="bg-neutral-800 text-white border border-green-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {actionData?.fieldErrors.imageSrc && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.imageSrc}
            </span>
          )}
        </FormSpacer>

        <FormSpacer>
          <label htmlFor="description" className="text-neutral-300 font-medium">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            rows="6"
            className="bg-neutral-800 text-white border border-green-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          ></textarea>
          {actionData?.fieldErrors.description && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.description}
            </span>
          )}
        </FormSpacer>

        {/* Submit Button */}
        <button className="bg-green-500 hover:bg-green-600 active:scale-95 transition ease-in-out duration-300 px-6 py-3 rounded-lg w-full text-white font-semibold shadow">
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </Form>
    </main>
  );
}
