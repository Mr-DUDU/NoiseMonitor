"use strict";

// Author: David Averos
// Last update: 2024-11-04

console.log("Escenario de Barras de Sonido cargado.");

// Inicializar el canvas y su contexto
const canvas = document.getElementById("visualizador");
const canvasContext = canvas.getContext("2d");

// Variables para almacenar la altura de cada barra y suavizar la animación
const barraAlturas = new Array(30).fill(0);

// Función principal para iniciar el escenario de barras
export function iniciarEscenarioBarras() {
  console.log("Iniciando escenario de barras de sonido...");
  // Configuración inicial del canvas si es necesario (tamaño, fondo, etc.)
}

// Función para interpolar suavemente el color entre dos valores RGB
function interpolarColor(colorInicio, colorFin, porcentaje) {
  const colorInterpolado = colorInicio.map((inicio, index) => {
    const final = colorFin[index];
    return Math.round(inicio + (final - inicio) * porcentaje);
  });
  return `rgb(${colorInterpolado[0]}, ${colorInterpolado[1]}, ${colorInterpolado[2]})`;
}

// Función para actualizar la visualización del canvas de barras de sonido
export function actualizarVisualizacionBarras(
  nivelRuido,
  { umbralEstable, umbralModerado, umbralAlto }
) {
  //console.log("Actualizando visualización de barras...");
  //console.log("Nivel de ruido:", nivelRuido);
  //console.log("Umbrales:", { umbralEstable, umbralModerado, umbralAlto });

  // Limpiar el canvas antes de dibujar
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  // Definir el ancho de cada barra y la posición inicial en X
  const barraAncho = canvas.width / barraAlturas.length; // Dividimos el ancho en la cantidad de barras
  let posX = 0;

  // Determinar los colores de inicio y fin para la interpolación
  const colorEstable = [0, 255, 0]; // Verde
  const colorModerado = [255, 255, 0]; // Amarillo
  const colorAlto = [255, 0, 0]; // Rojo

  // Determinar el color en función del nivel de ruido
  let colorInicio, colorFin, porcentaje;
  if (nivelRuido < umbralEstable) {
    colorInicio = colorEstable;
    colorFin = colorModerado;
    porcentaje = nivelRuido / umbralEstable;
  } else if (nivelRuido < umbralModerado) {
    colorInicio = colorModerado;
    colorFin = colorAlto;
    porcentaje =
      (nivelRuido - umbralEstable) / (umbralModerado - umbralEstable);
  } else {
    colorInicio = colorAlto;
    colorFin = colorAlto;
    porcentaje = 1;
  }

  // Dibujar las barras en el canvas
  for (let i = 0; i < barraAlturas.length; i++) {
    // Suavizar la transición de altura de cada barra
    const objetivoAltura =
      (nivelRuido / 120) * canvas.height * (0.5 + Math.random()); // Altura aleatoria basada en nivel de ruido
    barraAlturas[i] += (objetivoAltura - barraAlturas[i]) * 0.1; // Suavizar la altura

    // Calcular el color interpolado para cada barra
    const color = interpolarColor(colorInicio, colorFin, porcentaje);

    // Dibujar la barra con la altura y color interpolado
    canvasContext.fillStyle = color;
    canvasContext.fillRect(
      posX,
      canvas.height - barraAlturas[i],
      barraAncho - 2,
      barraAlturas[i]
    );

    posX += barraAncho;
  }
}
