import { client } from "../.server/mongo";

let db = client.db("products");
let collection = db.collection("faq");

export async function getFaq() {
  return collection.find().toArray();
}
