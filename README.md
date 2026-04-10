# Frontend - Red Social Periferia

Este repositorio contiene la interfaz de usuario moderna y reactiva de la Red Social Periferia, diseñada para ofrecer una experiencia fluida y visualmente impactante.

## 🎨 Características
*   **Diseño Premium**: Estética moderna con efectos de glassmorphism y transiciones suaves.
*   **Tiempo Real**: Visualización inmediata de likes y notificaciones mediante WebSockets.
*   **Responsive**: Adaptado para diferentes tamaños de pantalla.
*   **Arquitectura Limpia**: Componentes desacoplados y gestión de estado centralizada.

## 🚀 Tecnologías
*   **React 18**
*   **Vite** (Herramienta de construcción ultrarrápida)
*   **Tailwind CSS** (Estilización utilitaria)
*   **Zustand** (Gestión de estado global ligero)
*   **Axios** (Cliente HTTP para consumo de microservicios)
*   **STOMP.js / SockJS** (Comunicación persistente para eventos)

## 🛠️ Instalación y Ejecución
1.  Instalar dependencias:
    ```bash
    npm install
    ```
2.  Ejecutar en modo desarrollo:
    ```bash
    npm run dev
    ```
3.  La aplicación estará disponible en: `http://localhost:3000`

## 📁 Estructura Principal
*   `/src/api`: Configuraciones de Axios y llamadas a los microservicios.
*   `/src/components`: Botones, Cards, Modales y otros elementos UI.
*   `/src/hooks`: Lógica reutilizable, incluyendo la conexión a WebSockets.
*   `/src/pages`: Vistas principales (Feed, Perfil, Login, Registro).
*   `/src/store`: Almacenes de Zustad para Auth, Posts y Profile.
