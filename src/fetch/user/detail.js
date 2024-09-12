const userId = document.getElementById('user-id-input').value; 

    fetch(`https://tu1btc.com/api/user/detail/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error en la solicitud');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('Hubo un problema con la solicitud:', error);
          });