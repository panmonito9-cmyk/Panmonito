// No sustituir la foto de un producto por la de otro.
document.querySelectorAll('.catalogo-imagen img').forEach(imagen => {
  const mostrarAviso = () => {
    const aviso = document.createElement('span');
    aviso.className = 'imagen-no-disponible';
    aviso.textContent = 'Pronto tendremos la foto de este antojo';
    imagen.replaceWith(aviso);
  };
  if (imagen.complete && !imagen.naturalWidth) mostrarAviso();
  else imagen.addEventListener('error', mostrarAviso, { once: true });
});
