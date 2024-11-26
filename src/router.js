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

// Variable para almacenar la función de visualización del escenario activo
let actualizarVisualizacionActual;

//---------------------------- Inicialización y Escucha -----------------------
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

  const btnVolverPanel = document.getElementById('btnVolverPanel');
  if (btnVolverPanel) {
    btnVolverPanel.addEventListener('click', volverAlPanelConfiguracion);
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

//---------------------------- OffCanvas funcion -----------------------
function volverAlPanelConfiguracion() {
  // Cierra el offcanvas de escenarios manualmente
  const offcanvasEscenarios = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasEscenarios'));
  if (offcanvasEscenarios) {
    offcanvasEscenarios.hide();
  }

  // Abre el offcanvas del panel de configuración manualmente
  const panelConfiguracion = new bootstrap.Offcanvas(document.getElementById('panelConfiguracion'));
  panelConfiguracion.show();
}

//---------------------------- Orientacion Horizontal -----------------------
function forzarOrientacionHorizontal() {
  if (window.innerHeight > window.innerWidth) {
    document.body.classList.add('forzar-horizontal');
    alert('Por favor, gira tu dispositivo horizontalmente para tener una mejor experiencia.');
  } else {
    document.body.classList.remove('forzar-horizontal');
  }
}
// Llama a la función cuando se cargue la página y cada vez que cambie la orientación del dispositivo
window.addEventListener('load', forzarOrientacionHorizontal);
window.addEventListener('resize', forzarOrientacionHorizontal);

//---------------------------- Exandir Pantalla -----------------------
document.getElementById('expandirPantallaBtn').addEventListener('click', function () {
  toggleFullScreen();
});

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      alert(`Error al intentar entrar en modo de pantalla completa: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Exportar la función de selección de escenario si es necesario en otros módulos
export { seleccionarEscenario , volverAlPanelConfiguracion,toggleFullScreen};
