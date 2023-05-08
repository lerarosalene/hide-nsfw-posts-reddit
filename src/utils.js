export function getSubreddit() {
  const match = location.pathname.match(/\/r\/(.*?)(?:$|\/)/);
  if (!match) {
    return null;
  }

  return match[1];
}
