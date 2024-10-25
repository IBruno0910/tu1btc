const token = localStorage.getItem('authToken'); // Asegúrate de que el token esté almacenado

// Función de inicio del video
async function startVideo() {
    try {
        const response = await fetch('https://tu1btc.com/api/course/startVideo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idVideo: videoId })
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        console.log('Video started');
    } catch (error) {
        console.error('Failed to start video', error);
    }
}

// Función para actualizar el tiempo
async function updateTime(seconds) {
    try {
        const response = await fetch('https://tu1btc.com/api/course/updateTime', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: videoId, seconds })
        });
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        console.log('Video time updated');
    } catch (error) {
        console.error('Failed to update video time', error);
    }
}
