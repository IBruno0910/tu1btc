document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("basica-checkbox").addEventListener('change', function() { toggleCheckbox(this); });
    document.getElementById("media-checkbox").addEventListener('change', function() { toggleCheckbox(this); });
    document.getElementById("full-checkbox").addEventListener('change', function() { toggleCheckbox(this); });
    
    fetchAndDisplayCourses();
});

function toggleCheckbox(checkbox) {
    const checkboxes = [document.getElementById("basica-checkbox"), document.getElementById("media-checkbox"), document.getElementById("full-checkbox")];
    checkboxes.forEach(cb => {
        if (cb !== checkbox) {
            cb.checked = false;
        }
    });
    fetchAndDisplayCourses();
}

async function fetchAndDisplayCourses() {
    const isBasicChecked = document.getElementById("basica-checkbox").checked;
    const isMediumChecked = document.getElementById("media-checkbox").checked;
    const isFullChecked = document.getElementById("full-checkbox").checked;

    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch('https://tu1btc.com/api/course/getAllPremiumCoursesInfo', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const allCourses = await response.json();

        const filteredCourses = allCourses.filter(course => {
            const hasBasic = course.validSubscriptions.some(sub => sub.name.includes("Basica"));
            const hasMedium = course.validSubscriptions.some(sub => sub.name.includes("Media"));
            const hasFull = course.validSubscriptions.some(sub => sub.name.includes("Full"));
            
            if (hasBasic && isBasicChecked) return true;
            if (hasMedium && isMediumChecked) return true;
            if (hasFull && isFullChecked) return true;
            return false;
        });

        displayCourses(filteredCourses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        document.getElementById("courses-container").innerHTML = "<p>Error al cargar los cursos.</p>";
    }
}

function displayCourses(courses) {
    const coursesContainer = document.getElementById("courses-container");
    coursesContainer.innerHTML = "";

    if (courses.length === 0) {
        coursesContainer.innerHTML = "<p>No se encontraron cursos.</p>";
        return;
    }

    courses.forEach(course => {
        const courseElement = document.createElement("div");
        courseElement.className = "course-card"; 
        courseElement.innerHTML = `
            <img src="https://tu1btc.com/api/course/image/${course.image}" alt="${course.name}" class="course-image" />
            <h3>${course.name}</h3>
        `;

        courseElement.addEventListener('click', () => {
            window.location.href = `detallesCurso.html?id=${course.id}`;
        });

        coursesContainer.appendChild(courseElement);
    });
}



