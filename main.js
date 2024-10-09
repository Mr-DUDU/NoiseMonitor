"use strict";

//Author: David Averos
//Last update: 2024-10-07

// Variables globales para los umbrales de ruido
let umbralEstable = 20;    // Umbral máximo para "Estable"
let umbralModerado = umbralEstable + 30;   // Umbral máximo para "Moderado"
let umbralAlto = umbralModerado + 30;       // Umbral mínimo para "Alto"

// Función para actualizar el valor del umbral estable en tiempo real y ajustar los otros umbrales
function actualizarUmbral(tipo, valor) {
    if (tipo === 'estable') {
        document.getElementById('valorEstable').innerText = valor;
        umbralEstable = parseInt(valor);
        
        // Ajustar automáticamente los otros umbrales
        umbralModerado = umbralEstable + 30;
        umbralAlto = umbralModerado + 30;
        
        console.log('Umbrales ajustados: Estable:', umbralEstable, 'Moderado:', umbralModerado, 'Alto:', umbralAlto);
    }
}

// Función para guardar los cambios
function guardarCalibracion() {
    alert('Umbrales actualizados: Estable: ' + umbralEstable + ' dB, Moderado: ' + umbralModerado + ' dB, Alto: ' + umbralAlto + ' dB');
}


// Rutas de imágenes para diferentes estados de ruido
const imagenes = {
    estable: "/resources/estable.png",
    moderado: "/resources/moderado.png",
    alto: "/resources/alto.png"
  };

// Variable para controlar el estado actual de la imagen para evitar recambios innecesarios
let estadoActualImagen = 'estable';

// Función para inicializar la detección de sonido y configurar el visualizador
document.addEventListener('DOMContentLoaded', () => {
    iniciarDeteccionSonido();
});

/**
 * Función para iniciar la detección de sonido.
 * Conecta el micrófono al analizador de audio y muestra las barras visuales en el canvas.
 */
function iniciarDeteccionSonido() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        
        analyser.fftSize = 256;  // Configurar la FFT para precisión
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        mediaStreamSource.connect(analyser);

        const canvas = document.getElementById('visualizador');
        const canvasContext = canvas.getContext('2d');

        // Función que dibuja el visualizador en el canvas
        function dibujarVisualizador() {
            requestAnimationFrame(dibujarVisualizador);

            analyser.getByteFrequencyData(dataArray);
            canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

            const barraAncho = (canvas.width / dataArray.length) * 2.5;
            let posX = 0;

            let nivelRuido = calcularNivelRuido(dataArray);  // Obtener nivel medio del ruido

            ajustarVisualizacion(nivelRuido); // Ajustar visualización (barras e imagen)

            for (let i = 0; i < dataArray.length; i++) {
                const valor = dataArray[i];
                const altura = (valor / 256) * canvas.height;

                // Establecer el color de las barras de manera gradual según el nivel de ruido
                canvasContext.fillStyle = calcularColorGradual(nivelRuido, umbralEstable, umbralModerado, umbralAlto);
                canvasContext.fillRect(posX, canvas.height - altura, barraAncho, altura); // Dibujar la barra

                posX += barraAncho + 1;
            }
        }

        // Iniciar el proceso de visualización
        dibujarVisualizador();
    })
    .catch(function(err) {
        console.error('Error al acceder al micrófono:', err);
    });
}

/**
 * Función para calcular el nivel de ruido en base a los datos de frecuencia.
 * @param {Uint8Array} dataArray - Arreglo de frecuencias
 * @returns {number} - Nivel medio de ruido
 */
function calcularNivelRuido(dataArray) {
    let suma = dataArray.reduce((a, b) => a + b, 0);
    return suma / dataArray.length;
}

/**
 * Función para ajustar el color de las barras y cambiar la imagen y el texto del estado
 * de acuerdo con el nivel de ruido.
 * @param {number} nivelRuido - Nivel medio de ruido detectado
 */
function ajustarVisualizacion(nivelRuido) {
    const imagenEstado = document.getElementById('estado-imagen');
    const textoEstado = document.getElementById('estado-texto');  // Elemento del texto del estado

    // Cambiar imagen y texto según el nivel de ruido
    if (nivelRuido < umbralEstable && estadoActualImagen !== 'estable') {
        cambiarImagen(imagenEstado, imagenes.estable, 'estable');
        textoEstado.innerText = 'Estable';  // Actualizar el texto del estado
    } else if (nivelRuido >= umbralEstable && nivelRuido < umbralModerado && estadoActualImagen !== 'moderado') {
        cambiarImagen(imagenEstado, imagenes.moderado, 'moderado');
        textoEstado.innerText = 'Moderado';  // Actualizar el texto del estado
    } else if (nivelRuido >= umbralModerado && estadoActualImagen !== 'alto') {
        cambiarImagen(imagenEstado, imagenes.alto, 'alto');
        textoEstado.innerText = 'Alto';  // Actualizar el texto del estado
    }
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

/**
 * Función para calcular el color de las barras de manera gradual.
 * Se utiliza una interpolación lineal entre colores según el nivel de ruido.
 * @param {number} nivelRuido - Nivel medio de ruido detectado
 * @param {number} umbralEstable - Umbral de ruido para el estado "Estable"
 * @param {number} umbralModerado - Umbral de ruido para el estado "Moderado"
 * @param {number} umbralAlto - Umbral de ruido para el estado "Alto"
 * @returns {string} - Color interpolado en formato RGB para las barras
 */
function calcularColorGradual(nivelRuido, umbralEstable, umbralModerado, umbralAlto) {
    let colorInicial, colorFinal, porcentaje;

    if (nivelRuido < umbralEstable) {
        // Estado "Estable" - Verde
        colorInicial = [0, 255, 0]; // Verde
        colorFinal = [0, 255, 0];   // Mantiene verde para nivel bajo
        porcentaje = 0;  // Sin interpolación
    } else if (nivelRuido >= umbralEstable && nivelRuido < umbralModerado) {
        // Estado "Moderado" - Interpolación de Verde a Amarillo
        colorInicial = [0, 255, 0];   // Verde
        colorFinal = [255, 255, 0];   // Amarillo
        porcentaje = (nivelRuido - umbralEstable) / (umbralModerado - umbralEstable);
    } else {
        // Estado "Alto" - Interpolación de Amarillo a Rojo
        colorInicial = [255, 255, 0]; // Amarillo
        colorFinal = [255, 0, 0];     // Rojo
        porcentaje = (nivelRuido - umbralModerado) / (umbralAlto - umbralModerado); // Corrección en el rango de interpolación
    }

    // Interpolar entre los dos colores
    const colorInterpolado = colorInicial.map((inicio, index) => {
        const final = colorFinal[index];
        return Math.round(inicio + (final - inicio) * porcentaje);
    });

    // Convertir a formato RGB
    return `rgb(${colorInterpolado[0]}, ${colorInterpolado[1]}, ${colorInterpolado[2]})`;
}
