import { Controls } from "./controls";
import { process } from "./process";
import { createStyleNode } from "./style";
import { getSubreddit } from "./utils";

class Main {
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
}

function main() {
  if (window.top !== window) {
    return;
  }

  const manager = new Main();
  manager.init();
  manager.start();
}

main();
