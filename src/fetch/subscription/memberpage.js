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

async function displaySubscriptionDetails(subscription) {
    const detailsContainer = document.getElementById('details-container');
    
    // Obtener la imagen usando la función fetchSubscriptionImage
    const image = await fetchSubscriptionImage(subscription.images[0]);

    // Convertir la descripción en una lista estructurada
    const descriptionItems = subscription.description
        .split('\n')
        .map(item => item.trim())
        .filter(item => item !== '');

    const firstParagraph = descriptionItems[0];

    const listItems = descriptionItems
        .slice(1)
        .map(item => {
            if (item.includes('(')) {
                const [title, details] = item.split('(');
                const formattedDetails = details
                    .replace(')', '')
                    .split(')')
                    .map(detail => `<li>${detail.trim()}</li>`)
                    .join('');
                return `<li><strong>${title.trim()}</strong><ul>${formattedDetails}</ul></li>`;
            } else {
                return `<li>${item}</li>`;
            }
        })
        .join('');

    // Verificar si la membresía es "Membresía Exclusiva"
    let priceSection = '';
    if (subscription.name === "Membresia Exclusiva") {
        priceSection = `
            <div class="div-price">
                <a href="https://wa.me/5491134926411?text=Hola,%20Quiero%20saber%20más%20información%20sobre%20la%20membresía%20exclusiva" class="subscription-button">Contactanos</a>
            </div>
        `;
    } else {
        priceSection = `
    <div class="div-price">

        <div class="subscription-price">
            <span>Precio: </span><strong>$${subscription.price}</strong>
            <button class="subscription-button toggle-payment" data-target="options-1">
                <i class="fas fa-shopping-cart"></i> Adquirir Membresía
            </button>
            <div id="options-1" class="button-group payment-options" ">
                <a href="pago-transferencia.html?id=${subscription.id}&plan=mensual" class="subscription-button">
                    <i class="fas fa-university"></i> Transferencia Bancaria
                </a>
                <a href="pago-cripto.html?id=${subscription.id}&plan=mensual" class="subscription-button">
                    <i class="fab fa-bitcoin"></i> Criptomonedas
                </a>
            </div>
        </div>

        <div class="subscription-price">
            <span>Precio: </span><strong>$${subscription.price}</strong>
            <button class="subscription-button toggle-payment" data-target="options-2">
                <i class="fas fa-shopping-cart"></i> Adquirir Membresía
            </button>
            <div id="options-2" class="button-group payment-options" ">
                <a href="pago-transferencia.html?id=${subscription.id}&plan=anual" class="subscription-button">
                    <i class="fas fa-university"></i> Transferencia Bancaria
                </a>
                <a href="pago-cripto.html?id=${subscription.id}&plan=anual" class="subscription-button">
                    <i class="fab fa-bitcoin"></i> Criptomonedas
                </a>
            </div>
        </div>

    </div>
`;

    }

    // Mostrar los detalles en el contenedor
    detailsContainer.innerHTML = `
        <div class="subscription-details">
            <div class="image-title-container">
                <div class="image-container">
                    <img src="${image}" alt="${subscription.name}" class="subscription-image">
                </div>
                <h1 class="subscription-title">${subscription.name}</h1>
            </div>
            <div class="subscription-description">
                <p>${firstParagraph}</p>
                <ul>${listItems}</ul>
            </div>
            ${priceSection} <!-- Aquí se inserta la sección de precios o WhatsApp -->
        </div>
    `;
    document.querySelectorAll('.toggle-payment').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const options = document.getElementById(targetId);
            if (options.classList.contains('visible')) {
                options.classList.remove('visible');
            } else {
                // Oculta todos los demás por si querés que solo se vea uno a la vez
                document.querySelectorAll('.payment-options').forEach(opt => opt.classList.remove('visible'));
                options.classList.add('visible');
            }
        });
    });      
    
}


// Llamar a la función para obtener los detalles de la membresía
fetchSubscriptionDetails();