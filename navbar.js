// =========================================================
// SCRIPT INTERACTIVO DEL NAVBAR (Menú móvil responsive y scroll)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('barra-navegacion') || document.querySelector('.navbar');
  const toggleBtn = document.getElementById('navbar-toggle') || document.querySelector('.navbar-toggle');
  const menu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Control del menú desplegable móvil
  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle('active');
      toggleBtn.classList.toggle('active');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Cerrar el menú móvil al hacer clic en cualquier enlace
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Cerrar el menú si se hace clic fuera del menú
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !toggleBtn.contains(e.target)) {
        menu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Cambio dinámico de color al hacer scroll pasando el Hero
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Ejecución inicial
  }
});