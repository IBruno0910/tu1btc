async function fetchSubscriptions() {
    try {
        const token = localStorage.getItem('authToken'); // Obtener el token de localStorage
        const response = await fetch('https://tu1btc.com/api/subscription', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token si es necesario
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const subscriptions = await response.json();
        displaySubscriptions(subscriptions);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
    }
}

async function displaySubscriptions(subscriptions) {
    const subscriptionsContainer = document.getElementById('subscriptions-container');
    subscriptionsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

    for (const subscription of subscriptions) {
        const subscriptionCard = document.createElement('div');
        subscriptionCard.className = 'subscription-card'; // Clase CSS para la tarjeta

        // Obtener la imagen de la suscripción
        const imageUrl = await fetchSubscriptionImage(subscription.image);

        // Estructura de la tarjeta
        subscriptionCard.innerHTML = `
            <div class="imgcardsub">            
                <img src="${imageUrl}" alt="${subscription.name}" class="subscription-img" style="width: 100%; height: 200px; object-fit: cover;">
            </div>
            <h2>${subscription.name}</h2>
            <p>${subscription.description}</p>
            <p>Precio: $${subscription.price}</p>
        `;

        // Añadir la tarjeta al contenedor
        subscriptionsContainer.appendChild(subscriptionCard);
    }
}

// Función para obtener la imagen de la suscripción
async function fetchSubscriptionImage(imageName) {
    const token = localStorage.getItem('authToken'); // Obtener el token de localStorage
    try {
        const response = await fetch(`https://tu1btc.com/api/subscription/image/${imageName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluir el token si es necesario
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.status}`);
        }

        const blob = await response.blob(); // Obtener la imagen como un blob
        return URL.createObjectURL(blob); // Crear un URL para el blob
    } catch (error) {
        console.error('Error fetching image:', error);
        return './imgs/05_Membresias/default.jpg'; // Imagen por defecto si hay un error
    }
}

// Llamar al fetch para obtener y mostrar las suscripciones
fetchSubscriptions();
