const args = Object.fromEntries(
  ($argument || "")
    .split("&")
    .filter(Boolean)
    .map(i => i.split("="))
);

const USERNAME = decodeURIComponent(args.USERNAME || "");
const TOKEN = decodeURIComponent(args.TOKEN || "");

console.log("USERNAME:", USERNAME);
console.log("TOKEN:", TOKEN);