document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("dark-mode-toggle");
  const modeIcon = document.getElementById("mode-icon");
  const body = document.body;

  // Comprobar el modo guardado en localStorage
  if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      modeIcon.classList.add("icon-sun"); // Inicializar icono de sol si es modo oscuro
  }

  // Alternar modo oscuro/claro
  toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      modeIcon.classList.add("icon-transition"); // Agregar clase de transición
      
      if (body.classList.contains("dark-mode")) {
          modeIcon.classList.remove("icon-moon");
          modeIcon.classList.add("icon-sun");
          localStorage.setItem("theme", "dark");
      } else {
          modeIcon.classList.remove("icon-sun");
          modeIcon.classList.add("icon-moon");
          localStorage.setItem("theme", "light");
      }

      // Remover la clase de rotación después de la animación para evitar repeticiones
      setTimeout(() => modeIcon.classList.remove("icon-transition"), 500);
  });
});
