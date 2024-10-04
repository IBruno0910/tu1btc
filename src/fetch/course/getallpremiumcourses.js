const token = localStorage.getItem('authToken');

// Fetch para obtener los cursos premium
fetch('https://tu1btc.com/api/course/getAllNoPremiumCourses', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Incluye el token si es necesario
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    displayCourses(data); // Llama a la función para mostrar los datos
})
.catch(error => {
    console.error('Error fetching premium courses:', error);
});

// Función para mostrar los cursos en el HTML
function displayCourses(courses) {
    const coursesContainer = document.getElementById('coursesContainer'); // Asegúrate de que este contenedor existe en tu HTML
    
    courses.forEach(course => {
        const imageUrl = `https://tu1btc.com/api/course/image/${course.image}`; // Asegúrate de que esta URL es correcta
        const courseCard = document.createElement('div');
        courseCard.classList.add('element', 'element-1'); // Agrega las clases necesarias

        // Contenido de la tarjeta (solo imagen y título)
        courseCard.innerHTML = `
            <img class="img-card" src="${course.image}" alt="${course.name}">
            <h3 class="card-name">${course.name}</h3>
        `;

        // Agregar evento de clic en toda la tarjeta
        courseCard.addEventListener('click', () => {
            window.location.href = `/src/coursepremium.html?id=${course.id}`;
        });

        // Agregar la tarjeta al contenedor de cursos
        coursesContainer.appendChild(courseCard);
    });
}
