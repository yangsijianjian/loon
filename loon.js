(() => {
  let args = $argument || {};
  if (typeof args === "string") {
    args = Object.fromEntries(new URLSearchParams(args));
  }

  const username = (args.USERNAME || "").trim();
  const token = (args.TOKEN || "").trim();

  if (username && token && $request.url.toLowerCase().includes(username.toLowerCase())) {
    // 删除可能已存在的大小写不同 authorization 头
    for (const key of Object.keys($request.headers || {})) {
      if (key.toLowerCase() === "authorization") {
        delete $request.headers[key];
      }
    }
    $request.headers["Authorization"] = "token " + token;
  }

  $done({ headers: $request.headers || {} });
})();