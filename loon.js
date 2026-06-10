const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .filter(Boolean)
    .map(i => {
      const [k, ...v] = i.split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
);

const USERNAME = args.USERNAME || "";
const TOKEN = args.TOKEN || "";

console.log("USERNAME =", USERNAME);
console.log("TOKEN =", TOKEN ? "FOUND" : "EMPTY");

if (!TOKEN || !USERNAME) {
  console.log("Missing USERNAME or TOKEN");
  $done({});
  return;
}

const match = $request.url.match(
  /^https:\/\/(?:raw|gist)\.githubusercontent\.com\/([^\/]+)\//
);

if (!match) {
  console.log("URL not match");
  $done({});
  return;
}

const username = match[1];

if (username === USERNAME) {
  console.log(`ACCESSING PRIVATE REPO: ${username}`);

  $done({
    headers: {
      ...$request.headers,
      Authorization: `token ${TOKEN}`
    }
  });
} else {
  console.log(`Skip: ${username}`);
  $done({});
}