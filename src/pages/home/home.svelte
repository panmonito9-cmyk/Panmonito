<script lang="ts">
  import './home.css';
  import { assetUrl } from '../../assets';
  import Navbar from './section/navbar/navbar.svelte';
  import Heroe from './section/heroe/heroe.svelte';
  import SobreNosotros from './section/sobrenosotros/sobrenosotros.svelte';
  import Catalogo from './section/catalogo/catalogo.svelte';
  import Contacto from './section/contacto/contacto.svelte';
  import Footer from './section/footer/footer.svelte';
  import { onMount } from 'svelte';



  const originalScripts: { attributes: string[][]; content: string }[] = [{"attributes":[["src","navbar.js"]],"content":""},{"attributes":[["src","imagenes.js"],["defer",""]],"content":""},{"attributes":[["src","detalle-producto.js"],["defer",""]],"content":""}];
  onMount(() => {
    const previousClass = document.body.className;
    const previousStyle = document.body.getAttribute('style');
    const previousPage = document.body.getAttribute('data-svelte-page');
    const titleElement = document.head.querySelector('title');
    const previousTitleId = titleElement?.getAttribute('id');
    
    document.body.className = "";
    document.body.setAttribute('data-svelte-page', "home");
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
<title>Panmonito</title></svelte:head>

    <Navbar />
    <main>
      <Heroe />

      <SobreNosotros />

      <Catalogo />

      <Contacto />
    </main>
    <Footer />


    
    
    
  

