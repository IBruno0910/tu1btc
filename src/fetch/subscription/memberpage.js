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

// Función para obtener los detalles bancarios
async function fetchBankDetails() {
    try {
        const response = await fetch('https://tu1btc.com/api/settings', {
            method: 'GET',
            headers: {
                'accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching bank details');
        }

        const data = await response.json();
        return data.bankAccount;
    } catch (error) {
        console.error('Error fetching bank details:', error);
        return null;
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
                <a href="https://wa.me/541170632504?text=Hola,%20Quiero%20saber%20más%20información%20sobre%20la%20membresía%20exclusiva" class="subscription-button">Contactanos</a>
            </div>
        `;
    } else if (subscription.name === "Membresia Inicial") {
        priceSection = `
            <div class="div-price">
    
                <div class="subscription-price">
                    <div>
                        <span>Precio (1 mes):</span>
                        <strong class="current-price">
                            $${subscription.price}
                            <span class="currency-badge">USD</span>
                        </strong>
                    </div>
                    <button class="subscription-button toggle-payment" data-target="options-1">
                        <i class="fas fa-shopping-cart"></i> Adquirir Membresía
                    </button>
                    <div id="options-1" class="button-group payment-options">
                        <button id="transfPayButton" class="subscription-button">
                            <i class="fas fa-university"></i> Transferencia Bancaria
                        </button>
                        <button id="cryptoPayButton" class="subscription-button" data-period="${subscription.periodMonth}">
                            <i class="fab fa-bitcoin"></i> Criptomonedas
                        </button>
                    </div>
                </div>
    
                <div class="subscription-price">
                    <div class="price-container">
                        <span>Precio (3 meses): <strong class="current-price">
                            $${subscription.pricePeriod}
                            <span class="currency-badge">USD</span>
                        </strong>
                        </span>
                        <span class="previous-price">$150</span>
                    </div>
                    <button class="subscription-button toggle-payment" data-target="options-2">
                        <i class="fas fa-shopping-cart"></i> Adquirir Membresía
                    </button>
                    <div id="options-2" class="button-group payment-options">
                        <button id="transfPayButtonAnual" class="subscription-button">
                            <i class="fas fa-university"></i> Transferencia Bancaria
                        </button>
                        <button id="cryptoPayButtonAnual" class="subscription-button" data-period="${subscription.periodQuarter}">
                            <i class="fab fa-bitcoin"></i> Criptomonedas
                        </button>
                    </div>
                </div>
    
            </div>
        `;
    } else if (subscription.name === "Membresia Intermedia") {
        priceSection = `
            <div class="div-price">
    
                <div class="subscription-price">
                    <div>
                        <span>Precio (3 meses):</span>
                        <strong class="current-price">
                            $${subscription.price}
                            <span class="currency-badge">USD</span>
                        </strong>
                    </div>
                    <button class="subscription-button toggle-payment" data-target="options-1">
                        <i class="fas fa-shopping-cart"></i> Adquirir Membresía
                    </button>
                    <div id="options-1" class="button-group payment-options">
                        <button id="transfPayButton" class="subscription-button">
                            <i class="fas fa-university"></i> Transferencia Bancaria
                        </button>
                        <button id="cryptoPayButton" class="subscription-button" data-period="${subscription.periodMonth}">
                            <i class="fab fa-bitcoin"></i> Criptomonedas
                        </button>
                    </div>
                </div>
    
                <div class="subscription-price">
                    <div class="price-container">
                        <span>Precio (1 año): <strong class="current-price">
                            $${subscription.pricePeriod}
                            <span class="currency-badge">USD</span>
                        </strong>
                        </span>
                        <span class="previous-price">$1400</span>
                    </div>
                    <button class="subscription-button toggle-payment" data-target="options-2">
                        <i class="fas fa-shopping-cart"></i> Adquirir Membresía
                    </button>
                    <div id="options-2" class="button-group payment-options">
                        <button id="transfPayButtonAnual" class="subscription-button">
                            <i class="fas fa-university"></i> Transferencia Bancaria
                        </button>
                        <button id="cryptoPayButtonAnual" class="subscription-button" data-period="${subscription.periodQuarter}">
                            <i class="fab fa-bitcoin"></i> Criptomonedas
                        </button>
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

    function showLoader() {
        const loader = document.createElement('div');
        loader.id = 'js-loader';
        loader.style.cssText = `
          position: fixed; top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
        `;
        loader.innerHTML = `
          <div style="
            width: 50px; height: 50px;
            border: 6px solid #eee; border-top: 6px solid #F39000;
            border-radius: 50%; animation: spin 1s linear infinite;
          "></div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
        document.body.appendChild(loader);
      }
      
      function hideLoader() {
        const loader = document.getElementById('js-loader');
        if (loader) loader.remove();
      }
    
    document.getElementById('cryptoPayButton').addEventListener('click', async () => {
        showLoader();
        const token = localStorage.getItem('authToken');
        const sourceAmount = subscription.price; // Precio mensual
        const currency = 'USD';
        const sourceCurrency = 'USD';
        const idSubscription = subscription.id; 
    
        // Obtener el periodo (días) desde el botón
        const period = document.getElementById('cryptoPayButton').getAttribute('data-period'); // Obtiene el valor del periodo (en días)
    
        try {
            const userRes = await fetch('https://tu1btc.com/api/user/myInformation', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!userRes.ok) throw new Error('No se pudo obtener el email del usuario');
    
            const userData = await userRes.json();
            const email = userData.email;
    
            const response = await fetch('https://tu1btc.com/api/payment/plisio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currency,
                    source_currency: sourceCurrency,
                    source_amount: sourceAmount,
                    email,
                    IdSubscription: idSubscription,  // Usando IdSubscription ahora
                    period: period                   // Se pasa el periodo como número de días
                })
            });
    
            if (!response.ok) throw new Error('Error al crear la factura');
    
            const data = await response.json();
    
            if (data.data && data.data.invoice_url) {
                window.open(data.data.invoice_url, '_blank'); // ⬅️ Abre en nueva pestaña
            } else {
                console.error('No se recibió la URL de factura:', data);
            }
        } catch (error) {
            console.error('Error procesando el pago cripto mensual:', error);
        } finally {
            hideLoader();
        }
    });
    
    document.getElementById('cryptoPayButtonAnual').addEventListener('click', async () => {
        showLoader();
        const token = localStorage.getItem('authToken');
        const sourceAmount = subscription.pricePeriod; // Precio anual
        const currency = 'USD';
        const sourceCurrency = 'USD';
        const idSubscription = subscription.id; // Cambié a IdSubscription
    
        // Obtener el periodo (días) desde el botón
        const period = document.getElementById('cryptoPayButtonAnual').getAttribute('data-period'); // Obtiene el valor del periodo (en días)
    
        try {
            const userRes = await fetch('https://tu1btc.com/api/user/myInformation', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!userRes.ok) throw new Error('No se pudo obtener el email del usuario');
    
            const userData = await userRes.json();
            const email = userData.email;
    
            const response = await fetch('https://tu1btc.com/api/payment/plisio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currency,
                    source_currency: sourceCurrency,
                    source_amount: sourceAmount,
                    email,
                    IdSubscription: idSubscription,  // Usando IdSubscription ahora
                    period: period                   // Se pasa el periodo como número de días
                })
            });
    
            if (!response.ok) throw new Error('Error al crear la factura');
    
            const data = await response.json();
    
            if (data.data && data.data.invoice_url) {
                window.open(data.data.invoice_url, '_blank'); // ⬅️ Abre en nueva pestaña
            } else {
                console.error('No se recibió la URL de factura:', data);
            }
        } catch (error) {
            console.error('Error procesando el pago cripto anual:', error);
        } finally {
            hideLoader();
        }
    });
    
    
    window.copyToClipboard = function(text, btnElement) {
        navigator.clipboard.writeText(text).then(() => {
            const originalSVG = btnElement.getAttribute('data-original');
            const checkSVG = btnElement.getAttribute('data-check');
            btnElement.innerHTML = checkSVG;

            setTimeout(() => {
                btnElement.innerHTML = originalSVG;
            }, 1500);
        }).catch(err => {
            console.error('Error al copiar:', err);
        });
    }

    
    document.getElementById('transfPayButton').addEventListener('click', () => {
        showBankPopup(subscription.price); // Muestra el precio mensual
    });
    
    document.getElementById('transfPayButtonAnual').addEventListener('click', () => {
        showBankPopup(subscription.pricePeriod); // Muestra el precio anual
    });


    async function convertUSDToARS(usdAmount) {
        const API_KEY = 'cur_live_WxhvBXaon5wwRCQsR1SwnXal3uth1psHIoF4su85';
        const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=USD&currencies=ARS`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
    
            if (data && data.data && data.data.ARS) {
                const rate = data.data.ARS.value;
                return (usdAmount * rate).toFixed(2);
            } else {
                console.error("No se pudo obtener la tasa de cambio.");
                return null;
            }
        } catch (error) {
            console.error("Error al convertir moneda:", error);
            return null;
        }
    }
      
    
    
    // Función para mostrar el popup con la información bancaria
    async function showBankPopup(price) {
        const bankDetails = await fetchBankDetails();
        if (!bankDetails) return;
    
        const arsPrice = await convertUSDToARS(price);

        const popup = document.createElement('div');
        popup.classList.add('popup');
    
        popup.innerHTML = `
            <div class="popup-content">
                <h2>TRANSFERENCIA UNICAMENTE EN PESOS ARGENTINOS</h2>
                <hr class="divider">
                <h3>Información Bancaria</h3>
                <hr class="divider-2">
                <div class="bank-info">
                    <div class="info-row">
                        <span class="label">Banco:</span>
                        <span class="value">${bankDetails.bank}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">CBU:</span>
                        <span class="value cbu">
                        ${bankDetails.cbuNumber}
                        <button class="copy-btn" onclick="copyToClipboard('${bankDetails.cbuNumber}', this)" title="Copiar CBU"
                            data-original='<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#555"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z"/></svg>'
                            data-check='<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#28a745"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2l-3.5-3.5L4 14.2l5 5 10-10-1.5-1.5z"/></svg>'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="#555">
                                <path d="M0 0h24v24H0V0z" fill="none"/>
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z"/>
                            </svg>
                        </button>
                        </span>
                    </div>
                    <div class="info-row">
                        <span class="label">Alias:</span>
                        <span class="value">${bankDetails.alias}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Información Adicional:</span>
                        <span class="value">${bankDetails.information}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Precio:</span>
                        <span class="value"> ${arsPrice ? ` $${arsPrice} ARS` : ''}</span> 
                    </div>
                </div>
                <button id="sendReceiptBtn" class="send-btn">Enviar Comprobante</button>
            </div>
        `;
    
        document.body.appendChild(popup);
    
        // Agregar funcionalidad al botón de "Enviar Comprobante"
        document.getElementById('sendReceiptBtn').addEventListener('click', () => {
            window.location.href = 'https://wa.me/541170632504?text=Hola,%20Te%20envío%20el%20comprobante%20de%20pago';
            closePopup(popup);
        });
    
        // Cerrar el popup si se hace clic fuera del contenido
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup(popup);
            }
        });
    }
    
    // Función para cerrar el popup
    function closePopup(popup) {
        document.body.removeChild(popup);
    }


}

// ————— prueba rápida de CurrencyAPI —————
;(async () => {
    try {
      const API_KEY = 'cur_live_WxhvBXaon5wwRCQsR1SwnXal3uth1psHIoF4su85';
      const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=USD&currencies=ARS`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      console.log('🟢 Cotización USD→ARS:', json.data.ARS.value);
      console.log('⏰ Última actualización:', json.meta.last_updated_at);
    } catch (e) {
      console.error('🔴 Error prueba CurrencyAPI:', e);
    }
  })();


// Llamar a la función para obtener los detalles de la membresía
fetchSubscriptionDetails();