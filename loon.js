console.log("$argument =", JSON.stringify($argument));

const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .filter(Boolean)
    .map(item => {
      const [key, ...value] = item.split("=");
      return [key, decodeURIComponent(value.join("="))];
    })
);

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

const requestUsername = match[1];

console.log("Request Username =", requestUsername);

if (!USERNAME || !TOKEN) {
  console.log("Missing USERNAME or TOKEN");
  $done({});
  return;
}

if (requestUsername !== USERNAME) {
  console.log(`Skip: ${requestUsername}`);
  $done({});
  return;
}

console.log(`ACCESSING PRIVATE REPO: ${requestUsername}`);

const headers = {
  ...$request.headers,
  Authorization: `token ${TOKEN}`
};

console.log("Authorization Added");

$done({ headers });