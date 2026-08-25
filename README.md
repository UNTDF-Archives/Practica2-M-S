# Visualizador de Funciones Continuas

Aplicación web interactiva para la digitalización y visualización de funciones continuas (Escalón, Senoidal, Exponencial, Señal Amortiguada y Pulso Recortado).

## Requisitos Previos

- Node.js (v18 o superior)
- Docker (opcional, para despliegue en contenedor)

## Instalación y Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Compilar para producción:
   ```bash
   npm run build
   ```

## Ejecución con Docker

Para construir y levantar el contenedor con Nginx:

```bash
docker compose up --build
```

La aplicación estará disponible en `http://localhost:8080`.

## Funcionalidades Principales

- Visualización diferenciada por tipo de función.
- Control interactivo de parámetros (Amplitud, Frecuencia, Fase, Desplazamiento, Duración y Muestreo).
- Alternador de muestreo continuo vs. discreto.
- Tabla desplegable con vectores de dominio e imagen.
- Vista de Dashboard con 5 gráficas simultáneas.
