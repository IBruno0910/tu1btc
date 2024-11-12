document.getElementById('login-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevenir que la página se recargue

    const email = document.getElementById('login-email').value.toLowerCase();
    const password = document.getElementById('login-password').value;

    // Verifica si la contraseña cumple con los requisitos
    if (!validatePassword(password)) {
        showModal('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un carácter especial.');
        return;
    }

    // Verifica que ambos campos estén completos
    if (email && password) {
        const loginData = {
            email: email,
            password: password
        };

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

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.id);
            window.location.href = '../index.html';
        })
        .catch(error => {
            console.log("Error data:", error.message); // Agrega esta línea para verificar el mensaje exacto
            if (error.message === 'EMAIL_NOT_FOUND') {
                showModal('El correo ingresado no está registrado. Verifica y vuelve a intentarlo.');
            } else if (error.message === 'INVALID_PASSWORD') {
                showModal('La contraseña ingresada es incorrecta. Por favor, intenta nuevamente.');
            } else {
                showModal('La contraseña o el mail ingresado es incorrecto. Por favor, intenta nuevamente.');
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
