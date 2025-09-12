import { Form, useActionData, useNavigation } from "react-router";
import { validateText } from "../.server/validation";
import {
  getSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";
import { addMessage } from "../models/messages";
import { useEffect, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

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

  let isSubmitting = navigation.state !== "idle";

  let formRef = useRef();

  useEffect(() => {
    formRef.current.reset();
  }, [isSubmitting]);

  return (
    <section className="min-h-screen mt-5 bg-gradient-to-br from-green-950 via-black to-green-900 text-neutral-200 py-16 px-4 sm:px-6 ">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-green-400 mb-4">
          Get in <span className="text-green-500">Touch</span>
        </h1>
        <p className="text-center text-neutral-400 mb-12 text-lg sm:text-xl">
          Have questions about our products or delivery? Drop us a message and
          we'll get back to you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email Card */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-green-700/40 hover:shadow-[0_0_20px_#34d399] transition-shadow duration-300">
              <Mail className="text-green-400 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-green-400">Email</h2>
                <p>support@weedshop.com</p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-green-700/40 hover:shadow-[0_0_20px_#34d399] transition-shadow duration-300">
              <Phone className="text-green-400 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-green-400">Phone</h2>
                <p>+254 712 345 678</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-900 border border-green-700/40 hover:shadow-[0_0_20px_#34d399] transition-shadow duration-300">
              <MapPin className="text-green-400 w-6 h-6" />
              <div>
                <h2 className="text-lg font-semibold text-green-400">
                  Address
                </h2>
                <p>Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Form
            ref={formRef}
            method="post"
            className="bg-green-900/20 border border-green-700/50 p-8 rounded-3xl shadow-lg flex flex-col gap-4"
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
                className={`w-full px-4 py-3 rounded-lg bg-green-950 border ${
                  actionData?.errors?.name
                    ? "border-red-500"
                    : "border-green-700"
                } text-neutral-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                className={`w-full px-4 py-3 rounded-lg bg-green-950 border ${
                  actionData?.errors?.email
                    ? "border-red-500"
                    : "border-green-700"
                } text-neutral-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
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
                className={`w-full px-4 py-3 rounded-lg bg-green-950 border ${
                  actionData?.errors?.message
                    ? "border-red-500"
                    : "border-green-700"
                } text-neutral-200 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              {actionData?.errors?.message && (
                <span className="text-red-500 text-sm mt-1">
                  {actionData.errors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all mt-2 shadow-md"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </Form>
        </div>
      </div>
    </section>
  );
}
