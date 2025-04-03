document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("authToken");
    const outputElement = document.getElementById("membership-info");

    if (!token) {
        console.error("No se encontró un token de autenticación.");
        outputElement.innerHTML = "<p>Error: No autenticado. Agrega el token en localStorage.</p>";
        return;
    }

    try {
        const response = await fetch("https://tu1btc.com/api/payment/info", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        console.log("Respuesta del servidor:", data);

        if (!data || !data.payments_manual || data.payments_manual.length === 0) {
            outputElement.innerHTML = "<p>No hay membresías activas.</p>";
            return;
        }

        // Obtener la primera membresía del array `payments_manual`
        const membership = data.payments_manual[0].subscription;

        if (!membership) {
            outputElement.innerHTML = "<p>No se encontró información de la membresía.</p>";
            return;
        }

        // Obtener la imagen con la función reutilizada
        const imageUrl = await fetchSubscriptionImage(membership.image);

        // Formatear la descripción en lista estructurada
        const descriptionItems = membership.description
            .split("\n")
            .map(item => item.trim())
            .filter(item => item !== "");

        const firstParagraph = descriptionItems[0] || "";

        const listItems = descriptionItems
            .slice(1)
            .map(item => {
                if (item.includes("(")) {
                    const [title, details] = item.split("(");
                    const formattedDetails = details
                        .replace(")", "")
                        .split(")")
                        .map(detail => `<li>${detail.trim()}</li>`)
                        .join("");
                    return `<li><strong>${title.trim()}</strong><ul>${formattedDetails}</ul></li>`;
                } else {
                    return `<li>${item}</li>`;
                }
            })
            .join("");

        // Mostrar los detalles en el HTML con el mismo formato de la otra sección
        outputElement.innerHTML = `
            <div class="subscription-details">
                <div class="image-title-container">
                    <div class="image-container">
                        <img src="${imageUrl}" alt="${membership.name}" class="subscription-image">
                    </div>
                    <h1 class="subscription-title">${membership.name}</h1>
                </div>
                <div class="subscription-description">
                    <p>${firstParagraph}</p>
                    <ul>${listItems}</ul>
                </div>
                <div class="div-price">
                <a href="https://wa.me/5491134926411?text=Hola,%20Quiero%20mejorar%20mi%20membresía" class="subscription-button">Mejorar</a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error obteniendo la información:", error);
        outputElement.innerHTML = `<p>Error al obtener datos: ${error.message}</p>`;
    }
});

// Función para obtener la imagen de la membresía
async function fetchSubscriptionImage(imageName) {
    const token = localStorage.getItem("authToken");
    try {
        const response = await fetch(`https://tu1btc.com/api/subscription/image/${imageName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching image: ${response.status}`);
        }

        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error("Error fetching image:", error);
        return "./imgs/05_Membresias/default.jpg"; // Imagen por defecto
    }
}
