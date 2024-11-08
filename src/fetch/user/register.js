document.getElementById('register-btn').addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('email-input').value;
    const phone = document.getElementById('phone-input').value;
    const name = document.getElementById('name-input').value;
    const surname = document.getElementById('surname-input').value;
    const password = document.getElementById('password-input').value;

    const errorMessage = document.getElementById('error-message'); // Contenedor de errores
    errorMessage.textContent = ''; // Limpiar mensaje previo

    if (email && phone && name && surname && password) {
        const requestBody = { email, phone, name, surname, password };

        fetch('https://tu1btc.com/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Error en la solicitud');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('Usuario registrado:', data);
                showTokenModal(email); // Mostrar el modal para el token
            })
            .catch((error) => {
                console.error('Hubo un problema con la solicitud:', error);
                errorMessage.textContent = error.message; // Mostrar el mensaje de error
            });
    } else {
        errorMessage.textContent = 'Por favor, completa todos los campos.'; // Mostrar error
    }
});


// Función para mostrar el modal de token
function showTokenModal(email) {
    const modal = document.getElementById('tokenModal');
    modal.style.display = 'block';

    const validateButton = document.getElementById('validate-token-btn');
    const resendToken = document.getElementById('resend-token');

    // Validar el token
    validateButton.onclick = function () {
        const token = document.getElementById('token-input').value;

        if (token) {
            fetch(`https://tu1btc.com/api/user/validate?email=${email}&token=${token}`, {
                method: 'GET',
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((errorData) => {
                            throw new Error(errorData.message || 'Error en la validación');
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log('Email validado:', data);
                    alert('Registro completado con éxito.');
                    modal.style.display = 'none'; // Solo cierra el modal después de validar
                    window.location.href = 'login.html'; // Redirige al inicio de sesión
                })
                .catch((error) => {
                    console.error('Error al validar el token:', error);
                    alert(error.message);
                });
        } else {
            alert('Por favor, introduce el token.');
        }
    };

    // Reenviar el token
    resendToken.onclick = function () {
        fetch(`https://tu1btc.com/api/user/generate?email=${email}`, {
            method: 'GET',
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.message || 'Error al regenerar el token');
                    });
                }
                return response.json();
            })
            .then(() => {
                alert('Token reenviado a tu correo.');
            })
            .catch((error) => {
                console.error('Error al reenviar el token:', error);
                alert(error.message);
            });
    };
}

// Eliminar la opción de cerrar el modal manualmente
document.getElementById('tokenModalClose').style.display = 'none';

// Eliminar el evento para cerrar el modal al hacer clic fuera
window.addEventListener('click', function (event) {
    const modal = document.getElementById('tokenModal');
    if (event.target === modal) {
        event.stopPropagation(); // No permite cerrar el modal
    }
});
