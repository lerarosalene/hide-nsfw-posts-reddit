const processed = new WeakSet();

function isNSFWTag(element) {
  return element.textContent.includes("nsfw") && element.style.border;
}

export function process() {
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
