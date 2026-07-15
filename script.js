"use strict";

/*
  =====================================================
  SCRIPT UNDANGAN UTAMA — AAN & SUCI
  Simpan file ini dengan nama: script.js
  =====================================================
*/

document.addEventListener("DOMContentLoaded", function () {
  /* =========================================
     SAMPUL UNDANGAN
  ========================================= */

  const cover = document.getElementById("cover");
  const openButton = document.getElementById("openBtn");

  if (cover && openButton) {
    openButton.addEventListener("click", function () {
      cover.classList.add("open");
      document.body.classList.add("invitation-open");

      window.setTimeout(function () {
        cover.setAttribute("aria-hidden", "true");
        cover.style.display = "none";
      }, 1100);
    });
  }


  /* =========================================
     DATA TAMU DARI URL
     Contoh:
     index.html?to=Bapak%20Andi&greeting=Kepada%20Yth.&message=...
  ========================================= */

  const query = new URLSearchParams(window.location.search);

  const guestName = query.get("to");
  const greeting = query.get("greeting");
  const personalMessage = query.get("message");

  const guestNameElement = document.getElementById("guestName");
  const coverToElement = document.querySelector(".cover-to");

  if (guestName && guestNameElement) {
    guestNameElement.textContent = guestName;
    document.title = `Undangan untuk ${guestName} — Aan & Suci`;
  }

  if (greeting && coverToElement) {
    let greetingElement = document.getElementById("guestGreeting");

    if (!greetingElement) {
      greetingElement = document.createElement("span");
      greetingElement.id = "guestGreeting";
      greetingElement.style.display = "block";
      coverToElement.insertBefore(greetingElement, guestNameElement);
    }

    greetingElement.textContent = greeting;
  }

  if (personalMessage) {
    const heroSubtitle = document.querySelector(".hero-subtitle");

    if (heroSubtitle) {
      const messageCard = document.createElement("div");
      messageCard.className = "personal-message-card";
      messageCard.innerHTML = `
        <span class="personal-message-label">Pesan untuk Anda</span>
        <p></p>
      `;

      const messageParagraph = messageCard.querySelector("p");
      messageParagraph.textContent = personalMessage;

      heroSubtitle.insertAdjacentElement("afterend", messageCard);
    }
  }


  /* =========================================
     ANIMASI REVEAL
  ========================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("in");
    });
  }


  /* =========================================
     HITUNG MUNDUR
     WITA = UTC+08:00
  ========================================= */

  const weddingDate = new Date("2026-08-06T10:00:00+08:00");

  const dayElement = document.getElementById("cd-d");
  const hourElement = document.getElementById("cd-h");
  const minuteElement = document.getElementById("cd-m");
  const secondElement = document.getElementById("cd-s");

  function padNumber(number) {
    return String(number).padStart(2, "0");
  }

  function updateCountdown() {
    if (
      !dayElement ||
      !hourElement ||
      !minuteElement ||
      !secondElement
    ) {
      return;
    }

    const difference = weddingDate.getTime() - Date.now();

    if (difference <= 0) {
      dayElement.textContent = "00";
      hourElement.textContent = "00";
      minuteElement.textContent = "00";
      secondElement.textContent = "00";
      return;
    }

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);

    dayElement.textContent = padNumber(days);
    hourElement.textContent = padNumber(hours);
    minuteElement.textContent = padNumber(minutes);
    secondElement.textContent = padNumber(seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);


  /* =========================================
     GOOGLE CALENDAR
  ========================================= */

  function createCalendarURL(config) {
    const parameters = new URLSearchParams({
      action: "TEMPLATE",
      text: config.title,
      dates: `${config.start}/${config.end}`,
      details: config.details,
      location: config.location
    });

    return `https://calendar.google.com/calendar/render?${parameters.toString()}`;
  }

  const akadCalendarButton = document.getElementById("cal-akad");
  const receptionCalendarButton = document.getElementById("cal-resepsi");

  if (akadCalendarButton) {
    akadCalendarButton.href = createCalendarURL({
      title: "Akad Nikah Aan & Suci",
      start: "20260806T020000Z",
      end: "20260806T040000Z",
      details: "Akad nikah Aan dan Suci.",
      location: "Balai Kartini, Kabupaten Bantaeng"
    });
  }

  if (receptionCalendarButton) {
    receptionCalendarButton.href = createCalendarURL({
      title: "Resepsi Pernikahan Aan & Suci",
      start: "20260808T043000Z",
      end: "20260808T073000Z",
      details: "Resepsi pernikahan Aan dan Suci.",
      location: "Four Points by Sheraton Hotel, Kota Makassar"
    });
  }


  /* =========================================
     GALERI DAN LIGHTBOX
  ========================================= */

  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  function closeLightbox() {
    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lightboxImage) {
      lightboxImage.src = "";
    }
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      if (!lightbox || !lightboxImage) {
        return;
      }

      const image = item.querySelector("img");
      const caption = item.querySelector("span");

      const fullImage =
        item.getAttribute("data-full") ||
        (image ? image.getAttribute("src") : "");

      if (!fullImage) {
        return;
      }

      lightboxImage.src = fullImage;
      lightboxImage.alt = image ? image.alt : "Foto galeri Aan dan Suci";

      if (lightboxCaption) {
        lightboxCaption.textContent = caption
          ? caption.textContent.trim()
          : "";
      }

      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      if (lightboxClose) {
        lightboxClose.focus();
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });


  /* =========================================
     RSVP DAN UCAPAN TAMU
  ========================================= */

  const WISHES_KEY = "aanSuciWeddingWishes";

  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpMessage = document.getElementById("rsvp-msg");
  const wishlist = document.getElementById("wishlist");
  const clearWishesButton = document.getElementById("clearWishes");

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getWishes() {
    try {
      const savedWishes = localStorage.getItem(WISHES_KEY);

      if (!savedWishes) {
        return [];
      }

      const parsedWishes = JSON.parse(savedWishes);

      return Array.isArray(parsedWishes) ? parsedWishes : [];
    } catch (error) {
      return [];
    }
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
    } catch (error) {
      console.warn("Ucapan tidak dapat disimpan pada browser ini.", error);
    }
  }

  function renderWishes() {
    if (!wishlist) {
      return;
    }

    const wishes = getWishes();
    wishlist.innerHTML = "";

    if (wishes.length === 0) {
      wishlist.innerHTML = `
        <div class="empty-wishes">
          Belum ada ucapan. Jadilah yang pertama memberikan doa terbaik.
        </div>
      `;
      return;
    }

    wishes.forEach(function (wish) {
      const item = document.createElement("article");
      item.className = "wish";

      item.innerHTML = `
        <div class="wish-head">
          <div>
            <div class="who">${escapeHTML(wish.name)}</div>
            <div class="event">${escapeHTML(wish.event)}</div>
          </div>
          <div class="status">${escapeHTML(wish.status)}</div>
        </div>
        ${
          wish.message
            ? `<p>${escapeHTML(wish.message)}</p>`
            : ""
        }
      `;

      wishlist.appendChild(item);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(rsvpForm);

      const name = String(formData.get("name") || "").trim();
      const selectedEvent = String(formData.get("event") || "").trim();
      const status = String(formData.get("status") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name) {
        const nameInput = document.getElementById("r-name");

        if (nameInput) {
          nameInput.focus();
        }

        return;
      }

      const wishes = getWishes();

      wishes.unshift({
        name,
        event: selectedEvent,
        status,
        message,
        createdAt: new Date().toISOString()
      });

      saveWishes(wishes.slice(0, 100));
      renderWishes();

      rsvpForm.reset();

      if (rsvpMessage) {
        rsvpMessage.textContent =
          "Terima kasih. Konfirmasi dan ucapan Anda berhasil disimpan.";

        window.setTimeout(function () {
          rsvpMessage.textContent = "";
        }, 4500);
      }
    });
  }

  if (clearWishesButton) {
    clearWishesButton.addEventListener("click", function () {
      const wishes = getWishes();

      if (wishes.length === 0) {
        return;
      }

      const confirmed = window.confirm(
        "Hapus seluruh ucapan yang tersimpan pada perangkat ini?"
      );

      if (!confirmed) {
        return;
      }

      localStorage.removeItem(WISHES_KEY);
      renderWishes();
    });
  }

  renderWishes();


  /* =========================================
     MUSIK LATAR DARI YOUTUBE
  ========================================= */

  /*
    GANTI link berikut dengan link lagu YouTube yang akan digunakan.

    Format yang didukung:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/shorts/VIDEO_ID
    - VIDEO_ID langsung
  */
  const YOUTUBE_MUSIC_URL =
    "https://www.youtube.com/watch?v=VIDEO_Ihttps://youtu.be/s1ABWNYZaFED_ANDA";

  /*
    Volume musik: 0 sampai 100.
  */
  const YOUTUBE_MUSIC_VOLUME = 45;

  const musicToggle = document.getElementById("music-toggle");

  let youtubePlayer = null;
  let youtubePlayerReady = false;
  let youtubePlayerCreating = false;
  let musicPlaying = false;
  let playWhenReady = false;
  let resumeAfterVisibility = false;

  function getYouTubeVideoId(value) {
    const input = String(value || "").trim();

    if (!input) {
      return "";
    }

    /*
      Jika pengguna memasukkan video ID langsung.
    */
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }

    try {
      const parsedURL = new URL(input);
      const hostname = parsedURL.hostname.replace(/^www\./, "");

      if (hostname === "youtu.be") {
        return parsedURL.pathname
          .split("/")
          .filter(Boolean)[0] || "";
      }

      const watchVideoId = parsedURL.searchParams.get("v");

      if (watchVideoId) {
        return watchVideoId;
      }

      const pathParts = parsedURL.pathname
        .split("/")
        .filter(Boolean);

      const supportedPrefixes = [
        "embed",
        "shorts",
        "live"
      ];

      for (const prefix of supportedPrefixes) {
        const prefixIndex = pathParts.indexOf(prefix);

        if (
          prefixIndex !== -1 &&
          pathParts[prefixIndex + 1]
        ) {
          return pathParts[prefixIndex + 1];
        }
      }

      return "";
    } catch (error) {
      return "";
    }
  }

  const youtubeVideoId =
    getYouTubeVideoId(YOUTUBE_MUSIC_URL);

  function updateMusicButton(isPlaying) {
    musicPlaying = isPlaying;

    if (!musicToggle) {
      return;
    }

    musicToggle.classList.toggle(
      "playing",
      isPlaying
    );

    musicToggle.setAttribute(
      "aria-pressed",
      String(isPlaying)
    );

    musicToggle.setAttribute(
      "aria-label",
      isPlaying
        ? "Hentikan musik latar"
        : "Putar musik latar"
    );

    musicToggle.title =
      isPlaying
        ? "Hentikan musik"
        : "Putar musik";
  }

  function setMusicLoadingState(isLoading) {
    if (!musicToggle) {
      return;
    }

    musicToggle.classList.toggle(
      "loading",
      isLoading
    );

    if (isLoading) {
      musicToggle.setAttribute(
        "aria-label",
        "Memuat musik latar"
      );

      musicToggle.title = "Memuat musik";
    } else {
      updateMusicButton(musicPlaying);
    }
  }

  function createYouTubePlayerContainer() {
    let playerContainer =
      document.getElementById("youtube-player");

    if (playerContainer) {
      return playerContainer;
    }

    playerContainer =
      document.createElement("div");

    playerContainer.id = "youtube-player";
    playerContainer.setAttribute(
      "aria-hidden",
      "true"
    );

    /*
      Pemutar tetap aktif, tetapi tidak terlihat.
    */
    Object.assign(
      playerContainer.style,
      {
        position: "fixed",
        width: "1px",
        height: "1px",
        left: "-9999px",
        bottom: "-9999px",
        opacity: "0",
        pointerEvents: "none",
        overflow: "hidden"
      }
    );

    document.body.appendChild(playerContainer);

    return playerContainer;
  }

  function handleYouTubePlayerError(errorCode) {
    const messages = {
      2: "ID video YouTube tidak valid.",
      5: "Video tidak dapat diputar melalui pemutar HTML5.",
      100: "Video YouTube tidak ditemukan atau telah dihapus.",
      101: "Pemilik video tidak mengizinkan pemutaran melalui embed.",
      150: "Pemilik video tidak mengizinkan pemutaran melalui embed."
    };

    console.error(
      messages[errorCode] ||
        `Musik YouTube gagal diputar. Kode error: ${errorCode}`
    );

    playWhenReady = false;
    resumeAfterVisibility = false;
    setMusicLoadingState(false);
    updateMusicButton(false);
  }

  function initializeYouTubePlayer() {
    if (
      youtubePlayer ||
      youtubePlayerCreating ||
      !youtubeVideoId ||
      !window.YT ||
      typeof window.YT.Player !== "function"
    ) {
      return;
    }

    youtubePlayerCreating = true;
    createYouTubePlayerContainer();

    youtubePlayer = new window.YT.Player(
      "youtube-player",
      {
        width: "1",
        height: "1",
        videoId: youtubeVideoId,

        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          loop: 1,
          playlist: youtubeVideoId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },

        events: {
          onReady: function (event) {
            youtubePlayerReady = true;
            youtubePlayerCreating = false;

            event.target.setVolume(
              YOUTUBE_MUSIC_VOLUME
            );

            setMusicLoadingState(false);

            if (playWhenReady) {
              event.target.playVideo();
            }
          },

          onStateChange: function (event) {
            if (
              event.data ===
              window.YT.PlayerState.PLAYING
            ) {
              playWhenReady = false;
              setMusicLoadingState(false);
              updateMusicButton(true);
              return;
            }

            if (
              event.data ===
              window.YT.PlayerState.PAUSED
            ) {
              updateMusicButton(false);
              return;
            }

            if (
              event.data ===
              window.YT.PlayerState.ENDED
            ) {
              /*
                Cadangan apabila loop YouTube tidak berjalan.
              */
              event.target.seekTo(0, true);
              event.target.playVideo();
            }
          },

          onError: function (event) {
            handleYouTubePlayerError(
              event.data
            );
          }
        }
      }
    );
  }

  function loadYouTubeIframeAPI() {
    if (!youtubeVideoId) {
      console.warn(
        "Masukkan link YouTube pada YOUTUBE_MUSIC_URL di script.js."
      );

      if (musicToggle) {
        musicToggle.title =
          "Link musik YouTube belum diatur";
      }

      return;
    }

    if (
      window.YT &&
      typeof window.YT.Player === "function"
    ) {
      initializeYouTubePlayer();
      return;
    }

    const existingScript =
      document.getElementById(
        "youtube-iframe-api-script"
      );

    const previousCallback =
      window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady =
      function () {
        if (
          typeof previousCallback === "function"
        ) {
          previousCallback();
        }

        initializeYouTubePlayer();
      };

    if (existingScript) {
      return;
    }

    const apiScript =
      document.createElement("script");

    apiScript.id =
      "youtube-iframe-api-script";

    apiScript.src =
      "https://www.youtube.com/iframe_api";

    apiScript.async = true;

    apiScript.onerror = function () {
      console.error(
        "YouTube IFrame API gagal dimuat. Periksa koneksi internet."
      );

      setMusicLoadingState(false);
      updateMusicButton(false);
    };

    document.head.appendChild(apiScript);
  }

  function playYouTubeMusic() {
    if (!youtubeVideoId) {
      window.alert(
        "Link lagu YouTube belum dimasukkan di script.js."
      );
      return;
    }

    playWhenReady = true;
    setMusicLoadingState(true);

    if (
      youtubePlayerReady &&
      youtubePlayer &&
      typeof youtubePlayer.playVideo ===
        "function"
    ) {
      youtubePlayer.setVolume(
        YOUTUBE_MUSIC_VOLUME
      );

      youtubePlayer.playVideo();
      return;
    }

    loadYouTubeIframeAPI();
  }

  function pauseYouTubeMusic() {
    playWhenReady = false;
    resumeAfterVisibility = false;
    setMusicLoadingState(false);

    if (
      youtubePlayerReady &&
      youtubePlayer &&
      typeof youtubePlayer.pauseVideo ===
        "function"
    ) {
      youtubePlayer.pauseVideo();
    }

    updateMusicButton(false);
  }

  /*
    Muat API lebih awal agar pemutar siap ketika
    pengunjung menekan tombol Buka Undangan.
  */
  loadYouTubeIframeAPI();

  if (musicToggle) {
    musicToggle.setAttribute(
      "aria-pressed",
      "false"
    );

    musicToggle.addEventListener(
      "click",
      function () {
        if (musicPlaying) {
          pauseYouTubeMusic();
        } else {
          playYouTubeMusic();
        }
      }
    );
  }

  /*
    Musik mulai setelah tombol Buka Undangan ditekan.
    Browser menganggap klik ini sebagai interaksi pengguna.
  */
  if (openButton) {
    openButton.addEventListener(
      "click",
      function () {
        playYouTubeMusic();
      }
    );
  }

  /*
    Hentikan sementara ketika tab tidak aktif,
    kemudian lanjutkan saat pengguna kembali.
  */
  document.addEventListener(
    "visibilitychange",
    function () {
      if (
        !youtubePlayerReady ||
        !youtubePlayer
      ) {
        return;
      }

      if (document.hidden) {
        resumeAfterVisibility =
          musicPlaying;

        if (musicPlaying) {
          youtubePlayer.pauseVideo();
        }

        return;
      }

      if (resumeAfterVisibility) {
        resumeAfterVisibility = false;
        playYouTubeMusic();
      }
    }
  );
});
