# Instrucciones de integración — Granja Alianza + Supabase

## Archivos entregados

| Archivo | Qué hace |
|---|---|
| `js/supabase.js` | Configura la conexión a tu proyecto Supabase |
| `js/carrito.js`  | Carrito con carga de productos y guardado de pedidos |
| `js/contacto.js` | Formulario que guarda mensajes en Supabase |

---

## Paso 1 — Configura tus credenciales

Abre `js/supabase.js` y reemplaza los dos valores:

```js
const SUPABASE_URL = 'https://TU_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'TU_ANON_PUBLIC_KEY';
```

Los encuentras en tu proyecto de Supabase →  
**Settings → API → Project URL** y **anon / public key**

---

## Paso 2 — Agrega el CDN de Supabase en tus HTML

En **TODOS** los HTML que usen carrito o contacto, pega esta línea  
dentro del `<head>`, **antes** de cualquier `<script>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Archivos afectados:
- `html/cart.html`
- `html/ours_eggs.html`
- `html/contact.html`

---

## Paso 3 — Reemplaza los archivos JS

Copia los 3 archivos entregados a tu carpeta `js/`:

```
tu-proyecto/
└── js/
    ├── supabase.js     ← archivo nuevo
    ├── carrito.js      ← reemplaza el original
    ├── contacto.js     ← reemplaza el original
    └── module/
        └── menu.js     ← no se toca
```

---

## Paso 4 — Ejecuta el SQL en Supabase

Si aún no lo has hecho:
1. Abre tu proyecto en supabase.com
2. Ve a **SQL Editor**
3. Pega el contenido de `granja_alianza_database.sql`
4. Click en **Run**

---

## Cómo funciona ahora

```
Usuario abre ours_eggs.html
  → carrito.js llama a Supabase y carga los productos de la tabla `productos`
  → las tarjetas se generan dinámicamente (ya no están hardcodeadas en el HTML)

Usuario añade productos al carrito
  → se guardan en localStorage (igual que antes)

Usuario hace clic en el botón de WhatsApp
  → carrito.js llama al procedimiento almacenado `registrar_pedido()` en Supabase
  → el pedido queda guardado en la tabla `pedidos` y `pedido_items`
  → el stock se descuenta automáticamente
  → si el stock baja de 10, el trigger guarda una alerta en `auditoria_log`
  → se abre WhatsApp con el mensaje y el número de pedido

Usuario envía el formulario de contacto
  → contacto.js guarda nombre, email y mensaje en `mensajes_contacto`
  → se abre WhatsApp igual que antes
```

---

## Verificar que funciona

En el **SQL Editor** de Supabase puedes correr estas consultas:

```sql
-- Ver pedidos registrados
SELECT * FROM pedidos ORDER BY creado_en DESC;

-- Ver items de un pedido específico
SELECT * FROM pedido_items WHERE pedido_id = 1;

-- Ver mensajes del formulario de contacto
SELECT * FROM mensajes_contacto ORDER BY creado_en DESC;

-- Ver alertas de stock bajo
SELECT * FROM auditoria_log ORDER BY realizado_en DESC;
```
