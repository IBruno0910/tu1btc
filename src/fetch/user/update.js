document.getElementById('updateUserForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    
    // Capturar los valores del formulario
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const id = document.getElementById('id').value;
    
    // Crear el objeto de datos del usuario
    const userData = {
      name: name,
      surname: surname,
      email: email,
      phone: phone,
      id: id
    };
  
    try {
      // Realizar el fetch para actualizar los datos del usuario
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
  
      // Verificar si la respuesta es exitosa
      if (response.ok) {
        const data = await response.json();
        document.getElementById('responseMessage').innerText = 'Usuario actualizado correctamente';
        console.log('Usuario actualizado:', data);
      } else {
        throw new Error('Error al actualizar los datos del usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('responseMessage').innerText = 'Error al actualizar el usuario';
    }
  });
  