"use strict";

/* =========================================
   KONFIGURASI
========================================= */

const HISTORY_KEY = "achmadSuciInvitationHistory";


/* =========================================
   ELEMEN HALAMAN
========================================= */

const invitationForm =
  document.getElementById("invitationForm");

const guestNameInput =
  document.getElementById("guestName");

const invitationGreetingInput =
  document.getElementById("invitationGreeting");

const invitationMessageInput =
  document.getElementById("invitationMessage");

const invitationPageInput =
  document.getElementById("invitationPage");

const characterCountElement =
  document.getElementById("characterCount");

const emptyResult =
  document.getElementById("emptyResult");

const generatedResult =
  document.getElementById("generatedResult");

const previewGreeting =
  document.getElementById("previewGreeting");

const previewGuest =
  document.getElementById("previewGuest");

const previewMessage =
  document.getElementById("previewMessage");

const generatedLinkInput =
  document.getElementById("generatedLink");

const copyLinkButton =
  document.getElementById("copyLinkButton");

const openLinkButton =
  document.getElementById("openLinkButton");

const whatsappButton =
  document.getElementById("whatsappButton");

const resultMessage =
  document.getElementById("resultMessage");

const historyList =
  document.getElementById("historyList");

const clearHistoryButton =
  document.getElementById("clearHistoryButton");

let generatedInvitation = null;


/* =========================================
   FUNGSI BANTUAN
========================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function createInvitationId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}


function createAbsoluteInvitationURL(pageValue) {
  const cleanPage =
    pageValue.trim() || "index.html";

  try {
    return new URL(
      cleanPage,
      window.location.href
    );
  } catch (error) {
    return new URL(
      "index.html",
      window.location.href
    );
  }
}


function showResultMessage(message) {
  resultMessage.textContent = message;

  window.clearTimeout(
    showResultMessage.timeout
  );

  showResultMessage.timeout =
    window.setTimeout(function () {
      resultMessage.textContent = "";
    }, 4000);
}


/* =========================================
   PENGHITUNG KARAKTER
========================================= */

function updateCharacterCount() {
  characterCountElement.textContent =
    invitationMessageInput.value.length;
}

invitationMessageInput.addEventListener(
  "input",
  updateCharacterCount
);

updateCharacterCount();


/* =========================================
   MEMBUAT LINK UNDANGAN
========================================= */

invitationForm.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();

    const guestName =
      guestNameInput.value.trim();

    const greeting =
      invitationGreetingInput.value.trim();

    const message =
      invitationMessageInput.value.trim();

    if (!guestName) {
      guestNameInput.focus();
      return;
    }

    if (!message) {
      invitationMessageInput.focus();
      return;
    }

    const invitationURL =
      createAbsoluteInvitationURL(
        invitationPageInput.value
      );

    invitationURL.searchParams.set(
      "to",
      guestName
    );

    invitationURL.searchParams.set(
      "greeting",
      greeting
    );

    invitationURL.searchParams.set(
      "message",
      message
    );

    generatedInvitation = {
      id: createInvitationId(),
      guestName,
      greeting,
      message,
      url: invitationURL.toString(),
      createdAt: new Date().toISOString()
    };

    previewGreeting.textContent =
      greeting;

    previewGuest.textContent =
      guestName;

    previewMessage.textContent =
      message;

    generatedLinkInput.value =
      generatedInvitation.url;

    emptyResult.classList.add("hidden");

    generatedResult.classList.remove(
      "hidden"
    );

    saveInvitationToHistory(
      generatedInvitation
    );

    showResultMessage(
      "Link undangan berhasil dibuat."
    );

    generatedResult.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
);


/* =========================================
   SALIN LINK
========================================= */

copyLinkButton.addEventListener(
  "click",
  async function () {
    if (!generatedInvitation) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        generatedInvitation.url
      );

      showResultMessage(
        "Link undangan berhasil disalin."
      );
    } catch (error) {
      generatedLinkInput.select();
      generatedLinkInput.setSelectionRange(
        0,
        generatedLinkInput.value.length
      );

      document.execCommand("copy");

      showResultMessage(
        "Link undangan berhasil disalin."
      );
    }
  }
);


/* =========================================
   BUKA UNDANGAN
========================================= */

openLinkButton.addEventListener(
  "click",
  function () {
    if (!generatedInvitation) {
      return;
    }

    window.open(
      generatedInvitation.url,
      "_blank",
      "noopener,noreferrer"
    );
  }
);


/* =========================================
   PESAN WHATSAPP
========================================= */

function createWhatsAppMessage(invitation) {
  return `${invitation.greeting}

*${invitation.guestName}*

Dengan penuh rasa syukur, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

${invitation.message}

Silakan membuka undangan melalui tautan berikut:

${invitation.url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Salam hangat,

*Achmad & Suci*`;
}


function openWhatsApp(invitation) {
  const message =
    createWhatsAppMessage(invitation);

  const whatsappURL =
    "https://wa.me/?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}


whatsappButton.addEventListener(
  "click",
  function () {
    if (!generatedInvitation) {
      return;
    }

    openWhatsApp(
      generatedInvitation
    );
  }
);


/* =========================================
   RIWAYAT UNDANGAN
========================================= */

function getInvitationHistory() {
  try {
    const storedHistory =
      localStorage.getItem(HISTORY_KEY);

    if (!storedHistory) {
      return [];
    }

    const parsedHistory =
      JSON.parse(storedHistory);

    return Array.isArray(parsedHistory)
      ? parsedHistory
      : [];
  } catch (error) {
    return [];
  }
}


function saveInvitationToHistory(
  invitation
) {
  const history =
    getInvitationHistory();

  history.unshift(invitation);

  const limitedHistory =
    history.slice(0, 100);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(limitedHistory)
  );

  renderHistory();
}


async function copyHistoryLink(url) {
  try {
    await navigator.clipboard.writeText(
      url
    );

    alert(
      "Link undangan berhasil disalin."
    );
  } catch (error) {
    window.prompt(
      "Salin link undangan berikut:",
      url
    );
  }
}


function openHistoryLink(url) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}


function deleteHistoryItem(id) {
  const confirmed = window.confirm(
    "Hapus undangan tamu ini dari riwayat?"
  );

  if (!confirmed) {
    return;
  }

  const history =
    getInvitationHistory();

  const updatedHistory =
    history.filter(function (item) {
      return item.id !== id;
    });

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(updatedHistory)
  );

  renderHistory();
}


function renderHistory() {
  const history =
    getInvitationHistory();

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `
      <div class="empty-history">
        Belum ada undangan tamu yang dibuat.
      </div>
    `;

    return;
  }

  history.forEach(function (invitation) {
    const historyItem =
      document.createElement("article");

    historyItem.className =
      "history-item";

    const invitationDate =
      new Date(invitation.createdAt);

    const formattedDate =
      new Intl.DateTimeFormat(
        "id-ID",
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      ).format(invitationDate);

    historyItem.innerHTML = `
      <div class="history-item-header">
        <h3>
          ${escapeHTML(invitation.guestName)}
        </h3>

        <time>
          ${escapeHTML(formattedDate)}
        </time>
      </div>

      <p>
        ${escapeHTML(invitation.greeting)}
      </p>

      <div class="history-actions">

        <button
          type="button"
          data-action="copy"
        >
          Salin
        </button>

        <button
          type="button"
          data-action="open"
        >
          Buka
        </button>

        <button
          type="button"
          data-action="whatsapp"
        >
          WhatsApp
        </button>

        <button
          type="button"
          data-action="delete"
        >
          Hapus
        </button>

      </div>
    `;

    historyItem
      .querySelector('[data-action="copy"]')
      .addEventListener(
        "click",
        function () {
          copyHistoryLink(
            invitation.url
          );
        }
      );

    historyItem
      .querySelector('[data-action="open"]')
      .addEventListener(
        "click",
        function () {
          openHistoryLink(
            invitation.url
          );
        }
      );

    historyItem
      .querySelector('[data-action="whatsapp"]')
      .addEventListener(
        "click",
        function () {
          openWhatsApp(invitation);
        }
      );

    historyItem
      .querySelector('[data-action="delete"]')
      .addEventListener(
        "click",
        function () {
          deleteHistoryItem(
            invitation.id
          );
        }
      );

    historyList.appendChild(
      historyItem
    );
  });
}


/* =========================================
   HAPUS SEMUA RIWAYAT
========================================= */

clearHistoryButton.addEventListener(
  "click",
  function () {
    const history =
      getInvitationHistory();

    if (history.length === 0) {
      alert(
        "Belum ada riwayat undangan."
      );

      return;
    }

    const confirmed = window.confirm(
      "Yakin ingin menghapus seluruh riwayat tamu?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      HISTORY_KEY
    );

    renderHistory();
  }
);


/* =========================================
   INISIALISASI
========================================= */

renderHistory();

guestNameInput.focus();