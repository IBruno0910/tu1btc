// Archivo: src/fetch/courses/premiumCourses.js
const token = localStorage.getItem('authToken');

async function fetchPremiumCourses() {
  try {
    const response = await fetch('https://tu1btc.com/api/course/getAllPremiumCoursesInfo', {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) throw new Error('Error al obtener los cursos premium');
    
    const courses = await response.json();
    displayCourses(courses);
  } catch (error) {
    console.error('Error al hacer el fetch:', error);
  }
}

function displayCourses(courses) {
  const container = document.getElementById('premiumCoursesContainer'); // Contenedor en tu HTML
  container.innerHTML = '';

  courses.forEach(course => {
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card';

    // Crea la estructura de la tarjeta
    courseCard.innerHTML = `
      <img src="https://tu1btc.com/images/${course.image}" alt="${course.name}" class="course-image" />
      <h2 class="course-title">${course.name}</h2>
      <p class="course-description">${course.description}</p>
      <h3 class="course-plan-title">Plan de Estudios:</h3>
      <ul class="study-plan">
        ${course.study_plan.map(plan => `
          <li>
            <h4>${plan.name}</h4>
            <ul class="section-list">
              ${plan.sections.map(section => `
                <li>
                  <strong>${section.name}</strong>
                  <ul class="video-list">
                    ${section.videos.map(video => `
                      <li>${video.title} - Duración: ${video.duration} minutos</li>
                    `).join('')}
                  </ul>
                </li>
              `).join('')}
            </ul>
          </li>
        `).join('')}
      </ul>
      <h3 class="subscription-title">Suscripciones Válidas:</h3>
      <ul class="subscription-list">
        ${course.validSubscriptions.map(sub => `<li>${sub.name}</li>`).join('')}
      </ul>
      <h3 class="feedback-title">Reseñas:</h3>
      <ul class="feedback-list">
        ${course.feedback.map(feed => `
          <li>
            <p>${feed.description}</p>
            <span>Calificación: ${feed.rate} estrellas</span>
          </li>
        `).join('')}
      </ul>
    `;
    
    container.appendChild(courseCard);
  });
}

// Ejecuta el fetch cuando cargue la página
window.addEventListener('load', fetchPremiumCourses);
