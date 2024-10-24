async function fetchSubscriptionDetails() {
    const subscriptionId = localStorage.getItem('selectedSubscriptionId'); // Obtener el ID de la suscripción de localStorage

    if (!subscriptionId) {
        console.error('No subscription ID found in localStorage');
        return;
    }

    try {
        const response = await fetch(`https://tu1btc.com/api/subscription/${subscriptionId}`);
        const subscription = await response.json();

        if (subscription) {
            displaySubscriptionDetails(subscription);
        } else {
            console.error('Subscription not found');
        }
    } catch (error) {
        console.error('Error fetching subscription details:', error);
    }
}

function displaySubscriptionDetails(subscription) {
    const detailsContainer = document.getElementById('subscription-details');
    detailsContainer.innerHTML = `
        <h1 class="subscription-name">${subscription.name}</h1>
        <p class="subscription-price">$${subscription.price}</p>
        <p class="subscription-description">${subscription.description}</p>
    `;
}

// Llamar a la función para obtener los detalles
fetchSubscriptionDetails();
