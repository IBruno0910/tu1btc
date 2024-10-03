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
    const container = document.querySelector('#my-courses-container');
    
    data.forEach(course => {
        const imageUrl = `https://tu1btc.com/api/course/image/${course.image}`; // Asegúrate de que esta URL es correcta
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');
        courseCard.innerHTML = `
            <img src="${imageUrl}" alt="${course.name}">
            <div class="card-content">
                <h3>${course.name}</h3>
            </div>
        `;
        
        // Hacer que toda la tarjeta redirija al curso
        courseCard.onclick = () => {
            window.location.href = `course.html?id=${course.id}`;
        };
        
        container.appendChild(courseCard);
    });
})
.catch(error => {
    console.error('Error al obtener los cursos:', error);
});
