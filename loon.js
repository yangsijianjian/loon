/*
 * Private Repo Access for Loon
 * 用途：为访问 raw.githubusercontent.com / gist.githubusercontent.com 的请求注入 GitHub Token
 * 参数：通过插件 [Argument] 传入 USERNAME 与 TOKEN
 */

(() => {
  const TAG = "[PrivateRepo]";
  const url = ($request && $request.url) || "";
  const lowerUrl = url.toLowerCase();

  // 1. 放行脚本自身的下载请求，避免自我拦截导致更新失败
  if (lowerUrl.endsWith("/loon.js")) {
    console.log(`${TAG} Skip self script request: ${url}`);
    return $done({});
  }

  // 2. 解析参数（兼容 JSON 对象 / JSON 字符串 / URL 查询串）
  let args = $argument || {};
  if (typeof args === "string") {
    try {
      args = JSON.parse(args);
    } catch (e) {
      args = Object.fromEntries(new URLSearchParams(args));
    }
  }

  const username = (args.USERNAME || "").trim();
  const token = (args.TOKEN || "").trim();

  console.log(`${TAG} USERNAME=${username}`);
  console.log(`${TAG} TOKEN_LEN=${token.length}`);

  // 3. 参数缺失，直接放行
  if (!username || !token) {
    console.log(`${TAG} Missing USERNAME or TOKEN, skip.`);
    return $done({});
  }

  // 4. 只处理 URL 中包含用户名的请求（大小写不敏感）
  if (!lowerUrl.includes(username.toLowerCase())) {
    console.log(`${TAG} URL not match username, skip: ${url}`);
    return $done({});
  }

  // 5. 清理大小写不同的旧 authorization 头，再写入新的
  const headers = Object.assign({}, ($request.headers || {}));
  for (const key of Object.keys(headers)) {
    if (key.toLowerCase() === "authorization") {
      delete headers[key];
    }
  }
  headers["Authorization"] = "token " + token;

  console.log(`${TAG} Injected Authorization for: ${url}`);
  $done({ headers });
})();