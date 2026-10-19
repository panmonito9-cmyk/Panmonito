<script lang="ts">
  import './App.css';
  import { onMount } from 'svelte';
  import Home from './pages/home/home.svelte';
  import Catalogo from './pages/catalogo/catalogo.svelte';
  import Detalle from './pages/detalle/detalle.svelte';
  import products from './data/productos.json';
  import { assetUrl } from './assets';
  let currentRoute = 'home';
  let pageKey = '';
  let productId = '';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  function parseRoute() {
    const path = window.location.pathname.slice(base.length).replace(/^\//, '');
    currentRoute = path.startsWith('detalle') ? 'detalle' : path.startsWith('catalogo') ? 'catalogo' : 'home';
    document.body.dataset.sveltePage = currentRoute;
    const id = decodeURIComponent(path.split('/')[1] || '');
    productId = id;
    const product = products.find((item) => item.id === id);
    (window as any).__svelteProductSearch = product ? '?' + new URLSearchParams({ titulo: product.nombre, precio: String(product.precio), desc: product.descripcion, img: assetUrl(product.imagen) }).toString() : window.location.search;
    pageKey = window.location.pathname + window.location.search + currentRoute;
  }
  onMount(() => {
    const legacy = new URL(window.location.href);
    if (/detalle(?:-producto)?\.html$/i.test(legacy.pathname)) {
      const product = products.find((item) => item.nombre === legacy.searchParams.get('titulo'));
      if (product) history.replaceState({}, '', base + '/detalle/' + encodeURIComponent(product.id));
    } else if (/catalogo\.html$/i.test(legacy.pathname)) history.replaceState({}, '', base + '/catalogo');
    parseRoute();
    const navigate = async (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const element = event.target as Element;
      const link = element?.closest('a');
      const card = element?.closest('.catalogo-item, .card-producto, [data-producto], .card-overlay-hover, .card-modern-pill, .card-editorial-minimal');
      const button = element?.closest('button');
      const url = link ? new URL(link.href, window.location.href) : null;
      const detailAction = !!card && (/detalle|modal/i.test(link?.getAttribute('href') || '') || /ver detalles/i.test((link || button)?.textContent || ''));
      if ((!link && !detailAction) || link?.hasAttribute('download') || (url && url.origin !== window.location.origin)) return;
      let destination = '';
      if (!detailAction && url && /index\.html$/i.test(url.pathname)) destination = base + '/' + url.hash;
      else if (!detailAction && url && /(?:catalogo(?:\.html)?\/?$)/i.test(url.pathname)) destination = base + '/catalogo';
      else if (link?.getAttribute('href')?.startsWith('#') && currentRoute !== 'home' && link.closest('header, nav, footer')) destination = base + '/' + url!.hash;
      else if (!detailAction && url && url.pathname === base + '/') destination = base + '/' + url.hash;
      else if (detailAction || (url && /(?:\/detalle\/[^/]+$|\/detalle(?:-producto)?\.html$)/i.test(url.pathname))) {
        const title = url?.searchParams.get('titulo') || card?.querySelector('h3, h4, h2, .card-title, .titulo-producto')?.textContent?.trim();
        const id = url?.pathname.split('/detalle/')[1];
        const product = products.find((item) => item.id === id || item.nombre === title);
        if (!product) return;
        destination = base + '/detalle/' + encodeURIComponent(product.id);
      }
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
      document.querySelectorAll('.navbar-menu.active, .navbar-toggle.active').forEach((node) => node.classList.remove('active'));
      document.querySelector('.navbar-toggle')?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      history.pushState({}, '', destination);
      parseRoute();
      if (!destination.includes('#')) window.scrollTo(0, 0);
      else {
        const { tick } = await import('svelte');
        await tick();
        document.getElementById(decodeURIComponent(destination.split('#')[1]))?.scrollIntoView();
      }
    };
    document.addEventListener('click', navigate, true);
    window.addEventListener('popstate', parseRoute);
    return () => {
      document.removeEventListener('click', navigate, true);
      window.removeEventListener('popstate', parseRoute);
    };
  });
</script>
{#key pageKey}
  {#if currentRoute === 'catalogo'}
    <Catalogo />
  {:else if currentRoute === 'detalle'}
    <Detalle {productId} />
  {:else}
    <Home />
  {/if}
{/key}
