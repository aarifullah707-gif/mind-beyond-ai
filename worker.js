
export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (request.method === "GET") {
      return Response.json({
        app: "MIND BEYOND",
        status: "AI READY"
      }, { headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405, headers: cors }
      );
    }

    try {
      const { prompt } = await request.json();

      if (!prompt || typeof prompt !== "string") {
        return Response.json(
          { error: "Please enter a problem." },
          { status: 400, headers: cors }
        );
      }

      const result = await env.AI.run(
        
"@cf/google/gemma-4-26b-a4b-it",
        {
          messages: [
            {
              role: "system",
              content: "You are Mind Beyond, an intelligent problem-solving assistant. Analyze problems carefully, identify root causes, evaluate uncertainty, and suggest practical solutions."
            },
            {
              role: "user",
              content: prompt.slice(0, 1000)
            }
          ]
        }
      );

      return Response.json(
        { answer: result.response || result },
        { headers: cors }
      );

    } catch (error) {
  return Response.json(
    {
      error: "AI request failed",
      details: error instanceof Error ? error.message : String(error)
    },
    { status: 500, headers: cors }
  );
}
      return Response.json(
        { error: "AI request failed. Please try again." },
        { status: 500, headers: cors }
      );
    }
  }
};
