document.getElementById('submit-btn').addEventListener('click', function() {
  const email = document.getElementById('email-input').value;

  // Verifica si el email está siendo capturado
  console.log('Email capturado:', email);

  if (email) {
    fetch(`https://tu1btc.com/api/user/getUser/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      console.log('Respuesta recibida:', response); 
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos recibidos:', data); 
    })
    .catch(error => {
      console.error('Hubo un problema con la solicitud:', error);
    });
  } else {
    console.error('Por favor, ingresa un email válido.');
  }
});

