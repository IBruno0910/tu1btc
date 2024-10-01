function inscribirCurso(courseId) {
    const token = localStorage.getItem('authToken');
    const url = 'https://tu1btc.com/api/course/inscription';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Si se requiere autenticación
        },
        body: JSON.stringify({ idCourse: courseId }) // Aquí envías el ID del curso
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Inscripción exitosa:', data);
        alert('Te has inscrito en el curso exitosamente!');
    })
    .catch(error => {
        console.error('Error al inscribirse en el curso:', error);
        alert('Hubo un error al inscribirte en el curso. Intenta nuevamente.');
    });
}
