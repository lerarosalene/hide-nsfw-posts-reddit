const HIDE_NSFW_POSTS_ENABLED_FLAG_NAME = (subreddit) =>
  `hide-nsfw-posts-enabled:${subreddit ? `r/${subreddit}` : "global"}`;

export class Controls {
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

    const menuName = `Disable (${
      this.subreddit ? `/r/${this.subreddit}` : "global"
    })`;
    const menuId = GM_registerMenuCommand(menuName, this.disable.bind(this));
    this._cleanups.push(() => GM_unregisterMenuCommand(menuId));
    localStorage.setItem(
      HIDE_NSFW_POSTS_ENABLED_FLAG_NAME(this.subreddit),
      "true"
    );
  }

  disable() {
    this.cleanup();
    const menuName = `Enable (${
      this.subreddit ? `/r/${this.subreddit}` : "global"
    })`;
    const menuId = GM_registerMenuCommand(menuName, this.enable.bind(this));
    this._cleanups.push(() => GM_unregisterMenuCommand(menuId));
    localStorage.setItem(
      HIDE_NSFW_POSTS_ENABLED_FLAG_NAME(this.subreddit),
      "false"
    );
  }
}
