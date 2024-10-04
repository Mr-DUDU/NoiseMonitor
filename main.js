"use strict";

// Autor: MrDUDU - David Averos
// Última actualización: 2024-10-03

// Esperar a que el documento se haya cargado completamente antes de iniciar
document.addEventListener('DOMContentLoaded', () => {
    iniciarDeteccionSonido();
});

/**
 * Función para iniciar la detección de sonido y configurar el visualizador de audio.
 */
function iniciarDeteccionSonido() {
    // Solicitar acceso al micrófono
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        // Crear el contexto de audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        // Configurar el analizador
        analyser.fftSize = 256;  // Tamaño FFT para precisión en las frecuencias
        const dataArray = new Uint8Array(analyser.frequencyBinCount);  // Crear arreglo de datos de frecuencias
        mediaStreamSource.connect(analyser);  // Conectar el flujo de audio al analizador

        // Obtener el contexto del canvas donde se dibujarán las barras
        const canvas = document.getElementById('visualizador');
        const canvasContext = canvas.getContext('2d');

        // Función para dibujar el visualizador de barras
        function dibujarVisualizador() {
            // Solicitar el siguiente frame de animación
            requestAnimationFrame(dibujarVisualizador);

            // Obtener los datos de frecuencia de audio en tiempo real
            analyser.getByteFrequencyData(dataArray);

            // Limpiar el canvas (usando el fondo blanco definido en CSS)
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            // Dibujar las barras
            const barraAncho = (canvas.width / dataArray.length) * 2.5; // Ajusta el tamaño de las barras
            let posX = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const valor = dataArray[i];  // Valor de la frecuencia actual
                const altura = (valor / 256) * canvas.height;  // Escalar a la altura del canvas

                // Estilo de las barras
                canvasContext.fillStyle = 'purple';  // Color de las barras
                canvasContext.fillRect(posX, canvas.height - altura, barraAncho, altura);  // Dibujar la barra

                posX += barraAncho + 1;  // Espacio entre barras
            }
        }

        // Iniciar la visualización
        dibujarVisualizador();
    })
    .catch(function(err) {
        // Manejar errores de acceso al micrófono
        console.error('Error al acceder al micrófono:', err);
    });
}
