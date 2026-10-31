/*
 * Private Repo Access for Loon
 * 用途：为访问 raw.githubusercontent.com / gist.githubusercontent.com 的私有仓库请求注入 GitHub Token
 * 参数：通过插件 [Argument] 传入 USERNAME 与 TOKEN
 */

(() => {
  const TAG = "[PrivateRepo]";
  const TARGET_HOSTS = [
    "raw.githubusercontent.com",
    "gist.githubusercontent.com"
  ];

  // 兜底：确保 $done 一定被调用，避免请求挂起
  const finish = (obj) => {
    try { $done(obj || {}); } catch (e) { $done({}); }
  };

  try {
    const url = ($request && $request.url) || "";
    let parsed;
    try {
      parsed = new URL(url);
    } catch (e) {
      console.log(`${TAG} Invalid URL, skip.`);
      return finish({});
    }

    // 只处理目标 host
    if (!TARGET_HOSTS.includes(parsed.hostname.toLowerCase())) {
      return finish({});
    }

    // 解析参数（兼容 JSON 对象 / JSON 字符串 / URL 查询串）
    let args = $argument || {};
    if (typeof args === "string") {
      try { args = JSON.parse(args); }
      catch (e) { args = Object.fromEntries(new URLSearchParams(args)); }
    }
    const username = (args.USERNAME || "").trim();
    const token = (args.TOKEN || "").trim();

    if (!username || !token) {
      console.log(`${TAG} Missing USERNAME or TOKEN, skip.`);
      return finish({});
    }

    // 精确匹配：路径第一段必须是 username（大小写不敏感）
    // raw : /<user>/<repo>/<branch>/<path>
    // gist: /<user>/<gist_id>/raw/...
    const segments = parsed.pathname.split("/").filter(Boolean);
    const firstSegment = (segments[0] || "").toLowerCase();
    if (firstSegment !== username.toLowerCase()) {
      console.log(`${TAG} Not target user (${firstSegment}), skip.`);
      return finish({});
    }

    // 清理大小写不同的旧 authorization 头，再写入新的
    const headers = Object.assign({}, $request.headers || {});
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === "authorization") {
        delete headers[key];
      }
    }
    headers["Authorization"] = "token " + token;

    console.log(`${TAG} Injected for ${username}: ${parsed.pathname}`);
    return finish({ headers });
  } catch (e) {
    console.log(`${TAG} Error: ${e && e.message ? e.message : e}`);
    return finish({});
  }
})();