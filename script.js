// Copyright 2025 SpiralDev
// Licensed under the Apache License, Version 2.0
// See LICENSE file for details.

const newChat = document.createElement('div');
newChat.id = 'newChatBox';
newChat.classList.add("newChat")
let autoScroll = true;

const MESSAGE_CLASSES = {
  filteredMessage: "ylcfr-filtered-message",
  deletedMessage: "ylcfr-deleted-message",
  filterActivated:"ylcfr-active"
};

newChat.addEventListener('scroll', () => {
    const atBottom = (newChat.scrollHeight - newChat.scrollTop) === newChat.clientHeight;
    autoScroll = atBottom;
});

const waitForElement = (selector, interval = 100, timeout = 10000) =>
  new Promise((resolve) => {
    const endTime = Date.now() + timeout;
    const timer = setInterval(() => {
      const element = document.querySelector(selector);
      if (element || Date.now() > endTime) {
        clearInterval(timer);
        resolve(element);
      }
    }, interval);
  });

const waitForFilter = async (messageElement) => {
  if (!document.documentElement.classList.contains(MESSAGE_CLASSES.filterActivated)) return false;
  return new Promise((resolve) => {
    const timeout = Date.now() + 1000;
    const interval = setInterval(() => {
      if (messageElement.classList.contains(MESSAGE_CLASSES.filteredMessage) || Date.now() > timeout) {
        clearInterval(interval);
        resolve(messageElement.classList.contains(MESSAGE_CLASSES.deletedMessage));
      }
    }, 10);
  });
};

const processMessage = async (messageElement) => {
  const video = parent.document.querySelector("ytd-watch-flexy video.html5-main-video");
  if (!video || video.paused || (await waitForFilter(messageElement))) return;
  if (messageElement.tagName.toLowerCase() !== "yt-live-chat-text-message-renderer") return;

  const authorType = messageElement.getAttribute("author-type") || "guest";
  const message = messageElement.querySelector("#message") ?? "";
  var authorName = messageElement.querySelector("#author-name")?.textContent ?? "";
  const time = Math.floor(video.currentTime);

  const newMessage = document.createElement('div');
  const authorDiv = document.createElement('a');
  var textDiv = document.createElement('div');

  authorDiv.style.display = "inline";
  authorDiv.classList.add("newChat_authors_" + authorType);
  textDiv.style.display = "inline";

  if (authorName.startsWith("@")) {
    authorDiv.href = "https://youtube.com/" + authorName
    authorDiv.target = "_blank";
    authorDiv.rel = "noopener noreferrer";
  }
  authorDiv.textContent = authorName + ": ";

  textDiv = message;

  newMessage.appendChild(authorDiv);
  newMessage.appendChild(textDiv);

  newChat.appendChild(newMessage);

  if (autoScroll) {
    newChat.scrollTop = newChat.scrollHeight;
  }
};

const observeMessages = async () => {
  let observer;
  const setupObserver = async () => {
    observer?.disconnect();

    const chatContainer = await waitForElement("#items.yt-live-chat-item-list-renderer");
    if (!chatContainer) return;
    const chatParent = await waitForElement("div#item-offset.style-scope.yt-live-chat-item-list-renderer");
    if (!chatParent) return;
    chatContainer.style.display = 'none';
    chatParent.appendChild(newChat);

    observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        Array.from(mutation.addedNodes).forEach((node) => {
          if (node instanceof HTMLElement) processMessage(node);
        });
      });
    });
    observer.observe(chatContainer, { childList: true });
  };

  await setupObserver();
  const fallbackContainer = await waitForElement("#item-list.yt-live-chat-renderer");
  if (!fallbackContainer) return;

  new MutationObserver(async () => {
    await setupObserver();
  }).observe(fallbackContainer, { childList: true });
};

(async () => {
  await observeMessages();
})();

const reloadChat = async () => {
  while (newChat.firstChild) {
    newChat.removeChild(newChat.firstChild);
  }
};