export function createStyleNode() {
  const css = `.hide-nsfw-posts-hidden > * {
    display: none;
  }`;

  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  return styleNode;
}
