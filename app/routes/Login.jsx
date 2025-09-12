import {
  getSession,
  commitSession,
  setErrorMessage,
  setSuccessMessage,
} from "../.server/session";
import { getUserByEmail } from "../models/user"; // function to fetch user by email
import bcrypt from "bcrypt";
import { redirect, Form, Link } from "react-router";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  // fetch user by email
  let user = await getUserByEmail(email);

  if (!user) {
    setErrorMessage(session, "Email or password is incorrect");
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  // compare password
  let validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    setErrorMessage(session, "Email or password is incorrect");
    return redirect("/login", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  // save user info in session
  session.set("user", {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  if (user.role === "admin") {
    return redirect("/admin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  setSuccessMessage(session, `Welcome back, ${user.name}!`);

  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function LoginForm({ actionData }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <Form
        method="post"
        className="flex flex-col gap-5 bg-gray-900/70 backdrop-blur-md border border-green-800/40 p-6 sm:p-8 lg:p-10 rounded-2xl shadow-2xl w-full sm:max-w-sm md:max-w-md lg:max-w-lg"
      >
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-green-400">
          🌿 Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 text-center -mt-1 sm:-mt-2 mb-3 sm:mb-4">
          Login to elevate your experience
        </p>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400 text-sm sm:text-base"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400 text-sm sm:text-base"
          required
        />

        {/* Error Message */}
        {actionData?.error && (
          <p className="text-red-500 text-xs sm:text-sm text-center">
            {actionData.error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          className="bg-green-500 py-2 sm:py-3 rounded-lg text-white font-semibold shadow-lg transition-transform transform hover:scale-105 hover:bg-green-400 focus:ring-2 focus:ring-green-300 text-sm sm:text-base"
        >
          Login
        </button>

        {/* Footer */}
        <p className="text-gray-500 text-xs sm:text-sm text-center mt-3 sm:mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:text-green-300">
            Sign up
          </Link>
        </p>
      </Form>
    </div>
  );
}
