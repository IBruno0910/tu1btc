// Capturar el ID del curso desde la URL
const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');

const token = localStorage.getItem('authToken');
fetch(`https://tu1btc.com/api/course/${courseId}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
})
.then(course => {
    document.getElementById('course-name').innerText = course.name;
    document.getElementById('course-description').innerText = course.description;
    document.getElementById('course-video').src = course.videoUrl; // Asumiendo que la API devuelve una URL de video
})
.catch(error => {
    console.error('Error fetching course details:', error);
});
