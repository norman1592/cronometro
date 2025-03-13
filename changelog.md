# Changelog - Cronómetro y Cuenta Atrás

## [1.1.0] - 2024-01-XX

### Añadido
- Modo dual: Cronómetro y Cuenta Regresiva
- Indicador visual del modo actual
- Función `startStopwatch()` para el modo cronómetro
- Función `updateModeIndicator()` para mostrar el modo actual

### Mejorado
- Estilos del indicador de modo:
  - Fondo semi-transparente negro
  - Texto en rosa brillante (#FF1493)
  - Efecto de brillo con text-shadow
  - Mayor visibilidad durante la animación
- Función `clearCountdown()` adaptada para ambos modos
- Transiciones suaves entre modos

### Corregido
- Bug en la inicialización del cronómetro
- Comportamiento del botón Clear según el modo actual
