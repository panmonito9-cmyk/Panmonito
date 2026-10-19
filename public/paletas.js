const propuestas = [
  ['predeterminada', 'Predeterminada', 'Verde petróleo · crema · durazno', 'Conserva los colores actuales de Panmonito. El verde petróleo sostiene la idea de una jungla de sabores; el crema aporta calidez y el durazno recuerda la repostería recién horneada. Una identidad cercana para disfrutar postres a precios accesibles.'],
  ['paleta 1', 'Paleta 1', 'Cacao y caramelo', 'Los marrones evocan el chocolate del ChocoMonito y el café del tiramisú. El caramelo y la crema recuerdan el hojaldre dorado: una combinación cálida y artesanal para quienes buscan un antojo clásico o una pausa con café.'],
  ['paleta 2', 'Paleta 2', 'Chocolate, crema y rosa', 'Inspirada en tu referencia: el marrón chocolate aporta la calidez de la repostería, el crema recuerda la vainilla y el rosa suave añade un detalle dulce y divertido. Una combinación cercana para compartir postres en familia, con texto chocolate sobre los acentos rosados.'],
  ['paleta 3', 'Paleta 3', 'Selva y plátano', 'El verde profundo retoma la jungla y el personaje monito; el amarillo plátano añade energía tropical. Los fondos suaves mantienen una sensación fresca y amable, apropiada para una repostería en Montería con una personalidad lúdica.']
];
function contraste(a, b) {
  const luminancia = hex => {
    const rgb = hex.match(/[a-f\d]{2}/gi).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  const valores = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (valores[0] + .05) / (valores[1] + .05);
}
async function cargarPaletas() {
  const contenedor = document.getElementById('propuestas');
  try {
    const respuesta = await fetch('paletas.json');
    if (!respuesta.ok) throw new Error('No se pudo leer el archivo');
    const colores = await respuesta.json();
    const fragmento = document.createDocumentFragment();
    for (const [clave, nombre, concepto, razon] of propuestas) {
      const paleta = colores[clave];
      const variables = ['--color-primario', '--color-fondo', '--color-fondo-secundario', '--color-titulos', '--color-secundario', '--color-parrafos', '--paleta-suave'];
      if (!paleta || variables.some(variable => !/^#[\da-f]{6}$/i.test(paleta[variable]))) throw new Error('Paleta incompleta');
      const articulo = document.createElement('article');
      articulo.className = 'propuesta';
      articulo.id = clave.replace(' ', '-');
      variables.forEach(variable => articulo.style.setProperty(variable, paleta[variable]));
      articulo.innerHTML = `<header class="propuesta-cabecera"><h2>${nombre}</h2><span>${concepto}</span></header>
        <div class="vista"><div class="vista-texto"><span class="vista-marca">PANMONITO · HECHO CON DEDICACIÓN</span><h3>Una jungla de sabores en cada bocado.</h3><p>Chocolate, café y mucha imaginación. Descubre nuestros postres y dale un toque dulce a tu día.</p><a class="vista-boton" href="index.html#catalogo">Explorar nuestros productos →</a></div><figure class="vista-imagen"><img src="imagenes/sobrenosotros-imagen.webp" alt="Imagen de presentación de la repostería Panmonito" width="600" height="400"></figure></div>
        <div class="detalle"><p class="razon">${razon}</p><dl class="muestras"></dl><p class="contraste"></p></div>`;
      const muestras = articulo.querySelector('.muestras');
      variables.forEach(variable => {
        const muestra = document.createElement('div');
        muestra.className = 'muestra';
        const color = document.createElement('div');
        color.className = 'color';
        color.style.backgroundColor = paleta[variable];
        color.setAttribute('aria-hidden', 'true');
        const etiqueta = document.createElement('dt');
        etiqueta.textContent = variable;
        const codigo = document.createElement('dd');
        codigo.textContent = paleta[variable];
        muestra.append(color, etiqueta, codigo);
        muestras.append(muestra);
      });
      const pares = [
        ['texto de portada', '#FFFFFF', paleta['--color-fondo']],
        ['botón', paleta['--color-parrafos'], paleta['--color-secundario']],
        ['títulos', paleta['--color-titulos'], paleta['--color-fondo-secundario']],
        ['párrafos', paleta['--color-parrafos'], paleta['--color-fondo-secundario']],
        ['muestras', paleta['--color-parrafos'], paleta['--paleta-suave']],
        ['insignia de portada', paleta['--color-parrafos'], paleta['--color-secundario']]
      ];
      const resultados = pares.map(([uso, a, b]) => [uso, contraste(a, b)]);
      articulo.querySelector('.contraste').textContent = `${resultados.every(([, valor]) => valor >= 4.5) ? 'Contraste AA para texto normal' : 'Revisar contraste'} · ${resultados.map(([uso, valor]) => `${uso}: ${valor.toFixed(2)}:1`).join(' · ')}. El botón usa texto oscuro para conservar la legibilidad.`;
      fragmento.append(articulo);
    }
    contenedor.replaceChildren(fragmento);
  } catch (error) {
    contenedor.replaceChildren();
    const mensaje = document.createElement('p');
    mensaje.setAttribute('role', 'alert');
    mensaje.textContent = 'No se pudieron cargar las propuestas. Abre esta página desde un servidor web local y comprueba que paletas.json esté en la misma carpeta.';
    contenedor.append(mensaje);
  }
}
cargarPaletas();
