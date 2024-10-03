const token = localStorage.getItem('authToken');
fetch('https://tu1btc.com/api/course/findMyAllCourses', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Si se requiere autenticación
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    const container = document.querySelector('#my-courses-container tbody');
    data.forEach(course => {
        const courseRow = document.createElement('tr');
        courseRow.innerHTML = `
            <td>${course.name}</td>
            <td>${course.description}</td>
            <td><button class="button" onclick="window.location.href='course.html?id=${course.id}'">Ingresar</button></td>
        `;
        container.appendChild(courseRow);
    });
})
.catch(error => {
    console.error('Error al obtener las inscripciones:', error);
});
