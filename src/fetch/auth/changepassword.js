// 1. Definir showModal PRIMERO (para evitar el ReferenceError)
function showModal(message) {
    const modal = document.getElementById('error-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// 2. Cerrar el modal
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('error-modal').style.display = 'none';
});

// 3. Manejar el envío del formulario + reCAPTCHA
document.getElementById('change-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Validar reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        showModal('⚠️ Por favor, completa el reCAPTCHA.');
        return;
    }

    // Validar campos
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    if (!currentPassword || !newPassword) {
        showModal('📝 Completa todos los campos.');
        return;
    }

    // Verificar token de autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
        showModal('🔒 Sesión expirada. Inicia sesión nuevamente.');
        return;
    }

    try {
        const response = await fetch('https://tu1btc.com/api/user/changePassword', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: currentPassword,
                newPassword: newPassword,
                recaptchaToken: recaptchaResponse // Enviar token de reCAPTCHA al backend
            })
        });

        // Manejar errores HTTP (409, 400, etc.)
        if (!response.ok) {
            const errorData = await response.json(); // Leer mensaje de error del backend
            throw new Error(errorData.message || `Error ${response.status}`);
        }

        // Éxito: redirigir al login
        showModal('✅ ¡Contraseña cambiada! Redirigiendo...');
        setTimeout(() => {
            window.location.href = './login.html';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        showModal(`❌ ${error.message || 'Error al cambiar la contraseña. Intenta de nuevo.'}`);
        grecaptcha.reset(); // Reiniciar reCAPTCHA para reintentos
    }
});