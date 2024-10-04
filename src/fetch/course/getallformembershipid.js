// Recupera el token de localStorage
const token = localStorage.getItem('authToken'); // Asegúrate de que el token está guardado

// Recupera el ID de la membresía (si es necesario)
const membershipId = localStorage.getItem('membershipId'); // Asegúrate de que el ID de la membresía está guardado

// Fetch para obtener los cursos para la membresía
fetch(`https://tu1btc.com/api/course/getAllForMembershipId?membershipId=${membershipId}`, {
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
    displayMembershipCourses(data); // Llama a la función para mostrar los datos
})
.catch(error => {
    console.error('Error fetching courses for membership:', error);
});

// Función para mostrar los cursos en el HTML
function displayMembershipCourses(courses) {
    const membershipCoursesContainer = document.getElementById('membershipCoursesContainer'); // Asegúrate de que este contenedor existe en tu HTML

    // Iterar sobre los cursos y crear los elementos HTML
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
            window.location.href = `/src/course.html?id=${course.id}`;
        });

        // Agregar la tarjeta al contenedor de cursos
        membershipCoursesContainer.appendChild(courseCard);
    });
}
