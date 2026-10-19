# panmonito-zip (3) (Svelte + TypeScript)

Este proyecto ha sido transformado automáticamente desde HTML/CSS estático a una aplicación modular moderna en **Svelte + TypeScript**.

## 📁 Estructura del Proyecto

```
├── src/
│   ├── data/
│   │   ├── productos.json     <- Catálogo de productos con IDs, imágenes, precios y descripciones
│   │   └── informacion.json   <- Datos del negocio (teléfono, WhatsApp, email, redes)
│   ├── pages/
│   │   ├── home/
│   │   │   ├── home.svelte / home.css
│   │   │   └── section/       <- Cada sección en nombre/nombre.svelte y nombre/nombre.css
│   │   ├── catalogo/
│   │   │   ├── catalogo.svelte
│   │   │   └── catalogo.css
│   │   └── detalle/
│   │       ├── detalle.svelte
│   │       └── detalle.css
│   ├── styles/
│   │   ├── variables.css      <- Variables CSS globales centralizadas
│   │   └── style.css
│   ├── types.ts               <- Interfaces TypeScript (Producto, InformacionNegocio)
│   ├── App.svelte             <- Enrutador de páginas
│   └── main.ts
├── public/                    <- Imágenes y archivos multimedia
├── package.json
└── vite.config.ts
```

## 🚀 Cómo ejecutar en desarrollo

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Para compilar a producción:
```bash
npm run build
```
