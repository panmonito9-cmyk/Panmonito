<script lang="ts">
  import './contacto.css';
  import { assetUrl } from '../../../../assets';

  let sending = false;
  let statusMessage = '';
  let hasError = false;
  let startedAt = Date.now();

  async function enviarContacto(event: SubmitEvent) {
    if (sending) return;
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) return;
    sending = true;
    statusMessage = 'Enviando tu mensaje…';
    hasError = false;
    const data = new FormData(form);
    try {
      const response = await fetch(import.meta.env.BASE_URL + 'api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.get('nombre'), email: data.get('email'),
          telefono: data.get('telefono') || '', mensaje: data.get('mensaje'),
          website: data.get('website') || '', startedAt,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) throw new Error(result?.error || 'No pudimos enviar el mensaje. Inténtalo más tarde.');
      statusMessage = result.confirmationSent === false
        ? 'Recibimos tu mensaje. Te responderemos al correo que indicaste; no necesitas enviarlo otra vez.'
        : '¡Mensaje enviado! Revisa tu correo y la carpeta de spam para ver la confirmación.';
      form.reset();
      startedAt = Date.now();
    } catch (error) {
      hasError = true;
      statusMessage = error instanceof Error ? error.message : 'No pudimos enviar el mensaje. Revisa tu conexión.';
    } finally {
      sending = false;
    }
  }

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
            <form class="formulario-contacto" on:submit|preventDefault={enviarContacto} aria-busy={sending}>
        <div class="contacto-antispam" aria-hidden="true">
          <label for="contacto-website">Deja este campo vacío</label>
          <input id="contacto-website" type="text" name="website" tabindex="-1" autocomplete="off">
        </div>
              <div class="fila-formulario">
                <div class="campo-grupo">
                  <label for="nombre">Nombre Completo</label>
                  <input type="text" id="nombre" name="nombre" maxlength="80" autocomplete="name" placeholder="Ej. Alex Martínez" required>
                </div>
                <div class="campo-grupo">
                  <label for="email">Correo Electrónico</label>
                  <input type="email" id="email" name="email" maxlength="254" autocomplete="email" placeholder="alex@ejemplo.com" required>
                </div>
              </div>

              <div class="campo-grupo">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" maxlength="40" autocomplete="tel" inputmode="tel" placeholder="Ej. +57 300 123 4567" required>
              </div>

              <div class="campo-grupo">
                <label for="mensaje">¿Cómo podemos ayudarte?</label>
                <textarea id="mensaje" name="mensaje" maxlength="4000" rows="4" placeholder="Escribe aquí tu mensaje..." required></textarea>
              </div>

              <button type="submit" class="boton-enviar-contacto" disabled={sending}>
                <span>{sending ? 'Enviando…' : 'Enviar Mensaje'}</span>
              </button>
              <p class="contacto-estado" class:contacto-error={hasError} role="status" aria-live="polite" aria-atomic="true">{statusMessage}</p>
      </form>
          </div>
        </div>
      </section>
<style>
  .contacto-antispam { position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden; }
  .contacto-estado { margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: inherit; }
  .contacto-estado:empty { display: none; }
  .contacto-error { font-weight: 600; }
  .boton-enviar-contacto:disabled { opacity: 0.65; cursor: wait; }
</style>
