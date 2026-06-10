const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .map(i => i.split("="))
);

const config = {
  username: args.USERNAME || "",
  token: args.TOKEN || ""
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