document.getElementById('login-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir que la página se recargue
  
    // Captura los valores del formulario de inicio de sesión
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    // Verifica que ambos campos estén completos
    if (email && password) {
        // Cuerpo de la solicitud
        const loginData = {
            email: email,
            password: password
        };
  
        // Realiza el fetch para iniciar sesión
        fetch('https://tu1btc.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData) // Convierte el objeto a JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Verifica los datos recibidos en la consola
  
            // Almacena el token en localStorage
            const token = data.token;
            localStorage.setItem('authToken', token);
  
            // Opcional: Almacenar también el ID del usuario
            const userId = data.id;
            localStorage.setItem('userId', userId);
  
            // Confirmación en la consola
            console.log('Token guardado en localStorage:', token);
            console.log('ID del usuario guardado en localStorage:', userId);
  
            // Redirigir a la página principal o dashboard
            window.location.href = '../index.html'; // Cambia a la URL de la página principal
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
            // Mostrar el modal de error
            showModal('Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.');
        });
    } else {
        showModal('Por favor, completa ambos campos.');
    }
  });
  
  // Función para mostrar el modal de error
  function showModal(message) {
    const modal = document.getElementById('error-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
  }
  
  // Cerrar el modal al hacer clic en el botón "Cerrar"
  document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('error-modal').style.display = 'none';
  });
  