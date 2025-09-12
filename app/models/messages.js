import { client } from "../.server/mongo";

let db = client.db("products");
let collection = db.collection("messages");

export async function getMessages() {
  return collection.find().toArray();
}

export async function addMessage(response) {
  return collection.insertOne(response);
}
