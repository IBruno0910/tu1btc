const token = localStorage.getItem('authToken');

// Función para obtener los detalles del curso
async function fetchCourseDetails(courseId) {
  try {
    const response = await fetch(`https://tu1btc.com/api/course/${courseId}`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al obtener los detalles del curso');

    const courseDetails = await response.json();
    displayCourseDetails(courseDetails);
  } catch (error) {
    console.error('Error al hacer el fetch:', error);
  }
}

// Función para mostrar los detalles del curso en el DOM
function displayCourseDetails(course) {
  const container = document.getElementById('courseDetailsContainer');
  container.innerHTML = `
    <div class="course-details">
      <h2 class="course-title">${course.name}</h2>
      <div class="course-header">
        <img src="https://tu1btc.com/api/course/image/${course.image}" alt="${course.name}" class="course-image" />
        <p class="course-description">${course.description}</p>
      </div>

      <div class="study-plan-section">
        <h3 class="course-plan-title">Plan de Estudios:</h3>
        <ul class="study-plan">
          ${course.study_plan.map(plan => `
            <li class="study-plan-item">
              <h4 class="plan-name">${plan.name}</h4>
              <ul class="section-list">
                ${plan.sections.map(section => `
                  <li class="section-item">
                    <strong class="section-name">${section.name}</strong>
                    <ul class="video-list">
                      ${section.videos.map(video => `
                        <li class="video-item">${video.title} - <span class="video-duration">Duración: ${video.duration} minutos</span></li>
                      `).join('')}
                    </ul>
                  </li>
                `).join('')}
              </ul>
            </li>
          `).join('')}
        </ul>
      </div>

      <div class="feedback-form-section">
        <h3 class="feedback-form-title">Deja tu reseña:</h3>
        <form id="feedbackForm" class="feedback-form">
          <textarea id="feedbackDescription" placeholder="Escribe tu reseña aquí..." required class="feedback-textarea"></textarea>
          <input type="number" id="feedbackRate" min="1" max="5" placeholder="Calificación (1-5)" required class="feedback-rate-input" />
          <button type="submit" class="feedback-submit-btn">Enviar Reseña</button>
        </form>
      </div>

      <div class="feedback-section">
        <h3 class="feedback-title">Reseñas:</h3>
        <ul class="feedback-list">
          ${course.feedback.map(feed => `
            <li class="feedback-item">
              <p class="feedback-description">${feed.description}</p>
              <span class="feedback-rate">Calificación: ${feed.rate} estrellas</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;

  // Agregar listener al formulario solo si se ha creado
  const form = document.getElementById('feedbackForm');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const description = document.getElementById('feedbackDescription').value;
      const rate = document.getElementById('feedbackRate').value;
      submitFeedback(course.id, description, rate);
    });
  } else {
    console.error('Formulario no encontrado');
  }
}

// Ejecuta el fetch cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  fetchCourseDetails(courseId);
});
