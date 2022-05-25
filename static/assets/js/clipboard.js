const addCopyButtons = (clipboard) => {
  // 1. Look for pre > code elements in the DOM
  document.querySelectorAll("pre > code").forEach((codeBlock) => {
    // 2. Create a button that will trigger a copy operation
    const button = document.createElement("button");
    button.className = "clipboard-button";
    button.type = "button";
    button.innerHTML = "Скопировать";
    button.addEventListener("click", () => {
      clipboard.writeText(codeBlock.textContent).then(
        () => {
          button.blur();
          button.innerHTML = "Скопировано!";
          setTimeout(() => (button.innerHTML = "Скопировать"), 2000);
        },
        (error) => (button.innerHTML = "Error")
      );
    });
    // 3. Append the button directly before the pre tag
    let pre = codeBlock.parentNode.parentNode.parentNode;
    if (pre.tagName === "DETAILS") {
      pre.parentNode.insertBefore(button, pre);
    }
    pre = codeBlock.parentNode.parentNode.parentNode.parentNode;
    if (pre.tagName === "DETAILS") {
      pre.parentNode.insertBefore(button, pre);
    }
  });
};

if (navigator && navigator.clipboard) {
  addCopyButtons(navigator.clipboard);
} else {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js";
  script.integrity = "sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=";
  script.crossOrigin = "anonymous";
  script.onload = () => addCopyButtons(clipboard);
  document.body.appendChild(script);
}
