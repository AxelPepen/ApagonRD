export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      // Try to fetch the requested asset
      let response = await env.ASSETS.fetch(request);

      // If the asset is not found (404), serve index.html for SPA routing
      if (response.status === 404 && !url.pathname.startsWith("/assets/")) {
        const indexRequest = new Request(`${url.origin}/index.html`, request);
        return await env.ASSETS.fetch(indexRequest);
      }

      return response;
    } catch (e) {
      return new Response("Internal Error", { status: 500 });
    }
  },
};
