document.getElementById('yourButtonId').addEventListener('click', async () => {
    try {
        const userInfo = await fetchUserInfo();
        const membershipId = userInfo.membershipId; // Asegúrate de que este campo esté presente

        const courses = await fetchCourses(membershipId); // Llama a la función para obtener los cursos
        // Por cada curso, haz un fetch para obtener la información detallada
        for (const course of courses) {
            const courseDetails = await fetchCourseDetails(course.id); // Suponiendo que cada curso tiene un id
            displayCourseDetails(courseDetails); // Muestra la información detallada de cada curso
        }
    } catch (error) {
        console.error(error);
    }
});

async function fetchUserInfo() {
    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch('https://tu1btc.com/api/user/myInformation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener la información del usuario: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener la información del usuario');
    }
}

async function fetchCourses(membershipId) {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`https://tu1btc.com/api/course/getAllForMembershipId?membershipId=${membershipId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los cursos: ${response.status}`);
        }

        return await response.json(); // Asegúrate de que esto devuelva una lista de cursos
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los cursos');
    }
}

// Nueva función para obtener los detalles del curso
async function fetchCourseDetails(courseId) {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`https://tu1btc.com/api/course/getCourseDetails?id=${courseId}`, { // Cambia la URL según tu endpoint para obtener detalles del curso
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los detalles del curso: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener los detalles del curso');
    }
}

function displayCourseDetails(courseDetails) {
    const container = document.getElementById('coursesContainer');
    const courseElement = document.createElement('div');
    courseElement.innerHTML = `
        <h2>${courseDetails.name}</h2>
        <img src="${courseDetails.image}" alt="${courseDetails.name}">
        <p>${courseDetails.description}</p>
        <h3>Contenido:</h3>
        <ul>
            ${courseDetails.content.map(item => `<li>${item}</li>`).join('')}  
        </ul>
        <p><strong>Precio:</strong> ${courseDetails.price}</p>  
    `;
    container.appendChild(courseElement);
}
