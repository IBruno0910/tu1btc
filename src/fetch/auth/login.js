function showModal(message) {
    const modal = document.getElementById('error-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.-])[A-Za-z\d!@#$%^&*.-]{8,}$/;
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
                showModal('❌ Error, ingresaste mal el mail o la contraseña, revisa los datos.');
                break;
        }
    }

    function showTokenModal(email) {
        const modal = document.getElementById('token-modal');
        modal.style.display = 'flex';
    
        const closeBtn = document.getElementById('close-token-modal');
        const validateBtn = document.getElementById('validate-tokenn-btn');
        const resendBtn = document.getElementById('resend-tokenn-btn');
        const messageDiv = document.getElementById('token-message');
    
        let resendAttempts = 0;
        const maxResendAttempts = 3;
        let tokenSent = false;
    
        function showMessage(message, isError = true) {
            messageDiv.textContent = message;
            messageDiv.style.color = isError ? 'orange' : 'green';
        }
    
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            messageDiv.textContent = ''; // Limpiar mensaje al cerrar
        });
    
        validateBtn.addEventListener('click', async () => {
            const token = document.getElementById('tokenn-input').value.trim();
            if (!token) {
                showMessage('⚠️ Por favor ingresa el token.');
                return;
            }
    
            try {
                const res = await fetch(`https://tu1btc.com/api/user/validate?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
                const resData = await res.json();
    
                if (res.ok) {
                    showMessage('✅ Token validado correctamente. Redirigiendo...', false);
                    localStorage.setItem('authToken', resData.token);
                    localStorage.setItem('userId', resData.id);
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500); 
                } else {
                    if (res.status === 406) {
                        showMessage('❌ El token no coincide. Verifica tu email.');
                    } else if (res.status === 409) {
                        showMessage('❌ El token ha vencido. Solicita uno nuevo.');
                    } else {
                        showMessage('❌ Error al validar el token.');
                    }
                }
            } catch (err) {
                console.error('Error validando token:', err);
                showMessage('❌ Error de conexión al validar el token.');
            }
        });
    
        resendBtn.addEventListener('click', async () => {
            if (resendAttempts >= maxResendAttempts) {
                showMessage('⚠️ Has alcanzado el límite de reenvíos. Intenta más tarde.');
                resendBtn.disabled = true;
                resendBtn.style.opacity = '0.5';
                resendBtn.style.cursor = 'not-allowed';
                return;
            }
    
            try {
                const res = await fetch(`https://tu1btc.com/api/user/generate?email=${encodeURIComponent(email)}`);
    
                if (res.ok) {
                    resendAttempts++;
                    tokenSent = true;
                    showMessage('📧 Token enviado. Revisa tu correo.', false);
    
                    if (tokenSent) {
                        resendBtn.textContent = 'Reenviar Token';
                    }
                } else {
                    if (res.status === 409) {
                        resendAttempts++;
                        showMessage('⚠️ Ya solicitaste un token recientemente. Intenta más tarde.');
                    } else {
                        showMessage('❌ Error al enviar el token.');
                    }
                }
    
                if (resendAttempts >= maxResendAttempts) {
                    resendBtn.disabled = true;
                    resendBtn.style.opacity = '0.5';
                    resendBtn.style.cursor = 'not-allowed';
                }
    
            } catch (err) {
                console.error('Error enviando token:', err);
                showMessage('❌ Error de conexión al enviar el token.');
            }
        });
    
        resendBtn.textContent = 'Enviar Token';
        resendBtn.disabled = false;
        resendBtn.style.opacity = '1';
        resendBtn.style.cursor = 'pointer';
        messageDiv.textContent = ''; // Limpiar cualquier mensaje viejo
    }
});
