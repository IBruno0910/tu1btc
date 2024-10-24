async function fetchSubscriptions() {
    try {
        const response = await fetch('https://tu1btc.com/api/subscription');
        const subscriptions = await response.json();
        displaySubscriptions(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
    }
}

function displaySubscriptions(subscriptions) {
    const subscriptionsContainer = document.getElementById('subscriptions-container');
    subscriptionsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

    subscriptions.forEach(subscription => {
        const subscriptionCard = document.createElement('div');
        subscriptionCard.className = 'subscription-card'; // Clase CSS para la tarjeta

        // Determinar la ruta de la imagen según el ID de la suscripción
        let imageUrl = '';
        if (subscription.id === 'id1') {
            imageUrl = '././imgs/05_Membresias/crypto-Essentials.jpg';
        } else if (subscription.id === 'id2') {
            imageUrl = '././imgs/05_Membresias/crypto-TITAN.jpg';
        } else if (subscription.id === 'id3') {
            imageUrl = '././imgs/05_Membresias/crypto-VIP.jpg';
        }

        // Estructura de la tarjeta
        subscriptionCard.innerHTML = `
            <img src="${imageUrl}" alt="${subscription.name}" class="subscription-img" style="width: 100%; height: 200px; object-fit: cover;">
            <h2>${subscription.name}</h2>
            <p>${subscription.description}</p>
            <p>Price: $${subscription.price}</p>
        `;

        // Agregar evento para redirigir al detalle de la suscripción al hacer clic en la tarjeta
        subscriptionCard.addEventListener('click', () => {
            localStorage.setItem('selectedSubscriptionId', subscription.id);
            window.location.href = 'membresiasdetail.html'; // Redirigir a la página de detalles
        });

        // Añadir la tarjeta al contenedor
        subscriptionsContainer.appendChild(subscriptionCard);
    });
}

// Llamar al fetch para obtener y mostrar las suscripciones
fetchSubscriptions();
