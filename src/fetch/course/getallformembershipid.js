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
        const courseCard = document.createElement('div');

        courseCard.innerHTML =`
        <div class=" element element-1">
            <img class="img-card" src="${course.image}" alt="${course.name}">
            <h3 class="card-name">${course.name}</h3>
            <p class="card-desc">${course.description}</p>
            <div class="card-div">
                <button href="course.html" class="card-insc">Inscribirse</button>
                <p style="color:#FF9000" class="card-price">$${course.price}</p>
            </div>
        </div>
      `;
        membershipCoursesContainer.appendChild(courseCard); // Agregar la tarjeta del curso al contenedor
    });
}
