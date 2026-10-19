<script lang="ts">
  import './catalogo.css';
  import { assetUrl } from '../../../../assets';
  import { onMount } from 'svelte';
  import productos from '../../../../data/productos.json';


  const originalScripts: { attributes: string[][]; content: string }[] = [];
  onMount(() => {
    const previousClass = document.body.className;
    const previousStyle = document.body.getAttribute('style');
    const previousPage = document.body.getAttribute('data-svelte-page');
    const titleElement = document.head.querySelector('title');
    const previousTitleId = titleElement?.getAttribute('id');
    
    
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
      
      
    };
  });
</script>

<section id="catalogo" class="fondo-principal">
        <div class="contenedor-seccion">
          <div class="catalogo-header">
            <span>Colección Exclusiva</span>

            <h2>Explora nuestros productos</h2>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem; width: 100%;"><a href="catalogo.html" class="boton-catalogo" style="flex: 0 0 auto !important; width: auto !important; display: inline-flex; padding: 0.65rem 1rem;">Ver catálogo completo</a></div><div class="catalogo-contenido cuadricula">
            {#each productos.slice(0, 3) as producto (producto.id)}
<div class="catalogo-item" data-producto={producto.id}>
              <div class="catalogo-imagen">
                <img src={assetUrl(producto.imagen)} alt={producto.nombre}>
              </div>
              <div class="item-contenido">
                <div class="informacion-producto">
                  <h3>{producto.nombre}</h3>
                  <span class="precio-label">{producto.precio}</span>
                </div>
                <p class="producto-descripcion">{producto.descripcion}</p>
                <div class="producto-accion">
                  <a href={import.meta.env.BASE_URL + 'detalle/' + encodeURIComponent(producto.id)} target="_blank" rel="noopener noreferrer" class="boton-catalogo">Ver detalles</a>
                </div>
              </div>
            </div>
{/each}

            

            
          </div>
        </div>
      </section>