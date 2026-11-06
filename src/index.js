// Routes hanaki.shadowcary.com to /hanaki/* static files and proxies the song archive.
const SONGS = "https://xshadowmoon.github.io/hanaki-gequ/";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === "www.shadowcary.com") {
      url.hostname = "shadowcary.com";
      return Response.redirect(url.toString(), 301);
    }
    if (url.hostname.startsWith("hanaki.")) {
      if (url.pathname === "/songs") return Response.redirect(url.origin + "/songs/", 301);
      if (url.pathname === "/songs/") {
        const r = await fetch(SONGS, { cf: { cacheTtl: 300 } });
        const h = new Headers(r.headers);
        h.set("content-type", "text/html; charset=utf-8");
        h.set("cache-control", "public, max-age=300");
        return new Response(r.body, { status: r.status, headers: h });
      }
      const a = new URL(url);
      if (!url.pathname.startsWith("/fonts/")) a.pathname = "/hanaki" + url.pathname;
      return env.ASSETS.fetch(new Request(a, request));
    }
    return env.ASSETS.fetch(request);
  },
};
