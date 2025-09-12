import { client, ObjectId } from "../.server/mongo";

let db = client.db("products");
let collection = db.collection("user");

export async function getUser() {
  return collection.find().toArray();
}

export async function getUserByEmail(email) {
  return collection.findOne({ email });
}

export async function getUserById(id) {
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function addUser(user) {
  return collection.insertOne(user);
}

export async function getUsersCount() {
  return collection.countDocuments();
}

export async function updateUserRole(userId) {
  let user = await collection.findOne({ _id: new ObjectId(userId) });
  if (!user) throw new Error("User not found");

  // Flip isAdmin boolean
  let newRole = !user.isAdmin;

  await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { isAdmin: newRole } }
  );

  return { ...user, isAdmin: newRole };
}

export async function deleteUser(userId) {
  return collection.deleteOne({ _id: new ObjectId(userId) });
}

export async function updateUser(id, updateData) {
  // Convert string ID to ObjectId
  const _id = new ObjectId(id);
  return collection.updateOne({ _id }, { $set: updateData });
}
