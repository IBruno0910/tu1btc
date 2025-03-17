const urlParams = new URLSearchParams(window.location.search);
const subscriptionId = urlParams.get('id');

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

// Realizar el fetch para obtener los detalles de la membresía usando el id
async function fetchSubscriptionDetails() {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`https://tu1btc.com/api/subscription/${subscriptionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching subscription details: ${response.status}`);
        }

        const subscription = await response.json();
        displaySubscriptionDetails(subscription);
    } catch (error) {
        console.error('Error fetching subscription details:', error);
    }
}

// Función para mostrar los detalles de la membresía
async function displaySubscriptionDetails(subscription) {
    const detailsContainer = document.getElementById('details-container');
    
    // Obtener la imagen usando la función fetchSubscriptionImage
    const image = await fetchSubscriptionImage(subscription.images[0]); // Usar la primera imagen (ajusta si es necesario)

    // Convertir la descripción en una lista estructurada
    const descriptionItems = subscription.description
        .split('\n') // Dividir por saltos de línea
        .map(item => item.trim()) // Eliminar espacios en blanco
        .filter(item => item !== ''); // Evitar elementos vacíos

    // Extraer el primer elemento (no será parte de la lista)
    const firstParagraph = descriptionItems[0];

    // Convertir el resto de los elementos en una lista
    const listItems = descriptionItems
        .slice(1) // Ignorar el primer elemento
        .map(item => {
            // Si el texto es largo, lo dividimos en párrafos o listas
            if (item.includes('(')) {
                const [title, details] = item.split('(');
                const formattedDetails = details
                    .replace(')', '') // Eliminar el paréntesis de cierre
                    .split(')') // Dividir si hay más detalles
                    .map(detail => `<li>${detail.trim()}</li>`)
                    .join('');
                return `<li><strong>${title.trim()}</strong><ul>${formattedDetails}</ul></li>`;
            } else {
                return `<li>${item}</li>`;
            }
        })
        .join('');

    // Mostrar los detalles en el contenedor con un diseño más moderno
    detailsContainer.innerHTML = `
        <div class="subscription-details">
            <div class="image-title-container">
                <div class="image-container">
                    <img src="${image}" alt="${subscription.name}" class="subscription-image">
                </div>
                <h1 class="subscription-title">${subscription.name}</h1>
            </div>
            <div class="subscription-description">
                <p>${firstParagraph}</p> <!-- Primer párrafo fuera de la lista -->
                <ul>${listItems}</ul> <!-- Resto de los elementos en lista -->
            </div>
            <div class="subscription-price">
                <span>Precio: </span><strong>$${subscription.price}</strong>
            </div>
            <a href="#" class="subscription-button">Adquirir Membresía</a>
        </div>
    `;
}

// Llamar a la función para obtener los detalles de la membresía
fetchSubscriptionDetails();