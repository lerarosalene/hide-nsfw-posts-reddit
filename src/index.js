import { Controls } from "./controls";
import { process } from "./process";
import { createStyleNode } from "./style";

function main() {
  if (window.top !== window) {
    return;
  }
  const styleNode = createStyleNode();
  const controls = new Controls(styleNode);
  controls.init();
  setTimeout(process, 500);
}

main();
