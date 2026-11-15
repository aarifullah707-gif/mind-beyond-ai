
export default {
  async fetch(request, env) {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    if (request.method === "POST") {
      try {
        const body = await request.json();

        if (!body.prompt || typeof body.prompt !== "string") {
          return Response.json(
            { error: "Please enter a prompt" },
            { status: 400, headers }
          );
        }

        const result = await env.AI.run(
          "@cf/google/gemma-4-26b-a4b-it",
          {
            messages: [
              {
                role: "system",
                content: "You are Mind Beyond. Analyze deeply, examine evidence, identify root causes and give practical solutions. Reply in the user's language."
              },
              {
                role: "user",
                content: body.prompt.slice(0, 1000)
              }
            ]
          }
        );

        return Response.json({
          answer: result.response || result
        }, { headers });

      } catch (error) {
        return Response.json(
          { error: error.message || String(error) },
          { status: 500, headers }
        );
      }
    }

    if (request.method === "GET") {
      const page = await fetch(
        "https://raw.githubusercontent.com/aarifullah707-gif/mind-beyond-ai/main/index.html"
      );

      return new Response(await page.text(), {
        headers: {
          ...headers,
          "Content-Type": "text/html; charset=UTF-8"
        }
      });
    }

    return Response.json(
      { error: "Method not allowed" },
      { status: 405, headers }
    );
  }
};
