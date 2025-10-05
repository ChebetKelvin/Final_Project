import { Form, redirect } from "react-router";
import {
  getSession,
  commitSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";
import { validateText, validatePassword } from "../.server/validation";
import { addUser } from "../models/user";
import bcrypt from "bcrypt";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  let password = formData.get("password");

  let hashedPassword = await bcrypt.hash(password, 10);

  let user = {
    name,
    email,
    password: hashedPassword,
    role: "user",
  };

  let fieldErrors = {
    name: validateText(name),
    email: validateText(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors };
  }

  let users = await addUser(user);

  if (users.acknowledged) {
    setSuccessMessage(session, "Successfully registered");
  } else {
    setErrorMessage(session, "Failed registration");
  }

  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SignupForm({ actionData }) {
  console.log({ actionData });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Form
        method="post"
        className="flex flex-col gap-5 bg-gray-900/70 backdrop-blur-md border border-green-800/40 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto"
      >
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-green-400">
          🌱 Create Account
        </h2>
        <p className="text-sm text-gray-400 text-center -mt-2 mb-4">
          Join us and elevate your experience
        </p>

        {/* Full Name */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="px-4 py-3 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400 w-full"
            required
          />
          {actionData?.fieldErrors?.name && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.name}
            </span>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="px-4 py-3 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400 w-full"
            required
          />
          {actionData?.fieldErrors?.email && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="px-4 py-3 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400 w-full"
            required
          />
          {actionData?.fieldErrors?.password && (
            <span className="text-red-500 text-sm">
              {actionData.fieldErrors.password}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 py-3 rounded-lg text-white font-semibold shadow-lg transition-transform transform hover:scale-105 hover:bg-green-400 focus:ring-2 focus:ring-green-300"
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:text-green-300">
            Login
          </a>
        </p>
      </Form>
    </div>
  );
}
