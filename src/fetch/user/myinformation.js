document.getElementById('get-info-btn').addEventListener('click', function() {
    const token = localStorage.getItem('authToken');
  
    if (token) {
      fetch('https://tu1btc.com/api/user/myInformation', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('Información del usuario:', data); // Muestra la información recibida
  
        // Muestra los datos en la pantalla
        document.getElementById('user-id').textContent = data.id;
        document.getElementById('user-name').textContent = data.name;
        document.getElementById('user-surname').textContent = data.surname;
        document.getElementById('user-email').textContent = data.email;
        document.getElementById('user-phone').textContent = data.phone || 'No disponible'; // Manejo de caso nulo
        document.getElementById('user-active').textContent = data.active ? 'Sí' : 'No';
        document.getElementById('user-roles').textContent = data.roles.join(', '); // Muestra los roles como una lista
  
      })
      .catch(error => {
        console.error('Hubo un problema con la solicitud:', error);
      });
    } else {
      console.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
    }
  });
  