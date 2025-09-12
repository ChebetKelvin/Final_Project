import { getSession, commitSession } from "../.server/session";
import {
  redirect,
  useLoaderData,
  Form,
  useNavigate,
  useNavigation,
} from "react-router";
import { getUser, updateUserRole, deleteUser } from "../models/user";

export async function action({ request }) {
  let session = await getSession(request.headers.get("Cookie"));
  let admin = session.get("user");

  let formData = await request.formData();
  let userId = formData.get("userId");
  let actionType = formData.get("action");

  if (!userId || !actionType) return redirect("/admin/users");

  if (actionType === "delete") {
    await deleteUser(userId);
    session.set("successMessage", "User deleted successfully.");
  } else if (actionType === "toggleRole") {
    await updateUserRole(userId);
    session.set("successMessage", "User role updated successfully.");
  }

  return redirect("/admin/users", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function loader({ request }) {
  let session = await getSession(request.headers.get("Cookie"));

  let users = await getUser();

  // Format for frontend
  let formattedUsers = users.map((u) => ({
    ...u,
    _id: u._id.toString(),
  }));

  let successMessage = session.get("successMessage") || null;
  session.unset("successMessage");

  return {
    users: formattedUsers,
    successMessage,
    headers: { "Set-Cookie": await commitSession(session) },
  };
}

export default function AdminUsersPage() {
  let { users, successMessage } = useLoaderData();
  let navigate = useNavigate();
  let navigation = useNavigation();

  let isSubmitting = navigation.state !== "idle";

  if (!users || users.length === 0) {
    return (
      <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6 text-center">
        <h1 className="text-4xl font-bold text-green-400 mb-6">Users</h1>
        <p className="text-neutral-400">No users found.</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-950 text-neutral-300 py-24 px-6">
      <button
        className="  border border-green-500 text-green-400 px-4 py-2 rounded-lg hover:bg-green-900 transition"
        onClick={() => navigate(-1)}
      >
        ← Back to dashboard
      </button>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-12 text-center">
          All Users
        </h1>

        {successMessage && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center font-semibold">
            {successMessage}
          </div>
        )}

        {/* Users Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-green-900/40 rounded-xl">
            <thead className="bg-neutral-900">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-green-900/20">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.isAdmin ? "Admin" : "User"}</td>
                  <td className="p-3 flex gap-2">
                    <Form method="post">
                      <input type="hidden" name="userId" value={user._id} />
                      <input type="hidden" name="action" value="toggleRole" />
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition">
                        {user.isAdmin ? "Demote" : "Promote"}
                      </button>
                    </Form>
                    <Form method="post">
                      <input type="hidden" name="userId" value={user._id} />
                      <input type="hidden" name="action" value="delete" />
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm transition">
                        {isSubmitting ? "Deleting" : "Delete"}
                      </button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-6 mt-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-neutral-900 border border-green-900/40 p-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-lg font-semibold text-green-400">
                {user.name}
              </h2>
              <p className="text-neutral-400 mb-2">{user.email}</p>
              <p className="text-neutral-400 mb-4">
                Role: {user.isAdmin ? "Admin" : "User"}
              </p>
              <div className="flex gap-2">
                <Form method="post" className="flex-1">
                  <input type="hidden" name="userId" value={user._id} />
                  <input type="hidden" name="action" value="toggleRole" />
                  <button className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm transition">
                    {user.isAdmin ? "Demote" : "Promote"}
                  </button>
                </Form>
                <Form method="post" className="flex-1">
                  <input type="hidden" name="userId" value={user._id} />
                  <input type="hidden" name="action" value="delete" />
                  <button className="w-full px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white text-sm transition">
                    {isSubmitting ? "Deleting" : "Delete"}
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
