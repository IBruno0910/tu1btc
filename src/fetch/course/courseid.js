document.addEventListener('DOMContentLoaded', () => {
    const courseDetailsContainer = document.getElementById('course-details-container');
    const params = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('authToken');
    const courseId = new URLSearchParams(window.location.search).get('id');

  
    let vimeoPlayer = null;
  
    // Cargar contenido del curso
    fetch(`https://tu1btc.com/api/course/${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
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

                <div class="course-progress">
                    <h3>Progreso del curso</h3>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="progress-bar"></div>
                    </div>
                    <p id="progress-text">0% completado</p>
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
                                                    ${video.type === 'Video' ? `<span class="video-duration">${video.duration} mins</span>` : ''}
                                                    ${
                                                        video.type === 'Video'
                                                        ? `<button class="video-button" data-video-id="${video.link}" data-video-db-id="${video.id}">Ver Video</button>`
                                                        : `<a class="pdf-button" href="${video.link}" target="_blank" data-video-db-id="${video.id}">Abrir PDF</a>`
                                                    }
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </li>
                                `).join('')}
                            </ul>
                        </li>
                    `).join('')}
                </ul>
  
                <div class="feedback-form-section">
                  <h3 class="feedback-form-title">Deja tu reseña:</h3>
                  <form id="feedbackForm" class="feedback-form">
                      <textarea id="feedbackDescription" placeholder="Escribe tu reseña aquí..." required class="feedback-textarea"></textarea>
                      <input type="number" id="feedbackRate" min="1" max="5" placeholder="Calificación (1-5)" required class="feedback-rate-input" />

                      <!-- Contenedor del reCAPTCHA -->
                      <div id="recaptcha-container"></div>

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

        // Cargar y renderizar reCAPTCHA
        grecaptcha.render('recaptcha-container', {
            sitekey: '6LfEA7IqAAAAALp4WmhnbgbojTtgw63waY8H7mqm' // Reemplaza con tu clave pública de reCAPTCHA
        });
        
        

        document.querySelectorAll('button.video-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const videoId = event.target.getAttribute('data-video-id');
                const videoDbId = event.target.getAttribute('data-video-db-id');
                openVideoModal(videoId);
                startVideo(videoDbId);
            });
        });
        

        document.querySelectorAll('.pdf-button').forEach(link => {
            link.addEventListener('click', (event) => {
                const videoDbId = event.target.getAttribute('data-video-db-id');
                startVideo(videoDbId); // Para registrar que el usuario abrió el PDF
        
                // Simular finalización inmediata del archivo PDF
                setTimeout(() => {
                    finishVideo(videoDbId);  // Aquí NO necesitas el userId ni el studyPlan porque ya lo tenés
                }, 2000); // Podés ajustar el tiempo si querés darle unos segundos
            });
        });

  
            // Agregar evento para enviar feedback
    const form = document.getElementById('feedbackForm');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevenir el envío del formulario

            // Verificar si el reCAPTCHA ha sido completado
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert("Por favor, verifica que no eres un robot.");
                return; // No continuar si el reCAPTCHA no está completado
            }

            // Si el reCAPTCHA está completo, proceder con el envío
            const description = document.getElementById('feedbackDescription').value;
            const rate = document.getElementById('feedbackRate').value;
            submitFeedback(course.id, description, rate);
        });
    } else {
        console.error('Formulario de feedback no encontrado');
    }

    calculateAndRenderProgress(course.study_plan);

    }

    function calculateAndRenderProgress(studyPlan) {
        let totalVideos = 0;
        let completedVideos = 0;
    
        studyPlan.forEach(plan => {
            plan.sections.forEach(section => {
                section.videos.forEach(video => {
                    if (video.type === 'Video') {
                        totalVideos++;
                        const played = video.played_video || [];
                        console.log(`Video: ${video.title}`, played);
                        if (played.some(pv => pv.isEnd === true || pv.isEnd === "true")) {
                            completedVideos++;
                        }
                    }
                });
            });
        });
    
        const percent = totalVideos === 0 ? 0 : Math.round((completedVideos / totalVideos) * 100);
    
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
    
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    
        if (progressText) {
            progressText.textContent = `${percent}% completado`;
        }
    }
    
    let currentPlayedVideoId = null;

    function startVideo(videoDbId) {
        fetch('https://tu1btc.com/api/course/startVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ idVideo: videoDbId }),
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al iniciar el video");
            return res.json();
        })
        .then(data => {
            console.log("Video iniciado:", data);
            currentPlayedVideoId = data.id;

            const savedTime = parseFloat(data.seconds || 0); 

            if (vimeoPlayer && !isNaN(savedTime)) {
                vimeoPlayer.setCurrentTime(savedTime);
            }

            let lastUpdate = 0;

            vimeoPlayer.on('timeupdate', e => {
            const now = Date.now();
            if (now - lastUpdate > 5000) { // cada 5 segundos
                updateVideoTime(currentPlayedVideoId, e.seconds);
                lastUpdate = now;
            }
        });

            vimeoPlayer.on('ended', () => {
                finishVideo(currentPlayedVideoId, true);
            });
        })

        .catch(err => console.error("Error al iniciar el video:", err));
    }
        
  
  function updateVideoTime(videoDbId, seconds) {
    const videoId = String(videoDbId);  // Asegúrate de que `videoDbId` sea un UUID válido
    const timeInSeconds = String(seconds);  // Convierte el valor de `seconds` a string
  
    const payload = {
        id: videoId,  // El ID debe ser un UUID válido
        seconds: timeInSeconds  // El tiempo debe ser un número en formato de cadena
    };
  
    console.log("Payload enviado:", payload);  // Verifica que los valores sean correctos
  
    fetch('https://tu1btc.com/api/course/updateTime', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Si es necesario, incluye tu token de autenticación
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error('Error de servidor:', errorData);
                throw new Error(`Error al actualizar el tiempo: ${errorData.message || response.statusText}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Tiempo de video actualizado:', data);
    })
    .catch(error => {
        console.error('Error al actualizar el tiempo de vista del video:', error.message);
    });
  }

  
function finishVideo(videoDbId, isEnd = true) {
    const payload = {
        id: videoDbId,
        isEnd: isEnd ? "true" : "false"
    };
    console.log("Payload enviado a finishVideo:", payload);

    fetch('https://tu1btc.com/api/course/video/finish', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    })
    .then(res => {
        if (!res.ok) throw new Error("Error al finalizar el video.");
        return res.json();
    })
    .then(() => {
        console.log("Video finalizado");
        // Esperamos 1 segundo antes de volver a cargar el curso actualizado
        setTimeout(() => {
            fetch(`https://tu1btc.com/api/course/${courseId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(updatedCourse => {
                console.log("Course actualizado después de finalizar video:", updatedCourse);
                calculateAndRenderProgress(updatedCourse.study_plan);
            })
            .catch(err => console.error("Error al refrescar los detalles del curso:", err));
        }, 1000);
    })
    .catch(err => console.error("Error finalizando el video:", err));
} 

function updateUIWithNewCourses(courses) {
    console.log('Actualizando UI con los cursos:', courses);
    
    const course = courses.find(c => c.id === courseId);
    if (course) {
        calculateAndRenderProgress(course.study_plan);
    }
}
window.updateUIWithNewCourses = updateUIWithNewCourses;

  
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
  
    // Función para abrir el modal con el video
    function openVideoModal(videoId) {
        // Crear el modal en el DOM
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-btn">&times;</span>
                <div id="video-player-container"></div>
            </div>
        `;
        document.body.appendChild(modal);
  
        const closeButton = modal.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            closeVideoModal(modal);
        });
  
        // Cerrar modal al hacer clic fuera del contenido del modal
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeVideoModal(modal);
            }
        });
  
        // Cargar el video de Vimeo
        loadVimeoVideo(videoId);
  
        // Mostrar el modal
        modal.style.display = 'flex';  // Usamos 'flex' para centrar el modal correctamente
    }
  
    // Función para cerrar el modal y destruir el reproductor de Vimeo
    function closeVideoModal(modal) {
        modal.remove();  // Cerrar el modal
  
        if (vimeoPlayer) {
            vimeoPlayer.destroy().then(() => {
                console.log("Reproductor destruido.");
                vimeoPlayer = null;  // Asegurarse de que el reproductor esté limpio
            }).catch(error => console.error('Error al destruir el reproductor de Vimeo:', error));
        }
    }
  
    function loadVimeoVideo(videoId) {
        currentVideoId = videoId;
        const videoContainer = document.getElementById('video-player-container');
        
        // Ajustar el tamaño del contenedor del video para hacerlo más grande
        videoContainer.style.width = '100%';  // Mantiene la adaptabilidad
        videoContainer.style.maxWidth = '1000px'; // Establece un ancho máximo
        videoContainer.style.height = 'auto';  // Ajusta la altura automáticamente para mantener la proporción
    
        if (vimeoPlayer) {
            vimeoPlayer.loadVideo(videoId).then(function() {
                console.log(`Reproduciendo video de Vimeo: ${videoId}`);
            }).catch(function(error) {
                console.error('Error al cargar el video de Vimeo:', error);
            });
    
            vimeoPlayer.on('ended', () => {
                finishVideo(currentPlayedVideoId, true);
            });
            
    
        } else {
            vimeoPlayer = new Vimeo.Player(videoContainer, {
                id: videoId,
                responsive: true // Habilita la respuesta automática
            });
    
            vimeoPlayer.on('play', function() {
                console.log(`Video de Vimeo ${videoId} está en reproducción`);
            });       
        }
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
            console.error('Error al obtener los detalles del curso:', error);
        }
    }

    window.addEventListener('beforeunload', function() {
        if (vimeoPlayer) {
            const currentTime = vimeoPlayer.getCurrentTime();  // Obtén el tiempo actual del video
            updateVideoTime(videoDbId, currentTime);  // Guarda el tiempo actual
        }
    });

  });
  