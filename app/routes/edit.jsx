import { Form, redirect, useNavigate, useNavigation } from "react-router";
import { FormSpacer } from "../components/FormSpacer";
import { Input } from "../components/Input";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "../models/product";
import { validatePrice, validateText } from "../.server/validation";
import {
  commitSession,
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";

export async function loader({ params }) {
  let { id } = params;
  // console.log({ id });

  let product = await getProductById(id);

  return { product };
}

export async function action({ request, params }) {
  let { id } = params;
  console.log({ id });

  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();

  let action = formData.get("_action");

  switch (action) {
    case "edit": {
      let name = formData.get("name");
      let price = formData.get("price");
      let category = formData.get("category");
      let imageUrl = formData.get("imageUrl");

      // Validation

      let fieldErrors = {
        name: validateText(name),
        price: validatePrice(price),
        category: validateText(category),
        imageUrl: validateText(imageUrl),
      };

      if (Object.values(fieldErrors).some(Boolean)) {
        return { fieldErrors };
      }

      let updatedData = {
        name,
        price,
        category,
        imageUrl,
      };

      let result = await updateProduct(id, updatedData);

      if (result.acknowledged) {
        setSuccessMessage(session, "Edited successfully!");
      } else {
        setErrorMessage(session, "unsuccesful operation");
      }

      return redirect("/admin/products", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
    case "delete": {
      let result = await deleteProduct(id);
      return redirect("admin/products");
    }
  }
  return null;
}

export default function EditProduct({ actionData, loaderData }) {
  let { product } = loaderData;
  let navigate = useNavigate();
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";

  return (
    <main className="px-6 max-w-2xl mx-auto mt-36 py-8 bg-neutral-900 rounded-xl shadow-lg border border-green-700/40">
      {/* Back Button */}
      <button
        className="border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-900 transition"
        onClick={() => navigate(-1)}
      >
        ← Back to Products
      </button>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mt-8 text-green-400">
        Edit Product
      </h1>

      {/* Edit Form */}
      <Form method="post" className="space-y-6 mt-8">
        <input type="hidden" name="_id" value={product._id} />
        <FormSpacer>
          <label htmlFor="name" className="text-neutral-300 font-medium">
            Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            defaultValue={product.name}
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
            defaultValue={product.price}
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
            defaultValue={product.category}
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
            defaultValue={product.imageUrl}
            className="bg-neutral-800 text-white border border-green-700 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {actionData?.fieldErrors.imageUrl && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.imageSrc}
            </span>
          )}
        </FormSpacer>

        {/* Save Button */}
        <button
          name="_action"
          value="edit"
          className="bg-green-500 hover:bg-green-600 active:scale-95 transition ease-in-out duration-300 px-6 py-3 rounded-lg w-full text-white font-semibold shadow"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </Form>

      {/* Delete Button */}
      <Form method="post" className="mt-8">
        <button
          name="_action"
          value="delete"
          className="bg-red-500 hover:bg-red-600 active:scale-95 transition ease-in-out duration-300 px-6 py-3 rounded-lg w-full text-white font-semibold shadow"
        >
          Delete Product
        </button>
      </Form>
    </main>
  );
}
