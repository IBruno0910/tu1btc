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
      const courseElement = document.createElement('div');
      courseElement.innerHTML = `
        <div class="card-main elemento element-1">
            <img class="img-card" src="${course.image}" alt="${course.name}">
            <h3 class="card-name">${course.name}</h3>
            <p class="card-desc">${course.description}</p>
            <div class="card-div">
                <button href="course.html" class="card-insc">Inscribirse</button>
                <p class="card-price">$${course.price}</p>
            </div>
        </div>
      `;
      container.appendChild(courseElement);
    });
  })
  .catch(error => {
    console.error('Error fetching non-premium courses:', error);
  });
  // Fetch para obtener los cursos premium
  fetch('https://tu1btc.com/api/course/getAllNoPremiumCourses', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluye el token si es necesario
      }
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      displayCourses(data); // Llama a la función para mostrar los datos
  })
  .catch(error => {
      console.error('Error fetching non-premium courses:', error);
  });
  
  // Función para mostrar los cursos en el HTML
  function displayCourses(courses) {
      const coursesContainer = document.getElementById('coursesContainer'); // Asegúrate de que este contenedor existe en tu HTML
      coursesContainer.innerHTML = ''; // Limpiar el contenedor antes de mostrar nuevos cursos
  
      // Iterar sobre los cursos y crear los elementos HTML
      courses.forEach(course => {
          const courseCard = document.createElement('div');
  
          courseCard.innerHTML = `
            <div class="card-main">
                <img class="img-card" src="${course.image}" alt="${course.name}">
                <h3 class="card-name">${course.name}</h3>
                <p class="card-desc">${course.description}</p>
                <div class="card-div">
                    <button class="card-insc">Inscribirse</button>
                    <p class="card-price">$${course.price}</p>
                </div>
            </div>
          `;
  
          coursesContainer.appendChild(courseCard); // Agregar la tarjeta del curso al contenedor
      });
  }





