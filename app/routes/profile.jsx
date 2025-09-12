import { redirect, Form, useLoaderData } from "react-router";
import bcrypt from "bcryptjs";
import {
  getSession,
  commitSession,
  setSuccessMessage,
} from "../.server/session";
import { getUserById, updateUser } from "../models/user";
import { User } from "lucide-react";

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");
  console.log({ user });

  if (!user) return redirect("/login");

  // Map id → _id
  const dbUser = await getUserById(user.id); // pass user.id
  console.log({ dbUser });

  if (!dbUser) return redirect("/login");

  return {
    user: {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
    },
  };
}

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let user = session.get("user");

  if (!user) return redirect("/login");

  let formData = await request.formData();
  let name = formData.get("name");
  let email = formData.get("email");
  let password = formData.get("password");

  let updateFields = { name, email };
  if (password?.trim()) {
    updateFields.password = await bcrypt.hash(password, 10);
  }

  // Pass user.id (not _id)
  await updateUser(user.id, updateFields);

  const updatedUser = await getUserById(user.id);

  // Update session
  session.set("user", {
    id: updatedUser._id.toString(),
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
  });

  setSuccessMessage(session, "Profile updated successfully!");

  return redirect("/profile", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function ProfilePage() {
  let { user } = useLoaderData();
  console.log(user);

  return (
    <div className="h-fit pt-20 px-4 bg-neutral-950 text-white flex justify-center mb-10">
      <div className="w-full max-w-lg bg-neutral-900 p-8 rounded-2xl shadow-lg border border-green-700/40">
        <h1 className="text-2xl font-bold text-green-400 mb-6 text-center">
          My Profile
        </h1>

        <div className="w-50 h-50 bg-green-600 rounded-full mx-auto flex justify-center items-center">
          <User className="w-20 h-20 " />
        </div>

        <Form method="post" className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              defaultValue={user.name}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={user.email}
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep current"
              className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-green-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold text-white transition"
          >
            Update Profile
          </button>
        </Form>
      </div>
    </div>
  );
}
