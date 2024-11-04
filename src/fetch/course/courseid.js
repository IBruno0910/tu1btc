document.addEventListener('DOMContentLoaded', () => {
    const courseDetailsContainer = document.getElementById('course-details-container');
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const token = localStorage.getItem('authToken');
    let currentVideoId = null;
    let youtubePlayer = null;

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

    // Renderizar detalles del curso
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
                <div id="video-container"></div>
            </div>
        `;

        // Agregar eventos a los botones de video
        document.querySelectorAll('.video-button').forEach(button => {
            button.addEventListener('click', () => {
                const videoId = button.getAttribute('data-video-id');
                const videoDbId = button.getAttribute('data-video-db-id');
                startVideo(videoDbId);
                loadYouTubeVideo(videoId, videoDbId);
            });
        });
    }

    // Cargar y reproducir el video de YouTube
    function loadYouTubeVideo(videoId, videoDbId) {
        currentVideoId = videoDbId;

        if (youtubePlayer) {
            youtubePlayer.loadVideoById(videoId);
        } else {
            youtubePlayer = new YT.Player('video-container', {
                height: '360',
                width: '640',
                videoId: videoId,
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }

    // Manejar cambios en el estado del reproductor
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            console.log(`Video ${currentVideoId} está en reproducción`);
            setInterval(() => {
                const seconds = Math.floor(youtubePlayer.getCurrentTime());
                updateVideoTime(currentVideoId, seconds);
            }, 5000); // Actualizar cada 5 segundos
        } else if (event.data === YT.PlayerState.ENDED) {
            finishVideo(currentVideoId);
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

    // Actualizar tiempo de visualización
    function updateVideoTime(videoId, seconds) {
        fetch('https://tu1btc.com/api/course/updateTime', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: videoId, seconds: seconds })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(`Tiempo actualizado a ${seconds} segundos para el video ${videoId}`);
        })
        .catch(error => console.error('Error al actualizar el tiempo del video:', error));
    }

    // Finalizar video
    function finishVideo(videoId) {
        fetch('https://tu1btc.com/api/course/video/finish', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: videoId, isEnd: true })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(`Video ${videoId} finalizado`);
        })
        .catch(error => console.error('Error al finalizar el video:', error));
    }
});
