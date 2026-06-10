const config = JSON.parse(
  $persistentStore.read("github_private_repo") || "{}"
);

if (!config.token) {
  console.log("GitHub Token not found");
  $done({});
  return;
}

console.log("GitHub Auth:", $request.url);

$done({
  headers: {
    ...$request.headers,
    Authorization: `token ${config.token}`
  }
});