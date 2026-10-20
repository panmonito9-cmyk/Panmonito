/* =========================================================
   INTERACTIVIDAD: APERTURA DE PÁGINA DE DETALLE (detalle.html)
   (detalle-producto.js)
   Al hacer clic en "Ver detalles" o en el título de cualquier
   producto del Catálogo, abre la nueva página de detalle
   (detalle.html) pasando dinámicamente el título, precio,
   imagen y descripción del producto.
   ========================================================= */

(function () {
  'use strict';

  var CONFIG = {
    openInNewTab: true,
    targetPage: 'detalle.html'
  };

  function vincularCatalogoADetalle() {
    var catalogo =
      document.getElementById('catalogo') ||
      document.querySelector('section#catalogo') ||
      document.querySelector('.catalogo-seccion') ||
      document.body;

    var items = catalogo.querySelectorAll(
      '.catalogo-item, .card-producto, .producto, .card, [data-producto]'
    );

    items.forEach(function (item) {
      var tituloEl = item.querySelector('h3, h4, h2, .card-title, .titulo-producto');
      var precioEl = item.querySelector('.precio-label, .precio-valor, .precio, .card-precio, .price');
      var descEl = item.querySelector('.producto-descripcion, .card-desc, .descripcion, p');
      var imgEl = item.querySelector('img');
      var botonDetalle = item.querySelector(
        '.boton-catalogo, a[href*="detalle"], a[href="#contacto"], button, .btn'
      );

      function construirUrl() {
        var titulo = tituloEl ? tituloEl.textContent.trim() : 'Producto de Catálogo';
        var precio = precioEl ? precioEl.textContent.trim() : '';
        var desc = descEl ? descEl.textContent.trim() : '';
        var img = imgEl ? (imgEl.getAttribute('src') || '') : '';

        var baseUrl = CONFIG.targetPage;
        if (botonDetalle && botonDetalle.getAttribute('href')) {
          var h = botonDetalle.getAttribute('href');
          if (h && (h.includes('detalle.html') || h.startsWith('blob:'))) {
            baseUrl = h.split('?')[0];
          }
        }

        var params = new URLSearchParams();
        if (titulo) params.set('titulo', titulo);
        if (precio) params.set('precio', precio);
        if (desc) params.set('desc', desc);
        if (img) params.set('img', img);

        return baseUrl + '?' + params.toString();
      }

      function abrirPaginaDetalle(e) {
        if (e) e.preventDefault();
        var url = construirUrl();
        if (CONFIG.openInNewTab) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = url;
        }
      }

      // Actualizar botón de Ver detalles
      if (botonDetalle) {
        botonDetalle.setAttribute('href', CONFIG.targetPage);
        if (CONFIG.openInNewTab) {
          botonDetalle.setAttribute('target', '_blank');
          botonDetalle.setAttribute('rel', 'noopener noreferrer');
        }
        if (!botonDetalle.dataset.detailBound) {
          botonDetalle.dataset.detailBound = 'true';
          botonDetalle.addEventListener('click', abrirPaginaDetalle);
        }
      }

      // Preserve the heading and expose navigation as a native link.
      if (tituloEl && !tituloEl.dataset.detailBound) {
        tituloEl.dataset.detailBound = 'true';
        var enlace = document.createElement('a');
        enlace.className = 'catalogo-titulo-clicable';
        enlace.href = construirUrl();
        enlace.style.color = 'inherit';
        enlace.style.font = 'inherit';
        enlace.style.textDecoration = 'none';
        enlace.textContent = tituloEl.textContent;
        if (CONFIG.openInNewTab) {
          enlace.target = '_blank';
          enlace.rel = 'noopener noreferrer';
        }
        tituloEl.replaceChildren(enlace);
      }
    });
  }

  if (document.readyState === 'loading') {
    (function(callback) { callback.call(document, new Event('DOMContentLoaded')); })( vincularCatalogoADetalle);
  } else {
    vincularCatalogoADetalle();
  }

})();
