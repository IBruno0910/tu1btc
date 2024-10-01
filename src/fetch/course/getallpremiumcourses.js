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
    console.error('Error fetching non-premium courses:', error);
});

// Función para mostrar los cursos en el HTML
function displayCourses(courses) {
    const coursesContainer = document.getElementById('coursesContainer'); // Asegúrate de que este contenedor existe en tu HTML
    // Iterar sobre los cursos y crear los elementos HTML
    courses.forEach(course => {
        const courseCard = document.createElement('div');

        courseCard.innerHTML = `
        <div class=" element element-1">
            <img class="img-card" src="${course.image}" alt="${course.name}">
            <h3 class="card-name">${course.name}</h3>
            <p class="card-desc">${course.description}</p>
            <div class="card-div">
                <button class="card-insc" onclick="window.location.href='/src/coursepremium.html?id=${course.id}'">Inscribirse</button>
                <p style="color:#FF9000" class="card-price">$${course.price}</p>
            </div>
        </div>
      `;

        coursesContainer.appendChild(courseCard); // Agregar la tarjeta del curso al contenedor
    });
}