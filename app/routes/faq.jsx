import { useState } from "react";
import { getFaq } from "../models/faq";
import { useLoaderData } from "react-router";

// ✅ Loader fetches from DB
export async function loader() {
  let results = await getFaq();

  let faqs = results.map((item) => {
    return {
      ...item,
      _id: item._id.toString(),
    };
  });

  return { faqs };
}

export default function FaqPage() {
  const { faqs } = useLoaderData();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pt-24 px-4 bg-neutral-950 text-white flex justify-center mb-10">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-green-400 mb-8 text-center">
          Frequently Asked Questions
        </h1>

        {faqs.length === 0 ? (
          <p className="text-center text-gray-400">
            No FAQs available at the moment. Please check back later.
          </p>
        ) : (
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={item._id}
                className="border border-green-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full text-left px-6 py-4 bg-neutral-900 hover:bg-neutral-800 transition flex justify-between items-center"
                >
                  <span>{item.question}</span>
                  <span className="text-green-400 font-bold">
                    {openIndex === index ? "-" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-neutral-800 text-gray-300">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
