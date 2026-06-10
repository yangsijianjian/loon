const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .filter(Boolean)
    .map(i => i.split("="))
);

console.log("argument =", $argument);
console.log("USERNAME =", args.USERNAME);
console.log("TOKEN =", args.TOKEN);

$done({});