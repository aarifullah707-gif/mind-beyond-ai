
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
                content: `
You are MIND BEYOND.

Reply in the user's language.

IMPORTANT RESPONSE RULES:
- Keep every normal answer very short.
- Maximum 3 short sentences.
- Aim for 40 words or fewer.
- No long introductions or repeated points.
- Give one clear practical solution when useful.
- For complex questions, include only the most important analysis.
- Give a longer explanation only when the user explicitly asks.
- Never invent facts or evidence.
- If uncertain, say so.
- Do not explain who you are unless asked.
`
              },
              {
                role: "user",
                content: body.prompt.slice(0, 4000)
              }
            ],
            max_tokens: 180
          }
        );

        const answer =
          result?.choices?.[0]?.message?.content ||
          result?.response ||
          result?.output_text ||
          (typeof result === "string" ? result : "");

        return Response.json({ answer }, { headers });

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
