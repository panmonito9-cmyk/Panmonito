<script lang="ts">
  import './contacto.css';
  import { assetUrl } from '../../../../assets';
</script>
<section id="contacto" class="seccion-contacto fondo-secundario">
        <div class="contenedor-seccion">
          <div class="contacto-cabecera">
            <span class="contacto-insignia">Hablemos</span>
            <h2 class="contacto-titulo">Ponte en Contacto</h2>
            <p class="contacto-bajada">
              Déjanos tu consulta o mensaje y nos pondremos en contacto contigo.
            </p>
          </div>
          <!-- Banner interactivo de WhatsApp y Teléfono Directo -->
          <div class="banner-whatsapp">
            <div class="banner-whatsapp-info">
              <div class="icono-whatsapp-grande">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
                </svg>
              </div>
              <div>
                <h3>¿Necesitas respuesta inmediata?</h3>
                <p>Chatea por WhatsApp o llámanos directamente por teléfono.</p>
              </div>
            </div>
            <div class="banner-whatsapp-acciones">
              <a href="https://wa.me/573001234567?text=Hola%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios" target="_blank" rel="noopener noreferrer" class="boton-whatsapp">
                <span>Abrir WhatsApp</span>
              </a>
            </div>
          </div>

          <div class="tarjeta-formulario-contacto">
            <form class="formulario-contacto">
              <div class="fila-formulario">
                <div class="campo-grupo">
                  <label for="nombre">Nombre Completo</label>
                  <input type="text" id="nombre" name="nombre" placeholder="Ej. Alex Martínez" required="">
                </div>
                <div class="campo-grupo">
                  <label for="email">Correo Electrónico</label>
                  <input type="email" id="email" name="email" placeholder="alex@ejemplo.com" required="">
                </div>
              </div>

              <div class="campo-grupo">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" autocomplete="tel" inputmode="tel" placeholder="Ej. +57 300 123 4567" required="">
              </div>

              <div class="campo-grupo">
                <label for="mensaje">¿Cómo podemos ayudarte?</label>
                <textarea id="mensaje" name="mensaje" rows="4" placeholder="Escribe aquí tu mensaje..." required=""></textarea>
              </div>

              <button type="submit" class="boton-enviar-contacto">
                <span>Enviar Mensaje</span>
              </button>
            </form>
          </div>
        </div>
      </section>