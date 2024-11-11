document.getElementById('login-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir que la página se recargue
  
    // Captura y ajusta el valor del email a minúsculas
    const email = document.getElementById('login-email').value.toLowerCase();
    const password = document.getElementById('login-password').value;

    // Verifica si la contraseña cumple con los requisitos
    if (!validatePassword(password)) {
        showModal('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un carácter especial.');
        return;
    }

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
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.errorCode || 'UnknownError');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data); 
  
            // Almacena el token en localStorage
            const token = data.token;
            localStorage.setItem('authToken', token);
  
            // Opcional: Almacenar también el ID del usuario
            const userId = data.id;
            localStorage.setItem('userId', userId);
  
            // Redirigir a la página principal o dashboard
            window.location.href = '../index.html';
        })
        .catch(error => {
            if (error.message === 'EMAIL_NOT_FOUND') {
                showModal('El correo ingresado no está registrado. Verifica y vuelve a intentarlo.');
            } else if (error.message === 'INVALID_PASSWORD') {
                showModal('La contraseña ingresada es incorrecta. Por favor, intenta nuevamente.');
            } else {
                showModal('Hubo un problema con la solicitud. Intenta de nuevo.');
            }
            console.error('Hubo un problema con la solicitud:', error);
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

// Validación de contraseña
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
}

// Cerrar el modal al hacer clic en el botón "Cerrar"
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('error-modal').style.display = 'none';
});
