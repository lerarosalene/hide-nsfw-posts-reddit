// ==UserScript==
// @name         Hide NSFW posts in feed
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hides NSFW posts in feed without messing with account settings
// @author       Larissa Rosalene <lerarosalene@outlook.com>
// @match        *://*.reddit.com/*
// @icon         https://icons.duckduckgo.com/ip3/reddit.com.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// ==/UserScript==

(() => {
  // src/controls.js
  var HIDE_NSFW_POSTS_ENABLED_FLAG_NAME = (subreddit) => `hide-nsfw-posts-enabled:${subreddit ? `r/${subreddit}` : "global"}`;
  var Controls = class {
    constructor(styleNode, subreddit) {
      this.enabled = false;
      this.styleNode = styleNode;
      this.subreddit = subreddit;
      this._cleanups = [];
    }
    init() {
      const enabledEntry = localStorage.getItem(
        HIDE_NSFW_POSTS_ENABLED_FLAG_NAME(this.subreddit)
      );
      this.enabled = enabledEntry === "true";
      if (this.enabled) {
        this.enable();
      } else {
        this.disable();
      }
    }
    cleanup() {
      this._cleanups.forEach((f) => f());
      this._cleanups = [];
    }
    enable() {
      this.cleanup();
      document.head.appendChild(this.styleNode);
      this._cleanups.push(() => document.head.removeChild(this.styleNode));
      const menuName = `Disable (${this.subreddit ? `/r/${this.subreddit}` : "global"})`;
      const menuId = GM_registerMenuCommand(menuName, this.disable.bind(this));
      this._cleanups.push(() => GM_unregisterMenuCommand(menuId));
      localStorage.setItem(
        HIDE_NSFW_POSTS_ENABLED_FLAG_NAME(this.subreddit),
        "true"
      );
    }
    disable() {
      this.cleanup();
      const menuName = `Enable (${this.subreddit ? `/r/${this.subreddit}` : "global"})`;
      const menuId = GM_registerMenuCommand(menuName, this.enable.bind(this));
      this._cleanups.push(() => GM_unregisterMenuCommand(menuId));
      localStorage.setItem(
        HIDE_NSFW_POSTS_ENABLED_FLAG_NAME(this.subreddit),
        "false"
      );
    }
  };

  // src/process.js
  var processed = /* @__PURE__ */ new WeakSet();
  function isNSFWTag(element) {
    return element.textContent.includes("nsfw") && element.style.border;
  }
  function process() {
    const posts = document.querySelectorAll(":has(> [data-scroller-first]) > *");
    posts.forEach((post) => {
      if (processed.has(post)) {
        return;
      }
      processed.add(post);
      const spans = post.querySelectorAll("span");
      const nsfwTag = Array.from(spans).find(isNSFWTag);
      if (!nsfwTag) {
        return;
      }
      post.classList.add("hide-nsfw-posts-hidden");
    });
  }

  // src/style.js
  function createStyleNode() {
    const css = `.hide-nsfw-posts-hidden > * {
    display: none;
  }`;
    const styleNode = document.createElement("style");
    styleNode.appendChild(document.createTextNode(css));
    return styleNode;
  }

  // src/utils.js
  function getSubreddit() {
    const match = location.pathname.match(/\/r\/(.*?)(?:$|\/)/);
    if (!match) {
      return null;
    }
    return match[1];
  }

  // src/index.js
  var Main = class {
    constructor() {
      this._cleanups = [];
      this.styleNode = createStyleNode();
    }
    start() {
      const controls = new Controls(this.styleNode, getSubreddit());
      controls.init();
      const timerId = setInterval(process, 500);
      this._cleanups.push(
        () => controls.cleanup(),
        () => clearInterval(timerId)
      );
    }
    init() {
      this.lastLocation = location.href;
      setInterval(() => {
        if (this.lastLocation !== location.href) {
          this.lastLocation = location.href;
          this._cleanups.forEach((f) => f());
          this._cleanups = [];
          this.start();
        }
      }, 100);
    }
  };
  function main() {
    if (window.top !== window) {
      return;
    }
    const manager = new Main();
    manager.init();
    manager.start();
  }
  main();
})();
