document.addEventListener('DOMContentLoaded', () => {
    const courseDetailsContainer = document.getElementById('course-details-container');
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');

    // Obtener el token de authToken
    const token = localStorage.getItem('authToken');

    // Fetch para obtener el contenido completo del curso
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
        renderCourseDetails(course); // Renderiza el contenido del curso
    })
    .catch(error => console.error('Error fetching course details:', error));

    // Función para renderizar los detalles del curso
    function renderCourseDetails(course) {
        courseDetailsContainer.innerHTML = `
            <div class="course-details">
                <h2 class="course-title">${course.name}</h2>
                <img src="https://tu1btc.com/api/course/image/${course.image}" alt="${course.name}" class="course-image" />
                <p class="course-description">${course.description}</p>
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
                                                    <span>${video.title}</span> 
                                                    <span class="video-duration">${video.duration} mins</span>
                                                    <button class="video-button" data-video-id="${video.link}">Ver Video</button>
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

        // Agregar evento para mostrar el video
        document.querySelectorAll('.video-button').forEach(button => {
            button.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                showVideo(videoId);
            });
        });
    }

    // Función para mostrar el video en pantalla
    function showVideo(videoId) {
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = `
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" 
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; 
            encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    }
});
