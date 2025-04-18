document.addEventListener('DOMContentLoaded', async () => {
    const coursesContainer = document.getElementById('courses-container');

    const token = localStorage.getItem('authToken');

    try {
        // 1️⃣ Obtener las categorías
        const categoriesResponse = await fetch('https://tu1btc.com/api/course/category/get', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!categoriesResponse.ok) throw new Error('Error al obtener las categorías');

        const categories = await categoriesResponse.json();
        const categoriesMap = new Map(categories.map(cat => [cat.id, cat.name]));

        // 2️⃣ Obtener los cursos
        const coursesResponse = await fetch('https://tu1btc.com/api/course/getAllForMembershipId', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!coursesResponse.ok) throw new Error('Error al obtener los cursos');

        const courses = await coursesResponse.json();

        // ⛔ Si no hay cursos, mostrar un mensaje
        if (!courses.length) {
            coursesContainer.innerHTML = `
                <div class="no-courses">
                    <p>No tienes cursos disponibles actualmente.</p>
                    <a href="/membresias.html" class="go-membership-btn">Ver Membresías</a>
                </div>
            `;
            return;
        }

        // 3️⃣ Agrupar cursos por categoría
        const groupedCourses = {};
        courses.forEach(course => {
            const categoryName = categoriesMap.get(course.categoryId) || 'Sin categoría';
            if (!groupedCourses[categoryName]) {
                groupedCourses[categoryName] = [];
            }
            groupedCourses[categoryName].push(course);
        });

        // 4️⃣ Renderizar los cursos agrupados
        coursesContainer.innerHTML = '';

        categories.forEach(cat => {
            const category = cat.name;
            if (!groupedCourses[category]) return;

            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);

            const courseList = document.createElement('div');
            courseList.className = 'course-list';

            groupedCourses[category].forEach(course => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';

                const imageUrl = course.image
                    ? (course.image.startsWith('http') ? course.image : `https://tu1btc.com/api/course/image/${course.image}`)
                    : 'ruta/de/imagen_por_defecto.jpg';

                courseCard.innerHTML = `
                    <img src="${imageUrl}" alt="${course.name}" class="course-image">
                    <h3 class="course-title">${course.name}</h3>
                `;

                courseCard.addEventListener('click', () => {
                    window.location.href = `course-details.html?id=${course.id}`;
                });

                courseList.appendChild(courseCard);
            });

            categorySection.appendChild(courseList);
            coursesContainer.appendChild(categorySection);
        });

    } catch (error) {
        console.error('Error:', error);
        coursesContainer.innerHTML = `
            <div class="no-courses">
                <p>No tienes ninguna membresía</p>
                <a href="membresias.html" class="go-membership-btn">Ver Membresías</a>
            </div>
        `;
    }
});
