"use strict";

document.addEventListener('DOMContentLoaded', () => {
    iniciarDeteccionSonido();
});

function iniciarDeteccionSonido() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;  // Tamaño FFT para obtener precisión en las frecuencias
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        mediaStreamSource.connect(analyser);

        const canvas = document.getElementById('visualizador');
        const canvasContext = canvas.getContext('2d');

        function dibujarVisualizador() {
            requestAnimationFrame(dibujarVisualizador);

            analyser.getByteFrequencyData(dataArray);

            // Limpiar el canvas para el siguiente frame
            canvasContext.fillStyle = 'black';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);

            // Dibujar las barras
            const barraAncho = (canvas.width / dataArray.length) * 2.5; // Ajusta el tamaño de las barras
            let posX = 0;

            for (let i = 0; i < dataArray.length; i++) {
                const valor = dataArray[i];
                const altura = (valor / 256) * canvas.height; // Escalar a la altura del canvas

                canvasContext.fillStyle = 'purple'; // Color de las barras
                canvasContext.fillRect(posX, canvas.height - altura, barraAncho, altura); // Dibujar la barra

                posX += barraAncho + 1; // Espacio entre barras
            }
        }

        // Comenzar a dibujar
        dibujarVisualizador();
    })
    .catch(function(err) {
        console.error('Error al acceder al micrófono:', err);
    });
}
