import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';  
import cors from 'cors';

const app = express();
const PORT = 3000;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Middleware para manejar JSON en solicitudes POST
app.use(bodyParser.json());

// Ruta para registrar al usuario
app.post('/api/user/register', async (req, res) => {
    const { email, phone, name, surname, password, recaptchaToken } = req.body;

    // Verificar si el token de reCAPTCHA está presente
    if (!recaptchaToken) {
        return res.status(400).json({ success: false, message: 'Token de reCAPTCHA no proporcionado.' });
    }

    // Verificar el token con Google reCAPTCHA
    const secretKey = '6LfEA7IqAAAAAE810M0aNEQgk6-PRzADEcKMskwv'; 
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
        const response = await fetch(verificationUrl, { method: 'POST' });
        const data = await response.json();

        if (!data.success) {
            return res.status(400).json({ success: false, message: 'Fallo en la verificación de reCAPTCHA.' });
        }

        // Lógica para registrar el usuario
        // Aquí puedes realizar la llamada a tu API privada para registrar al usuario
        const apiResponse = await fetch('https://tu1btc.com/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                phone,
                name,
                surname,
                password
            })
        });

        const apiData = await apiResponse.json();

        if (apiResponse.ok) {
            res.json({ success: true, message: 'Usuario registrado exitosamente.' });
        } else {
            res.status(400).json({ success: false, message: apiData.message || 'Error en el registro de usuario.' });
        }

    } catch (error) {
        console.error('Error al verificar reCAPTCHA o registrar usuario:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
