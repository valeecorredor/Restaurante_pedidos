# Restaurante Ratatouille - Frontend

Este es el proyecto frontend para el sistema de gestión de pedidos del **Restaurante Ratatouille**. La aplicación web permite a diferentes roles de empleados (cajero, mesero, chef) interactuar con los pedidos, iniciar sesión y registrar nuevos usuarios.

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura de las páginas.
- **CSS3**: Estilos con [W3.CSS](https://www.w3schools.com/w3css/default.asp) y Bootstrap 5.3.2, junto con hojas de estilos personalizadas (`css/estilos.css`).
- **JavaScript Vanilla**: Lógica de cliente y consumo de la API REST usando `fetch`.
- **Fuentes**: Google Fonts (Amatic SC).

## 📁 Estructura del Proyecto

- `index.html`: Página principal.
- `login.html` / `js/login.js`: Interfaz y lógica para el inicio de sesión.
- `registro.html` / `js/registro.js`: Interfaz y lógica para registrar nuevos empleados.
- `cajero.html`: Panel de control del cajero.
- `chef.html`: Panel de control del chef.
- `mesero.html`: Panel de control del mesero.
- `pedidos.html` / `js/pedidos.js`: Gestión general de pedidos.
- `css/`: Directorio que contiene los estilos locales.
- `imagenes/`: Directorio de recursos de imágenes.

## ⚙️ Configuración y Ejecución

Al ser un proyecto frontend puro, no requiere compilación. Sigue estos pasos para probarlo:

1. **Clonar o descargar** este repositorio (o carpeta) en tu máquina local.
2. **Iniciar el Backend:** Este frontend requiere que el servidor backend (API) esté en ejecución. El backend debe estar configurado para correr en el puerto **`3005`** (`http://localhost:3005`).
3. **Abrir el Frontend:** Puedes abrir cualquiera de los archivos `.html` (por ejemplo, `index.html` o `login.html`) directamente en tu navegador web o usar un servidor local como [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code.

## 🔗 Endpoints del Backend Utilizados

La aplicación asume que el backend provee los siguientes endpoints REST:

### Autenticación y Usuarios
- `POST /login`: Iniciar sesión (espera `user` y `password`).
- `POST /register`: Registrar un nuevo empleado (espera `user`, `name`, `rol`, y `password`).

### Pedidos por Rol (Pendientes de implementar la conexión)
- `GET /pedidos`: Obtiene la lista de todos los pedidos (Cajero).
- `POST /pedido`: Crea un nuevo pedido.
- `PUT /pedido`: Actualiza la información de un pedido.
- `DELETE /pedido`: Elimina un pedido.
- `GET /chef`: Obtiene pedidos para el chef.
- `PUT /preparando` / `PUT /listo`: Actualiza el estado de pedidos en el chef.
- `GET /mesero`: Obtiene pedidos para el mesero.
- `PUT /entregado`: Actualiza el estado a entregado.

## 👥 Roles del Sistema

- **Cajero:** Encargado de tomar pedidos generales, modificar o eliminar órdenes.
- **Chef:** Encargado de ver los pedidos pendientes y pasarlos a estado "Preparando" o "Listo".
- **Mesero:** Encargado de ver los pedidos listos y marcarlos como "Entregados" al cliente.


INTEGRANTES: JUANA VALENTINA CORREDOR
ANDRES ESPINOSA 
ANDRES PIÑA