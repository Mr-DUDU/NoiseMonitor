"use strict";

// Author: David Averos
// Last update: 2024-11-04

//---------------------------- Configuración de Umbrales -----------------------

// Variables de umbrales de ruido
let umbralEstable = 20;
let umbralModerado = umbralEstable + 30;
let umbralAlto = umbralModerado + 30;

// Rutas de imágenes para diferentes estados de ruido
const imagenes = {
  estable: "./resources/estable.png",
  moderado: "./resources/moderado.png",
  alto: "./resources/alto.png",
};

// Variable para controlar el estado actual de la imagen para evitar recambios innecesarios
let estadoActualImagen = "estable";

// Función para actualizar el valor del umbral estable en tiempo real
function actualizarUmbral(tipo, valor) {
  console.log("Función actualizarUmbral llamada."); // Confirmación de llamada
  if (tipo === "estable") {
    document.getElementById("valorEstable").innerText = valor;
    umbralEstable = parseInt(valor);

    // Ajustar automáticamente los otros umbrales
    umbralModerado = umbralEstable + 40; // Corrección del cálculo para que sea coherente
    umbralAlto = umbralModerado + 30;

    // Actualizar los rangos de los umbrales en el modal
    document.getElementById("rangoEstable").innerText = `${umbralEstable} - ${
      umbralModerado - 1
    }`;
    document.getElementById("rangoModerado").innerText = `${umbralModerado} - ${
      umbralAlto - 1
    }`;
    document.getElementById("rangoAlto").innerText = `${umbralAlto} - 150`;

    console.log("Umbrales ajustados:", {
      umbralEstable,
      umbralModerado,
      umbralAlto,
    });
  }
}

// Función para guardar cambios de calibración
function guardarCalibracion() {
  console.log("Función guardarCalibracion llamada."); // Confirmación de llamada
  alert("Los umbrales se han actualizado correctamente.");
}

//---------------------------- Captura de Sonido -----------------------

/**
 * Función para iniciar la detección de sonido.
 * @param {function} callback - Función que recibirá nivel de ruido y umbrales para enviarlos al enrutador.
 */
function iniciarDeteccionSonido(callback) {
  console.log("Intentando acceder al micrófono..."); // Mensaje inicial de diagnóstico

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      console.log("Acceso al micrófono concedido."); // Confirmación de acceso

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const mediaStreamSource = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      mediaStreamSource.connect(analyser);

      // Función que procesa el nivel de ruido en tiempo real
      function procesarNivelRuido() {
        requestAnimationFrame(procesarNivelRuido);
        analyser.getByteFrequencyData(dataArray);
        let nivelRuido = calcularNivelRuido(dataArray);

        // Llamar al callback con el nivel de ruido y los umbrales actuales
        if (typeof callback === "function") {
          callback(nivelRuido, { umbralEstable, umbralModerado, umbralAlto });
        }

        // Ajustar visualización según el nivel de ruido para la imagen y texto
        ajustarVisualizacion(nivelRuido);
      }

      procesarNivelRuido();
    })
    .catch(function (err) {
      console.error("Error al acceder al micrófono:", err); // Mostrar error si el acceso es denegado
    });
}

// Función para calcular el nivel medio de ruido
function calcularNivelRuido(dataArray) {
  let suma = dataArray.reduce((a, b) => a + b, 0);
  return suma / dataArray.length;
}

//---------------------------- Visualización del Estado de Ruido -----------------------

/**
 * Función para ajustar la visualización de la imagen y el texto del estado
 * de acuerdo con el nivel de ruido y los umbrales actuales.
 * @param {number} nivelRuido - Nivel medio de ruido detectado
 */
function ajustarVisualizacion(nivelRuido) {
  const imagenEstado = document.getElementById("estado-imagen");
  const textoEstado = document.getElementById("estado-texto"); // Elemento del texto del estado
  let nuevoEstado = "estable";

  // Cambiar imagen y texto según el nivel de ruido y el estado actual
  if (nivelRuido < umbralEstable && estadoActualImagen !== "estable") {
    cambiarImagen(imagenEstado, imagenes.estable, "estable");
    textoEstado.innerText = "Estable"; // Actualizar el texto del estado
    nuevoEstado = "estable";
  } else if (
    nivelRuido >= umbralEstable &&
    nivelRuido < umbralModerado &&
    estadoActualImagen !== "moderado"
  ) {
    cambiarImagen(imagenEstado, imagenes.moderado, "moderado");
    textoEstado.innerText = "Moderado"; // Actualizar el texto del estado
    nuevoEstado = "moderado";
  } else if (nivelRuido >= umbralModerado && estadoActualImagen !== "alto") {
    cambiarImagen(imagenEstado, imagenes.alto, "alto");
    textoEstado.innerText = "Alto"; // Actualizar el texto del estado
    nuevoEstado = "alto";
  }

  return nuevoEstado;
}


/**
 * Función para cambiar la imagen con una transición suave.
 * @param {HTMLElement} imagenElemento - El elemento de la imagen que se va a cambiar
 * @param {string} nuevaImagen - URL o base64 de la nueva imagen
 * @param {string} nuevoEstado - El nuevo estado de la imagen para evitar recambios innecesarios
 */
function cambiarImagen(imagenElemento, nuevaImagen, nuevoEstado) {
  imagenElemento.style.opacity = 0; // Inicia el fade out
  setTimeout(() => {
    imagenElemento.src = nuevaImagen; // Cambia la imagen
    imagenElemento.style.opacity = 1; // Aplica el fade in
    estadoActualImagen = nuevoEstado; // Actualiza el estado actual
  }, 500); // Duración de la transición (coincide con la duración del fade)
}

//---------------------------- Exportaciones -----------------------

export { iniciarDeteccionSonido, actualizarUmbral, guardarCalibracion, ajustarVisualizacion };
