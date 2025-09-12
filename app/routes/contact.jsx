import { Form, useActionData, useNavigation } from "react-router";
import { validateText } from "../.server/validation";
import {
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";
import { addMessage } from "../models/messages";
import { useEffect, useRef } from "react";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  let message = formData.get("message");

  let response = {
    name,
    email,
    message,
  };

  let fiedErrors = {
    name: validateText("name"),
    email: validateText("email"),
    message: validateText("message"),
  };

  if (Object.values(fiedErrors).some(Boolean)) {
    return { fiedErrors };
  }

  let result = await addMessage(response);

  if (result.acknowledged) {
    setSuccessMessage(
      session,
      "Message sent succesfully we'll get back to you!"
    );
  } else {
    setErrorMessage(session, "Failed try again!.");
  }

  return { fiedErrors, setErrorMessage, setSuccessMessage };
}

export default function ContactPage() {
  let actionData = useActionData();

  let navigation = useNavigation();

  let isSubmmitting = navigation.state !== "idle";

  let formRef = useRef();

  useEffect(() => {
    formRef.current.reset();
  }, [isSubmmitting]);

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-green-400 mb-8">
          Get in <span className="text-green-500">Touch</span>
        </h1>
        <p className="text-center text-neutral-400 mb-12">
          Have questions about our products or delivery? Drop us a message and
          we'll get back to you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-2">
                Email
              </h2>
              <p>support@weedshop.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-2">
                Phone
              </h2>
              <p>+254 712 345 678</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-2">
                Address
              </h2>
              <p>Nairobi, Kenya</p>
            </div>
          </div>

          {/* Contact Form */}
          <Form
            ref={formRef}
            method="post"
            className="bg-neutral-900 border border-green-900/40 p-8 rounded-2xl shadow-lg flex flex-col gap-4"
          >
            {/* Success Message */}
            {actionData?.success && (
              <p className="text-green-400 font-semibold text-center mb-4">
                Thank you! We received your message.
              </p>
            )}

            {/* Name */}
            <div className="flex flex-col">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                  actionData?.errors?.name
                    ? "border-red-500"
                    : "border-green-800"
                } text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {actionData?.errors?.name && (
                <span className="text-red-500 text-sm mt-1">
                  {actionData.errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                  actionData?.errors?.email
                    ? "border-red-500"
                    : "border-green-800"
                } text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {actionData?.errors?.email && (
                <span className="text-red-500 text-sm mt-1">
                  {actionData.errors.email}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col">
              <textarea
                name="message"
                rows="5"
                placeholder="Your Message"
                className={`w-full px-4 py-3 rounded-lg bg-neutral-800 border ${
                  actionData?.errors?.message
                    ? "border-red-500"
                    : "border-green-800"
                } text-neutral-200 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {actionData?.errors?.message && (
                <span className="text-red-500 text-sm mt-1">
                  {actionData.errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition mt-2"
            >
              {isSubmmitting ? "Sending..." : "Send Message"}
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}
