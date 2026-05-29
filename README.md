# Red Mujeres Backend

Backend API para **Red Mujeres**, una plataforma web tipo vitrina digital creada para apoyar, visibilizar y fortalecer emprendimientos liderados por mujeres.
El sistema permite gestionar emprendedoras, negocios, productos, categorías, contenidos dinámicos, galerías multimedia, usuarios, roles, aprobaciones y seguridad de acceso.

Este backend está construido como una API REST modular, preparada para una versión Beta productiva y compatible con despliegue en hosting Linux cPanel con soporte Node.js y MySQL.

---

## Objetivo del proyecto

Red Mujeres busca ofrecer una plataforma digital donde mujeres emprendedoras puedan presentar sus historias, emprendimientos y productos, mientras un equipo administrador gestiona la aprobación, publicación y organización del contenido visible en el sitio público.

La plataforma está pensada para cubrir:

* Registro y autenticación de usuarios.
* Gestión de perfiles de emprendedoras.
* Gestión de emprendimientos.
* Catálogo de productos.
* Categorización de productos y negocios.
* Panel administrativo.
* Flujo de revisión, aprobación y publicación.
* Galerías multimedia.
* CMS para páginas públicas dinámicas.
* Dashboard con métricas.
* Carga de imágenes.
* Gestión segura de contraseñas.

---

## Stack tecnológico

* **Node.js**
* **Express.js**
* **MySQL**
* **Prisma ORM**
* **JWT Authentication**
* **Zod Validation**
* **Multer Uploads**
* **Winston Logger**
* **Morgan HTTP Logger**
* **Helmet Security**
* **CORS**
* **Rate Limiting**
* **Envalid**
* **bcryptjs**
* **cPanel compatible**

---

## Módulos principales

### Autenticación y seguridad

* Registro de usuarios.
* Login con JWT.
* Refresh token.
* Logout.
* Sesiones persistidas.
* Cambio de contraseña.
* Recuperación de contraseña por token.
* Restablecimiento de contraseña por administrador.
* Revocación de sesiones.
* Validación de variables de entorno.
* Rate limiting.
* Headers de seguridad con Helmet.

### Usuarios y roles

* Listado de usuarios.
* Detalle de usuario.
* Cambio de estado.
* Roles administrativos y de emprendedora.
* Control de acceso basado en roles.

### Emprendedoras

* Creación de perfil.
* Consulta y actualización de perfil.
* Flujo de revisión.
* Aprobación por administrador.
* Rechazo con motivo.
* Cambio manual de estado.
* Exposición pública de perfiles aprobados.

### Emprendimientos

* Creación de negocios por emprendedoras aprobadas.
* Listado de negocios propios.
* Edición de negocios.
* Moderación administrativa.
* Aprobación, rechazo y publicación.
* Consulta pública por slug.

### Productos

* Creación de productos.
* Edición de productos.
* Gestión de imágenes.
* Upload automático de imágenes.
* Flujo de revisión y aprobación.
* Publicación en catálogo público.
* Filtros por categoría, negocio, estado y búsqueda.

### Categorías

* CRUD administrativo.
* Categorías activas para formularios.
* Soporte para categorías tipo negocio, producto o ambas.
* Lectura para administradores y emprendedoras.
* Consulta pública de categorías activas.

### Media y galerías

* Registro de archivos multimedia.
* Creación de galerías.
* Asociación de imágenes a galerías.
* Upload automático de imágenes a galerías.
* Galerías públicas por slug.

### CMS

* Gestión de páginas dinámicas.
* Gestión de secciones CMS.
* Upload automático de imágenes para secciones.
* Consulta pública por slug.
* Pensado para alimentar Home, About, Impacto, FAQ y otras páginas públicas.

### Dashboard

* Métricas administrativas.
* Métricas para emprendedoras.
* Conteo de usuarios, negocios, productos, estados pendientes y publicados.

### Auditoría y aprobaciones

* Registro de acciones críticas.
* Approval logs.
* Audit logs.
* Trazabilidad para aprobaciones, rechazos, cambios de estado y acciones administrativas.

---

## Estructura general del proyecto

```txt
src/
├── config/
│   ├── cors.js
│   ├── env.js
│   ├── logger.js
│   └── prisma.js
│
├── constants/
│   └── upload.constants.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── business.controller.js
│   ├── category.controller.js
│   ├── cms.controller.js
│   ├── dashboard.controller.js
│   ├── entrepreneur.controller.js
│   ├── health.controller.js
│   ├── media.controller.js
│   ├── password.controller.js
│   ├── product.controller.js
│   ├── upload.controller.js
│   └── user.controller.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── logger.middleware.js
│   ├── role.middleware.js
│   ├── security.middleware.js
│   ├── upload.middleware.js
│   └── validate.middleware.js
│
├── repositories/
│   ├── audit.repository.js
│   ├── business.repository.js
│   ├── category.repository.js
│   ├── cms.repository.js
│   ├── dashboard.repository.js
│   ├── entrepreneur.repository.js
│   ├── media.repository.js
│   ├── password-reset.repository.js
│   ├── product.repository.js
│   ├── role.repository.js
│   ├── session.repository.js
│   └── user.repository.js
│
├── routes/
│   ├── auth.routes.js
│   ├── business.routes.js
│   ├── category.routes.js
│   ├── cms.routes.js
│   ├── dashboard.routes.js
│   ├── entrepreneur.routes.js
│   ├── health.routes.js
│   ├── media.routes.js
│   ├── product.routes.js
│   ├── public.routes.js
│   ├── upload.routes.js
│   └── user.routes.js
│
├── schemas/
│   ├── auth.schema.js
│   ├── business.schema.js
│   ├── category.schema.js
│   ├── cms.schema.js
│   ├── entrepreneur.schema.js
│   ├── media.schema.js
│   ├── password.schema.js
│   ├── product.schema.js
│   └── user.schema.js
│
├── services/
│   ├── auth.service.js
│   ├── business.service.js
│   ├── category.service.js
│   ├── cms.service.js
│   ├── dashboard.service.js
│   ├── entrepreneur.service.js
│   ├── media.service.js
│   ├── password.service.js
│   ├── product.service.js
│   └── user.service.js
│
├── uploads/
├── utils/
├── app.js
└── server.js
```

---

## Instalación local

### 1. Clonar repositorio

```bash
git clone https://github.com/usuario/red-mujeres-backend.git
cd red-mujeres-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` a partir de `.env.example`:

```bash
cp .env.example .env
```

Ejemplo local:

```env
NODE_ENV=development
PORT=4000

DATABASE_URL="mysql://root:@localhost:3306/db_redcatlog"

JWT_ACCESS_SECRET="CHANGE_ME_ACCESS_SECRET"
JWT_REFRESH_SECRET="CHANGE_ME_REFRESH_SECRET"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

CORS_ORIGINS="http://localhost:3000,http://localhost:5173,http://localhost:4000"

UPLOADS_DIR="src/uploads"
MAX_FILE_SIZE_MB=3

RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=300
AUTH_RATE_LIMIT_MAX_REQUESTS=20
```

### 4. Generar Prisma Client

```bash
npx prisma generate
```

### 5. Ejecutar servidor en desarrollo

```bash
npm run dev
```

Servidor local:

```txt
http://localhost:4000
```

---

## Scripts disponibles

```bash
npm run dev
npm start
npm run prisma:generate
npm run prisma:studio
npm run prisma:seed
npm run lint
npm run format
```

---

## Healthchecks

```http
GET /health
GET /health/db
GET /api/health
GET /api/health/db
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "API Red Mujeres funcionando correctamente.",
  "data": {
    "status": "OK",
    "service": "red-mujeres-backend",
    "environment": "development"
  }
}
```

---

## Endpoints principales

### Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
PATCH /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Users

```http
GET   /api/users/me
PUT   /api/users/me
GET   /api/users
GET   /api/users/:id
PATCH /api/users/:id/status
PATCH /api/users/:id/password
```

### Entrepreneurs

```http
POST  /api/entrepreneurs
GET   /api/entrepreneurs/me
PUT   /api/entrepreneurs/me
GET   /api/entrepreneurs
GET   /api/entrepreneurs/:id
PATCH /api/entrepreneurs/:id/approve
PATCH /api/entrepreneurs/:id/reject
PATCH /api/entrepreneurs/:id/status
```

### Businesses

```http
POST  /api/businesses
GET   /api/businesses/me
GET   /api/businesses/me/:id
PUT   /api/businesses/me/:id
GET   /api/businesses
GET   /api/businesses/:id
PATCH /api/businesses/:id/approve
PATCH /api/businesses/:id/reject
PATCH /api/businesses/:id/status
```

### Products

```http
POST   /api/products
GET    /api/products/me
GET    /api/products/me/:id
PUT    /api/products/me/:id
POST   /api/products/:id/images
POST   /api/products/:id/images/upload
DELETE /api/products/:id/images/:imageId
GET    /api/products
GET    /api/products/:id
PATCH  /api/products/:id/approve
PATCH  /api/products/:id/reject
PATCH  /api/products/:id/status
```

### Categories

```http
GET   /api/categories
GET   /api/categories/:id
POST  /api/categories
PUT   /api/categories/:id
PATCH /api/categories/:id/status
```

### Media

```http
POST   /api/media/files
GET    /api/media/files
GET    /api/media/files/:id
POST   /api/media/galleries
GET    /api/media/galleries
GET    /api/media/galleries/:id
PUT    /api/media/galleries/:id
POST   /api/media/galleries/:id/items
POST   /api/media/galleries/:id/items/upload
DELETE /api/media/galleries/:id/items/:itemId
```

### CMS

```http
GET    /api/cms/pages
GET    /api/cms/pages/:id
POST   /api/cms/pages
PUT    /api/cms/pages/:id
POST   /api/cms/pages/:id/sections
PUT    /api/cms/sections/:id
POST   /api/cms/sections/:id/image/upload
DELETE /api/cms/sections/:id
```

### Dashboard

```http
GET /api/dashboard/admin/overview
GET /api/dashboard/me/overview
```

### Public API

```http
GET /api/public/categories
GET /api/public/categories/:slug
GET /api/public/entrepreneurs
GET /api/public/entrepreneurs/:id
GET /api/public/businesses
GET /api/public/businesses/:slug
GET /api/public/products
GET /api/public/products/:slug
GET /api/public/galleries
GET /api/public/galleries/:slug
GET /api/public/cms/:slug
```

---

## Seguridad

El backend incluye:

* Autenticación JWT.
* Refresh tokens.
* Validación de roles.
* Rate limiting general y para autenticación.
* CORS configurable.
* Helmet para headers seguros.
* HPP protection.
* Validación de variables de entorno.
* Hash de contraseñas.
* Restablecimiento de contraseña por token.
* Revocación de sesiones.
* Auditoría de acciones sensibles.

---

## Uploads

El sistema soporta carga de imágenes para:

```txt
products
ventures
gallery
profiles
cms
```

Formatos permitidos:

```txt
JPG
PNG
WEBP
```

Tamaño máximo configurable:

```env
MAX_FILE_SIZE_MB=3
```

Las imágenes quedan disponibles públicamente bajo:

```txt
/uploads/...
```

---

## Logs

El backend usa Winston y Morgan.

Archivos:

```txt
logs/error.log
logs/combined.log
```

La carpeta `logs/` debe existir en producción.

---

## Producción

Antes de desplegar:

```bash
npm install
npx prisma generate
npm start
```

Configurar correctamente:

```env
NODE_ENV=production
DATABASE_URL="mysql://usuario:password@host:3306/base_datos"
JWT_ACCESS_SECRET="SECRET_PRODUCCION"
JWT_REFRESH_SECRET="SECRET_PRODUCCION"
CORS_ORIGINS="https://dominio.com,https://www.dominio.com"
```

No subir nunca el archivo `.env` al repositorio.

---

## Estado del proyecto

Backend Beta funcional con módulos principales completos:

* Autenticación
* Usuarios
* Roles
* Emprendedoras
* Emprendimientos
* Productos
* Categorías
* Multimedia
* CMS
* Dashboard
* Uploads
* Auditoría
* Recuperación de contraseña

---

## Licencia

Proyecto privado desarrollado para Red Mujeres.

---

Ing. Cerjattin

Backend desarrollado como parte de la plataforma digital **Red Mujeres Beta**.
