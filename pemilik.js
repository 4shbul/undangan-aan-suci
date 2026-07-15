"use strict";

/*
  =====================================================
  AKUN KEDUA MEMPELAI
  =====================================================

  Ganti username dan password sebelum website dipublikasikan.

  Catatan:
  Karena website ini bersifat statis, data akun tetap dapat dilihat
  melalui source code browser. Untuk keamanan penuh diperlukan backend.
*/

const OWNER_ACCOUNTS = {
  achmad: {
    password: "achmad0608",
    displayName: "Achmad"
  },

  suci: {
    password: "suci0608",
    displayName: "Suci"
  }
};


const SESSION_KEY = "achmadSuciOwnerSession";
const HISTORY_KEY = "achmadSuciInvitationHistory";

const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginMessage = document.getElementById("loginMessage");

const showPasswordButton = document.getElementById("showPassword");
const logoutButton = document.getElementById("logoutButton");

const ownerNameElement = document.getElementById("ownerName");

const invitationForm = document.getElementById("invitationForm");
const guestNameInput = document.getElementById("guestName");
const invitationGreetingInput =
  document.getElementById("invitationGreeting");

const invitationMessageInput =
  document.getElementById("invitationMessage");

const invitationPageInput =
  document.getElementById("invitationPage");

const characterCountElement =
  document.getElementById("characterCount");

const emptyResult = document.getElementById("emptyResult");
const generatedResult = document.getElementById("generatedResult");

const previewGreeting = document.getElementById("previewGreeting");
const previewGuest = document.getElementById("previewGuest");
const previewMessage = document.getElementById("previewMessage");

const generatedLinkInput = document.getElementById("generatedLink");

const copyLinkButton = document.getElementById("copyLinkButton");
const openLinkButton = document.getElementById("openLinkButton");
const whatsappButton = document.getElementById("whatsappButton");

const resultMessage = document.getElementById("resultMessage");

const historyList = document.getElementById("historyList");
const clearHistoryButton =
  document.getElementById("clearHistoryButton");

let generatedInvitation = null;


/*
  Menghindari karakter HTML berbahaya saat menampilkan data.
*/
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/*
  Memeriksa sesi login yang tersimpan.
*/
function getActiveSession() {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);

    if (!session) {
      return null;
    }

    const parsedSession = JSON.parse(session);

    if (
      !parsedSession.username ||
      !OWNER_ACCOUNTS[parsedSession.username]
    ) {
      return null;
    }

    return parsedSession;
  } catch (error) {
    return null;
  }
}


/*
  Menampilkan dashboard.
*/
function showDashboard(username) {
  const account = OWNER_ACCOUNTS[username];

  if (!account) {
    return;
  }

  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");

  ownerNameElement.textContent = account.displayName;

  renderHistory();
}


/*
  Menampilkan halaman login.
*/
function showLogin() {
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");

  loginForm.reset();
  loginMessage.textContent = "";

  usernameInput.focus();
}


/*
  Login.
*/
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  const account = OWNER_ACCOUNTS[username];

  if (!account || account.password !== password) {
    loginMessage.textContent =
      "Nama pengguna atau kode akses tidak sesuai.";

    passwordInput.value = "";
    passwordInput.focus();

    return;
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      username,
      loginTime: new Date().toISOString()
    })
  );

  loginMessage.textContent = "";

  showDashboard(username);
});


/*
  Lihat atau sembunyikan password.
*/
showPasswordButton.addEventListener("click", function () {
  const isPassword =
    passwordInput.type === "password";

  passwordInput.type =
    isPassword ? "text" : "password";

  showPasswordButton.textContent =
    isPassword ? "Tutup" : "Lihat";
});


/*
  Logout.
*/
logoutButton.addEventListener("click", function () {
  sessionStorage.removeItem(SESSION_KEY);

  generatedInvitation = null;

  showLogin();
});


/*
  Menghitung karakter ucapan.
*/
function updateCharacterCount() {
  characterCountElement.textContent =
    invitationMessageInput.value.length;
}

invitationMessageInput.addEventListener(
  "input",
  updateCharacterCount
);

updateCharacterCount();


/*
  Membuat URL absolut.

  Jika input hanya berisi index.html, URL akan mengikuti
  alamat folder website saat ini.
*/
function createAbsoluteInvitationURL(pageValue) {
  const cleanPage = pageValue.trim() || "index.html";

  try {
    return new URL(cleanPage, window.location.href);
  } catch (error) {
    return new URL("index.html", window.location.href);
  }
}


/*
  Membuat link undangan.
*/
invitationForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const activeSession = getActiveSession();

  if (!activeSession) {
    showLogin();
    return;
  }

  const guestName = guestNameInput.value.trim();
  const greeting = invitationGreetingInput.value.trim();
  const message = invitationMessageInput.value.trim();

  if (!guestName) {
    guestNameInput.focus();
    return;
  }

  const ownerAccount =
    OWNER_ACCOUNTS[activeSession.username];

  const invitationURL = createAbsoluteInvitationURL(
    invitationPageInput.value
  );

  invitationURL.searchParams.set("to", guestName);
  invitationURL.searchParams.set("greeting", greeting);
  invitationURL.searchParams.set("message", message);
  invitationURL.searchParams.set(
    "sender",
    ownerAccount.displayName
  );

  generatedInvitation = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()),

    guestName,
    greeting,
    message,

    sender: ownerAccount.displayName,
    url: invitationURL.toString(),

    createdAt: new Date().toISOString()
  };

  previewGreeting.textContent = greeting;
  previewGuest.textContent = guestName;
  previewMessage.textContent = message;

  generatedLinkInput.value =
    generatedInvitation.url;

  emptyResult.classList.add("hidden");
  generatedResult.classList.remove("hidden");

  saveInvitationToHistory(generatedInvitation);

  resultMessage.textContent =
    "Link undangan berhasil dibuat.";

  generatedResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});


/*
  Salin link.
*/
copyLinkButton.addEventListener("click", async function () {
  if (!generatedInvitation) {
    return;
  }

  try {
    await navigator.clipboard.writeText(
      generatedInvitation.url
    );

    resultMessage.textContent =
      "Link undangan berhasil disalin.";
  } catch (error) {
    generatedLinkInput.select();
    document.execCommand("copy");

    resultMessage.textContent =
      "Link undangan berhasil disalin.";
  }
});


/*
  Buka link undangan.
*/
openLinkButton.addEventListener("click", function () {
  if (!generatedInvitation) {
    return;
  }

  window.open(
    generatedInvitation.url,
    "_blank",
    "noopener,noreferrer"
  );
});


/*
  Membuat teks pesan WhatsApp.
*/
function createWhatsAppMessage(invitation) {
  return `${invitation.greeting}

*${invitation.guestName}*

Dengan penuh rasa syukur, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.

${invitation.message}

Silakan membuka undangan melalui tautan berikut:

${invitation.url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.

Salam hangat,
*Achmad & Suci*`;
}


/*
  Kirim melalui WhatsApp.
*/
whatsappButton.addEventListener("click", function () {
  if (!generatedInvitation) {
    return;
  }

  const whatsappMessage =
    createWhatsAppMessage(generatedInvitation);

  const whatsappURL =
    "https://wa.me/?text=" +
    encodeURIComponent(whatsappMessage);

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
});


/*
  Mengambil riwayat undangan.
*/
function getInvitationHistory() {
  try {
    const history =
      localStorage.getItem(HISTORY_KEY);

    if (!history) {
      return [];
    }

    const parsedHistory = JSON.parse(history);

    return Array.isArray(parsedHistory)
      ? parsedHistory
      : [];
  } catch (error) {
    return [];
  }
}


/*
  Menyimpan undangan ke riwayat.
*/
function saveInvitationToHistory(invitation) {
  const history = getInvitationHistory();

  history.unshift(invitation);

  /*
    Batasi sampai 100 data tamu.
  */
  const limitedHistory = history.slice(0, 100);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(limitedHistory)
  );

  renderHistory();
}


/*
  Salin link dari riwayat.
*/
async function copyHistoryLink(url) {
  try {
    await navigator.clipboard.writeText(url);
    alert("Link undangan berhasil disalin.");
  } catch (error) {
    window.prompt(
      "Salin link undangan berikut:",
      url
    );
  }
}


/*
  Buka undangan dari riwayat.
*/
function openHistoryLink(url) {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}


/*
  Kirim riwayat lewat WhatsApp.
*/
function sendHistoryToWhatsApp(invitation) {
  const message = createWhatsAppMessage(invitation);

  const whatsappURL =
    "https://wa.me/?text=" +
    encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}


/*
  Hapus satu riwayat.
*/
function deleteHistoryItem(id) {
  const confirmed = confirm(
    "Hapus data tamu ini dari riwayat?"
  );

  if (!confirmed) {
    return;
  }

  const history = getInvitationHistory();

  const updatedHistory =
    history.filter((item) => item.id !== id);

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(updatedHistory)
  );

  renderHistory();
}


/*
  Menampilkan daftar riwayat.
*/
function renderHistory() {
  const history = getInvitationHistory();

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
    const item = document.createElement("article");

    item.className = "history-item";

    const date = new Date(invitation.createdAt);

    const formattedDate =
      new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(date);

    item.innerHTML = `
      <div class="history-item-header">
        <h4>${escapeHTML(invitation.guestName)}</h4>
        <time>${escapeHTML(formattedDate)}</time>
      </div>

      <p>
        Dibuat oleh ${escapeHTML(invitation.sender)}
      </p>

      <div class="history-actions">
        <button type="button" data-action="copy">
          Salin
        </button>

        <button type="button" data-action="open">
          Buka
        </button>

        <button type="button" data-action="whatsapp">
          WhatsApp
        </button>

        <button type="button" data-action="delete">
          Hapus
        </button>
      </div>
    `;

    item
      .querySelector('[data-action="copy"]')
      .addEventListener("click", function () {
        copyHistoryLink(invitation.url);
      });

    item
      .querySelector('[data-action="open"]')
      .addEventListener("click", function () {
        openHistoryLink(invitation.url);
      });

    item
      .querySelector('[data-action="whatsapp"]')
      .addEventListener("click", function () {
        sendHistoryToWhatsApp(invitation);
      });

    item
      .querySelector('[data-action="delete"]')
      .addEventListener("click", function () {
        deleteHistoryItem(invitation.id);
      });

    historyList.appendChild(item);
  });
}


/*
  Hapus semua riwayat.
*/
clearHistoryButton.addEventListener("click", function () {
  const history = getInvitationHistory();

  if (history.length === 0) {
    return;
  }

  const confirmed = confirm(
    "Yakin ingin menghapus seluruh riwayat tamu?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(HISTORY_KEY);

  renderHistory();
});


/*
  Saat halaman dibuka.
*/
const activeSession = getActiveSession();

if (activeSession) {
  showDashboard(activeSession.username);
} else {
  showLogin();
}