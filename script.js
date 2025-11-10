// Copyright 2025 SpiralDev
// Licensed under the Apache License, Version 2.0
// See LICENSE file for details.

function setCookie(key,value) {
    document.cookie = `${key}=${value}; path=/; domain=.youtube.com; max-age=${60*60*24*365}`;
}

function getCookie(key) {
    const match = document.cookie.match(
        new RegExp(`(^|;)\\s*${key}=([^;]*)`)
    );
    return match ? match[2] : null;
}

var savedGuestColor = getCookie("Twitchy-Youtube-Chat_guest_color") || "#b3b3b3";
var savedMemberColor = getCookie("Twitchy-Youtube-Chat_member_color") || "#107516";
var savedModeratorColor = getCookie("Twitchy-Youtube-Chat_moderator_color") || "#5e84f1";
var savedOwnerColor = getCookie("Twitchy-Youtube-Chat_owner_color") || "#ffd600";

Modify_Property("--Twitchy-Youtube-Chat_guest_color",savedGuestColor);
Modify_Property("--Twitchy-Youtube-Chat_member_color",savedMemberColor);
Modify_Property("--Twitchy-Youtube-Chat_moderator_color",savedModeratorColor);
Modify_Property("--Twitchy-Youtube-Chat_owner_color",savedOwnerColor);

function Modify_Property(id,value) {
    document.documentElement.style.setProperty(id,value);
}

const settingsButton = document.createElement("button");
settingsButton.id = 'Twitchy-Youtube-Chat-Settings-Button';
const settingsButtonIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
settingsButtonIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
settingsButtonIcon.setAttribute("height", "24");
settingsButtonIcon.setAttribute("width", "24");
settingsButtonIcon.setAttribute("viewBox", "0 0 24 24");
settingsButtonIcon.setAttribute("focusable", "false");
settingsButtonIcon.setAttribute("aria-hidden", "true");
settingsButtonIcon.style.pointerEvents = "none";
settingsButtonIcon.style.display = "inherit";
settingsButtonIcon.style.width = "100%";
settingsButtonIcon.style.height = "100%";
settingsButtonIcon.id = 'Twitchy-Youtube-Chat-Settings-Button-Icon';

const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", "M12.844 1h-1.687a2 2 0 00-1.962 1.616 3 3 0 01-3.92 2.263 2 2 0 00-2.38.891l-.842 1.46a2 2 0 00.417 2.507 3 3 0 010 4.525 2 2 0 00-.417 2.507l.843 1.46a2 2 0 002.38.892 3.001 3.001 0 013.918 2.263A2 2 0 0011.157 23h1.686a2 2 0 001.963-1.615 3.002 3.002 0 013.92-2.263 2 2 0 002.38-.892l.842-1.46a2 2 0 00-.418-2.507 3 3 0 010-4.526 2 2 0 00.418-2.508l-.843-1.46a2 2 0 00-2.38-.891 3 3 0 01-3.919-2.263A2 2 0 0012.844 1Zm-1.767 2.347a6 6 0 00.08-.347h1.687a4.98 4.98 0 002.407 3.37 4.98 4.98 0 004.122.4l.843 1.46A4.98 4.98 0 0018.5 12a4.98 4.98 0 001.716 3.77l-.843 1.46a4.98 4.98 0 00-4.123.4A4.979 4.979 0 0012.843 21h-1.686a4.98 4.98 0 00-2.408-3.371 4.999 4.999 0 00-4.12-.399l-.844-1.46A4.979 4.979 0 005.5 12a4.98 4.98 0 00-1.715-3.77l.842-1.459a4.98 4.98 0 004.123-.399 4.981 4.981 0 002.327-3.025ZM16 12a4 4 0 11-7.999 0 4 4 0 018 0Zm-4 2a2 2 0 100-4 2 2 0 000 4Z");
path.setAttribute("fill", "#ffffffff");
settingsButtonIcon.appendChild(path);

const settingsUI = document.createElement('div');
settingsUI.style.display = "none";
settingsUI.style.position = "absolute";
settingsUI.style.top = "50px";
settingsUI.style.padding = "10px";
settingsUI.style.background = "var(--yt-spec-menu-background)";
settingsUI.style.border = "1px solid #666";
settingsUI.style.borderRadius = "8px";
settingsUI.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
settingsUI.style.color = "#fff";
settingsUI.style.zIndex = "9999";
settingsUI.style.borderColor = "var(--yt-spec-base-background)";
settingsUI.id = 'Twitchy-Youtube-Chat-Settings-UI';
settingsUI.style.width = '120px';
document.body.appendChild(settingsUI);

document.addEventListener('click', (event) => {
  const isClickInsideGUI = settingsUI.contains(event.target);
  const isClickOnButton = settingsButton.contains(event.target);

  if (!isClickInsideGUI && !isClickOnButton) {
      settingsUI.style.display = "none";
  }
});

const twitchyChatBox = document.createElement('div');
twitchyChatBox.id = 'Twitchy-Youtube-Chat';
twitchyChatBox.classList.add("Twitchy-Youtube-Chat")
let autoScroll = true;


const MESSAGE_CLASSES = {
  filteredMessage: "ylcfr-filtered-message",
  deletedMessage: "ylcfr-deleted-message",
  filterActivated:"ylcfr-active"
};

twitchyChatBox.addEventListener('scroll', () => {
    const atBottom = (twitchyChatBox.scrollHeight - twitchyChatBox.scrollTop) === twitchyChatBox.clientHeight;
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
  if (!video || (await waitForFilter(messageElement))) return;
  const messageType = messageElement.tagName.toLowerCase();

  switch(messageType) {
    case "yt-live-chat-text-message-renderer": { // Normal Message
      const authorType = messageElement.getAttribute("author-type") || "guest";
      const message = messageElement.querySelector("#message") || "";
      var authorName = messageElement.querySelector("#author-name")?.textContent || "";
      const time = Math.floor(video.currentTime);
      const before_content_buttons = messageElement.querySelector("#before-content-buttons");

      const newMessage = document.createElement('div');
      newMessage.id = "text-message"
      const authorDiv = document.createElement('a');
      var textDiv = document.createElement('div');

      authorDiv.style.display = "inline";
      authorDiv.classList.add("Twitchy-Youtube-Chat_authors_" + authorType);
      textDiv.style.display = "inline";

      if (authorName.startsWith("@")) {
        authorDiv.href = "https://youtube.com/" + authorName
        authorDiv.target = "_blank";
        authorDiv.rel = "noopener noreferrer";
      }
      authorDiv.textContent = authorName + ": ";
      textDiv = message;

      if (before_content_buttons) {
        newMessage.appendChild(before_content_buttons); 
      }

      newMessage.appendChild(authorDiv);
      textDiv.classList.add("Twitchy-Youtube-Chat_messages");
      newMessage.appendChild(textDiv);

      if (authorType == "moderator" || authorType == "owner") {
        newMessage.style.marginTop= "var(--Twitchy-Youtube-Chat_staff_margin)";
        newMessage.style.marginBottom= "var(--Twitchy-Youtube-Chat_staff_margin)";
      }

      twitchyChatBox.appendChild(newMessage);
    break;
    }
    case "yt-live-chat-paid-message-renderer": { // Superchat
      const card = messageElement.querySelector("#card");
      card.classList.add("Twitchy-Youtube-Chat_card");
      card.style.width = 85%
      twitchyChatBox.appendChild(card);
    break;
    }
    case "ytd-sponsorships-live-chat-gift-redemption-announcement-renderer": { // Membership gift
      twitchyChatBox.appendChild(messageElement);
      messageElement.querySelector("#content").querySelector("#message").children[0].style.color = "var(--Twitchy-Youtube-Chat_text_color) !important";
      break;
    }
    case "yt-live-chat-membership-item-renderer": { // Membership join
      twitchyChatBox.appendChild(messageElement);
      break;
    }
    default: {
      console.log("Detected unknown message type " + messageType);
      return;
    }
  }

  if (autoScroll) {
    twitchyChatBox.scrollTop = twitchyChatBox.scrollHeight;
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
    chatParent.appendChild(twitchyChatBox);

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

const createSettings = async () => {
  const parent_span = await waitForElement("#chat-messages > yt-live-chat-header-renderer > #primary-content");
  parent_span.style.position = "relative";

  settingsButton.setAttribute("aria-label", "Settings");
  settingsButton.style.display = "flex";
  settingsButton.style.alignItems = "center";
  settingsButton.style.justifyContent = "center";
  settingsButton.style.width = "32px";
  settingsButton.style.height = "32px";
  settingsButton.style.border = "none";
  settingsButton.style.borderRadius = "50%";
  settingsButton.style.cursor = "pointer";
  settingsButton.style.backgroundColor = "transparent";
  settingsButton.style.transition = "transform 0.1s ease";
  settingsButton.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";

  settingsButton.style.position = "absolute";
  settingsButton.style.right = "4px";
  settingsButton.style.top = "50%";
  settingsButton.style.transform = "translateY(-50%)";

  settingsButton.addEventListener("mousedown", () => {
    settingsButton.style.transform = "translateY(-50%) scale(0.95)";
  });
  settingsButton.addEventListener("mouseup", () => {
    settingsButton.style.transform = "translateY(-50%) scale(1)";
  });

  settingsButton.addEventListener('click', () => {
    const rect = settingsButton.getBoundingClientRect();
    settingsUI.style.position = "fixed";
    settingsUI.style.top = rect.bottom + 5 + "px";
    settingsUI.style.left = rect.left - rect.width + "px";
    settingsUI.style.display = settingsUI.style.display === "none" ? "block" : "none";
  });

  const guest_color_picker = document.createElement('div');
  const guestColorInput = document.createElement('input');
  guestColorInput.type = 'color';
  guestColorInput.id = 'guest_color_picker';
  guestColorInput.name = 'guest_color_picker';
  guestColorInput.value = savedGuestColor;
  guestColorInput.style.background = savedGuestColor;
  guestColorInput.style.borderWidth = "2px";

  const guestLabel = document.createElement('label');
  guestLabel.htmlFor = 'guest_color_picker';
  guestLabel.textContent = 'Guest Color';

  guest_color_picker.appendChild(guestColorInput);
  guest_color_picker.appendChild(guestLabel);
  guest_color_picker.classList.add('hex-picker-container');

  settingsUI.appendChild(guest_color_picker);

  guestColorInput.addEventListener('input', (event) => {
    const selectedColor = event.target.value;

    savedGuestColor = selectedColor;
    Modify_Property("--Twitchy-Youtube-Chat_guest_color",selectedColor)
    setCookie("Twitchy-Youtube-Chat_guest_color", selectedColor);
  });


  const member_color_picker = document.createElement('div');
  const memberColorInput = document.createElement('input');
  memberColorInput.type = 'color';
  memberColorInput.id = 'member_color_picker';
  memberColorInput.name = 'member_color_picker';
  memberColorInput.value = savedMemberColor;
  memberColorInput.style.background = savedMemberColor;
  memberColorInput.style.borderWidth = "2px";

  const memberLabel = document.createElement('label');
  memberLabel.htmlFor = 'member_color_picker';
  memberLabel.textContent = 'Member Color';

  member_color_picker.appendChild(memberColorInput);
  member_color_picker.appendChild(memberLabel);
  member_color_picker.classList.add('hex-picker-container');

  settingsUI.appendChild(member_color_picker);

  memberColorInput.addEventListener('input', (event) => {
    const selectedColor = event.target.value;

    savedMemberColor = selectedColor;
    Modify_Property("--Twitchy-Youtube-Chat_member_color",selectedColor)
    setCookie("Twitchy-Youtube-Chat_member_color", selectedColor);
  });


  const moderator_color_picker = document.createElement('div');
  const moderatorColorInput = document.createElement('input');
  moderatorColorInput.type = 'color';
  moderatorColorInput.id = 'moderator_color_picker';
  moderatorColorInput.name = 'moderator_color_picker';
  moderatorColorInput.value = savedModeratorColor;
  moderatorColorInput.style.background = savedModeratorColor;
  moderatorColorInput.style.borderWidth = "2px";

  const moderatorLabel = document.createElement('label');
  moderatorLabel.htmlFor = 'moderator_color_picker';
  moderatorLabel.textContent = 'Moderator Color';

  moderator_color_picker.appendChild(moderatorColorInput);
  moderator_color_picker.appendChild(moderatorLabel);
  moderator_color_picker.classList.add('hex-picker-container');

  settingsUI.appendChild(moderator_color_picker);

  moderatorColorInput.addEventListener('input', (event) => {
    const selectedColor = event.target.value;

    savedModeratorColor = selectedColor;
    Modify_Property("--Twitchy-Youtube-Chat_moderator_color",selectedColor)
    setCookie("Twitchy-Youtube-Chat_moderator_color", selectedColor);
  });
  
  
  const owner_color_picker = document.createElement('div');
  const ownerColorInput = document.createElement('input');
  ownerColorInput.type = 'color';
  ownerColorInput.id = 'owner_color_picker';
  ownerColorInput.name = 'owner_color_picker';
  ownerColorInput.value = savedOwnerColor;
  ownerColorInput.style.background = savedOwnerColor;
  ownerColorInput.style.borderWidth = "2px";

  const ownerLabel = document.createElement('label');
  ownerLabel.htmlFor = 'owner_color_picker';
  ownerLabel.textContent = 'Owner Color';

  owner_color_picker.appendChild(ownerColorInput);
  owner_color_picker.appendChild(ownerLabel);
  owner_color_picker.classList.add('hex-picker-container');

  settingsUI.appendChild(owner_color_picker);

  ownerColorInput.addEventListener('input', (event) => {
    const selectedColor = event.target.value;

    savedOwnerColor = selectedColor;
    Modify_Property("--Twitchy-Youtube-Chat_owner_color",selectedColor)
    setCookie("Twitchy-Youtube-Chat_owner_color", selectedColor);
  });

  settingsButton.appendChild(settingsButtonIcon);

  parent_span.appendChild(settingsButton);
}

(async () => {
  await observeMessages();
  await createSettings();
})();

const reloadChat = async () => {
  while (twitchyChatBox.firstChild) {
    twitchyChatBox.removeChild(twitchyChatBox.firstChild);
  }
};