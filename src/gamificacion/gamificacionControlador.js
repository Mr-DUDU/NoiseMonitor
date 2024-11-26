let temporizadorInterval;
let tiempoRestante; // Variable global para almacenar el tiempo en segundos
const estrellas = document.querySelectorAll(".fa-star");
// Audios
const sonidoEstrella = new Audio("./resources/audios/estrella_conseguida.mp3");
const sonidoGanar = new Audio('./resources/audios/ganar.mp3');
const sonidoTerminar = new Audio('./resources/audios/terminar.mp3');
const sonidoPerder = new Audio('./resources/audios/perder.mp3');


let estadoMeta = {
  estrellasCompletadas: 0,
  progresoAcumulado: 0,
  tiempoMetaEstable: 0, // Será asignado dinámicamente
  ciclosCompletados: 0,
  totalCiclos: 5, // Número inicial de ciclos
};

function resetearJuego() {
  // Reiniciar estadoMeta
  estadoMeta.estrellasCompletadas = 0;
  estadoMeta.progresoAcumulado = 0;
  estadoMeta.tiempoMetaEstable = 0;
  estadoMeta.ciclosCompletados = 0;
  estadoMeta.totalCiclos = 5;

  // Reiniciar las estrellas (volverlas a grises)
  estrellas.forEach((estrella) => {
    estrella.classList.remove("estrella-activa", "estrella-perdida");
    estrella.classList.add("estrella-inactiva");
  });

  // Reiniciar la barra de progreso
  const barraProgreso = document.getElementById("barraProgreso");
  barraProgreso.style.setProperty("--progreso", "0%");
  barraProgreso.innerText = "";

  // Reiniciar el temporizador
  if (temporizadorInterval) {
    clearInterval(temporizadorInterval); // Detener el temporizador actual
    tiempoRestante = 0; // Reiniciar el tiempo restante
    actualizarVisualizacionTemporizador(); // Actualizar la visualización a 00:00
  }

  console.log("Juego reiniciado.");
}

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
      console.log("Tiempo agotado. 2");
      mostrarEstadoFinal();
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
  const intervalo = 1000;
  estadoMeta.tiempoMetaEstable = tiempoPorCiclo * 0.8;
  let avanceRapido = (tiempoPorCiclo * 0.8) / (tiempoPorCiclo / intervalo);

  function iniciarCiclo() {
    // Reiniciar la barra de progreso al iniciar cada ciclo
    barraProgreso.style.setProperty("--progreso", "0%");
    estadoMeta.progresoAcumulado = 0;

    const timer = setInterval(() => {
      // Verificar si el tiempo restante es 0 o menos
      if (tiempoRestante <= 0) {
        clearInterval(timer);
        console.log("Tiempo agotado. Progreso finalizado.");

        return;
      }
      // Obtener el valor del estado actual desde el DOM
      const estadoElemento = document.getElementById("estado-texto");
      let estadoActual = estadoElemento
        ? estadoElemento.innerText.trim().toLowerCase()
        : "desconocido";

      //console.log("Estado actual:", estadoActual);
      //console.log("# de Ciclos", estadoMeta.totalCiclos);

      // Lógica de avance o retroceso según el estado
      if (estadoActual === "estable" || estadoActual === "silencioso") {
        // Incremento rápido en estado "estable"
        estadoMeta.tiempoMetaEstable = tiempoPorCiclo * 0.6;
        estadoMeta.progresoAcumulado += avanceRapido;
      } else if (estadoActual === "moderado") {
        // Retroceso en estado "moderado"
        estadoMeta.progresoAcumulado -= avanceRapido * 0.2; // O usa otro decremento proporcional si prefieres
      } else if (estadoActual === "alto") {
        if (estadoMeta.totalCiclos > 1) {
          console.log(`Eliminando ciclo ${estadoMeta.totalCiclos}.`);
          estadoMeta.totalCiclos--;
          eliminarCiclo(estadoMeta.estrellasCompletadas);
          marcarUltimaEstrellaPerdida();
          if (estadoMeta.ciclosCompletados >= estadoMeta.totalCiclos) {
            clearInterval(timer);
            console.log("Meta no alcanzada. Se eliminaron demasiados ciclos.");
            clearInterval(temporizadorInterval);
            mostrarEstadoFinal();
            return;
          }
        } else {
          console.log("No se pueden eliminar más ciclos. Meta no alcanzada.");
          mostrarEstadoFinal();
          clearInterval(timer);
          clearInterval(temporizadorInterval);
          return;
        }
      }

      // Actualización del progreso visual
      const porcentajeProgreso = Math.min(
        (estadoMeta.progresoAcumulado / estadoMeta.tiempoMetaEstable) * 100,
        100
      );
      barraProgreso.style.setProperty("--progreso", `${porcentajeProgreso}%`);

      if (porcentajeProgreso >= 100) {
        // Completó el ciclo
        clearInterval(timer);
        estadoMeta.ciclosCompletados++;
        console.log(
          `Ciclo completado: ${estadoMeta.ciclosCompletados}/${estadoMeta.totalCiclos}`
        );

        if (estadoMeta.estrellasCompletadas < estrellas.length) {
          estrellas[estadoMeta.estrellasCompletadas].classList.remove(
            "estrella-inactiva"
          );
          estrellas[estadoMeta.estrellasCompletadas].classList.add(
            "estrella-activa"
          );
          // Reproducir sonido de estrella conseguida
          sonidoEstrella.play().catch((error) => {
            console.error(
              "Error al reproducir sonido de estrella conseguida:",
              error
            );
          });
          estadoMeta.estrellasCompletadas++;
        }

        if (estadoMeta.ciclosCompletados < estadoMeta.totalCiclos) {
          // Si aún quedan ciclos por completar, iniciar el siguiente ciclo
          iniciarCiclo();
        } else if (estadoMeta.totalCiclos === 5) {
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
  const estrellas = document.querySelectorAll(".fa-star");
  for (let i = estrellas.length - 1; i >= 0; i--) {
    if (estrellas[i].classList.contains("estrella-inactiva")) {
      // Quitar la clase de estrella inactiva
      estrellas[i].classList.remove("estrella-inactiva");

      // Agregar la clase de estrella perdida
      estrellas[i].classList.add("estrella-perdida");

      console.log(`Estrella en posición ${i} marcada como perdida.`);
      break; // Terminar el bucle después de encontrar y modificar la última estrella inactiva
    }
  }
}

function mostrarEstadoFinal() {
  // Mostrar el modal de vista final
  const modalVistaFinal = document.getElementById("modalVistaFinal");
  modalVistaFinal.classList.add("show");

  // Seleccionar los elementos dinámicos del modal
  const tituloModal = document.querySelector(".modal-vista-final-titulo");
  const mensajeModal = document.querySelector(".modal-vista-final-mensaje");
  const imagenRepresentacion = document.querySelector(
    ".modal-vista-final-imagen img"
  );
  const barraProgreso = document.querySelector(".barra-progreso-vistaFinal");
  const tablaEstadisticas = document.querySelector(".tabla-estadisticas");

  const porcentajeProgresoFinal = Math.min(
    (estadoMeta.progresoAcumulado / estadoMeta.tiempoMetaEstable) * 100,
    100
  );

  console.log(
    `Progreso acumulado del ciclo actual: ${porcentajeProgresoFinal}`
  );
  console.log("Estrellas:ssss", estadoMeta.estrellasCompletadas);

  // Inicialización del porcentaje total
  let porcentajeTotal =
    estadoMeta.ciclosCompletados === estadoMeta.totalCiclos
      ? estadoMeta.estrellasCompletadas * 20 // Caso en el que se completaron todos los ciclos
      : estadoMeta.estrellasCompletadas < 5
      ? estadoMeta.estrellasCompletadas * 20 + porcentajeProgresoFinal * 0.2 // Caso en el que no se completaron las estrellas
      : 100; // Caso en el que se alcanzó el 100%

  // Debugging opcional
  console.log(
    estadoMeta.estrellasCompletadas < 5 &&
      estadoMeta.ciclosCompletados !== estadoMeta.totalCiclos
      ? "Entró al caso de menos de 5 estrellas"
      : "Entró al caso de 100%"
  );

  if (porcentajeTotal < 0) {
    porcentajeTotal = 0;
  }
  console.log(`Progreso acumulado total: ${porcentajeTotal.toFixed(2)}%`);

  // Agregar datos dinámicos en la tabla de estadísticas
  tablaEstadisticas.innerHTML = `
    <tr>
      <td>Ciclo Completado:</td>
      <td>${estadoMeta.ciclosCompletados}/${estadoMeta.totalCiclos}</td>
    </tr>
    <tr>
      <td>Estrellas Conseguidas:</td>
      <td>${estadoMeta.estrellasCompletadas}</td>
    </tr>
  `;

  // HASTA AHORA MEDIO FUNCIONA PERO ES UN PUNTO DE CONTROL
  if (
    estadoMeta.estrellasCompletadas < 5 &&
    estadoMeta.ciclosCompletados === estadoMeta.totalCiclos &&
    estadoMeta.progresoAcumulado < estadoMeta.tiempoMetaEstable
  ) {
    // Caso perder: Se estaba en el último ciclo pero llegó a alto antes de completarlo
    sonidoPerder.play().catch((error) => console.error("Error al reproducir sonido de perder:", error));
    tituloModal.innerText = "¡PERDISTE!";
    mensajeModal.innerText =
      "Llegaste a alto en el último ciclo. ¡Inténtalo nuevamente!";
    imagenRepresentacion.src = "./resources/imagenes/perder.png";
    barraProgreso.style.width = `${porcentajeTotal}%`;
    barraProgreso.innerText = `${porcentajeTotal.toFixed(2)}%`;
  } else if (
    estadoMeta.estrellasCompletadas === 5 &&
    estadoMeta.ciclosCompletados === estadoMeta.totalCiclos
  ) {
    // Caso ganar
    sonidoGanar.play().catch((error) => console.error("Error al reproducir sonido de ganar:", error));
    tituloModal.innerText = "¡FELICIDADES!";
    mensajeModal.innerText =
      "Todos los ciclos completados, con todas las estrellas. ¡Siuuu!";
    imagenRepresentacion.src = "./resources/imagenes/ganar.png";
    barraProgreso.style.width = `100%`;
    barraProgreso.innerText = `100%`;
  } else if (
    estadoMeta.progresoAcumulado > 0 &&
    estadoMeta.ciclosCompletados < estadoMeta.totalCiclos
  ) {
    // Caso acabar
    sonidoTerminar.play().catch((error) => console.error("Error al reproducir sonido de terminar:", error));
    tituloModal.innerText = "Juego Terminado";
    mensajeModal.innerText = "Casi lo logramos, volvamos a intentarlo.";
    imagenRepresentacion.src = "./resources/imagenes/acabar.png";
    barraProgreso.style.width = `${porcentajeTotal}%`;
    barraProgreso.innerText = `${porcentajeTotal.toFixed(2)}%`;
  } else {
    // Caso genérico de pérdida
    sonidoPerder.play().catch((error) => console.error("Error al reproducir sonido de perder:", error));
    tituloModal.innerText = "¡PERDISTE!";
    mensajeModal.innerText =
      "No se alcanzaron los objetivos. ¡Inténtalo nuevamente!";
    imagenRepresentacion.src = "./resources/imagenes/perder.png";
    barraProgreso.style.width = `${porcentajeTotal}%`;
    barraProgreso.innerText = `${porcentajeTotal.toFixed(2)}%`;
  }

  // Agregar evento para cerrar el modal
  const btnCerrarVistaFinal = document.getElementById("cerrarModalVistaFinal");
  btnCerrarVistaFinal.addEventListener("click", () => {
    modalVistaFinal.classList.remove("show");
  });
}

// Exponer la función de inicio del temporizador si es necesario
export {
  iniciarTemporizador,
  calcularTiempoPorCiclo,
  iniciarBarraDeProgreso,
  resetearJuego,
};
