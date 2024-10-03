# NoiseMonitor

**NoiseMonitor** es una herramienta visual diseñada para medir y controlar el nivel de ruido en el aula, promoviendo un ambiente de aprendizaje tranquilo y productivo. La herramienta detecta sonidos en tiempo real y activa alertas visuales cuando el ruido excede ciertos umbrales predefinidos, fomentando la autorregulación de los estudiantes. Con elementos de gamificación y un sistema de calibración adaptable, NoiseMonitor contribuye a mejorar la dinámica de la clase.

## Objetivo

El objetivo principal de NoiseMonitor es ayudar a los docentes a mantener un ambiente de clase tranquilo, utilizando señales visuales y auditivas (opcional) para indicar el nivel de ruido en el aula. Está destinada a ser una herramienta de apoyo para el **Ministerio de Educación del Ecuador**.

## Características Principales

- **Detección de ruido en tiempo real**: Utiliza el micrófono para captar el sonido ambiente del aula y medir el nivel de ruido en decibelios (dB).
- **Representación visual del nivel de ruido**: La herramienta muestra el nivel de ruido utilizando señales visuales claras y progresivas, basadas en un sistema de colores similar al de un semáforo:
  - **Nivel Estable**: 50dB - 80dB
  - **Nivel Moderado**: 80dB - 150dB
  - **Nivel Alto**: >150dB
- **Alertas visuales**: Las señales cambian dinámicamente cuando el ruido excede los umbrales definidos.
- **Alertas auditivas (opcional)**: Sonidos suaves se pueden activar al sobrepasar ciertos niveles de ruido, con control de volumen y posibilidad de desactivarlas según las preferencias del docente.
- **Calibración adaptable**: Permite ajustar la herramienta para cada aula, considerando niveles de ruido ambiental altos como aquellos cerca de calles transitadas.
- **Gamificación**: Cuando el nivel de ruido se mantiene bajo por un periodo determinado, se muestran señales de recompensa o felicitación, fomentando el trabajo en equipo y la autorregulación.
  
## Requisitos Funcionales

- **Detección de ruido en tiempo real**: Carpintería que gestione la detección precisa de sonido.
- **Representación visual**: Elementos visuales atractivos y pedagógicamente alineados.
- **Calibración**: Función de calibración para ajustar el nivel base de ruido según las condiciones de cada aula.
- **Alertas auditivas (opcional)**: Control total sobre las alertas auditivas, ajustables y desactivables.
  
## Requisitos No Funcionales

- **Tiempo de respuesta**: El sistema debe responder en tiempo real para asegurar una experiencia fluida, incluso en dispositivos con capacidades limitadas.
- **Compatibilidad multiplataforma**: El diseño debe ser responsive y compatible con diferentes dispositivos (PC, tabletas, proyectores).
- **Procesamiento local**: Todo el procesamiento de ruido debe realizarse localmente para evitar depender de una conexión a internet.

## Escenarios de Uso

- **Escenario 1: Nivel de ruido Estable**
  - Cuando el nivel de ruido se mantiene entre 50dB y 80dB, la herramienta permanece en un estado de "Estable".
  
- **Escenario 2: Nivel de ruido Moderado**
  - Si el nivel de ruido excede los 80dB, la herramienta cambia a un estado "Moderado", indicando que el nivel de ruido comienza a ser problemático.
  
- **Escenario 3: Nivel de ruido Alto**
  - Cuando el nivel de ruido sobrepasa los 150dB, la herramienta cambia a un estado de "Alto", alertando sobre un ambiente de ruido excesivo.

## Usuarios

- **Docentes**: Los docentes son los principales usuarios de la herramienta, ya que les ayuda a monitorear y controlar el ruido en el aula.
- **Estudiantes**: Aunque los estudiantes no operan directamente la herramienta, son quienes deben autorregularse en función de las señales visuales proporcionadas.

## Consideraciones del Contexto

- **Limitaciones de hardware**: La herramienta está diseñada para ser flexible y funcionar en una variedad de dispositivos, desde computadoras antiguas hasta tabletas o teléfonos.
- **Acceso al micrófono**: Es importante asegurar que el uso del micrófono no comprometa la privacidad de los usuarios y que no se almacenen ni transmitan datos de audio.
- **Conectividad a internet**: Dado que algunas escuelas pueden tener acceso limitado a internet, el sistema está diseñado para funcionar sin depender de recursos externos o APIs en la nube.

## Fase 2 (Interactividad y Gamificación)

- **Feedback positivo**: La herramienta proporciona recompensas visuales cuando el ruido se mantiene bajo durante un tiempo, incentivando a los estudiantes a trabajar juntos.
- **Mini-juegos silenciosos**: Se planea la implementación de desafíos o mini-juegos que refuercen el comportamiento positivo de los estudiantes cuando el ruido es controlado.

## Preguntas al Cliente

- ¿Cuál es el nivel de tolerancia al ruido para distintos tipos de aulas?
- ¿Se prefiere un enfoque más visual o auditivo para las alertas?
- ¿Cuáles serían las recompensas más adecuadas para los estudiantes?

---

© 2024 Ministerio de Educación del Ecuador - David Averos "MrDUDU"
