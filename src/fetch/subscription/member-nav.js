document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("authToken");
    const outputElement = document.getElementById("membership-info");

    if (!token) {
        console.error("No se encontró un token de autenticación.");
        outputElement.innerHTML = "<p>Error: No autenticado. Agrega el token en localStorage.</p>";
        return;
    }

    try {
        // 1. Obtener el subscriptionId desde /api/membership/info
        const membershipRes = await fetch("https://tu1btc.com/api/membership/info", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!membershipRes.ok) {
            throw new Error("No se pudo obtener la membresía");
        }

        const membershipData = await membershipRes.json();
        console.log("Membership Info:", membershipData);

        if (!membershipData || membershipData.length === 0 || !membershipData[0].subscriptionId) {
            outputElement.innerHTML = "<p>No tienes una membresía activa.</p>";
            return;
        }

        const subscriptionId = membershipData[0].subscriptionId;

        // 2. Obtener info detallada desde /api/subscription/:id
        const subscriptionRes = await fetch(`https://tu1btc.com/api/subscription/${subscriptionId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!subscriptionRes.ok) {
            throw new Error("No se pudo obtener información de la suscripción");
        }

        const subscription = await subscriptionRes.json();
        console.log("Subscription Data:", subscription);

        if (!subscription || !subscription.description || !subscription.name) {
            outputElement.innerHTML = "<p>No se encontró información de la suscripción.</p>";
            return;
        }

        // Obtener imagen
        const imageUrl = await fetchSubscriptionImage(subscription.images);

        // Descripción procesada
        const descriptionItems = subscription.description
            .split("\n")
            .map(item => item.trim())
            .filter(item => item !== "");

        const firstParagraph = descriptionItems[0] || "";

        const listItems = descriptionItems
            .slice(1)
            .map(item => `<li>${item}</li>`)
            .join("");

        // Mostrar HTML
        outputElement.innerHTML = `
            <div class="subscription-details">
                <div class="image-title-container">
                    <div class="image-container">
                        <img src="${imageUrl}" alt="${subscription.name}" class="subscription-image">
                    </div>
                    <h1 class="subscription-title">${subscription.name}</h1>
                </div>
                <div class="subscription-description">
                    <p>${firstParagraph}</p>
                    <ul>${listItems}</ul>
                </div>
                <div class="div-price">
                    <a href="https://wa.me/541170632504?text=Hola,%20Quiero%20mejorar%20mi%20membresía" class="subscription-button">Mejorar</a>
                </div>
            </div>
        `;

    } catch (error) {
        console.error("Error:", error);
        outputElement.innerHTML = `<p>Error al obtener datos: ${error.message}</p>`;
    }
});

// Función para obtener la imagen
async function fetchSubscriptionImage(imageName) {
    const token = localStorage.getItem("authToken");
    try {
        const res = await fetch(`https://tu1btc.com/api/subscription/image/${imageName}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("Error obteniendo imagen");
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        console.error("Error al cargar la imagen:", err);
        return "./imgs/05_Membresias/default.jpg";
    }
}
