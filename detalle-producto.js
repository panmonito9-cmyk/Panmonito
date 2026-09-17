/* =========================================================
   INTERACTIVIDAD: MODAL DE DETALLE DE PRODUCTO
   (detalle-producto.js)
   Abre automáticamente el modal emergente al hacer clic en
   "Ver detalles" o en el título de cualquier tarjeta del Catálogo.
   Carga dinámicamente los datos del producto y actualiza el enlace
   de WhatsApp con el número verificado del Pie de Página (Footer).
   ========================================================= */

(function () {
  'use strict';

  // Configuración de contacto extraída del Footer
  var CONFIG = {
    whatsappNumero: '3235253215',
    mensajeSaludo: 'Hola, me interesa pedir este producto:'
  };

  function inicializarModalDetalleProducto() {
    var modal = document.getElementById('detalle-producto');
    if (!modal) return;

    var modalImg = document.getElementById('modal-producto-img');
    var modalTitulo = document.getElementById('modal-producto-titulo');
    var modalPrecio = document.getElementById('modal-producto-precio');
    var modalDesc = document.getElementById('modal-producto-descripcion');
    var modalBtnWhatsapp = document.getElementById('modal-btn-whatsapp');
    var closeButtons = modal.querySelectorAll('[data-close-modal]');

    function abrirModal(datos) {
      if (datos.img && modalImg) {
        modalImg.src = datos.img;
        modalImg.alt = datos.titulo || 'Producto';
      }
      if (datos.titulo && modalTitulo) {
        modalTitulo.textContent = datos.titulo;
      }
      if (datos.precio && modalPrecio) {
        modalPrecio.textContent = datos.precio;
      }
      if (datos.desc && modalDesc) {
        modalDesc.textContent = datos.desc;
      }

      // Actualizar enlace directo de WhatsApp con el producto específico
      if (modalBtnWhatsapp && CONFIG.whatsappNumero) {
        var textoPedido = CONFIG.mensajeSaludo + ' ' + (datos.titulo || '') + ' (' + (datos.precio || '') + ')';
        modalBtnWhatsapp.href = 'https://wa.me/' + CONFIG.whatsappNumero + '?text=' + encodeURIComponent(textoPedido);
      }

      // Mostrar el modal
      modal.classList.add('activo');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-detalle-abierto');
    }

    function cerrarModal() {
      modal.classList.remove('activo');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-detalle-abierto');
    }

    // 1. Cerrar al hacer clic en la ✕ o en el fondo oscuro
    closeButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        cerrarModal();
      });
    });

    // 2. Cerrar al presionar la tecla Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('activo')) {
        cerrarModal();
      }
    });

    // 3. Vincular todas las tarjetas del Catálogo
    function vincularTarjetasCatalogo() {
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
        var precioEl = item.querySelector(
          '.precio-label, .precio-valor, .precio, .card-precio, .price'
        );
        var descEl = item.querySelector(
          '.producto-descripcion, .card-desc, .descripcion, p'
        );
        var imgEl = item.querySelector('img');
        var botonDetalle = item.querySelector(
          '.boton-catalogo, a[href="#detalle-producto"], a[href="#contacto"], button, .btn'
        );

        function obtenerDatos() {
          return {
            titulo: tituloEl ? tituloEl.textContent.trim() : 'Producto de Catálogo',
            precio: precioEl ? precioEl.textContent.trim() : '$ 50.000',
            desc: descEl
              ? descEl.textContent.trim()
              : 'Pieza seleccionada con altos estándares de calidad.',
            img: imgEl ? imgEl.getAttribute('src') : './imagenes/placeholder.jpg'
          };
        }

        // a) Clic en el Título
        if (tituloEl && !tituloEl.dataset.modalBound) {
          tituloEl.dataset.modalBound = 'true';
          tituloEl.classList.add('catalogo-titulo-clicable');
          tituloEl.setAttribute('role', 'button');
          tituloEl.setAttribute('tabindex', '0');
          tituloEl.setAttribute('title', 'Ver detalles de este producto');
          tituloEl.addEventListener('click', function (e) {
            e.preventDefault();
            abrirModal(obtenerDatos());
          });
          tituloEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              abrirModal(obtenerDatos());
            }
          });
        }

        // b) Clic en el Botón "Ver detalles"
        if (botonDetalle && !botonDetalle.dataset.modalBound) {
          botonDetalle.dataset.modalBound = 'true';
          var txt = (botonDetalle.textContent || '').toLowerCase();
          if (
            txt.includes('detalle') ||
            txt.includes('ver') ||
            botonDetalle.classList.contains('boton-catalogo')
          ) {
            botonDetalle.setAttribute('href', '#detalle-producto');
            botonDetalle.setAttribute('title', 'Ver ficha del producto');
            botonDetalle.addEventListener('click', function (e) {
              e.preventDefault();
              abrirModal(obtenerDatos());
            });
          }
        }
      });
    }

    vincularTarjetasCatalogo();

    // Re-vincular si hay mutaciones en el DOM del catálogo
    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        vincularTarjetasCatalogo();
      });
      var seccionCatalogo = document.getElementById('catalogo');
      if (seccionCatalogo) {
        observer.observe(seccionCatalogo, { childList: true, subtree: true });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarModalDetalleProducto);
  } else {
    inicializarModalDetalleProducto();
  }
})();
