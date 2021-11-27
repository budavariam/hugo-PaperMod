// inspiration: https://aaronluna.dev/blog/add-copy-button-to-code-blocks-hugo-chroma/

function createCopyButton(highlightDiv) {
    const button = document.createElement("button");
    button.className = "copy-code-button";
    button.type = "button";
    button.innerText = "Copy";
    button.addEventListener("click", () => copyCodeToClipboard(button, highlightDiv));
    addCopyButtonToDom(button, highlightDiv);
}

async function copyCodeToClipboard(button, highlightDiv) {
  const codeToCopy = highlightDiv.querySelector(":last-child > code").innerText;
  try {
    result = await navigator.permissions.query({ name: "clipboard-write" });
    if (result.state == "granted" || result.state == "prompt") {
      await navigator.clipboard.writeText(codeToCopy);
    } else {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    }
  } catch (_) {
    copyCodeBlockExecCommand(codeToCopy, highlightDiv);
  }
  finally {
    codeWasCopied(button);
  }
}

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = codeToCopy;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.visibility = "hidden";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    } catch (err) {
        console.error("Failed to copy data to clipboard", err, data)
    }
}

function codeWasCopied(button) {
  button.blur();
  button.innerText = "Copied!";
  setTimeout(function() {
    button.innerText = "Copy";
  }, 2000);
}

function addCopyButtonToDom(button, highlightDiv) {
  highlightDiv.insertBefore(button, highlightDiv.firstChild);
  const wrapper = document.createElement("div");
  wrapper.className = "highlight-wrapper";
  highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
  wrapper.appendChild(highlightDiv);
}

document.querySelectorAll(".highlight")
  .forEach(highlightDiv => createCopyButton(highlightDiv));
