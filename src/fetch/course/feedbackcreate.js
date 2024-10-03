document.getElementById('feedback-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const rate = document.getElementById('rate').value;

    // Extraer el id del curso desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id'); // Extrae el ID del curso de la URL
    
    // Validación simple
    if (!description || !courseId || rate < 1 || rate > 5) {
        alert('Verifica que los datos sean correctos: Reseña no vacía, calificación entre 1 y 5.');
        return;
    }

    const token = localStorage.getItem('authToken');
    const url = 'https://tu1btc.com/api/course/feedback/create';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            description: description,
            rate: rate.toString(),  // Convertimos rate a string
            idCourse: courseId     // Usamos el idCourse desde la URL
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(`Error: ${response.status} - ${errorData.message || 'Solicitud inválida'}`);
            });
        }
        return response.json();
    })
    .then(data => {
        alert('¡Reseña enviada exitosamente!');
        console.log('Reseña creada:', data);
    })
    .catch(error => {
        // Manejo de errores general
        console.error('Error al enviar la reseña:', error);
        alert(`Hubo un error al enviar la reseña. Detalles: ${error.message}`);
    });
});
