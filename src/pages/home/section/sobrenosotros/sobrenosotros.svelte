<script lang="ts">
  import './sobrenosotros.css';
  import { assetUrl } from '../../../../assets';
  // Props o lógica del componente
</script>

<section id="sobre-nosotros" class="fondo-secundario sobre-seccion">
        <div class="cuadricula contenedor-seccion">
          <!-- Aquí va el texto y debes usar la clase col-span-7 -->
          <div class="col-span-7 sobre-contenedor">
            <div class="sobre-nosotros-textos">
              <!-- Redacta aquí tu propio título con h2 y al menos dos párrafos con p -->
              <h2>Sobre nosotros</h2>
              <p>
                Deberían comprar en Panmonito porque ofrecemos productos de
                buena calidad, frescos y deliciosos a precios accesibles.
                Además, buscamos brindar una atención amable y cercana a
                nuestros clientes
              </p>
              <p class="descripcion">
                Panmonito es una opción ideal para disfrutar un producto rico,
                práctico y preparado con dedicación. ¡En Panmonito encuentras
                sabor, calidad y buenos precios en un solo lugar
              </p>
            </div>
          </div>

          <!-- Aquí va la imagen y debes usar la clase col-span-5 -->
          <div class="col-span-5">
            <!-- Aquí va la imagen solicitada -->
            <div class="contenedor-imagen">
              <img src={assetUrl("imagenes/sobrenosotros-imagen.webp")} alt="Sobre nosotros" class="imagen-estudio">
            </div>
          </div>
        </div>
      </section>
