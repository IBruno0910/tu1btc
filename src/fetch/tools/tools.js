// tool-details.js
async function fetchToolDetails() {
    const toolId = localStorage.getItem('selectedToolId');
    
    if (!toolId) {
        console.error('No tool ID found in localStorage');
        return;
    }
    
    try {
        const response = await fetch('https://tu1btc.com/api/tools/business'); // Obtener todas las herramientas
        const tools = await response.json();
        const tool = tools.find(t => t.id === toolId); // Buscar la herramienta por ID

        if (tool) {
            displayToolDetails(tool);
        } else {
            console.error('Tool not found');
        }
    } catch (error) {
        console.error('Error fetching tool details:', error);
    }
}

function displayToolDetails(tool) {
    const toolDetailsContainer = document.getElementById('tool-details');
    toolDetailsContainer.innerHTML = `
        <div class="tool-details-content">
            <img src="https://tu1btc.com/api/tools/image/business/${tool.image}" alt="${tool.title}" class="tool-image">
            <div class="tool-info">
                <h1 class="tool-title">${tool.title}</h1>
                <p class="tool-description">${tool.description}</p>
            </div>
        </div>
    `;
}


// Llamar a la función para mostrar los detalles
fetchToolDetails();
