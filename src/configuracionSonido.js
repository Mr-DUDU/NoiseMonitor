"use strict";

// Author: David Averos
// Last update: 2024-11-04

//------------------------------------------  Configuración de Umbrales & Variables ------------------------------------------ 
// Variables de umbrales de ruido
let umbralSilencioso = 0;
let umbralEstable = 20;
let umbralModerado = umbralEstable + 20;
let umbralAlto = umbralModerado + 20;
/*
Silencioso [0dB - 19dB]
Estable [20dB - 49dB]
Moderado [50dB - 79dB]
Alto [80dB - 100dB]
*/
// Rutas de imágenes para diferentes estados de ruido
const imagenes = {
  silencioso: "./resources/imagenes/silencioso.png",
  estable: "./resources/imagenes/estable.png",
  moderado: "./resources/imagenes/moderado.png",
  alto: "./resources/imagenes/alto.png",
};

// Variable para controlar el estado actual de la imagen para evitar recambios innecesarios
let estadoActualImagen = "silencioso";

////------------------------------------------  Configuración Sonido  ------------------------------------------
// Sincronizar valores al abrir el modal
function inicializarModalCalibracion() {
  // Configurar el slider y etiquetas según los valores actuales
  document.getElementById("sliderEstable").value = umbralEstable;
  document.getElementById("valorEstable").innerText = umbralEstable;

  // Actualizar rangos de umbrales
  actualizarRangosUmbrales();
}

// Actualizar los rangos de umbrales dinámicamente
function actualizarRangosUmbrales() {
  umbralModerado = umbralEstable + 20;
  umbralAlto = umbralModerado + 20;

  document.getElementById("rangoSilencioso").innerText = `${umbralSilencioso} - ${umbralEstable - 1}`;
  document.getElementById("rangoEstable").innerText = `${umbralEstable} - ${umbralModerado - 1}`;
  document.getElementById("rangoModerado").innerText = `${umbralModerado} - ${umbralAlto - 1}`;
  document.getElementById("rangoAlto").innerText = `${umbralAlto} - 120`;
}


// Función para actualizar el valor del umbral estable en tiempo real
function actualizarUmbral(tipo, valor) {
  console.log("Función actualizarUmbral llamada."); // Confirmación de llamada

  // Mostrar los umbrales actuales al inicio
  console.log("Umbrales actuales:");
  console.log(`Silencioso: 0 - ${umbralEstable - 1} dB`);
  console.log(`Estable: ${umbralEstable} - ${umbralModerado - 1} dB`);
  console.log(`Moderado: ${umbralModerado} - ${umbralAlto - 1} dB`);
  console.log(`Alto: ${umbralAlto} - 120 dB`);

  if (tipo === "estable") {
    document.getElementById("valorEstable").innerText = valor;
    umbralEstable = parseInt(valor);

    // Ajustar automáticamente los otros umbrales
    umbralModerado = umbralEstable + 20;
    umbralAlto = umbralModerado + 20;

    // Actualizar los rangos de los umbrales en el modal
    document.getElementById("rangoSilencioso").innerText = `0 - ${umbralEstable - 1}`;
    document.getElementById("rangoEstable").innerText = `${umbralEstable} - ${umbralModerado - 1}`;
    document.getElementById("rangoModerado").innerText = `${umbralModerado} - ${umbralAlto - 1}`;
    document.getElementById("rangoAlto").innerText = `${umbralAlto} - 120`;

    // Mostrar umbrales ajustados
    console.log("Umbrales ajustados:");
    console.log(`Silencioso: 0 - ${umbralEstable - 1} dB`);
    console.log(`Estable: ${umbralEstable} - ${umbralModerado - 1} dB`);
    console.log(`Moderado: ${umbralModerado} - ${umbralAlto - 1} dB`);
    console.log(`Alto: ${umbralAlto} - 120 dB`);
  }
}

// Función para guardar cambios de calibración
function guardarCalibracion() {
  console.log("Función guardarCalibracion llamada."); // Confirmación de llamada
  console.log("Rangos guardados:");
  console.log(`Silencioso: 0 - ${umbralEstable - 1} dB`);
  console.log(`Estable: ${umbralEstable} - ${umbralModerado - 1} dB`);
  console.log(`Moderado: ${umbralModerado} - ${umbralAlto - 1} dB`);
  console.log(`Alto: ${umbralAlto} - 120 dB`);
  alert("Los umbrales se han actualizado correctamente.");
  // Cerrar el modal después de guardar
  const modalCalibracion = bootstrap.Modal.getInstance(document.getElementById('modalCalibracion'));
  if (modalCalibracion) {
    modalCalibracion.hide();
  }
}


/* --------------------- Estilos Generales --------------------- */
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
        //nivelRuido = 59
        /*
        Silencioso [0dB - 19dB]
        Estable [20dB - 39dB]
        Moderado [40dB - 59dB]
        Alto [60dB - 100dB]
        */

        // Llamar al callback con el nivel de ruido y los umbrales actuales
        if (typeof callback === "function") {
          callback(nivelRuido, { umbralEstable, umbralModerado, umbralAlto });
        }

        // Actualizar la visualización del nivel de decibeles en el DOM
        actualizarVisualizacionDecibeles(nivelRuido);

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

function actualizarVisualizacionDecibeles(nivelRuido) {
  const estadoDecibelesElemento = document.getElementById("estado-decibeles");
  if (estadoDecibelesElemento) {
    estadoDecibelesElemento.textContent = `${nivelRuido.toFixed(2)} dB`;
  }
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
  let nuevoEstado = "silencioso";
  //console.log(`Nivel de ruido detectado: ${nivelRuido} dB`); // Registro para verificación
  //console.log(`Umbrales - Silencioso: ${umbralSilencioso}, Estable: ${umbralEstable}, Moderado: ${umbralModerado}, Alto: ${umbralAlto}`); // Verificación de umbrales

  // Cambiar imagen y texto según el nivel de ruido y el estado actual
  if (nivelRuido < umbralEstable) {
    // Silencioso
    if (estadoActualImagen !== "silencioso") {
      cambiarImagen(imagenEstado, imagenes.silencioso, "silencioso");
      textoEstado.innerText = "Silencioso";
    }
    nuevoEstado = "silencioso";
  } else if (nivelRuido >= umbralEstable && nivelRuido < umbralModerado) {
    // Estable
    if (estadoActualImagen !== "estable") {
      cambiarImagen(imagenEstado, imagenes.estable, "estable");
      textoEstado.innerText = "Estable";
    }
    nuevoEstado = "estable";
  } else if (nivelRuido >= umbralModerado && nivelRuido < umbralAlto) {
    // Moderado
    if (estadoActualImagen !== "moderado") {
      cambiarImagen(imagenEstado, imagenes.moderado, "moderado");
      textoEstado.innerText = "Moderado";
    }
    nuevoEstado = "moderado";
  } else if (nivelRuido >= umbralAlto) {
    // Alto
    if (estadoActualImagen !== "alto") {
      cambiarImagen(imagenEstado, imagenes.alto, "alto");
      textoEstado.innerText = "Alto";
    }
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
export { iniciarDeteccionSonido, actualizarUmbral, guardarCalibracion, ajustarVisualizacion, inicializarModalCalibracion };
