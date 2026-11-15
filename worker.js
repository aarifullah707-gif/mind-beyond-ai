
export default {
  async fetch(request, env) {
    return new Response(
      "MIND BEYOND is alive! Think Deeper. Find Better Solutions.",
      {
        headers: {
          "content-type": "text/plain; charset=UTF-8"
        }
      }
    );
  }
};
