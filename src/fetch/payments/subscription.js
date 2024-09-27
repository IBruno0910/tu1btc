document.getElementById('payment-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Previene que el formulario se recargue si es parte de un form

    // Captura el valor del email desde un input
    const email = document.getElementById('email-input').value;

    // Verifica que el email no esté vacío
    if (email) {
        // Crea el cuerpo de la solicitud
        const requestBody = {
            email: email
        };

        // Realiza el fetch al endpoint de creación de suscripción
        fetch('https://tu1btc.com/api/payment/subscription/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Si es necesario el token de autenticación
            },
            body: JSON.stringify(requestBody) // Convierte el objeto a JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Link de pago creado:', data);

            // Si deseas redirigir al usuario al link de pago:
            if (data.paymentLink) {
                window.location.href = data.paymentLink; // Redirige al usuario al link de pago si se proporciona
            } else {
                console.log('Link de pago no proporcionado en la respuesta.');
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
        });
    } else {
        console.error('Por favor, ingresa un correo electrónico válido.');
    }
});
