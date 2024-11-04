document.getElementById('register-btn').addEventListener('click', function(event) {
  event.preventDefault(); // Evita el envío del formulario por defecto

  const email = document.getElementById('email-input').value;
  const phone = document.getElementById('phone-input').value;
  const name = document.getElementById('name-input').value;
  const surname = document.getElementById('surname-input').value;
  const password = document.getElementById('password-input').value;

  // Verifica si todos los campos están completos
  if (email && phone && name && surname && password) {
      const requestBody = {
          email: email,
          phone: phone,
          name: name,
          surname: surname,
          password: password
      };

      fetch('https://tu1btc.com/api/user/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
      })
      .then(response => {
          if (!response.ok) {
              return response.json().then(errorData => {
                  throw new Error(errorData.message || 'Error en la solicitud');
              });
          }
          return response.json();
      })
      .then(data => {
          console.log('Usuario registrado:', data);
          window.location.href = 'login.html'; // Redirige a la página de inicio de sesión
      })
      .catch(error => {
          console.error('Hubo un problema con la solicitud:', error);
          showModal(error.message); // Llama a la función para mostrar el modal
      });
  } else {
      showModal('Por favor, completa todos los campos.');
  }
});

// Función para mostrar el modal con el mensaje de error
function showModal(message) {
    const modal = document.getElementById('passwordModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Cerrar el modal cuando se hace clic en la "x"
document.getElementById('modalClose').addEventListener('click', function() {
    document.getElementById('passwordModal').style.display = 'none';
});

// Opcional: Cerrar el modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('passwordModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
