# Cheska

Catalogo online y panel de gestion para vender productos de belleza con una experiencia simple, visual y administrable.

Cheska es una aplicacion full stack pensada para negocios que necesitan mostrar sus productos, administrar stock, registrar ventas y entender el rendimiento comercial desde un mismo lugar. Combina un catalogo publico moderno con un panel privado para operar el dia a dia sin depender de planillas sueltas.

## Que problema resuelve

Muchos emprendimientos venden por WhatsApp, Instagram o de forma presencial, pero terminan repartiendo la informacion entre chats, notas, hojas de calculo y publicaciones. Cheska centraliza lo importante:

- Productos visibles en un catalogo claro y responsive.
- Stock actualizado desde el panel administrativo.
- Registro de ventas por canal.
- Calculo de ingresos, costos y ganancia.
- Alertas de productos con bajo stock.
- Exportacion de ventas para analisis o control externo.

## Funcionalidades principales

### Catalogo publico

- Listado de productos activos para clientes.
- Busqueda por nombre o categoría.
- Filtros por tipo de producto.
- Ordenamiento por novedades y precio.
- Detalle individual de producto.
- Diseño responsive para mobile y desktop.
- Productos sin stock enviados al final del listado.

### Panel administrativo

- Login protegido con JWT.
- Dashboard con resumen del mes.
- Métricas de ventas, ingresos, ganancia y stock bajo.
- Gráfico de ventas por mes.
- Ranking de productos mas vendidos.
- Gestión completa de productos: crear, editar, eliminar, activar o desactivar.
- Carga de imagenes mediante Cloudinary.
- Reposición de stock.
- Registro de ventas con multiples items.
- Descuento automatico de stock al vender.
- Exportacion de ventas en CSV y Excel.

## Stack tecnologico

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- Axios
- Recharts
- Lucide React
- React Hot Toast
- SweetAlert2

### Backend

- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication
- Swagger
- Cloudinary
- ClosedXML para exportacion Excel
- Arquitectura separada en Domain, Application, Infrastructure y API

## Arquitectura del proyecto

```txt
Cheska/
|-- cheska-frontend/     Aplicacion web React
|-- cheska-backend/      API .NET 8
|-- readme.md           Presentacion del proyecto
```

El frontend consume la API mediante una URL configurable por entorno. El backend expone endpoints publicos para el catalogo y endpoints protegidos para la administracion.

## Modulos destacados

- Productos: alta, edicion, baja, visibilidad publica, stock, costo, precio, margen e imagen.
- Ventas: registro por canal, items vendidos, total, ganancia y notas.
- Dashboard: indicadores comerciales, alertas de stock y productos con mejor rendimiento.
- Exportaciones: descarga de ventas en CSV y Excel.
- Seguridad: autenticacion JWT y rutas admin protegidas.

## Variables de entorno

### Frontend

```env
VITE_API_URL=https://tu-api.com/api
```

### Backend

```env
ConnectionStrings__DefaultConnection=Host=...;Database=...;Username=...;Password=...
Jwt__Key=una-clave-larga-random-de-32-caracteres-o-mas
Jwt__Issuer=Cheska
Jwt__Audience=Cheska
Admin__Username=usuario-admin
Admin__Password=password-fuerte
Cloudinary__CloudName=...
Cloudinary__ApiKey=...
Cloudinary__ApiSecret=...
Cors__AllowedOrigins__0=https://tu-frontend.com
```

## Como ejecutarlo en local

### 1. Frontend

```bash
cd cheska-frontend
npm install
npm run dev
```

Por defecto, Vite levanta la app en:

```txt
http://localhost:5173
```

### 2. Backend

```bash
cd cheska-backend
dotnet restore
dotnet run --project cheska-backend
```

El backend aplica migraciones automaticamente al iniciar, siempre que la cadena de conexion a PostgreSQL este configurada correctamente.

## Endpoints principales

- `GET /api/products` - Catalogo publico.
- `GET /api/products/{id}` - Detalle publico de producto.
- `GET /api/products/admin` - Listado admin protegido.
- `POST /api/products` - Crear producto.
- `PUT /api/products/{id}` - Editar producto.
- `PATCH /api/products/{id}/stock/replenish` - Reponer stock.
- `DELETE /api/products/{id}` - Eliminar producto.
- `POST /api/sales` - Registrar venta.
- `GET /api/sales` - Listar ventas.
- `GET /api/dashboard` - Obtener metricas del dashboard.
- `GET /api/export/sales/csv` - Exportar ventas CSV.
- `GET /api/export/sales/excel` - Exportar ventas Excel.

## Por que destaca

Cheska no es solo una vidriera digital. Es una herramienta operativa para que un emprendimiento pueda vender mejor, controlar su stock y tomar decisiones con datos reales. La experiencia publica esta cuidada para convertir visitas en consultas, mientras que el panel admin esta pensado para ahorrar tiempo en tareas repetitivas.

El proyecto demuestra integracion full stack real, autenticacion, persistencia en base de datos, subida de imagenes, exportacion de informacion, arquitectura por capas y una interfaz preparada para uso cotidiano.

## Estado del proyecto

Proyecto funcional con:

- Catalogo publico listo.
- Panel admin protegido.
- Gestion de productos.
- Gestion de ventas.
- Dashboard comercial.
- Exportaciones.
- Checklist de deploy incluido.

## Autor

Desarrollado como proyecto full stack para gestionar y potenciar la venta de productos.

