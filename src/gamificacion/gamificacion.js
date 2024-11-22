"use strict";

import { iniciarTemporizador } from './gamificacionControlador.js';
// En gamificacion.js o donde llames a la función
import { calcularTiempoPorCiclo } from './gamificacionControlador.js';
import { iniciarBarraDeProgreso } from './gamificacionControlador.js';
import { resetearJuego } from './gamificacionControlador.js';
// Mostrar el modal al inicio de la aplicación
window.onload = function () {
  const modalDefinirMeta = new bootstrap.Modal(document.getElementById('modalDefinirMeta'));
  modalDefinirMeta.show();
};

// Actualizar el valor mostrado según el slider
const duracionMetaInput = document.getElementById('duracionMeta');
const valorDuracionMeta = document.getElementById('valorDuracionMeta');
duracionMetaInput.addEventListener('input', function () {
  valorDuracionMeta.textContent = duracionMetaInput.value;
});
// Manejar el evento del botón "Guardar Meta"
const guardarMetaBtn = document.getElementById('guardarMetaBtn');
guardarMetaBtn.addEventListener("click", function () {
  const duracionSeleccionada = parseInt(duracionMetaInput.value);
  //const duracionSeleccionada = 1 / 2;
  console.log(`Duración de la meta seleccionada: ${duracionSeleccionada} minutos`);

  // Resetear el juego antes de iniciar una nueva meta
  resetearJuego();

  // Llama a la función para calcular el tiempo por ciclo
  const tiempoPorCiclo = calcularTiempoPorCiclo(duracionSeleccionada);
  if (tiempoPorCiclo) {
    console.log(`Tiempo por ciclo calculado correctamente: ${tiempoPorCiclo} ms`);
    iniciarBarraDeProgreso(tiempoPorCiclo); // Llama a la función para iniciar la barra de progreso
  }

  // Iniciar la nueva sesión de meta
  iniciarSesionMeta(duracionSeleccionada);

  // Cerrar el modal
  const modalDefinirMeta = bootstrap.Modal.getInstance(document.getElementById('modalDefinirMeta'));
  if (modalDefinirMeta) {
    modalDefinirMeta.hide();
  }

  // Cerrar el offcanvas
  const offcanvasMetas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasMetas'));
  if (offcanvasMetas) {
    offcanvasMetas.hide();
  }
});

// Función para iniciar la meta con la duración seleccionada
function iniciarSesionMeta(duracion) {
  console.log(`Iniciando sesión de meta con duración de ${duracion} minutos.`);
  iniciarTemporizador(duracion); // Iniciar el temporizador
  // Otras lógicas relacionadas con la sesión de meta
}


export { iniciarSesionMeta };
