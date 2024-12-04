document.getElementById('register-btn').addEventListener('click', async function (event) {
    event.preventDefault();

    const errorMessage = document.getElementById('error-message'); // Contenedor de errores
    errorMessage.textContent = ''; // Limpiar mensaje previo

    try {
        // Validar el reCAPTCHA
        const recaptchaToken = await validateRecaptcha();
        console.log("reCAPTCHA validado con éxito:", recaptchaToken);

        // Proceder con el registro solo si el reCAPTCHA es válido
        const email = document.getElementById('email-input').value.toLowerCase();
        const phone = document.getElementById('phone-input').value;
        const name = document.getElementById('name-input').value;
        const surname = document.getElementById('surname-input').value;
        const password = document.getElementById('password-input').value;

        if (email && phone && name && surname && password) {
            const passwordRegex = /^(?=.*[A-Z])(?=.*\W).{8,}$/;
            if (!passwordRegex.test(password)) {
                errorMessage.textContent = 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula y un carácter especial.';
                return;
            }

            const requestBody = { email, phone, name, surname, password, recaptchaToken };

            const response = await fetch('https://tu1btc.com/api/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la solicitud');
            }

            const data = await response.json();
            console.log('Usuario registrado:', data);
            showTokenModal(email); // Mostrar el modal para el token
            document.getElementById('success-message').textContent = 'Registro exitoso. Revisa tu correo para validar tu cuenta.';
            document.getElementById('success-message').style.display = 'block';

            grecaptcha.reset(); // Resetear el reCAPTCHA
        } else {
            errorMessage.textContent = 'Por favor, completa todos los campos.';
        }
    } catch (error) {
        errorMessage.textContent = error;
        console.error('Error en el proceso de registro:', error);
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
                    // Mostrar el mensaje de éxito en el div
                    const successMessage = document.getElementById('success-message');
                    successMessage.style.display = 'block'; // Mostrar el mensaje
                    successMessage.textContent = 'Registro completado con éxito.';

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
