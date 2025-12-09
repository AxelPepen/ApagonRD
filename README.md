# ApagónRD

Una plataforma moderna diseñada para ayudar a los dominicanos a mantenerse informados sobre el estado del servicio eléctrico en la República Dominicana. Con ApagónRD puedes conocer en tiempo real qué sectores tienen luz, cuáles no, y reportar cualquier inconveniente de forma rápida y sencilla.

## Objetivo

Construir una comunidad conectada y colaborativa que comparta información para mejorar el acceso a la energía en cada rincón de la República Dominicana.

## Características Principales

- **Mapa Interactivo**: Visualiza en tiempo real el estado eléctrico de los diferentes sectores del país
- **Reportes de Apagones**: Reporta cortes de luz o problemas eléctricos con geolocalización automática
- **Estadísticas**: Consulta estadísticas detalladas sobre el tiempo con energía, eficiencia y promedios por sector
- **Asistente de IA**: Obtén respuestas rápidas sobre el sistema eléctrico y apagones en la República Dominicana
- **Gestión de Reportes**: Visualiza y gestiona todos tus reportes en un solo lugar
- **Modo Oscuro**: Interfaz con soporte para modo claro y oscuro con tema personalizado

## Tecnologías Utilizadas

- **Frontend Framework**: React 18.3.1
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Mapas**: Leaflet & React Leaflet
- **Gráficos**: Chart.js & React Chart.js 2
- **Formularios**: React Hook Form con validación Yup
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Iconos**: Font Awesome

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd ApagonRD
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build-dev` - Compila para desarrollo
- `npm run build-prod` - Compila para producción
- `npm run lint` - Ejecuta el linter
- `npm run preview` - Previsualiza la build de producción

## Funcionalidades

### Mapa de Sectores
Visualiza en un mapa interactivo el estado eléctrico de cada sector, con indicadores visuales para sectores con y sin energía.

### Reportar Apagón
- Detección automática de sector mediante geolocalización
- Selección manual de sector si es necesario
- Subida de fotos opcional
- Descripción detallada del problema

### Estadísticas
- Tiempo con energía por sector
- Horas con/sin energía
- Eficiencia del servicio
- Resumen mensual con días sin energía y promedios diarios

### Asistente de IA
Asistente especializado que responde preguntas sobre:
- Estado del servicio eléctrico
- Apagones programados
- Tarifas eléctricas
- Información sobre sectores específicos

## Pruebas Automatizadas

Este proyecto cuenta con pruebas E2E (End-to-End) automatizadas que verifican el flujo completo de la aplicación desde la perspectiva del usuario.

**Repositorio de Pruebas**: [ApagonRD-test](https://github.com/adricn29/ApagonRD-test)

Las pruebas automatizadas cubren:
- Flujos de autenticación
- Navegación entre módulos
- Funcionalidades de reporte
- Visualización de datos
- Interacción con el asistente de IA

## Modo Oscuro

La aplicación incluye un modo oscuro completo con:
- Tema personalizado (negro/morado con acentos dorados)
- Transiciones suaves entre modos
- Persistencia de preferencias del usuario

## Licencia

Este proyecto es privado.

## Contribuidores

Desarrollado para mejorar el acceso a información sobre el servicio eléctrico en la República Dominicana.

---

**Únete a ApagónRD y sé parte del cambio: juntos podemos hacer que la información llegue a todos.**

