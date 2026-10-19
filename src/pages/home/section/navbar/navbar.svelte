<script lang="ts">
  import './navbar.css';
  import { assetUrl } from '../../../../assets';
  export let pageAttributes: Record<string, string> = {};
  export let pageLinks: string[] = [];
  function configureRoot(node: HTMLElement, config: { attributes: Record<string, string>; links: string[] }) {
    const update = (value: typeof config) => {
      Object.entries(value.attributes).forEach(([name, content]) => node.setAttribute(name, content));
      node.querySelectorAll('a').forEach((link, index) => {
        if (value.links[index] !== undefined) link.setAttribute('href', value.links[index]);
      });
    };
    update(config);
    return { update };
  }
</script>
<nav use:configureRoot={{ attributes: pageAttributes, links: pageLinks }} id="barra-navegacion" class="navbar">
      <div class="contenedor-navbar">
        <a href="#heroe" class="navbar-logo">Panmonito</a>

        <!-- Botón hamburguesa responsive para móviles -->
        <button class="navbar-toggle" id="navbar-toggle" aria-label="Abrir menú" aria-expanded="false">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul class="navbar-menu">
          <li><a href="paletas.html" class="nav-link">Paletas</a></li>
          <li><a href="#heroe" class="nav-link">Inicio</a></li>
          <li><a href="#sobre-nosotros" class="nav-link">Sobre Nosotros</a></li>
          <li><a href="#catalogo" class="nav-link">Catálogo</a></li>
          <li>
            <a href="#contacto" class="nav-link nav-link-btn">Contacto</a>
          </li>
        </ul>
      </div>
    </nav>