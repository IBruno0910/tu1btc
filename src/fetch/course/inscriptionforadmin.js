// inscripcionPremium.js

function inscribirCursoPremium(courseId) {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId'); // Asegúrate de que tienes el ID del usuario

    const url = 'https://tu1btc.com/api/course/inscriptionForAdmin';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            idCourse: courseId,
            idUser: userId // Aquí enviamos el ID del usuario
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Inscripción exitosa:', data);
        alert('Te has inscrito en el curso premium exitosamente!');
    })
    .catch(error => {
        console.error('Error al inscribirse en el curso premium:', error);
        alert('Hubo un error al inscribirte en el curso premium. Intenta nuevamente.');
    });
}
