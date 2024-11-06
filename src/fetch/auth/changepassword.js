document.getElementById('change-password-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevenir que la página se recargue

    // Captura los valores del formulario
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    // Verifica que todos los campos estén completos
    if (currentPassword && newPassword) {

        // Obtener el token de localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
            showModal('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
            return;
        }

        // Cuerpo de la solicitud
        const passwordData = {
            password: currentPassword,   // Contraseña actual
            newPassword: newPassword     // Nueva contraseña
        };

        try {
            const response = await fetch('https://tu1btc.com/api/user/changePassword', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData) // Convierte el objeto a JSON
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }

            // Si la respuesta es exitosa
            showModal('Contraseña cambiada con éxito. Redirigiendo...');
            setTimeout(() => {
                window.location.href = './login.html'; // Redirige a la página de login
            }, 2000); // Redirige después de 2 segundos para mostrar el mensaje
        } catch (error) {
            console.error('Hubo un problema con la solicitud:', error);
            // Mostrar el modal de error
            showModal('Hubo un problema al cambiar la contraseña. Intenta de nuevo.');
        }
    } else {
        showModal('Por favor, completa todos los campos.');
    }
});

// Función para mostrar el modal de error o éxito
function showModal(message) {
    const modal = document.getElementById('error-modal');
    const modalMessage = document.getElementById('modal-message');
    modalMessage.textContent = message;
    modal.style.display = 'block';
}

// Cerrar el modal al hacer clic en el botón "Cerrar"
document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('error-modal').style.display = 'none';
});
