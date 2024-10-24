// business.js
async function fetchTools() {
    try {
        const response = await fetch('https://tu1btc.com/api/tools/business');
        const tools = await response.json();
        displayTools(tools);
    } catch (error) {
        console.error('Error fetching tools:', error);
    }
}

function displayTools(tools) {
    const toolsContainer = document.getElementById('tools-container');
    toolsContainer.innerHTML = ''; // Limpiar el contenedor

    tools.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'card'; // Clase para el diseño de la card
        toolCard.innerHTML = `
            <img src="https://tu1btc.com/api/tools/image/business/${tool.image}" alt="${tool.title}">
            <h2>${tool.title}</h2>
        `;
        toolCard.addEventListener('click', () => {
            localStorage.setItem('selectedToolId', tool.id);
            window.location.href = 'tool-details.html';
        });
        toolsContainer.appendChild(toolCard);
    });
}

// Llamar a la función para obtener las herramientas
fetchTools();
