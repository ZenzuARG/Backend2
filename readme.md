# Backend E-commerce – Trabajo Práctico Final (Backend 2)

Este proyecto corresponde al Trabajo Práctico Final del curso Backend 2.
Se trata de un backend completo de e-commerce desarrollado en Node.js, aplicando una arquitectura profesional en capas, buenas prácticas y separación de responsabilidades.

El sistema permite la gestión de usuarios, autenticación, productos, carritos y compras con control real de stock, además de recuperación de contraseña vía email.

------------------------------------------------------------

FUNCIONALIDADES PRINCIPALES

USUARIOS Y SESIONES
- Registro de usuarios
- Login con JWT almacenado en cookies HTTP Only
- Endpoint /current que retorna el usuario autenticado mediante DTO
- Logout (eliminación de cookie)
- Recuperación de contraseña
  - Solicitud de reset (forgot-password)
  - Envío de email con token (Ethereal - testing)
  - Aplicación de nueva contraseña (reset-password)

PRODUCTOS
- Creación, lectura, actualización y eliminación
- Validaciones básicas
- Asociación de producto con propietario (owner)
- Control de stock

CARRITOS
- Creación de carrito
- Obtención de carrito por ID
- Agregado de productos con cantidad
- Compra del carrito
  - Verificación de stock producto por producto
  - Descuento real de stock
  - Generación de ticket
  - Respuesta separando productos comprados y no comprados

------------------------------------------------------------

TECNOLOGÍAS UTILIZADAS

- Node.js
- Express
- MongoDB
- Mongoose
- Passport (register / login / current)
- JWT
- Cookies HTTP Only
- bcrypt
- Nodemailer
- Ethereal Email (testing)
- dotenv
- Nodemon

------------------------------------------------------------

INSTALACIÓN Y EJECUCIÓN

1) Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>

2) Instalar dependencias
npm install

3) Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto con el siguiente contenido:

PORT=8080
MONGO_URL=mongodb://localhost:27017/backend2
JWT_SECRET=superSecretJWT

MAIL_FROM=no-reply@ecommerce.local
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=USUARIO_ETHEREAL
MAIL_PASS=PASSWORD_ETHEREAL

4) Ejecutar la aplicación

Modo desarrollo
npm run dev

Modo producción
npm start

------------------------------------------------------------

ARQUITECTURA DEL PROYECTO

El proyecto sigue una arquitectura en capas, separando responsabilidades de forma clara y escalable.

src
- config        Configuración general (env, DB, passport, mail)
- controllers   Controladores (capa HTTP)
- services      Lógica de negocio
- repositories  Abstracción de acceso a datos
- daos          Acceso directo a base de datos
- models        Schemas de Mongoose
- routes        Definición de endpoints
- middlewares   Middlewares personalizados
- utils         Utilidades (hash, jwt, tokens, helpers)
- dtos          DTOs (UserDTO)
- app.js        Entry point del servidor

PRINCIPIOS APLICADOS
- No hay lógica de negocio en las rutas
- Los controladores solo orquestan servicios
- Los servicios contienen la lógica real
- Acceso a datos desacoplado mediante DAO + Repository
- Uso de DTO para exponer datos seguros del usuario

------------------------------------------------------------

ENDPOINTS PRINCIPALES

SESSIONS
- POST /api/sessions/register
- POST /api/sessions/login
- GET  /api/sessions/current
- POST /api/sessions/logout
- POST /api/sessions/forgot-password
- POST /api/sessions/reset-password

PRODUCTS
- GET  /api/products
- POST /api/products
- GET  /api/products/:pid
- PUT  /api/products/:pid
- DELETE /api/products/:pid

CARTS
- POST /api/carts
- GET  /api/carts/:cid
- POST /api/carts/:cid/products/:pid
- POST /api/carts/:cid/purchase

------------------------------------------------------------

GUÍA BÁSICA DE PRUEBAS (POSTMAN)

REGISTRO
POST /api/sessions/register
first_name: User
last_name: Test
email: user@test.com
password: 1234

LOGIN
POST /api/sessions/login
email: user@test.com
password: 1234

USUARIO ACTUAL
GET /api/sessions/current

CREAR CARRITO
POST /api/carts

AGREGAR PRODUCTO AL CARRITO
POST /api/carts/:cid/products/:pid
quantity: 2

COMPRAR CARRITO
POST /api/carts/:cid/purchase

------------------------------------------------------------

RECUPERACIÓN DE CONTRASEÑA

- El email se envía utilizando Ethereal
- En entorno de testing se devuelve un previewUrl para visualizar el correo
- El token tiene expiración y se valida antes de actualizar la contraseña

------------------------------------------------------------

NOTAS FINALES

- Autenticación basada en JWT + cookies HTTP Only
- Stock descontado únicamente al concretar la compra
- Proyecto preparado para escalar y extender funcionalidades
- Cumple con los requisitos del Trabajo Práctico Final del curso Backend 2

------------------------------------------------------------

AUTOR

Zenon Zuliani
Trabajo Práctico Final – Backend 2
