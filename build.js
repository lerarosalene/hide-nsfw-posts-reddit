const path = require("node:path");
const fs = require("node:fs/promises");
const esbuild = require("esbuild");
const UserScriptHeader = require("userscript-header-format");

async function main() {
  const packageData = JSON.parse(await fs.readFile("package.json", "utf-8"));

  const header = UserScriptHeader.fromObject({
    name: "Hide NSFW posts in feed",
    namespace: "http://tampermonkey.net/",
    version: packageData.version,
    description:
      "Hides NSFW posts in feed without messing with account settings",
    author: "Larissa Rosalene <lerarosalene@outlook.com>",
    match: "*://*.reddit.com/*",
    icon: "https://icons.duckduckgo.com/ip3/reddit.com.ico",
    grant: ["GM_registerMenuCommand", "GM_unregisterMenuCommand"],
  });

  await esbuild.build({
    entryPoints: [path.join("src", "index.js")],
    bundle: true,
    minify: false,
    outfile: path.join("dist", "hide-nsfw-posts-reddit.user.js"),
    banner: {
      js: header.toString() + "\n",
    },
  });
}

main().catch((error) => {
  console.error(error);
});
