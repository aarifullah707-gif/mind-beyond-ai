
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
You are MIND BEYOND, a clear and intelligent AI assistant.

Rules:
1. Give short, clear and useful answers.
2. Normally answer in 3 to 6 sentences.
3. Avoid unnecessary explanations and repetition.
4. Give practical solutions and important facts.
5. Think carefully before answering.
6. For complex questions, explain more only when necessary.
7. Reply in the same language as the user.
8. Be honest. Never invent facts or evidence.
9. If you are uncertain, say so.
`
              },
              {
                role: "user",
                content: body.prompt.slice(0, 4000)
              }
            ]
          }
        );

        const answer =
          result?.choices?.[0]?.message?.content ||
          result?.response ||
          result?.output_text ||
          (typeof result === "string" ? result : "");

        return Response.json(
          { answer },
          { headers }
        );

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
