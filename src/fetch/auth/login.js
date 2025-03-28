// Función para mostrar el modal (ya la tienes)
function showModal(message) {
    const modal = document.getElementById('error-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Validación de contraseña (ya la tienes)
function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
}

// Cerrar modal (ya lo tienes)
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('error-modal').style.display = 'none';
});

// Login con reCAPTCHA
document.getElementById('login-btn').addEventListener('click', async function(event) {
    event.preventDefault();

    // Validar reCAPTCHA primero
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showModal('⚠️ Por favor, completa el reCAPTCHA.');
        return;
    }

    const email = document.getElementById('login-email').value.toLowerCase();
    const password = document.getElementById('login-password').value;

    // Validar contraseña
    if (!validatePassword(password)) {
        showModal('La contraseña debe tener 8+ caracteres, una mayúscula y un carácter especial.');
        grecaptcha.reset(); // Resetear reCAPTCHA
        return;
    }

    // Validar campos vacíos
    if (!email || !password) {
        showModal('Por favor, completa ambos campos.');
        grecaptcha.reset();
        return;
    }

    try {
        const response = await fetch('https://tu1btc.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                recaptchaToken: recaptchaResponse // Añadir el token
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errorCode || 'UnknownError');
        }

        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.id);
        window.location.href = '../index.html';

    } catch (error) {
        console.error('Error:', error);
        grecaptcha.reset(); // Resetear reCAPTCHA en errores

        // Manejo de errores específicos
        if (error.message === 'EMAIL_NOT_FOUND') {
            showModal('El correo no está registrado. Verifica e intenta de nuevo.');
        } else if (error.message === 'INVALID_PASSWORD') {
            showModal('Contraseña incorrecta. Intenta nuevamente.');
        } else {
            showModal('Error al iniciar sesión. Intenta más tarde.');
        }
    }
});