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
import {
  iniciarEscenarioVelocimetro,
  actualizarVisualizacionVelocimetro,
} from "./escenarios/escenarioVelocimetro.js";

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
  seleccionarEscenario("velocimetro");

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
  const estadoDecibeles = document.getElementById("estado-decibeles");
  const canvas = document.getElementById("visualizador");

  // Limpiar cualquier clase previa
  canvas.classList.remove("barras-style", "velocimetro-style");

  // Asignar la clase según el escenario seleccionado
  if (escenario === "barras") {
    canvas.classList.add("barras-style");
  } else if (escenario === "velocimetro") {
    canvas.classList.add("velocimetro-style");
  }
  // Limpiar cualquier visualización o configuración previa del escenario activo
  if (actualizarVisualizacionActual) {
    console.log("Limpiando escenario anterior...");
    actualizarVisualizacionActual = null;
  }

  // Manejar la visibilidad del texto de decibeles según el escenario
  if (estadoDecibeles) {
    estadoDecibeles.style.display =
      escenario === "velocimetro" ? "none" : "block";
  }

  switch (escenario) {
    case "barras":
      iniciarEscenarioBarras();
      actualizarVisualizacionActual = actualizarVisualizacionBarras;
      break;

    case "velocimetro":
      iniciarEscenarioVelocimetro();
      actualizarVisualizacionActual = actualizarVisualizacionVelocimetro;
      break;

    default:
      console.warn(`Escenario desconocido: ${escenario}`);
      break;
  }
}

function cerrarAmbosOffcanvas() {
  // Cerrar el Offcanvas de Escenarios
  const offcanvasEscenarios = bootstrap.Offcanvas.getInstance(
    document.getElementById("offcanvasEscenarios")
  );
  if (offcanvasEscenarios) {
    offcanvasEscenarios.hide();
  }

  // Cerrar el Offcanvas del Panel de Configuración
  const panelConfiguracion = bootstrap.Offcanvas.getInstance(
    document.getElementById("panelConfiguracion")
  );
  if (panelConfiguracion) {
    panelConfiguracion.hide();
  }
}

// Exponer cerrarAmbosOffcanvas al ámbito global
window.cerrarAmbosOffcanvas = cerrarAmbosOffcanvas;
// Exponer seleccionarEscenario al ámbito global
window.seleccionarEscenario = seleccionarEscenario;


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
export { seleccionarEscenario, volverAlPanelConfiguracion, toggleFullScreen };
