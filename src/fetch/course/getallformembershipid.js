document.addEventListener('DOMContentLoaded', async () => {
    const coursesContainer = document.getElementById('courses-container');

    // Obtener el token de authToken
    const token = localStorage.getItem('authToken');

    try {
        // 1️⃣ Obtener las categorías
        const categoriesResponse = await fetch('https://tu1btc.com/api/course/category/get', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!categoriesResponse.ok) throw new Error('Error al obtener las categorías');

        const categories = await categoriesResponse.json();
        const categoriesMap = new Map(categories.map(cat => [cat.id, cat.name])); // Mapa de id -> nombre

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
        coursesContainer.innerHTML = ''; // Limpiar contenedor

        Object.keys(groupedCourses).forEach(category => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';

            // Agregar título de la categoría
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categorySection.appendChild(categoryTitle);

            // Crear contenedor de cursos
            const courseList = document.createElement('div');
            courseList.className = 'course-list'; // Clase CSS para estilos

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
    }
});
