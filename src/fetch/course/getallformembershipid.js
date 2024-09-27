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
    membershipCoursesContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos cursos

    // Iterar sobre los cursos y crear los elementos HTML
    courses.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = 'course-card bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300';

        courseCard.innerHTML = `
            <img src="${course.image}" alt="${course.name}" class="w-full h-40 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold mt-2">${course.name}</h3>
                <p class="text-gray-600">${course.description}</p>
                <p class="text-gray-800 font-bold mt-2">$${course.price}</p>
            </div>
        `;

        membershipCoursesContainer.appendChild(courseCard); // Agregar la tarjeta del curso al contenedor
    });
}
