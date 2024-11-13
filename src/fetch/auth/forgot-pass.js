async function requestPasswordReset(email) {
    try {
        const response = await fetch(`https://tu1btc.com/api/user/generateLostPassword?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        if (result === true) {
            console.log("Token enviado al correo electrónico.");
            // Mostrar formulario para cambiar la contraseña
            document.getElementById('changePasswordForm').style.display = 'block';
        } else {
            alert("Error: no se pudo enviar el token.");
        }
    } catch (error) {
        console.error("Error en la solicitud de recuperación de contraseña:", error);
    }
}

async function changePassword(email, token, newPassword) {
    try {
        const response = await fetch('https://tu1btc.com/api/user/changePasswordLost', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,            // Aquí pasa el email
                token: token,            // Aquí pasa el token recibido
                newPassword: newPassword // Aquí pasa la nueva contraseña
            }),
        });

        // Esperamos la respuesta y procesamos
        const result = await response.json();

        if (response.ok) {
            alert("Contraseña cambiada exitosamente.");
        } else {
            console.error("Error en la respuesta:", result); // Imprimir el error del servidor
            alert("Hubo un problema al cambiar la contraseña.");
        }
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        alert("Hubo un error en la solicitud.");
    }
}

function handleChangePassword(event) {
    event.preventDefault();

    // Obtener los valores de los campos
    const email = document.getElementById('emailConfirm').value;
    const token = document.getElementById('token').value;
    const newPassword = document.getElementById('newPassword').value;

    // Verificar si los valores están completos
    if (!email || !token || !newPassword) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Llamar a la función para cambiar la contraseña
    changePassword(email, token, newPassword);
}




