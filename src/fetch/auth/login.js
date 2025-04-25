function showModal(message) {
    const modal = document.getElementById('error-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.])[A-Za-z\d!@#$%^&*.]{8,}$/;
    return passwordRegex.test(password);
}

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('error-modal').style.display = 'none';
});

// Login con reCAPTCHA
document.getElementById('login-btn').addEventListener('click', async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.toLowerCase();
    const password = document.getElementById('login-password').value;

    // Validar campos vacíos primero
    if (!email || !password) {
        showModal('⚠️ Por favor, completa ambos campos.');
        return;
    }

    // Validar contraseña
    if (!validatePassword(password)) {
        showModal('⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.');
        return;
    }

    // Validar reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showModal('⚠️ Por favor, completa el reCAPTCHA.');
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
                recaptchaToken: recaptchaResponse
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Se lanza con el mensaje real del backend, si lo hay
            throw new Error(data.message || 'UNKNOWN_ERROR');
        }

        // Guardar datos de sesión
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.id);
        window.location.href = '../index.html';

    } catch (error) {
        console.error('Error:', error);
        grecaptcha.reset();

        // Manejo de errores conocidos del backend
        switch (error.message) {
            case 'Debe validar su email para ingresar a la plataforma':
                await fetch(`https://tu1btc.com/api/user/generate?email=${encodeURIComponent(email)}`);
                showTokenModal(email);
                break;
            case 'EMAIL_NOT_FOUND':
                showModal('📧 El correo no está registrado. Puedes crear una cuenta.');
                break;
            case 'INVALID_PASSWORD':
                showModal('🔐 Contraseña incorrecta. Intenta nuevamente.');
                break;
            case 'RECAPTCHA_FAILED':
                showModal('⚠️ Error en la verificación del reCAPTCHA. Intenta de nuevo.');
                break;
            default:
                showModal('❌ Error al iniciar sesión. Intenta más tarde o revisa tus datos.');
                break;
        }
    }

    function showTokenModal(email) {
        const modal = document.getElementById('token-modal');
        modal.style.display = 'flex';
    
        const closeBtn = document.getElementById('close-token-modal');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    
        document.getElementById('validate-token-btn').addEventListener('click', async () => {
            const token = document.getElementById('token-input').value;
            if (!token) {
                alert('⚠️ Por favor ingresa el token.');
                return;
            }
    
            try {
                const res = await fetch(`https://tu1btc.com/api/user/validate?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
                const resData = await res.json();
    
                if (res.ok) {
                    modal.style.display = 'none';
                    alert('✅ Tu cuenta fue validada con éxito. Ahora puedes iniciar sesión.');
                } else {
                    alert(`❌ Token inválido. Verifica tu email.`);
                }
            } catch (err) {
                console.error('Error validando token:', err);
                alert('❌ Ocurrió un error al validar el token.');
            }
        });
    }
    
});
