export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method === "GET") {
      return new Response(JSON.stringify({
        app: "MIND BEYOND",
        status: "ONLINE"
      }), { headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({
        error: "Use POST method"
      }), { status: 405, headers });
    }

    try {
      const body = await request.json();

      if (!body.prompt || typeof body.prompt !== "string") {
        return new Response(JSON.stringify({
          error: "Please enter a prompt"
        }), { status: 400, headers });
      }

      const result = await env.AI.run(
        "@cf/google/gemma-4-26b-a4b-it",
        {
          messages: [
            {
              role: "system",
              content: "You are Mind Beyond. Analyze deeply, find root causes, examine evidence and provide practical solutions."
            },
            {
              role: "user",
              content: body.prompt.slice(0, 1000)
            }
          ]
        }
      );

      return new Response(JSON.stringify({
        answer: result.response || result
      }), { headers });

    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message || String(error)
      }), { status: 500, headers });
    }
  }
};
