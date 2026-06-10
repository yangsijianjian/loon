console.log("===START===");
console.log("$argument =", $argument);
console.log("$request.url =", $request.url);
const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .map(i => i.split("="))
);

const config = {
  username: decodeURIComponent(args.USERNAME || ""),
  token: decodeURIComponent(args.TOKEN || "")
};

const repoOwner = $request.url.match(
  /https:\/\/(?:raw|gist)\.githubusercontent\.com\/([^\/]+)\//
)?.[1];

if (repoOwner === config.username) {
  $done({
    headers: {
      ...$request.headers,
      Authorization: `token ${config.token}`
    }
  });
} else {
  $done({});
}