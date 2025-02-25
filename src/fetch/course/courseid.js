document.addEventListener('DOMContentLoaded', () => {
    const courseDetailsContainer = document.getElementById('course-details-container');
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const token = localStorage.getItem('authToken');
  
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
            const savedTime = course.videos.find(video => video.id === videoDbId).savedTime;  // Suponiendo que guardes 'savedTime' en la base de datos
            if (vimeoPlayer) {
                vimeoPlayer.setCurrentTime(savedTime);  // Configura el tiempo donde dejó el usuario
            }
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
        
        

        // Agregar eventos a los botones de video
        document.querySelectorAll('.video-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const videoId = event.target.getAttribute('data-video-id');
                const videoDbId = event.target.getAttribute('data-video-db-id');
                openVideoModal(videoId);
                startVideo(videoDbId);  // Llamada a la función startVideo
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

    }
  
  // Función startVideo que hace un fetch para el endpoint startvideo y actualiza el tiempo de vista
  function startVideo(videoDbId) {
    const payload = {
        idVideo: videoDbId
    };
  
    fetch('https://tu1btc.com/api/course/startVideo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Asegúrate de incluir el token si es necesario
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error al iniciar el video. Código de estado: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Video iniciado:', data);
        
        // Aquí se espera que el servidor devuelva un UUID (id) para el video y el tiempo inicial
        const videoId = data.id;  // Asegúrate de que el servidor devuelve un UUID válido
        const videoDbId = String(videoId); // Verifica que este sea el UUID correcto
  
        if (vimeoPlayer) {
            vimeoPlayer.on('timeupdate', function(event) {
                const currentTime = event.seconds;  // Tiempo actual del video en segundos
                updateVideoTime(videoDbId, currentTime);
            });
        }
    })
    .catch(error => {
        console.error('Error al iniciar el video:', error.message);
    });
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
  
  function finishVideo(videoId, userId, studyPlan) {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.error("Token no encontrado. Por favor, inicia sesión.");
        return;
    }

    // Encontrar el video correcto por su ID
    const section = studyPlan.find(section =>
        section.videos.some(video => video.id === videoId)
    );
  
    if (!section) {
        console.error("Sección no encontrada para el video ID:", videoId);
        return;
    }
  
    const video = section.videos.find(video => video.id === videoId);
    if (!video) {
        console.error("Video no encontrado con ID:", videoId);
        return;
    }
  
    const playedVideo = video.played_video.find(pv => pv.userId === userId);
    if (!playedVideo) {
        console.error("No se encontró registro de reproducción para el usuario:", userId);
        return;
    }
  
    const videoDbId = playedVideo.id; // ID correcto a enviar
    console.log("ID del video que se está enviando:", videoDbId);
  
    const payload = {
        id: videoDbId,  // ID del registro de reproducción
        isEnd: true     // Finalización del video
    };
  
    console.log("Payload enviado:", payload);
  
    fetch('https://tu1btc.com/api/course/video/finish', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Token obtenido desde localStorage
        },
        body: JSON.stringify(payload),
    })
        .then(response => {
            console.log('Respuesta del servidor:', response);
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error('Error de servidor:', errorData);
                    throw new Error(`Error al finalizar el video: ${errorData.message || response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Video finalizado:', data);
  
            // Realizar un nuevo fetch para obtener los datos actualizados
            return fetch('https://tu1btc.com/api/course/getAllForMembershipId', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los cursos actualizados.');
            }
            return response.json();
        })
        .then(updatedCourses => {
            console.log('Cursos actualizados:', updatedCourses);
  
            // Aquí puedes actualizar la UI con los datos nuevos
            updateUIWithNewCourses(updatedCourses);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

  
  // Función para actualizar la UI con los datos nuevos
  function updateUIWithNewCourses(courses) {
    // Aquí implementa la lógica para renderizar nuevamente los cursos en la página
    console.log('Actualizando UI con los cursos:', courses);
    // Por ejemplo:
    // renderCourses(courses); 
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
    
            // Agregar el listener del evento 'ended' para cuando el video termine
            vimeoPlayer.on('ended', function() {
                console.log("El video ha terminado");  // Verifica que el evento se esté activando
                finishVideo(videoId);  // Llamar la función finishVideo cuando el video termine
            });
    
        } else {
            vimeoPlayer = new Vimeo.Player(videoContainer, {
                id: videoId,
                responsive: true // Habilita la respuesta automática
            });
    
            vimeoPlayer.on('play', function() {
                console.log(`Video de Vimeo ${videoId} está en reproducción`);
            });
    
            // Agregar el listener del evento 'ended' para cuando el video termine
            vimeoPlayer.on('ended', function() {
                console.log("El video ha terminado");  // Verifica que el evento se esté activando
                finishVideo(videoId);  // Llamar la función finishVideo cuando el video termine
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
  