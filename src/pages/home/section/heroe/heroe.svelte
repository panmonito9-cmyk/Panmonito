<script lang="ts">
  import './heroe.css';
  import { assetUrl } from '../../../../assets';
  // Props o lógica del componente
</script>

<section class="fondo-principal seccion-heroe" id="heroe">
        <div class="cuadricula contenedor-seccion contenedor-heroe">
          <div class="col-span-5 contenedor-texto">
            <span class="hero-insignia">Panmonito · Dulces momentos</span>
            <h1>Una jungla de sabores <em>en cada bocado.</em></h1>
            <p>
              Chocolate, café y mucha imaginación. Postres frescos, figuras
              divertidas y pequeños antojos para compartir grandes momentos.
            </p>
            <div class="contenedor-boton">
              <a class="boton boton-secundario" href="#catalogo">Explorar productos</a>
              <a class="boton boton-blanco" href="#contacto">Contacto</a>
            </div>
          </div>
          <figure class="col-span-7 heroe-imagen-contenedor">
            <img src={assetUrl("imagenes/sobrenosotros-imagen.webp")} class="heroe-imagen" alt="Pastel con chocolate y un monito decorativo de Panmonito" width="1200" height="900" fetchpriority="high">
            <figcaption class="hero-pie-foto"><span>Hecho con dedicación</span><strong>Un bocado, millones de recuerdos.</strong></figcaption>
          </figure>
        </div>
      </section>
