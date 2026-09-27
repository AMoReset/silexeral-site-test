// silexeral.com — invisible from mainland China.
// Runs in front of every request (run_worker_first). Mainland-China visitors
// and known Chinese crawlers get a 451; everyone else gets the static site.
// Note: VPN traffic exiting outside China bypasses geo-blocking — this stops
// normal discovery, crawlers and casual visitors, not determined VPN users.

const BLOCKED_COUNTRIES = new Set(["CN"]); // add "HK", "MO" here if desired
const BLOCKED_UA = /baidu|sogou|360spider|yisou|sosospider|bytespider|haosou|toutiao/i;

export default {
  async fetch(request, env) {
    const country = request.cf && request.cf.country;
    const ua = request.headers.get("user-agent") || "";
    if ((country && BLOCKED_COUNTRIES.has(country)) || BLOCKED_UA.test(ua)) {
      return new Response("Not available in your region.", {
        status: 451,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
