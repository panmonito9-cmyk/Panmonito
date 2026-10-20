# Conectar el formulario con Gmail

El código ya está preparado. El formulario envía la consulta al negocio y una confirmación al visitante.

## Lo que debe hacer cada grupo

1. En la cuenta de Google que enviará correos, activa la verificación en dos pasos y crea una contraseña de aplicación en https://myaccount.google.com/apppasswords. No uses la contraseña habitual. Algunas cuentas de colegio o empresa no permiten contraseñas de aplicación: consulta al administrador o usa una cuenta permitida.
2. En tu proyecto de Vercel, abre **Settings → Environment Variables** y añade estas tres variables para **Production** (también Preview si vas a probar un despliegue de prueba):

| Nombre | Valor |
| --- | --- |
| GMAIL_USER | Tu dirección de Gmail, por ejemplo negocio@gmail.com |
| GMAIL_APP_PASSWORD | La contraseña de aplicación generada por Google |
| CONTACT_EMAIL | El correo donde quieres recibir las consultas; puede ser el mismo Gmail |

3. Guarda los valores y haz **Redeploy** desde Deployments. Las variables se aplican a los nuevos despliegues.
4. Abre la página desplegada, escribe una consulta con un correo de prueba que controles y pulsa Enviar. El negocio recibirá la consulta y el visitante una confirmación. Revisa también Spam.

No hay que instalar Node.js en el computador del grupo ni activar un servidor en Vercel. `api/contacto.js` es detectado automáticamente; Nodemailer está declarado en package.json. El SMTP de Gmail ya está configurado en el código (puerto 465 con TLS). No pongas las credenciales en GitHub ni les añadas el prefijo VITE_. `.env.example` contiene solo ejemplos.

## Qué correo recibe cada persona

- El negocio recibe nombre, correo, teléfono (si se indicó) y mensaje. Al pulsar Responder, responde al visitante gracias a Reply-To.
- El visitante recibe el HTML de `emails/confirmacion.html`. Al pulsar Responder, responde a CONTACT_EMAIL.
- Si el aviso al negocio llegó pero falla la confirmación, el formulario informa que la consulta fue recibida y evita pedir que se envíe de nuevo. Una respuesta SMTP aceptada no garantiza llegada a la bandeja principal.

## Editar el correo con ChatGPT

La plantilla editable es **emails/confirmacion.html**. Es la plantilla real que se envía, no solo una maqueta. Usa tablas y estilos en línea para que funcione en clientes de correo. No necesita imágenes externas.

Puedes pedir:

> Edita emails/confirmacion.html para adaptar la confirmación a nuestro negocio. Conserva las variables {{nombre}}, {{negocio}} y {{anio}}, las tablas, los estilos en línea y la versión para celular. No añadas contraseñas ni JavaScript al correo.

El nombre del negocio se define en `lib/contacto.js` (BUSINESS). Si cambias el contenido del HTML, pide a ChatGPT que actualice también el texto alternativo del correo en `lib/contacto.js`. No cambies la ruta de la plantilla sin actualizar la función y vercel.json.

## Comprobar y resolver errores

- **Formulario aún no disponible:** revisa los tres nombres de variables y vuelve a desplegar.
- **No pudimos enviar:** consulta los registros de la función en Vercel; comprueba la contraseña de aplicación y la cuenta de Google. El visitante no ve credenciales ni detalles internos.
- **Solo funciona en Vercel:** es lo esperado con npm run dev o vite preview; esos comandos no ejecutan funciones de Vercel. Para pruebas locales completas se necesita Vercel CLI, algo opcional para la clase.
- Gmail tiene límites de envío y puede bloquear accesos que considera sospechosos. Cada formulario usa hasta dos envíos. Nodemailer no añade una cuota de pago propia.

El formulario incluye validación, un campo trampa y un límite básico de cinco solicitudes por IP/correo cada quince minutos **por instancia**. Ese límite se reinicia al cambiar de instancia y no sustituye un límite persistente ni una protección contra bots para tráfico público elevado. Las respuestas automáticas llevan contenido fijo; la consulta del visitante se envía solo al negocio.

## Validación del proyecto

`npm run check` comprueba Svelte, `npm run build` genera el sitio y `npm run test:contacto` comprueba la API con un transporte simulado, sin enviar correos reales.

Documentación: https://nodemailer.com/guides/using-gmail y https://vercel.com/docs/functions/runtimes/node-js.
