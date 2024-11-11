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
            </div>
        `;

        // Agregar eventos a los botones de video
        document.querySelectorAll('.video-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const videoId = event.target.getAttribute('data-video-id');
                const videoDbId = event.target.getAttribute('data-video-db-id');
                openVideoModal(videoId);
                startVideo(videoDbId);
            });
        });
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

    // Cargar el video de Vimeo
    function loadVimeoVideo(videoId) {
        const videoContainer = document.getElementById('video-player-container');
        videoContainer.style.width = '100%';
        videoContainer.style.height = '500px';

        // Destruir el reproductor anterior si existe antes de crear uno nuevo
        if (vimeoPlayer) {
            vimeoPlayer.destroy().then(() => {
                console.log("Reproductor destruido y listo para uno nuevo.");
                vimeoPlayer = null;  // Limpiar el reproductor anterior
                createVimeoPlayer(videoId);  // Crear un nuevo reproductor
            }).catch(error => console.error('Error al destruir el reproductor de Vimeo:', error));
        } else {
            // Si no hay reproductor, directamente creamos uno nuevo
            createVimeoPlayer(videoId);
        }
    }

    // Función para crear el reproductor de Vimeo
    function createVimeoPlayer(videoId) {
        const videoContainer = document.getElementById('video-player-container');

        // Crear un nuevo reproductor de Vimeo
        vimeoPlayer = new Vimeo.Player(videoContainer, {
            id: videoId,
            width: '1000px',
            height: '500px'
        });

        vimeoPlayer.on('play', function() {
            console.log(`Video de Vimeo ${videoId} está en reproducción`);
        });
    }

    // Iniciar el video (marcar como iniciado en la base de datos)
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
                throw new Error('Error al iniciar el video');
            }
            console.log(`Video ${videoId} iniciado`);
        })
        .catch(error => console.error('Error al iniciar el video:', error));
    }
});
