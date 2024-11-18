document.addEventListener("DOMContentLoaded", () => {
    const requestTokenForm = document.getElementById("request-token-form");
    const changePasswordForm = document.getElementById("change-password-form");
    const requestResponse = document.getElementById("request-response");
    const changePasswordSection = document.getElementById("change-password");
    const changeResponse = document.getElementById("change-response");
  
    // Función para validar la contraseña
    const isPasswordValid = (password) => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };
  
    // Solicitar token
    requestTokenForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      let email = document.getElementById("email-token").value.trim().toLowerCase(); // Convertir el correo a minúsculas
  
      if (!email) {
        requestResponse.textContent = "Por favor ingresa un correo electrónico válido.";
        return;
      }
  
      try {
        const response = await fetch(`https://tu1btc.com/api/user/generateLostPassword?email=${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.ok) {
          requestResponse.textContent = "Un token ha sido enviado a tu correo.";
          changePasswordSection.style.display = "block"; // Muestra el formulario para cambiar la contraseña
        } else {
          const errorData = await response.json();
          requestResponse.textContent = `Error: ${errorData.message || "No se pudo completar la solicitud."}`;
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        requestResponse.textContent = "Ocurrió un problema al procesar tu solicitud.";
      }
    });
  
    // Cambiar la contraseña
    changePasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const token = document.getElementById("token").value.trim();
      const email = document.getElementById("email-token").value.trim().toLowerCase(); // Convertir el correo a minúsculas
      const newPassword = document.getElementById("new-password").value.trim();
  
      // Validación de la contraseña
      if (!isPasswordValid(newPassword)) {
        changeResponse.textContent = "La contraseña debe tener al menos 8 caracteres, una mayúscula y un carácter especial.";
        return;
      }
  
      if (!token || !email || !newPassword) {
        changeResponse.textContent = "Por favor, completa todos los campos.";
        return;
      }
  
      try {
        const response = await fetch("https://tu1btc.com/api/user/changePasswordLost", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            email: email,
            password: newPassword,
          }),
        });
  
        if (response.ok) {
          changeResponse.textContent = "Tu contraseña ha sido cambiada con éxito.";
          // Redirigir a la página de login después de un cambio exitoso
          setTimeout(() => {
            window.location.href = "login.html"; // Redirige a login.html
          }, 2000); // Espera 2 segundos antes de redirigir
        } else {
          const errorData = await response.json();
          changeResponse.textContent = `Error: ${errorData.message || "No se pudo cambiar la contraseña."}`;
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        changeResponse.textContent = "Ocurrió un problema al procesar tu solicitud.";
      }
    });
  });
  