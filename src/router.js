"use strict";

// Author: David Averos
// Last update: 2024-11-04

// Importar funciones desde configuracionSonido.js y los módulos de escenario
import {
  iniciarDeteccionSonido,
  actualizarUmbral,
  guardarCalibracion,
} from "./configuracionSonido.js";
import {
  iniciarEscenarioBarras,
  actualizarVisualizacionBarras,
} from "./escenarios/escenarioBarras.js";
// Importaremos otros escenarios conforme los implementemos

// Variable para almacenar la función de visualización del escenario activo
let actualizarVisualizacionActual;

//---------------------------- Inicialización -----------------------

// Función para inicializar el sistema cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM completamente cargado y analizado.");

  // Iniciar la detección de sonido al cargar la página
  iniciarDeteccionSonido((nivelRuido, umbrales) => {
    if (actualizarVisualizacionActual) {
      actualizarVisualizacionActual(nivelRuido, umbrales);
    }
  });

  // Configurar eventos de umbrales y guardar cambios
  const sliderEstable = document.getElementById("sliderEstable");
  const btnGuardar = document.querySelector(
    'button[onclick="guardarCalibracion()"]'
  );

  if (sliderEstable) {
    sliderEstable.oninput = (event) => {
      const valor = event.target.value;
      console.log(`Valor del slider cambiado: ${valor}`);
      actualizarUmbral("estable", valor);
    };
  }

  if (btnGuardar) {
    btnGuardar.onclick = () => {
      console.log("Botón de guardar presionado.");
      guardarCalibracion();
    };
  }

  // Inicializar el escenario por defecto (barras de sonido)
  seleccionarEscenario("barras");

  // Configurar selector de escenario en el frontend
  const escenarioSelector = document.getElementById("escenarioSelector");
  if (escenarioSelector) {
    escenarioSelector.addEventListener("change", (event) => {
      const escenarioSeleccionado = event.target.value;
      console.log(`Escenario seleccionado: ${escenarioSeleccionado}`);
      seleccionarEscenario(escenarioSeleccionado);
    });
  }
});

//---------------------------- Funciones de Escenarios -----------------------

/**
 * Selecciona el escenario activo según el valor recibido y actualiza la función de visualización.
 * @param {string} escenario - Nombre del escenario a seleccionar.
 */
function seleccionarEscenario(escenario) {
  // Limpiar cualquier visualización o configuración previa del escenario activo
  if (actualizarVisualizacionActual) {
    console.log("Limpiando escenario anterior...");
    actualizarVisualizacionActual = null; // Opcional, dependiendo de la lógica de limpieza que se requiera
  }

  switch (escenario) {
    case "barras":
      console.log("Cargando el escenario de barras de sonido...");
      iniciarEscenarioBarras();
      actualizarVisualizacionActual = actualizarVisualizacionBarras;
      break;

    default:
      console.warn(`Escenario desconocido: ${escenario}`);
      break;
  }
}

//---------------------------- Exportaciones -----------------------

// Exportar la función de selección de escenario si es necesario en otros módulos
export { seleccionarEscenario };
