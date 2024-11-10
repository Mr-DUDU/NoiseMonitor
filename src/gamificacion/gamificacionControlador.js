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

// Ejemplo de inicialización en gamificacion.js o donde se controla el flujo
const duracionSeleccionada = 25; // Este valor debe venir de la selección en el modal
const tiempoPorCiclo = calcularTiempoPorCiclo(duracionSeleccionada);

function calcularTiempoPorCiclo(duracionSeleccionada) {
  console.log('Función calcularTiempoPorCiclo llamada con duración:', duracionSeleccionada);

  if (typeof duracionSeleccionada !== 'number' || duracionSeleccionada <= 0) {
      console.warn("Duración seleccionada no válida:", duracionSeleccionada);
      return;
  }

  const tiempoPorCiclo = (duracionSeleccionada * 60 * 1000) / 5;
  console.log(`Duración total seleccionada: ${duracionSeleccionada} minutos`);
  console.log(`Tiempo por ciclo calculado: ${tiempoPorCiclo} ms`);
  
  return tiempoPorCiclo;
}

function iniciarBarraDeProgreso(tiempoPorCiclo) {
  const barraProgreso = document.getElementById('barraProgreso');
  const estrellas = document.querySelectorAll('.fa-star'); // Seleccionar las estrellas
  let tiempoTranscurrido = 0;
  let ciclosCompletados = 0;
  let estrellasCompletadas = 0;
  const totalCiclos = 5; // Siempre serán 5 ciclos
  const intervalo = 1000; // 1000 ms (1 segundo)
  const incrementoPorIntervalo = (100 / (tiempoPorCiclo / intervalo));

  function iniciarCiclo() {
    // Reiniciar la barra de progreso al iniciar
    barraProgreso.style.setProperty('--progreso', '0%');
    tiempoTranscurrido = 0;

    const timer = setInterval(() => {
      tiempoTranscurrido += intervalo;
      const porcentajeProgreso = Math.min((tiempoTranscurrido / tiempoPorCiclo) * 100, 100);

      // Actualiza el ancho de la barra de progreso
      barraProgreso.style.setProperty('--progreso', `${porcentajeProgreso}%`);

      // Verifica si el ciclo se ha completado
      if (tiempoTranscurrido >= tiempoPorCiclo) {
        clearInterval(timer);
        ciclosCompletados++;
        console.log(`Ciclo completado: ${ciclosCompletados}/${totalCiclos}`);

        // Lógica para marcar una estrella como completa
        if (estrellasCompletadas < estrellas.length) {
          estrellas[estrellasCompletadas].classList.remove('estrella-inactiva');
          estrellas[estrellasCompletadas].classList.add('estrella-activa');
          estrellasCompletadas++;
        }

        if (ciclosCompletados < totalCiclos) {
          // Si aún quedan ciclos por completar, iniciar el siguiente ciclo
          iniciarCiclo();
        } else {
          console.log('Todos los ciclos completados');
          // Aquí puedes agregar lógica adicional si todos los ciclos se completaron
        }
      }
    }, intervalo);
  }

  // Inicia el primer ciclo
  iniciarCiclo();
}

// Exponer la función de inicio del temporizador si es necesario
export { iniciarTemporizador, calcularTiempoPorCiclo , iniciarBarraDeProgreso};
