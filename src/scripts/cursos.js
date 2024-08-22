const button = document.querySelector('button[aria-expanded]');
const menu = document.querySelector('.relative > div'); // Selecciona el menú que quieres mostrar/ocultar

button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    
    if (isExpanded) {
        // Ocultar el menú
        menu.classList.remove('opacity-100', 'translate-y-0');
        menu.classList.add('opacity-0', 'translate-y-1');
    } else {
        // Mostrar el menú
        menu.classList.remove('opacity-0', 'translate-y-1');
        menu.classList.add('opacity-100', 'translate-y-0');
    }
});