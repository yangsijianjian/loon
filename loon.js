(() => {
  const T = "[PrivateRepo]";
  const done = (o) => { try { $done(o || {}); } catch (e) {} };
  try {
    const u = new URL(($request && $request.url) || "");
    if (!/^(raw|gist)\.githubusercontent\.com$/i.test(u.hostname)) return done();

    let a = $argument || {};
    if (typeof a === "string") { try { a = JSON.parse(a); } catch (e) { a = Object.fromEntries(new URLSearchParams(a)); } }
    const user = (a.USERNAME || "").trim(), token = (a.TOKEN || "").trim();
    if (!user || !token) return done();

    const seg = u.pathname.split("/")[1] || "";
    if (seg.toLowerCase() !== user.toLowerCase()) return done({});

    const h = Object.assign({}, $request.headers || {});
    for (const k in h) if (k.toLowerCase() === "authorization") delete h[k];
    h["Authorization"] = "token " + token;
    console.log(`${T} Injected for ${user}`);
    return done({ headers: h });
  } catch (e) {
    return done({});
  }
})();