let temporizadorInterval;
let tiempoRestante; // Variable global para almacenar el tiempo en segundos
let totalCiclos = 5; // Cambiado a variable mutable
const estrellas = document.querySelectorAll(".fa-star");

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
      console.log("Tiempo agotado.");
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
  const temporizadorElemento = document.getElementById("temporizador");

  // Formatear el tiempo como "MM:SS"
  temporizadorElemento.textContent = `${minutos
    .toString()
    .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}

function calcularTiempoPorCiclo(duracionSeleccionada) {
  // Convierte la duración seleccionada en minutos a milisegundos divididos en 5 ciclos
  const tiempoPorCiclo = (duracionSeleccionada * 60 * 1000) / 5;
  return tiempoPorCiclo;
}

function iniciarBarraDeProgreso(tiempoPorCiclo) {
  const barraProgreso = document.getElementById("barraProgreso");
  let ciclosCompletados = 0;
  let estrellasCompletadas = 0;
  let progresoAcumulado = 0;
  const intervalo = 1000;
  let tiempoMetaEstable = tiempoPorCiclo * 0.8;
  let avanceRapido = (tiempoPorCiclo * 0.8) / (tiempoPorCiclo / intervalo);

  function iniciarCiclo() {
    // Reiniciar la barra de progreso al iniciar cada ciclo
    barraProgreso.style.setProperty("--progreso", "0%");
    progresoAcumulado = 0;

    const timer = setInterval(() => {
      // Verificar si el tiempo restante es 0 o menos
      if (tiempoRestante <= 0) {
        clearInterval(timer);
        console.log("Tiempo agotado. Progreso finalizado.");
        mostrarEstadoFinal(
          estrellasCompletadas,
          progresoAcumulado,
          tiempoMetaEstable
        );
        return;
      }
      // Obtener el valor del estado actual desde el DOM
      const estadoElemento = document.getElementById("estado-texto");
      let estadoActual = estadoElemento
        ? estadoElemento.innerText.trim().toLowerCase()
        : "desconocido";

      console.log("Estado actual:", estadoActual);
      console.log("# de Ciclos", totalCiclos);

      // Lógica de avance o retroceso según el estado
      if (estadoActual === "estable" || estadoActual === "silencioso") {
        // Incremento rápido en estado "estable"
        tiempoMetaEstable = tiempoPorCiclo * 0.6;
        progresoAcumulado += avanceRapido;
      } else if (estadoActual === "moderado") {
        // Retroceso en estado "moderado"
        progresoAcumulado -= avanceRapido * 0.2; // O usa otro decremento proporcional si prefieres
      } else if (estadoActual === "alto") {
        if (totalCiclos > 1) {
          console.log(`Eliminando ciclo ${totalCiclos}.`);
          totalCiclos--;
          eliminarCiclo(estrellasCompletadas);
          marcarUltimaEstrellaPerdida();
          if (ciclosCompletados >= totalCiclos) {
            clearInterval(timer);
            console.log("Meta no alcanzada. Se eliminaron demasiados ciclos.");
            clearInterval(temporizadorInterval);
            return;
          }
        } else {
          console.log("No se pueden eliminar más ciclos. Meta no alcanzada.");
          mostrarEstadoFinal(
            estrellasCompletadas,
            progresoAcumulado,
            tiempoMetaEstable
          );
          clearInterval(timer);
          clearInterval(temporizadorInterval);
          return;
        }
      }

      // Actualización del progreso visual
      const porcentajeProgreso = Math.min(
        (progresoAcumulado / tiempoMetaEstable) * 100,
        100
      );
      barraProgreso.style.setProperty("--progreso", `${porcentajeProgreso}%`);

      if (porcentajeProgreso >= 100) {
        // Completó el ciclo
        clearInterval(timer);
        ciclosCompletados++;
        console.log(`Ciclo completado: ${ciclosCompletados}/${totalCiclos}`);

        if (estrellasCompletadas < estrellas.length) {
          estrellas[estrellasCompletadas].classList.remove("estrella-inactiva");
          estrellas[estrellasCompletadas].classList.add("estrella-activa");
          estrellasCompletadas++;
        }

        if (ciclosCompletados < totalCiclos) {
          // Si aún quedan ciclos por completar, iniciar el siguiente ciclo
          iniciarCiclo();
        } else if (totalCiclos === 5){
          console.log("Todos los ciclos completados, con todas las estrellas.");
          // Aquí puedes agregar lógica adicional si todos los ciclos se completaron
        }

      }
    }, intervalo);
  }

  // Inicia el primer ciclo
  iniciarCiclo();
}

function eliminarCiclo(estrellasCompletadas) {
  console.log("Eliminando un ciclo debido a estado alto.");

}

function marcarUltimaEstrellaPerdida() {
  const estrellas = document.querySelectorAll('.fa-star');
  for (let i = estrellas.length - 1; i >= 0; i--) {
    if (estrellas[i].classList.contains('estrella-inactiva')) {
      // Quitar la clase de estrella inactiva
      estrellas[i].classList.remove('estrella-inactiva');

      // Agregar la clase de estrella perdida
      estrellas[i].classList.add('estrella-perdida');


      console.log(`Estrella en posición ${i} marcada como perdida.`);
      break; // Terminar el bucle después de encontrar y modificar la última estrella inactiva
    }
  }
}

function mostrarEstadoFinal(
  estrellasCompletadas,
  progresoAcumulado,
  tiempoMetaEstable
) {
  const porcentajeProgresoFinal = Math.min(
    (progresoAcumulado / tiempoMetaEstable) * 100,
    100
  );
  const porcentajeTotal =
    estrellasCompletadas * 20 + porcentajeProgresoFinal * 0.2;

  if (estrellasCompletadas < 5) {
console.log('Estrellas completadas: ', estrellasCompletadas);
    console.log(`Progreso acumulado total: ${porcentajeTotal.toFixed(2)}%`);
  }
}

// Exponer la función de inicio del temporizador si es necesario
export { iniciarTemporizador, calcularTiempoPorCiclo, iniciarBarraDeProgreso };
