window.addEventListener("load", function() {
    // Tiempo mínimo en milisegundos que se mostrará el preloader (por ejemplo, 1.5 segundos)
    const tiempoMinimo = 1500;

    // Obtén el tiempo de carga inicial
    const tiempoCargaInicial = Date.now();

    // Función para ocultar el preloader después de cargar la página y cumplir el tiempo mínimo
    function ocultarPreloader() {
        const tiempoActual = Date.now();
        const tiempoTranscurrido = tiempoActual - tiempoCargaInicial;

        // Si ya ha pasado el tiempo mínimo, oculta el preloader
        if (tiempoTranscurrido >= tiempoMinimo) {
            document.getElementById("preloader").style.display = "none";
            document.getElementById("content").style.display = "block";
        } else {
            // Si no ha pasado el tiempo mínimo, espera el tiempo restante
            setTimeout(ocultarPreloader, tiempoMinimo - tiempoTranscurrido);
        }
    }

    // Llama a la función para ocultar el preloader
    ocultarPreloader();
});
