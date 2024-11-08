document.addEventListener('DOMContentLoaded', () => {
    const courseDetailsContainer = document.getElementById('course-details-container');
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const token = localStorage.getItem('authToken');

    let vimeoPlayer = null;
    let currentVideoId = null;

    // Cargar contenido del curso
    fetch(`https://tu1btc.com/api/course/${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(course => {
        renderCourseDetails(course);
    })
    .catch(error => console.error('Error fetching course details:', error));

    // Renderizar detalles del curso y formulario de feedback
    function renderCourseDetails(course) {
        courseDetailsContainer.innerHTML = `
            <div class="course-details">
                <h2 class="course-title">${course.name}</h2>
                <div class="course-header">
                    <img src="https://tu1btc.com/api/course/image/${course.image}" alt="${course.name}" class="course-image" />
                    <p class="course-description">${course.description}</p>
                </div>
                <h3 class="course-plan-title">Plan de estudio:</h3>
                <ul>
                    ${course.study_plan.map(plan => `
                        <li class="study-plan-item">
                            <h4 class="plan-name">${plan.name}</h4>
                            <ul class="section-list">
                                ${plan.sections.map(section => `
                                    <li class="section-item">
                                        <span class="section-name">${section.name}</span>
                                        <ul class="video-list">
                                            ${section.videos.map(video => `
                                                <li class="video-item">
                                                    <span class="video-title">${video.title}</span> 
                                                    <span class="video-duration">${video.duration} mins</span>
                                                    <button class="video-button" data-video-id="${video.link}" data-video-db-id="${video.id}">Ver Video</button>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </li>
                                `).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>

                <div id="video-player-container"></div> <!-- Contenedor del video aquí, abajo de Plan de estudio -->

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

        // Agregar eventos a los botones de video
        document.querySelectorAll('.video-button').forEach(button => {
            button.addEventListener('click', () => {
                const videoId = button.getAttribute('data-video-id');
                const videoDbId = button.getAttribute('data-video-db-id');
                startVideo(videoDbId);
                loadVimeoVideo(videoId);
            });
        });

        // Agregar evento para enviar feedback
        const form = document.getElementById('feedbackForm');
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                const description = document.getElementById('feedbackDescription').value;
                const rate = document.getElementById('feedbackRate').value;
                submitFeedback(course.id, description, rate);
            });
        } else {
            console.error('Formulario de feedback no encontrado');
        }
    }

    // Enviar la reseña del curso
    async function submitFeedback(courseId, description, rate) {
        try {
            const feedbackData = {
                description: description,
                rate: rate.toString(),
                idCourse: courseId,
            };

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

   // Cambia la inicialización de Vimeo Player para que ocupe más espacio y se ajuste al diseño:
   function loadVimeoVideo(videoId) {
    currentVideoId = videoId;
    const videoContainer = document.getElementById('video-player-container');
    
    // Ajustar el tamaño del contenedor del video para hacerlo más grande
    videoContainer.style.width = '100%';  // Mantiene la adaptabilidad
    videoContainer.style.maxWidth = '1000px'; // Establece un ancho máximo
    videoContainer.style.height = '500px';  // Mantén una altura fija, ajusta según necesites

    if (vimeoPlayer) {
        vimeoPlayer.loadVideo(videoId).then(function() {
            console.log(`Reproduciendo video de Vimeo: ${videoId}`);
        }).catch(function(error) {
            console.error('Error al cargar el video de Vimeo:', error);
        });
    } else {
        vimeoPlayer = new Vimeo.Player(videoContainer, {
            id: videoId,
            width: '1000px',   // Mantiene la responsividad
            height: 500      // Establece una altura fija
        });

        vimeoPlayer.on('play', function() {
            console.log(`Video de Vimeo ${videoId} está en reproducción`);
        });
    }
}



    // Iniciar el video
    function startVideo(videoId) {
        fetch('https://tu1btc.com/api/course/startVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idVideo: videoId })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(`Video ${videoId} iniciado`);
        })
        .catch(error => console.error('Error al iniciar el video:', error));
    }

    // Recargar los detalles del curso con feedback actualizado
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
            renderCourseDetails(courseDetails);
        } catch (error) {
            console.error('Error al hacer el fetch:', error);
        }
    }
});
