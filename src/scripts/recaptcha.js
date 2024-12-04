// Función para obtener el token del reCAPTCHA
async function validateRecaptcha() {
    return new Promise((resolve, reject) => {
        const recaptchaResponse = grecaptcha.getResponse(); // Obtener el token del reCAPTCHA

        if (!recaptchaResponse) {
            reject("Por favor, completa el reCAPTCHA.");
        } else {
            resolve(recaptchaResponse);
        }
    });
}

// Función para verificar el token del reCAPTCHA con la API de Google
async function verifyRecaptchaToken(token) {
    try {
        // Endpoint de verificación (modificar si decides implementar backend)
        const url = `https://www.google.com/recaptcha/api/siteverify`;
        const secretKey = "6LeRcpEqAAAAAIqB6PuUyUMF1KwkEca2udT0XtkN"; // Reemplaza con tu clave secreta

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${secretKey}&response=${token}`,
        });

        const data = await response.json();

        if (data.success) {
            return true;
        } else {
            throw new Error("Error en la validación del reCAPTCHA.");
        }
    } catch (error) {
        console.error("Error verificando el reCAPTCHA:", error);
        throw error;
    }
}
