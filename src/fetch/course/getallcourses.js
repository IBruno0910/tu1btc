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

    if (!response.ok) {
      if (response.status === 402) {
        // Mostrar mensaje específico para error de pago
        throw new Error('El acceso al curso requiere un pago. Por favor, actualiza tu suscripción.');
      } else {
        throw new Error('Error al obtener los detalles del curso');
      }
    }

    const courseDetails = await response.json();
    displayCourseDetails(courseDetails);
  } catch (error) {
    console.error('Error al hacer el fetch:', error);

    // Mostrar el mensaje de error en el HTML con un botón
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <p style="padding:10px">${error.message}</p>
        <button id="membership-btn" style="padding: 10px 20px; background-color: #F39000; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Membresías
        </button>
      `;
      errorContainer.style.display = 'block'; // Asegúrate de que sea visible

      // Agregar redirección al botón
      const membershipBtn = document.getElementById('membership-btn');
      membershipBtn.addEventListener('click', () => {
        window.location.href = 'membresias.html'; // Cambia esta URL si es diferente
      });
    }
  }
}



// Función para enviar la reseña del curso
async function submitFeedback(courseId, description, rate) {
  try {
    // Convertir rate a string en lugar de número
    const feedbackData = {
      description: description,
      rate: rate.toString(), // Convertimos rate a string aquí
      idCourse: courseId,
    };

    console.log('Datos de la reseña que se están enviando:', feedbackData); // Registro de depuración

    const response = await fetch(`https://tu1btc.com/api/course/feedback/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) throw new Error('Error al enviar la reseña');

    const result = await response.json();
    console.log('Reseña enviada con éxito:', result);

    // Recargar los detalles del curso para mostrar la nueva reseña
    fetchCourseDetails(courseId);
  } catch (error) {
    console.error('Error al enviar la reseña:', error);
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
        <h3 class="course-plan-title">Plan de Estudio:</h3>
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
      submitFeedback(course.id, description, rate); // Llamada a submitFeedback
    });
  } else {
    console.error('');
  }
}

// Ejecuta el fetch cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  fetchCourseDetails(courseId);
});
