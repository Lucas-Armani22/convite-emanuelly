/* =========================================================
   Convite digital — Emanuelly, 15 anos
   JavaScript puro (sem bibliotecas)
   ========================================================= */

/* ---------------------------------------------------------
   >>> CONFIGURAÇÕES QUE VOCÊ PODE EDITAR <<<
   --------------------------------------------------------- */

// SUBSTITUIR pelo número real do WhatsApp.
// Use somente números, com código do país (55) + DDD + número.
// Exemplo (formato): "5517999999999"
// Enquanto estiver vazio, o botão não abre nenhuma conversa.
const WHATSAPP_NUMBER = "5517988461279";

// Mensagem que já vem escrita na conversa.
const WHATSAPP_MESSAGE =
  "Olá! Estou entrando em contato para confirmar minha presença na festa de 15 anos da Emanuelly, no dia 14/10.";

/* --------------------------------------------------------- */

(function () {
  "use strict";

  // Ativa os efeitos de revelação (sem JS, tudo fica visível normalmente).
  document.documentElement.classList.add("js");

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var body = document.body;
  var cover = document.getElementById("capa");
  var invite = document.getElementById("convite");
  var openBtn = document.getElementById("open-invite");

  /* ---------- Abertura do convite ---------- */
  var opened = false;

  function revealContent() {
    cover.hidden = true;
    invite.hidden = false;
    body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    invite.focus({ preventScroll: true });
    setupReveal();
  }

  function openInvite() {
    if (opened) return;
    opened = true;
    openBtn.disabled = true;

    if (prefersReducedMotion) {
      revealContent();
      return;
    }

    cover.classList.add("is-leaving");

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      revealContent();
    }

    cover.addEventListener("transitionend", function (e) {
      if (e.target === cover && e.propertyName === "opacity") finish();
    });
    // Garantia caso o evento de transição não dispare.
    window.setTimeout(finish, 800);
  }

  if (openBtn && cover && invite) {
    openBtn.addEventListener("click", openInvite);
  } else {
    // Se algo estiver faltando, nunca deixa o conteúdo preso.
    if (cover) cover.hidden = true;
    if (invite) invite.hidden = false;
    body.classList.remove("is-locked");
  }

  /* ---------- Entrada gradual dos elementos ---------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Foto da entrada da chácara ----------
     O caminho da imagem fica no atributo src da tag <img id="entrada-img">
     no index.html (padrão: assets/images/entrada-chacara.jpg).
     Se o arquivo existir, ele aparece e o espaço reservado some. */
  var photo = document.getElementById("entrada-img");
  var placeholder = document.getElementById("entrada-placeholder");

  function showPhoto() {
    photo.hidden = false;
    if (placeholder) placeholder.hidden = true;
  }

  if (photo) {
    if (photo.complete && photo.naturalWidth > 0) {
      showPhoto();
    } else {
      photo.addEventListener("load", function () {
        if (photo.naturalWidth > 0) showPhoto();
      });
    }
  }

  /* ---------- Confirmação pelo WhatsApp ---------- */
  var waBtn = document.getElementById("whatsapp-btn");
  var waStatus = document.getElementById("whatsapp-status");
  var cleanNumber = String(WHATSAPP_NUMBER).replace(/\D/g, "");
  // 55 + DDD (2 dígitos) + número (8 ou 9 dígitos) = 12 ou 13 dígitos
  var numberIsValid = /^55\d{10,11}$/.test(cleanNumber);

  if (waBtn) {
    if (numberIsValid) {
      waBtn.href = "https://wa.me/" + cleanNumber + "?text=" + encodeURIComponent(WHATSAPP_MESSAGE);
      waBtn.target = "_blank";
    } else {
      console.warn(
        "[Convite] Número de WhatsApp não configurado. " +
        "Edite a constante WHATSAPP_NUMBER em js/script.js (ex.: \"5517999999999\")."
      );
      waBtn.addEventListener("click", function (e) {
        e.preventDefault();
        if (waStatus) {
          waStatus.textContent =
            "O número do WhatsApp ainda não foi configurado. Edite WHATSAPP_NUMBER em js/script.js.";
        }
      });
    }
  }
})();
