# Backend – Entrega 1

## Autenticación y manejo de usuarios

---

## Descripción

Este proyecto corresponde a la **Entrega N°1** del curso de Backend en Coderhouse.

Se desarrolló una API REST utilizando **Node.js** y **Express**, conectada a **MongoDB**, que implementa registro y login de usuarios, autenticación con **Passport** y autorización mediante **JWT**.

El objetivo principal de la entrega es aplicar buenas prácticas de autenticación, seguridad y manejo de sesiones.

---

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Passport
  - passport-local
  - passport-jwt
- bcrypt
- jsonwebtoken
- cookie-parser
- dotenv

---

## Estructura del proyecto

```
src/
├── app.js
├── config/
│   └── passport.js
├── models/
│   ├── user.model.js
│   └── cart.model.js
├── routes/
│   ├── users.router.js
│   └── sessions.router.js
├── utils/
│   ├── crypto.js
│   └── jwt.js
```

---

## Configuración inicial

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
MONGODB_URI=mongodb://127.0.0.1:27017/backend
JWT_SECRET=supersecretjwt
PORT=8080
```

---

### Instalación de dependencias

```
npm install
```

---

### Ejecución del servidor

```
npm run dev
```

o bien:

```
node src/app.js
```

---

## Modelo de Usuario

El modelo de usuario cuenta con los siguientes campos:

- `first_name` (String, requerido)
- `last_name` (String, requerido)
- `email` (String, requerido, único)
- `age` (Number, requerido)
- `password` (String, requerido, almacenado de forma hasheada)
- `cart` (ObjectId, referencia a la colección carts)
- `role` (String, valor por defecto: `"user"`)

---

## Seguridad

- Las contraseñas se almacenan utilizando **bcrypt.hashSync**.
- El login genera un **JWT**.
- El JWT se guarda en una **cookie httpOnly**.
- Los mensajes de error de autenticación son genéricos y no revelan información sensible  
  (por ejemplo: *"Credenciales incorrectas"*).

---

## Endpoints disponibles

### Registro de usuario

**POST** `/api/sessions/register`

Body (JSON):

```
{
  "first_name": "Zen",
  "last_name": "Zu",
  "email": "zen@test.com",
  "age": 30,
  "password": "1234"
}
```

Respuesta exitosa:

```
{
  "status": "success",
  "message": "Usuario registrado correctamente"
}
```

---

### Login

**POST** `/api/sessions/login`

Body (JSON):

```
{
  "email": "zen@test.com",
  "password": "1234"
}
```

Respuesta exitosa:

```
{
  "status": "success",
  "message": "Login exitoso"
}
```

El token JWT se almacena automáticamente en una cookie llamada `jwt`.

---

### Usuario actual (endpoint protegido)

**GET** `/api/sessions/current`

Requiere un JWT válido en la cookie.

Respuesta:

```
{
  "status": "success",
  "payload": {
    "_id": "...",
    "first_name": "Zen",
    "last_name": "Zu",
    "email": "zen@test.com",
    "age": 30,
    "cart": "...",
    "role": "user"
  }
}
```

---

### Listado de usuarios

**GET** `/api/users`

Devuelve el listado de usuarios sin exponer el campo `password`.

---

## Validaciones y comportamiento esperado

- No se permite registrar usuarios con emails duplicados.
- El login falla con un mensaje genérico si las credenciales son inválidas.
- El endpoint `/api/sessions/current` devuelve **401** si el usuario no está autenticado.
- MongoDB crea automáticamente las colecciones al registrar el primer usuario.

