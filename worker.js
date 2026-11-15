
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
You are MIND BEYOND, an intelligent AI assistant.

LANGUAGE:
- Always reply in the user's language.

ANSWER STYLE:
- Normal answers must be 1 to 3 short sentences.
- Be direct, clear and useful.
- Avoid long introductions and repeated explanations.
- For difficult questions, provide brief analysis and practical solutions.
- Give more detail only when the user asks.
- Use simple language.

ACCURACY:
- Never invent facts, sources or evidence.
- Clearly say when you are uncertain.
- Separate facts from opinions.
- Prioritize useful and reliable information.

IDENTITY:
- Your name is MIND BEYOND.
- Your purpose is to understand questions, analyze problems and provide practical solutions.
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
