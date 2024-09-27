document.getElementById('register-btn').addEventListener('click', function(event) {
  // Captura los valores de los inputs
  const email = document.getElementById('email-input').value;
  const phone = document.getElementById('phone-input').value;
  const name = document.getElementById('name-input').value;
  const surname = document.getElementById('surname-input').value;
  const password = document.getElementById('password-input').value;

  // Verifica si todos los campos están completos
  if (email && phone && name && surname && password) {
      // Crea el cuerpo de la solicitud
      const requestBody = {
          email: email,
          phone: phone,
          name: name,
          surname: surname,
          password: password
      };

      // Realiza el fetch a la API
      fetch('https://tu1btc.com/api/user/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody) // Convierte el objeto a JSON
      })
      .then(response => {
          console.log('Respuesta recibida:', response);
          if (!response.ok) {
              throw new Error('Error en la solicitud: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
          console.log('Usuario registrado:', data);
          // Redirige a la página principal si el registro es exitoso
          window.location.href = '../index.html'; // Cambia la ruta según la estructura de tu proyecto
      })
      .catch(error => {
          console.error('Hubo un problema con la solicitud:', error);
      });
  } else {
      console.error('Por favor, completa todos los campos.');
  }
});
