const HIDE_NSFW_POSTS_ENABLED_FLAG_NAME = "hide-nsfw-posts-enabled";

export class Controls {
  constructor(styleNode) {
    this.enabled = false;
    this.styleNode = styleNode;
    this._cleanups = [];
  }

  init() {
    const enabledEntry = localStorage.getItem(
      HIDE_NSFW_POSTS_ENABLED_FLAG_NAME
    );
    this.enabled = enabledEntry === null || enabledEntry === "true";
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
    const menuId = GM_registerMenuCommand("Disable", this.disable.bind(this));
    this._cleanups.push(() => GM_unregisterMenuCommand(menuId));
    localStorage.setItem(HIDE_NSFW_POSTS_ENABLED_FLAG_NAME, "true");
  }

  disable() {
    this.cleanup();
    const menuId = GM_registerMenuCommand("Enable", this.enable.bind(this));
    this._cleanups.push(() => GM_unregisterMenuCommand(menuId));
    localStorage.setItem(HIDE_NSFW_POSTS_ENABLED_FLAG_NAME, "false");
  }
}
