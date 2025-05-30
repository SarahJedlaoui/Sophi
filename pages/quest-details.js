"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; 

export default function GuidedPostPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
 const router = useRouter();
  useEffect(() => {
    const fetchInsights = async () => {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        alert("No session ID found.");
        return;
      }


      try {
        const res = await fetch(
          `https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/insights/${sessionId}`
        );
        const result = await res.json();
        setSession(result); // 👈 save the session object directly
        console.log("result", result);
        console.log("session", result.session);
        setLoading(false);
        // ✅ Generate and save questions
      await fetch(
        "https://sophiabackend-82f7d870b4bb.herokuapp.com/api/persona/questionsV2",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        }
      );
      } catch (err) {
        console.error("Failed to load insights", err);
        alert("Could not fetch your insights.");
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <p className="p-8 text-center">Loading insights...</p>;
  if (!session?.insights)
    return <p className="p-8 text-center">No insights found.</p>;

  const { insights } = session;

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col text-[#222] max-w-[430px] mx-auto">
      {/* HEADER */}
      <div className="bg-[#D96C4F] text-white px-6 py-6 rounded-b-2xl">
        {/* Progress */}
        <div className="flex gap-2 mb-1 mt-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${
                i === 0
                  ? "bg-[#FFFFFF]"
                  : i === 1
                  ? "bg-[#FFFFFF]"
                  : "bg-[#FFFFFF] opacity-40"
              }`}
            />
          ))}
        </div>

        <p className="text-sm">Step 2 of 4</p>
        <h1 className="text-xl font-bold mt-2">Today’s Question</h1>
        <p className="text-lg font-semibold mt-2 leading-snug">
          {session.chosenQuestion}
        </p>
      </div>

      {/* BODY */}
      <div className="p-6 flex-1">
        <h2 className="text-lg font-bold mb-1">
          Find Out What Your Community Is Saying
        </h2>

        {/* QUICK TAKE */}
        <h3 className="text-md font-semibold mt-4 mb-1">Quick Take</h3>
        <p className="text-md text-[#444] leading-relaxed">
          {insights.quickTake}
        </p>

        {/* THOUGHT FROM FIELD */}
        <div className="mt-6 border rounded-lg p-4 bg-white shadow">
          <h4 className="text-md font-semibold mb-2">
            A Thought from the Field
          </h4>
          <p className="text-md text-[#D96C4F] italic">
            “{insights.expertQuote?.quote || "No quote found"}”
          </p>
          <p className="text-[11px] mt-2 text-gray-600">
            {insights.expertQuote?.author}
          </p>
        </div>

        {/* FAST FACTS */}
        <h3 className="text-sm font-semibold mt-6 mb-2">Fast Facts</h3>
        <ul className="text-sm space-y-2">
          {(insights.fastFacts || []).map((fact, idx) => (
            <li key={idx} className="flex gap-2">
              <span>•</span>
              <span dangerouslySetInnerHTML={{ __html: fact }} />
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="p-6 pt-0">
        <button  onClick={() => router.push("/guided-discussion")} className="w-full bg-[#D96C4F] text-white py-3 rounded-full text-lg shadow">
          Build my post
        </button>
      </div>
    </div>
  );
}
