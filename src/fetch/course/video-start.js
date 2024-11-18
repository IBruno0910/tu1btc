// Función para iniciar un video
async function startVideo(videoId) {
    try {
      const response = await fetch('/api/course/startVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idVideo: videoId }),
      });
  
      if (!response.ok) {
        throw new Error('Error al iniciar el video');
      }
      console.log('Video iniciado correctamente');
    } catch (error) {
      console.error(error);
    }
  }
  
  // Función para actualizar el tiempo del video (en segundos)
  async function updateTime(videoId, seconds) {
    try {
      const response = await fetch('/api/course/updateTime', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: videoId,
          seconds: seconds,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el tiempo del video');
      }
      console.log('Tiempo actualizado correctamente');
    } catch (error) {
      console.error(error);
    }
  }
  
  // Función para marcar el video como finalizado
  async function finishVideo(videoId) {
    try {
      const response = await fetch('/api/course/video/finish', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: videoId,
          isEnd: true,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Error al finalizar el video');
      }
      console.log('Video marcado como finalizado');
    } catch (error) {
      console.error(error);
    }
  }
  
  // Detectar el evento de reproducción y gestionar los endpoints
  function handleVideoPlayback(videoElement, videoId) {
    // Enviar el POST para iniciar el video cuando comienza a reproducirse
    startVideo(videoId);
  
    // Actualizar el tiempo cada 5 segundos mientras se reproduce
    videoElement.addEventListener('timeupdate', async () => {
      const currentTime = Math.floor(videoElement.currentTime);
      await updateTime(videoId, currentTime);
    });
  
    // Marcar el video como finalizado cuando el usuario termine de verlo
    videoElement.addEventListener('ended', async () => {
      await finishVideo(videoId);
    });
  }
  
  // Esta función es solo un ejemplo de cómo podrías inicializar el reproductor
  function initializePlayer(videoElement, videoId) {
    handleVideoPlayback(videoElement, videoId);
  }
  
  // Exportar las funciones si necesitas usarlas en otros archivos JS
  export { startVideo, updateTime, finishVideo, handleVideoPlayback, initializePlayer };
  