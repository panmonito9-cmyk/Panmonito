<script lang="ts">
  import './detalle.css';
  import { assetUrl } from '../../assets';
  import { onMount } from 'svelte';
  import productos from '../../data/productos.json';
  export let productId = '';
  $: producto = productos.find((item) => item.id === productId);
  import Navbar from '../home/section/navbar/navbar.svelte';
  import Footer from '../home/section/footer/footer.svelte';
  const originalScripts: { attributes: string[][]; content: string }[] = [{"attributes":[],"content":"\n    (function () {\n      try {\n        var params = new URLSearchParams(window.location.search);\n        var titulo = params.get('titulo');\n        var precio = params.get('precio');\n        var desc = params.get('desc');\n        var img = params.get('img');\n\n        if (titulo) {\n          var tEl = document.getElementById('detalle-producto-titulo');\n          var bEl = document.getElementById('breadcrumb-producto');\n          var docTitle = document.getElementById('pagina-titulo');\n          if (tEl) tEl.textContent = titulo;\n          if (bEl) bEl.textContent = titulo;\n          if (docTitle) docTitle.textContent = titulo + ' | Detalle de Producto';\n        }\n        if (precio) {\n          var pEl = document.getElementById('detalle-producto-precio');\n          if (pEl) pEl.textContent = precio;\n        }\n        if (desc) {\n          var dEl = document.getElementById('detalle-producto-descripcion');\n          if (dEl) dEl.textContent = desc;\n        }\n        if (img) {\n          var iEl = document.getElementById('detalle-producto-img');\n          if (iEl) {\n            iEl.src = img;\n            if (titulo) iEl.alt = titulo;\n          }\n        }\n\n        // Actualizar botón de WhatsApp si hay datos\n        var btnWa = document.getElementById('detalle-btn-whatsapp');\n        var waNum = '573235253215';\n        var saludo = 'Hola, me interesa pedir este producto:';\n        if (btnWa && waNum) {\n          var finalProd = titulo || 'Croisssant ChocoMonito';\n          var finalPrice = precio || '$15.000';\n          var msg = saludo + ' ' + finalProd + ' (' + finalPrice + ')';\n          btnWa.href = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(msg);\n        }\n\n      } catch (err) {\n        console.error('Error cargando parámetros de producto:', err);\n      }\n    })();\n  "},{"attributes":[],"content":"\n(() => {\n  const navbar = document.body.querySelector('header, nav, .navbar, #navbar, .barra-navegacion');\n  if (!navbar) return;\n  const update = () => {\n    const fixed = getComputedStyle(navbar).position === 'fixed';\n    document.body.style.setProperty('--pagina-navbar-offset', fixed ? Math.max(0, navbar.getBoundingClientRect().bottom) + 'px' : '0px');\n  };\n  update();\n  const observer = new ResizeObserver(update);\n  observer.observe(navbar);\n  window.addEventListener('resize', update);\n  window.addEventListener('load', update, { once: true });\n})();\n"}];
  onMount(() => {
    const previousClass = document.body.className;
    const previousStyle = document.body.getAttribute('style');
    const previousPage = document.body.getAttribute('data-svelte-page');
    const titleElement = document.head.querySelector('title');
    const previousTitleId = titleElement?.getAttribute('id');
    titleElement?.setAttribute('id', "pagina-titulo");
    document.body.className = "pagina-detalle-cuerpo detalle-tema-project detalle-typo-editorial-serif";
    document.body.setAttribute('data-svelte-page', "detalle");
    document.body.setAttribute('style', "");
    const mountedScripts: HTMLScriptElement[] = [];
    let cancelled = false;
    // Re-run the original page scripts after Svelte mounts their original DOM.
    queueMicrotask(async () => {
      for (const original of originalScripts) {
        if (cancelled) break;
        const script = document.createElement('script');
        for (const [name, value] of original.attributes) {
          script.setAttribute(name, name === 'src' ? assetUrl(value) : value);
        }
        script.textContent = original.content.replace(/\b(?:window\.)?location\.search\b/g, '(window.__svelteProductSearch ?? window.location.search)');
        const loaded = script.src ? new Promise<void>((resolve) => {
          script.onload = () => resolve();
          script.onerror = () => resolve();
        }) : Promise.resolve();
        mountedScripts.push(script);
        document.body.appendChild(script);
        await loaded;
      }
    });
    return () => {
      cancelled = true;
      mountedScripts.forEach((script) => script.remove());
      if (previousTitleId == null) titleElement?.removeAttribute('id');
      else titleElement?.setAttribute('id', previousTitleId);
      document.body.className = previousClass;
      if (previousPage === null) document.body.removeAttribute('data-svelte-page');
      else document.body.setAttribute('data-svelte-page', previousPage);
      if (previousStyle === null) document.body.removeAttribute('style');
      else document.body.setAttribute('style', previousStyle);
    };
  });
</script>
<svelte:head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Croisssant ChocoMonito | Detalle de Producto</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&amp;display=swap" rel="stylesheet"></svelte:head>


  <!-- 1. Header / Navbar Original del Proyecto (index.html) -->
<Navbar pageAttributes={{"id":"barra-navegacion","class":"navbar"}} pageLinks={["index.html#heroe","paletas.html","index.html#heroe","index.html#sobre-nosotros","index.html#catalogo","index.html#contacto"]} />

  <!-- Miga de Pan (Breadcrumb) -->
  <nav class="detalle-miga-pan" aria-label="Navegación de migas de pan">
    <div class="detalle-contenedor">
      <ol class="miga-pan-lista">
        <li><a href="index.html">Inicio</a></li>
        <li class="separador">/</li>
        <li><a href="index.html#catalogo">Catálogo</a></li>
        <li class="separador">/</li>
        <li class="activo" id="breadcrumb-producto">Croisssant ChocoMonito</li>
      </ol>
    </div>
  </nav>

  <!-- Ficha Principal del Producto Según Diseño Seleccionado -->
  <main class="detalle-principal-wrap">
    <div class="detalle-contenedor">
      
      <!-- DISEÑO 2: MODERNO DIVIDIDO (TECH SPLIT 50/50 CON ATRIBUTOS) -->
      <div class="detalle-tarjeta-producto detalle-diseno-2" id="ficha-producto">
        <!-- Columna Izquierda: Galería Moderna del Producto -->
        <div class="detalle-imagen-columna">
          <div class="detalle-tech-badge-top">
            <span class="punto-verde-pulso"></span>
            <span>En Stock • Despacho Inmediato</span>
          </div>
          <div class="detalle-imagen-marco marco-moderno">
            <img id="detalle-producto-img" src={assetUrl(producto?.imagen ?? '')} alt={producto?.nombre ?? ''} class="detalle-producto-img" loading="lazy">
          </div>
        </div>

        <!-- Columna Derecha: Información Técnica y Compra -->
        <div class="detalle-info-columna">
          <div class="detalle-eyebrow-wrap">
            <span class="detalle-badge-tech">Colección Exclusiva</span>
            <span class="badge-envio-gratis">🚀 Envío Express</span>
          </div>

          <h1 id="detalle-producto-titulo" class="detalle-titulo-moderno">{producto?.nombre ?? ''}</h1>

          <div class="detalle-precio-tech-row">
            <div class="detalle-precio-caja-moderna">
              <span id="detalle-producto-precio" class="detalle-precio">{producto?.precio ?? ''}</span>
            </div>
          </div>

          <div class="detalle-precio-nota-moderna">Precio final • Pedido directo sin intermediarios</div>

          <div class="detalle-descripcion-wrap">
            <p id="detalle-producto-descripcion" class="detalle-descripcion">{producto?.descripcion ?? ''}</p>
          </div>

          <!-- Cuadrícula de Especificaciones / Chips de Calidad -->
          <div class="detalle-specs-grid">
            <div class="detalle-spec-card">
              <span class="spec-emoji">✨</span>
              <div class="spec-info">
                <span class="spec-label">Calidad</span>
                <span class="spec-val">100% Original</span>
              </div>
            </div>
            <div class="detalle-spec-card">
              <span class="spec-emoji">📦</span>
              <div class="spec-info">
                <span class="spec-label">Despacho</span>
                <span class="spec-val">24 - 48 Horas</span>
              </div>
            </div>
            <div class="detalle-spec-card">
              <span class="spec-emoji">🛡️</span>
              <div class="spec-info">
                <span class="spec-label">Garantía</span>
                <span class="spec-val">Soporte Directo</span>
              </div>
            </div>
            <div class="detalle-spec-card">
              <span class="spec-emoji">💬</span>
              <div class="spec-info">
                <span class="spec-label">Atención</span>
                <span class="spec-val">Vía WhatsApp</span>
              </div>
            </div>
          </div>

          <!-- Botón de WhatsApp -->
          <div class="detalle-acciones">
            <a id="detalle-btn-whatsapp" href="https://wa.me/573235253215?text=Hola%2C%20me%20interesa%20pedir%20este%20producto%3A%20Croisssant%20ChocoMonito%20(%2415.000)" target="_blank" rel="noopener noreferrer" class="btn-pedir-whatsapp-moderno" title="Pedir este producto por WhatsApp">
              <svg class="icono-wa" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.072-1.808-.413-1.42-.587-2.327-2.023-2.399-2.119-.072-.095-.584-.777-.584-1.482 0-.705.368-1.053.498-1.197.13-.145.284-.182.378-.182.095 0 .19.002.273.007.087.005.203-.033.317.241.116.275.399.972.434 1.045.035.072.058.156.01.25-.047.095-.072.155-.144.24-.072.084-.153.187-.218.251-.073.072-.149.15-.064.296.085.145.378.624.811 1.01.558.497 1.029.651 1.174.723.145.072.23.06.316-.036.087-.096.371-.433.47-.58.099-.148.199-.124.331-.075.132.048.838.395.982.467.144.073.24.108.276.17.036.06.036.353-.108.758z"></path>
              </svg>
              <span>Comprar Directo por WhatsApp</span>
            </a>
            <p class="detalle-contacto-footer-nota">
              ✓ Contacto oficial para pedidos: <strong>+57 323 525 3215</strong>
            </p>
          </div>
        </div>
      </div>
      
    </div>
  </main>

  <!-- 3. Footer Original del Proyecto (index.html) -->
<Footer pageAttributes={{"class":"sitio-footer","id":"pie-de-pagina"}} pageLinks={["index.html#heroe","index.html#sobre-nosotros","index.html#catalogo","index.html#contacto"]} />

  <!-- Script para recibir datos dinámicos desde URL (?titulo=...&precio=...&img=...&desc=...) -->
  


