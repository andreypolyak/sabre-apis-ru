const addCopyButtons = (clipboard) => {
  document.querySelectorAll("pre > code").forEach((codeBlock) => {
    const button = document.createElement("a");
    button.className = "book-btn clipboard-btn";
    button.innerHTML = "Скопировать";
    button.addEventListener("click", () => {
      clipboard.writeText(codeBlock.textContent).then(
        () => {
          button.blur();
          button.innerHTML = "Скопировано!";
          setTimeout(() => (button.innerHTML = "Скопировать"), 2000);
        },
        (error) => (button.innerHTML = "Ошибка")
      );
    });
    const details = parentByTag(codeBlock, "DETAILS");
    details.parentNode.insertBefore(button, details);
  });
};

if (navigator && navigator.clipboard) {
  addCopyButtons(navigator.clipboard);
} else {
  const script = document.createElement("script");
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js";
  script.integrity = "sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=";
  script.crossOrigin = "anonymous";
  script.onload = () => addCopyButtons(clipboard);
  document.body.appendChild(script);
}

function parentByTag(el, tag) {
  if (!el || el.tagName == tag) {
    return el
  } else {
    return parentByTag(el.parentElement, tag)
  }
}
