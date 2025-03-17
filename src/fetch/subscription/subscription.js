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

    const isLoggedIn = !!localStorage.getItem('authToken'); // Verificar si el usuario está logueado

    for (const subscription of subscriptions) {
        const subscriptionCard = document.createElement('div');
        subscriptionCard.className = 'subscription-card';

        // Verifica si hay dos imágenes
        const images = await Promise.all(
            subscription.images.map(imageName => fetchSubscriptionImage(imageName))
        );
        
        const hasMultipleImages = images.length > 1;

        // Limitar descripción a 200 caracteres
        let truncatedDescription = subscription.description.length > 100 
            ? subscription.description.substring(0, 200) + "..."
            : subscription.description;

        // Estructura de la tarjeta
        subscriptionCard.innerHTML = `
            <div class="imgcardsub">
                <img src="${images[0]}" alt="${subscription.name}" class="subscription-img" style="width: 100%; height: 200px; object-fit: cover;">
            </div>
            <h2>${subscription.name}</h2>
            <p class="subscription-description">${truncatedDescription}</p>
        `;

        if (isLoggedIn) {
            const contentButton = document.createElement("button");
            contentButton.className = "member-content-button";
            contentButton.textContent = "Contenido";

            // Redirigir al hacer clic en el botón "Contenido"
            contentButton.addEventListener('click', () => {
                window.location.href = `memberpage.html?id=${subscription.id}`; // Redirige a la página de detalles
            });

            subscriptionCard.appendChild(contentButton);
        }

        // Mostrar modal si el usuario no está logueado al hacer clic en la tarjeta
        subscriptionCard.addEventListener('click', () => {
            if (!isLoggedIn) {
                showModal();
            }
        });

        // Si tiene dos imágenes, cambiar la imagen al pasar el mouse
        if (hasMultipleImages) {
            const imgElement = subscriptionCard.querySelector('.subscription-img');
            
            subscriptionCard.addEventListener('mouseenter', () => {
                imgElement.src = images[1]; // Cambia a la segunda imagen
            });
            
            subscriptionCard.addEventListener('mouseleave', () => {
                imgElement.src = images[0]; // Vuelve a la primera imagen
            });
        }

        subscriptionsContainer.appendChild(subscriptionCard);
    }
}


// Función para mostrar el modal
function showModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';

    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Cierra el modal si el usuario hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
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
