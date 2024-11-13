document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const modeIcon = document.getElementById("mode-icon");
    const body = document.body;
  
    // Comprobar el modo guardado en localStorage
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      modeIcon.setAttribute("name", "sunny-outline");
    }
  
    // Alternar modo oscuro/claro
    toggleButton.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      
      // Cambiar el icono según el modo actual
      if (body.classList.contains("dark-mode")) {
        modeIcon.setAttribute("name", "sunny-outline");
        localStorage.setItem("theme", "dark");
      } else {
        modeIcon.setAttribute("name", "moon-outline");
        localStorage.setItem("theme", "light");
      }
    });
  });
  