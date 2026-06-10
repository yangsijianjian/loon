console.log("$argument =", $argument);

const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .filter(Boolean)
    .map(item => {
      const [key, ...value] = item.split("=");
      return [key, decodeURIComponent(value.join("="))];
    })
);

console.log("args =", JSON.stringify(args));

const USERNAME = args.USERNAME || "";
const TOKEN = args.TOKEN || "";

console.log("USERNAME =", USERNAME);
console.log("TOKEN =", TOKEN ? "FOUND" : "EMPTY");

const match = $request.url.match(
  /^https:\/\/(?:raw|gist)\.githubusercontent\.com\/([^\/]+)\//
);

if (!match) {
  console.log("URL not match");
  $done({});
  return;
}

const username = match[1];

console.log("Request Username =", username);

if (!USERNAME || !TOKEN) {
  console.log("Missing USERNAME or TOKEN");
  $done({});
  return;
}

if (username === USERNAME) {
  console.log(`ACCESSING PRIVATE REPO: ${username}`);

  const headers = {
    ...$request.headers,
    Authorization: `token ${TOKEN}`
  };

  console.log("Authorization Added");

  $done({ headers });
} else {
  console.log(`Skip: ${username}`);
  $done({});
}