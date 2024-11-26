"use strict";

console.log("Escenario de Velocímetro cargado.");

// Inicializar el canvas y su contexto
const canvas = document.getElementById("visualizador");
const canvasContext = canvas.getContext("2d");

// Configuración del velocímetro
const centerX = canvas.width / 2;
const centerY = canvas.height * 0.8; // Centro más cerca de la base
const radius = Math.min(canvas.width, canvas.height) * 0.4;
const agujaLargo = radius * 0.9;

// Ángulos del velocímetro
const startAngle = Math.PI; // Inicio del arco (180°)
const endAngle = 2 * Math.PI; // Fin del arco (360°)


// Función para inicializar el escenario del velocímetro
export function iniciarEscenarioVelocimetro() {
  console.log("Iniciando escenario de velocímetro...");
  // Limpiar el canvas antes de dibujar
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  dibujarBaseVelocimetro();
}

// Función para dibujar la base del velocímetro
function dibujarBaseVelocimetro() {
  // Dibujar las divisiones del velocímetro con colores
  const numSecciones = 10;
  const colores = ["#4CAF50", "#FFC107", "#F44336"]; // Verde, amarillo, rojo

  for (let i = 0; i < numSecciones; i++) {
    const sectionStartAngle =
      startAngle + (i / numSecciones) * (endAngle - startAngle);
    const sectionEndAngle =
      startAngle + ((i + 1) / numSecciones) * (endAngle - startAngle);

    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, sectionStartAngle, sectionEndAngle, false);
    canvasContext.lineWidth = 15;
    const colorIndex = i < 4 ? 0 : i < 7 ? 1 : 2;
    canvasContext.strokeStyle = colores[colorIndex];
    canvasContext.stroke();
  }
}

// Función para actualizar la visualización del velocímetro
export function actualizarVisualizacionVelocimetro(
  nivelRuido,
  { umbralEstable, umbralModerado, umbralAlto }
) {
  // Limpiar el canvas
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar base y fondo del velocímetro
  dibujarBaseVelocimetro();

  // Calcular el ángulo de la aguja en función del nivel de ruido
  const ruidoNormalizado = Math.min(nivelRuido / 120, 1); // Nivel de ruido normalizado entre 0 y 1
  const agujaAngle =
    startAngle + ruidoNormalizado * (endAngle - startAngle);

  // Determinar color según nivel de ruido
  let color;
  if (nivelRuido < umbralEstable) {
    color = "green";
  } else if (nivelRuido < umbralModerado) {
    color = "yellow";
  } else if (nivelRuido < umbralAlto) {
    color = "orange";
  } else {
    color = "red";
  }

  // Dibujar la aguja del velocímetro
  canvasContext.beginPath();
  canvasContext.moveTo(centerX, centerY);
  canvasContext.lineTo(
    centerX + agujaLargo * Math.cos(agujaAngle),
    centerY + agujaLargo * Math.sin(agujaAngle)
  );
  canvasContext.lineWidth = 5;
  canvasContext.strokeStyle = color;
  canvasContext.stroke();

  // Dibujar el valor numérico en el centro
  canvasContext.font = "3vh Arial";
  canvasContext.fillStyle = "#f5f5f5";
  canvasContext.textAlign = "center";
  canvasContext.fillText(`${nivelRuido.toFixed(1)} dB`, centerX, centerY - 10);
}

