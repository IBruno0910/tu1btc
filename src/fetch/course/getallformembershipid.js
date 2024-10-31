document.addEventListener('DOMContentLoaded', () => {
  const coursesContainer = document.getElementById('courses-container');

  // Función para renderizar los cursos
  function renderCourses(courses) {
      coursesContainer.innerHTML = ''; // Limpia el contenedor
      courses.forEach(course => {
          const courseCard = document.createElement('div');
          courseCard.className = 'course-card'; // Clase CSS para estilizar la card

          // Verifica si course.image existe y construye la URL
          const imageUrl = course.image
              ? (course.image.startsWith('http') ? course.image : `https://tu1btc.com/api/course/image/${course.image}`)
              : 'ruta/de/imagen_por_defecto.jpg'; // Imagen de respaldo si no existe

          // Agrega el contenido de la card
          courseCard.innerHTML = `
              <img src="${imageUrl}" alt="${course.name}" class="course-image">
              <h3 class="course-title">${course.name}</h3>
          `;

          courseCard.addEventListener('click', () => {
            window.location.href = `course-details.html?id=${course.id}`;
        });

          coursesContainer.appendChild(courseCard);
      });
  }

  // Obtener el token de authToken
  const token = localStorage.getItem('authToken');

  // Fetch al endpoint para obtener los cursos
  fetch('https://tu1btc.com/api/course/getAllForMembershipId', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Usa el token de authToken
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      renderCourses(data); // Llama a la función para mostrar los cursos
  })
  .catch(error => console.error('Error fetching courses:', error));
});
