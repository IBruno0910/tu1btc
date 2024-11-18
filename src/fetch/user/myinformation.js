document.addEventListener('DOMContentLoaded', function() {
    // Obtener información del usuario
    document.getElementById('get-info-btn').addEventListener('click', function() {
        const token = localStorage.getItem('authToken');

        if (token) {
            fetch('https://tu1btc.com/api/user/myInformation', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Aquí se corrige el uso de comillas
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Información del usuario:', data);

                // Guardar userId en el localStorage
                localStorage.setItem('userId', data.id);

                // Mostrar información en la tabla
                document.getElementById('user-id').textContent = data.id;
                document.getElementById('user-name').textContent = data.name;
                document.getElementById('user-surname').textContent = data.surname;
                document.getElementById('user-email').textContent = data.email;
                document.getElementById('user-phone').textContent = data.phone || 'No disponible';
                document.getElementById('user-active').textContent = data.active ? 'Sí' : 'No';
                document.getElementById('user-roles').textContent = data.roles.join(', ');

                // Prellenar el formulario de actualización
                document.getElementById('update-user-name').value = data.name;
                document.getElementById('update-user-surname').value = data.surname;
                document.getElementById('update-user-email').value = data.email;
                document.getElementById('update-user-phone').value = data.phone || '';
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
            });
        } else {
            console.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
        }
    });

    // Evento para el formulario de actualización
    document.getElementById('update-user-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario

        const token = localStorage.getItem('authToken');

        if (token) {
            // Recopilar datos del formulario
            const updatedUserInfo = {
                name: document.getElementById('update-user-name').value.trim(),
                surname: document.getElementById('update-user-surname').value.trim(),
                email: document.getElementById('update-user-email').value.trim(),
                phone: document.getElementById('update-user-phone').value.trim()
            };

            // Validación de los campos
            if (!updatedUserInfo.name || !updatedUserInfo.surname || !updatedUserInfo.email || !updatedUserInfo.phone) {
                alert('Por favor completa todos los campos.');
                return;
            }

            // Enviar la solicitud PUT
            fetch('https://tu1btc.com/api/user/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, // Aquí se corrige el uso de comillas
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserInfo) // Convierte el objeto a JSON
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la actualización: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Información actualizada del usuario:', data);
                // Mostrar el modal en lugar de la alerta
                document.getElementById('success-modal').classList.remove('hidden'); // Mostrar el modal aquí

                // Actualizar la tabla con la nueva información
                document.getElementById('user-id').textContent = data.id;
                document.getElementById('user-name').textContent = data.name;
                document.getElementById('user-surname').textContent = data.surname;
                document.getElementById('user-email').textContent = data.email;
                document.getElementById('user-phone').textContent = data.phone || 'No disponible';
                document.getElementById('user-active').textContent = data.active ? 'Sí' : 'No';
                document.getElementById('user-roles').textContent = data.roles.join(', ');
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
                alert('Error al actualizar la información.');
            });
        } else {
            console.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
        }
    });

    // Cerrar el modal al hacer clic en la "X"
    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('success-modal').classList.add('hidden'); // Ocultar el modal aquí
    });

    // Cerrar el modal si se hace clic fuera del contenido
    document.getElementById('success-modal').addEventListener('click', function(event) {
        if (event.target === this) { // Solo si se hace clic en el fondo del modal
            this.classList.add('hidden'); // Ocultar el modal aquí
        }
    });
});
