let temporizadorInterval;
let tiempoRestante; // Variable global para almacenar el tiempo en segundos

/**
 * Función para iniciar el temporizador.
 * @param {number} duracion - Duración de la meta en minutos.
 */
function iniciarTemporizador(duracion) {
  // Convertir minutos a segundos
  tiempoRestante = duracion * 60;

  // Actualizar la visualización al iniciar
  actualizarVisualizacionTemporizador();

  // Limpiar cualquier temporizador previo
  if (temporizadorInterval) {
    clearInterval(temporizadorInterval);
  }

  // Iniciar el temporizador
  temporizadorInterval = setInterval(() => {
    if (tiempoRestante <= 0) {
      clearInterval(temporizadorInterval);
      console.log("Meta completada o tiempo agotado.");
      return;
    }

    tiempoRestante--; // Reducir tiempo
    actualizarVisualizacionTemporizador(); // Actualizar visualización
  }, 1000);
}

/**
 * Función para actualizar la visualización del temporizador.
 */
function actualizarVisualizacionTemporizador() {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const temporizadorElemento = document.getElementById('temporizador');

  // Formatear el tiempo como "MM:SS"
  temporizadorElemento.textContent = `${minutos
    .toString()
    .padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Exponer la función de inicio del temporizador si es necesario
export { iniciarTemporizador };
