document.addEventListener('DOMContentLoaded', function() {
    function obtenerInformacionUsuario() {
        const token = localStorage.getItem('authToken');

        if (token) {
            fetch('https://tu1btc.com/api/user/myInformation', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
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

                // Guardar userId en localStorage
                localStorage.setItem('userId', data.id);

                // Mostrar información en la tabla
                document.getElementById('user-id').textContent = data.id;
                document.getElementById('user-name').textContent = data.name;
                document.getElementById('user-surname').textContent = data.surname;
                document.getElementById('user-email').textContent = data.email;
                document.getElementById('user-phone').textContent = data.phone || 'No disponible';
                verificarMembresiaActiva(token);
                document.getElementById('user-roles').textContent = data.roles.join(', ');

                // Formatear y mostrar la fecha de finalización de la membresía (updateAt)
                if (data.updateAt) {
                    const fechaFormateada = formatearFecha(data.updateAt);
                    document.getElementById('user-update-at').textContent = fechaFormateada;
                } else {
                    document.getElementById('user-update-at').textContent = 'No disponible';
                }

                // Obtener y mostrar el nombre de la membresía
                obtenerNombreMembresia(token);

                // Prellenar el formulario de actualización si existe
                if (document.getElementById('update-user-name')) {
                    document.getElementById('update-user-name').value = data.name;
                    document.getElementById('update-user-surname').value = data.surname;
                    document.getElementById('update-user-email').value = data.email;
                    document.getElementById('update-user-phone').value = data.phone || '';
                }
            })
            .catch(error => {
                console.error('Hubo un problema con la solicitud:', error);
            });
        } else {
            console.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
        }
    }

    // Función para formatear la fecha (año, mes y día)
    function formatearFecha(fecha) {
        const fechaObj = new Date(fecha);
        const año = fechaObj.getFullYear();
        const mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11
        const dia = String(fechaObj.getDate()).padStart(2, '0');
        return `${año}-${mes}-${dia}`;
    }

    function verificarMembresiaActiva(token) {
        fetch('https://tu1btc.com/api/membership/info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json().then(data => ({ status: response.status, data })))
        .then(({ status, data }) => {
            if (status === 401 && !data.error) {
                document.getElementById('user-active').textContent = 'Sí';
                mostrarSeccionMembresia(); // por si se quiere volver a mostrar si está oculta
            } else {
                document.getElementById('user-active').textContent = 'No';
                ocultarSeccionMembresia();
            }
        })
        .catch(error => {
            console.error('Error al verificar membresía activa:', error);
            document.getElementById('user-active').textContent = 'No';
            ocultarSeccionMembresia();
        });
    }
    
    function ocultarSeccionMembresia() {
        const seccion = document.getElementById('membership-section');
        const fechaMembresia = document.getElementById('user-update-at');
    
        if (seccion) {
            seccion.style.display = 'none';
        }
        if (fechaMembresia) {
            fechaMembresia.parentElement.style.display = 'none'; // oculta el <p> que contiene la fecha
        }
    }
    
    function mostrarSeccionMembresia() {
        const seccion = document.getElementById('membership-section');
        const fechaMembresia = document.getElementById('user-update-at');
    
        if (seccion) {
            seccion.style.display = '';
        }
        if (fechaMembresia) {
            fechaMembresia.parentElement.style.display = ''; // vuelve a mostrar el <p>
        }
    }
    
    
    function obtenerNombreMembresia(token) {
        fetch('https://tu1btc.com/api/payment/info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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
            const pagoManual = data.payments_manual?.[0];
    
            if (pagoManual?.subscription?.name) {
                document.getElementById('user-membership').textContent = pagoManual.subscription.name;
            } else {
                document.getElementById('user-membership').textContent = 'No tiene membresía activa';
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
            document.getElementById('user-membership').textContent = 'No disponible';
        });
    }
    
       

    // Llamar a la función para obtener la información del usuario
    obtenerInformacionUsuario();

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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUserInfo)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la actualización: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Información actualizada del usuario:', data);

                // Mostrar el modal de éxito
                document.getElementById('success-modal').classList.remove('hidden');

                // Actualizar la tabla con la nueva información
                document.getElementById('user-id').textContent = data.id;
                document.getElementById('user-name').textContent = data.name;
                document.getElementById('user-surname').textContent = data.surname;
                document.getElementById('user-email').textContent = data.email;
                document.getElementById('user-phone').textContent = data.phone || 'No disponible';
                verificarMembresiaActiva(token);
                document.getElementById('user-roles').textContent = data.roles.join(', ');

                // Volver a obtener la información del usuario después de la actualización
                obtenerInformacionUsuario();
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
        document.getElementById('success-modal').classList.add('hidden');
    });

    // Cerrar el modal si se hace clic fuera del contenido
    document.getElementById('success-modal').addEventListener('click', function(event) {
        if (event.target === this) { 
            this.classList.add('hidden');
        }
    });
});