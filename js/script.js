/**
 * ============================================================================
 *  LA ENTREVISTA DE CAPTACIÓN – MÉTODO C.A.P.T.A.
 *  Scripts de la landing (Vanilla JS)
 * ============================================================================
 */

/* ============================================================================
 *  OPCIONES FÁCILMENTE EDITABLES
 * ============================================================================
 *  ✏️ 1) SHOPIFY_CHECKOUT_URL: URL del carrito/checkout de tu tienda Shopify.
 *       Todos los botones "COMPRAR AHORA" (.btn-comprar) usan esta variable.
 *  ✏️ 2) PRICE: precio mostrado. No hace falta tocarlo también en el HTML.
 * ==========================================================================*/
const SHOPIFY_CHECKOUT_URL = "https://metodocaptarpropiedades.com/cart";
const PRICE = "14.999"; // ✏️ EDITAR AQUÍ (precio en pesos argentinos, ARS)

/* Estado global */
document.addEventListener("DOMContentLoaded", () => {
  aplicarPrecio();
  conectarBotonesShopify();
  initMenuMovil();
  initHeaderScroll();
  initSmoothAnchors();
  initReveal();
  initFAQ();
  initGarantia();
  setFooterYear();
});

/* ----------------------------------------------------------------------------
 * Precio y botones de compra (Shopify)
 * --------------------------------------------------------------------------*/

/** Sustituye el precio en todos los elementos con [data-price]. */
function aplicarPrecio() {
  document.querySelectorAll("[data-price]").forEach((el) => {
    el.textContent = PRICE;
  });
}

/**
 * Conecta los 5 botones de compra (.btn-comprar) al carrito de Shopify.
 * Navega en la misma pestaña: el usuario sale de la landing y entra al checkout.
 */
function conectarBotonesShopify() {
  document.querySelectorAll(".btn-comprar").forEach((button) => {
    button.href = SHOPIFY_CHECKOUT_URL;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = SHOPIFY_CHECKOUT_URL;
    });
  });
}

/* ----------------------------------------------------------------------------
 * Menú móvil
 * --------------------------------------------------------------------------*/
function initMenuMovil() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  // Cierra el menú al pulsar cualquier enlace
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  // Cierra con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Cierra al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("is-open") &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      setOpen(false);
    }
  });
}

/* ----------------------------------------------------------------------------
 * Header con sombra al hacer scroll
 * --------------------------------------------------------------------------*/
function initHeaderScroll() {
  const header = document.getElementById("header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ----------------------------------------------------------------------------
 * Scroll suave con compensación del header fijo
 * (scroll-behavior: smooth ya está en CSS; esto añade precisión en anclas)
 * --------------------------------------------------------------------------*/
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById("header")?.offsetHeight || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 14;

      window.scrollTo({ top, behavior: "smooth" });

      // Actualiza el hash sin saltos bruscos
      history.replaceState(null, "", id);
    });
  });
}

/* ----------------------------------------------------------------------------
 * Aparición sutil al hacer scroll (IntersectionObserver)
 * --------------------------------------------------------------------------*/
function initReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  // Si no hay soporte, mostrar todo directamente
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------------------------------
 * FAQ interactivo (cierra los demás al abrir uno)
 * --------------------------------------------------------------------------*/
function initFAQ() {
  const items = document.querySelectorAll(".faq__item");
  if (!items.length) return;

  items.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });
}

/* ----------------------------------------------------------------------------
 * Acordeón de la Garantía de 7 días
 * --------------------------------------------------------------------------*/
function initGarantia() {
  const accordeon = document.getElementById("garantiaAccordeon");
  const btn = document.getElementById("garantiaBtn");
  const panel = document.getElementById("garantiaPanel");

  if (!accordeon || !btn || !panel) return;

  /** Abre o cierra el panel con transición elegante. */
  const setOpen = (open) => {
    if (open) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.style.opacity = "1";
      accordeon.dataset.open = "true";
      btn.setAttribute("aria-expanded", "true");
    } else {
      panel.style.maxHeight = "0px";
      panel.style.opacity = "0";
      accordeon.dataset.open = "false";
      btn.setAttribute("aria-expanded", "false");
    }
  };

  // Alternar con clic (accesible por teclado: Enter / Espacio funcionan nativo)
  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  // Ajustar la altura si cambia el tamaño de pantalla (responsive)
  const onResize = () => {
    if (btn.getAttribute("aria-expanded") === "true") {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  };
  window.addEventListener("resize", onResize);
}

/* ----------------------------------------------------------------------------
 * Año actual en el footer
 * --------------------------------------------------------------------------*/
function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}