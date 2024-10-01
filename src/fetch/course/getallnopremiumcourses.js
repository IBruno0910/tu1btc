const token = localStorage.getItem('authToken');
fetch('https://tu1btc.com/api/course/getAllNoPremiumCourses', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Si se requiere autenticación
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    const container = document.getElementById('no-premium-courses-container');
    data.forEach(course => {
        const imageUrl = `https://tu1btc.com/api/course/image/${course.image}`; // Asegúrate de que esta URL es correcta
        const courseId = course.id; // Suponiendo que el ID del curso está disponible en 'course.id'
        
        const courseElement = document.createElement('div');
        courseElement.innerHTML = `
            <div class="element element-1">
                <img class="img-card" src="${imageUrl}" alt="${course.name}">
                <h3 class="card-name">${course.name}</h3>
                <p class="card-desc">${course.description}</p>
                <div class="card-div">
                    <button class="card-insc" onclick="window.location.href='/src/course.html?id=${course.id}'">Inscribirse</button>
                    <p style="color:#FF9000" class="card-price">$${course.price}</p>
                </div>
            </div>
        `;
        container.appendChild(courseElement);
    });
})
.catch(error => {
    console.error('Error fetching non-premium courses:', error);
});
