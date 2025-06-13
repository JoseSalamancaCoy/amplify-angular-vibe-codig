# 🎨 Sistema de Diseño PurpleLab

## 🎯 Visión del Sistema

El sistema de diseño de PurpleLab está orientado a crear interfaces confiables, profesionales y accesibles para el manejo de datos de salud y audiencias predictivas. Utiliza una paleta centrada en el morado (purple) que transmite innovación, confianza y profesionalismo en el sector healthcare.

---

## 🎨 Paleta de Colores

### Colores Primarios

| Color | Nombre | Hex | RGB | Uso |
|-------|--------|-----|-----|-----|
| ![#79589f](https://via.placeholder.com/20x20/79589f/79589f.png) | **Purple Primary** | `#79589f` | `rgb(121, 88, 159)` | Botones principales, navegación activa |
| ![#4f3074](https://via.placeholder.com/20x20/4f3074/4f3074.png) | **Purple Dark** | `#4f3074` | `rgb(79, 48, 116)` | Hover states, headers |
| ![#9d70d0](https://via.placeholder.com/20x20/9d70d0/9d70d0.png) | **Purple Light** | `#9d70d0` | `rgb(157, 112, 208)` | Accents, focus states |

### Colores Secundarios

| Color | Nombre | Hex | RGB | Uso |
|-------|--------|-----|-----|-----|
| ![#006deb](https://via.placeholder.com/20x20/006deb/006deb.png) | **Blue Primary** | `#006deb` | `rgb(0, 109, 235)` | Links, información |
| ![#008700](https://via.placeholder.com/20x20/008700/008700.png) | **Green Success** | `#008700` | `rgb(0, 135, 0)` | Éxito, confirmaciones |
| ![#c74c00](https://via.placeholder.com/20x20/c74c00/c74c00.png) | **Orange Warning** | `#c74c00` | `rgb(199, 76, 0)` | Advertencias |
| ![#de0a0a](https://via.placeholder.com/20x20/de0a0a/de0a0a.png) | **Red Danger** | `#de0a0a` | `rgb(222, 10, 10)` | Errores, eliminación |

### Neutrales

| Color | Nombre | Hex | RGB | Uso |
|-------|--------|-----|-----|-----|
| ![#1a1a1a](https://via.placeholder.com/20x20/1a1a1a/1a1a1a.png) | **Gray 900** | `#1a1a1a` | `rgb(26, 26, 26)` | Texto principal |
| ![#475366](https://via.placeholder.com/20x20/475366/475366.png) | **Gray 700** | `#475366` | `rgb(71, 83, 102)` | Texto secundario |
| ![#56667d](https://via.placeholder.com/20x20/56667d/56667d.png) | **Gray 600** | `#56667d` | `rgb(86, 102, 125)` | Texto deshabilitado |
| ![#62738d](https://via.placeholder.com/20x20/62738d/62738d.png) | **Gray 500** | `#62738d` | `rgb(98, 115, 141)` | Bordes, divisores |
| ![#cfd7e6](https://via.placeholder.com/20x20/cfd7e6/cfd7e6.png) | **Gray 300** | `#cfd7e6` | `rgb(207, 215, 230)` | Bordes suaves |
| ![#eef1f6](https://via.placeholder.com/20x20/eef1f6/eef1f6.png) | **Gray 100** | `#eef1f6` | `rgb(238, 241, 246)` | Fondos sutiles |
| ![#f7f8fb](https://via.placeholder.com/20x20/f7f8fb/f7f8fb.png) | **Gray 50** | `#f7f8fb` | `rgb(247, 248, 251)` | Fondos de página |
| ![#ffffff](https://via.placeholder.com/20x20/ffffff/ffffff.png) | **White** | `#ffffff` | `rgb(255, 255, 255)` | Fondos principales |

### Colores de Estado

| Color | Nombre | Hex | Fondo | Uso |
|-------|--------|-----|-------|-----|
| ![#f6faff](https://via.placeholder.com/20x20/f6faff/f6faff.png) | **Info Background** | `#f6faff` | `#8ebdf1` | Mensajes informativos |
| ![#f8fcf9](https://via.placeholder.com/20x20/f8fcf9/f8fcf9.png) | **Success Background** | `#f8fcf9` | `#86cf95` | Mensajes de éxito |
| ![#fffaf6](https://via.placeholder.com/20x20/fffaf6/fffaf6.png) | **Warning Background** | `#fffaf6` | `#fa9f47` | Mensajes de advertencia |
| ![#fdf6f6](https://via.placeholder.com/20x20/fdf6f6/fdf6f6.png) | **Danger Background** | `#fdf6f6` | `#de7575` | Mensajes de error |

---

## 📝 Tipografía

### Familia de Fuentes

```css
font-family: "Salesforce Sans", -apple-system, BlinkMacSystemFont, 
             'avenir next', avenir, helvetica, 'helvetica neue', 
             ubuntu, roboto, noto, 'segoe ui', arial, sans-serif;
```

### Escala Tipográfica

| Elemento | Tamaño | Peso | Altura de Línea | Uso |
|----------|--------|------|-----------------|-----|
| **H1** | `32px` | `700` | `1.2` | Títulos principales |
| **H2** | `24px` | `600` | `1.3` | Títulos de sección |
| **H3** | `20px` | `600` | `1.4` | Subtítulos |
| **H4** | `18px` | `600` | `1.4` | Títulos de componentes |
| **H5** | `16px` | `600` | `1.5` | Títulos menores |
| **H6** | `14px` | `600` | `1.5` | Etiquetas |
| **Body Large** | `16px` | `400` | `1.6` | Texto principal grande |
| **Body** | `14px` | `400` | `1.5` | Texto principal |
| **Body Small** | `13px` | `400` | `1.4` | Texto secundario |
| **Caption** | `12px` | `400` | `1.3` | Texto de apoyo |
| **Code** | `13px` | `400` | `1.5` | Código, monospace |

### Pesos de Fuente

- **Light (300)**: Textos decorativos (uso limitado)
- **Regular (400)**: Texto principal
- **Medium (500)**: Texto de énfasis medio
- **Semibold (600)**: Títulos, etiquetas
- **Bold (700)**: Títulos principales, texto muy enfático

---

## 📏 Espaciado y Grid

### Sistema de Espaciado (Base 4px)

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | `4px` | Espaciado mínimo |
| `sm` | `8px` | Espaciado pequeño |
| `md` | `16px` | Espaciado medio |
| `lg` | `24px` | Espaciado grande |
| `xl` | `32px` | Espaciado extra grande |
| `2xl` | `48px` | Espaciado muy grande |
| `3xl` | `64px` | Espaciado máximo |

### Grid System

- **Contenedor máximo**: `1200px`
- **Columnas**: 12 columnas
- **Gutters**: `24px`
- **Breakpoints**:
  - `xs`: `0px` (móviles)
  - `sm`: `576px` (móviles grandes)
  - `md`: `768px` (tablets)
  - `lg`: `992px` (desktop)
  - `xl`: `1200px` (desktop grande)

---

## 🔲 Componentes Base

### Botones

#### Tamaños
- **Large**: `40px` altura, `16px` padding horizontal
- **Medium**: `32px` altura, `15px` padding horizontal *(default)*
- **Small**: `26px` altura, `12px` padding horizontal

#### Variantes
- **Primary**: Fondo `purple-primary`, texto blanco
- **Secondary**: Borde `purple-primary`, texto `purple-primary`
- **Tertiary**: Sin borde, texto `purple-primary`
- **Danger**: Fondo `red-danger` / Borde según contexto
- **Success**: Borde `green-success`, texto `green-success`

#### Estados
- **Default**: Estilo base
- **Hover**: Darken 20% para primary, lighten 10% background para outline
- **Active**: Darken 30% para primary
- **Focus**: Border + box-shadow con color de marca
- **Disabled**: `gray-100` background, `gray-600` texto

### Inputs

#### Tipos
- **Text input**: Texto simple
- **Textarea**: Texto multilínea
- **Select**: Dropdown de opciones
- **Checkbox**: Selección múltiple
- **Radio**: Selección única
- **Toggle/Switch**: Activar/desactivar

#### Estados
- **Default**: Borde `gray-300`
- **Focus**: Borde `purple-primary`, box-shadow
- **Error**: Borde `red-danger`
- **Success**: Borde `green-success`
- **Disabled**: Fondo `gray-100`, texto `gray-600`

### Cards

#### Estructura
- **Padding**: `24px`
- **Border radius**: `8px`
- **Border**: `1px solid gray-300`
- **Shadow**: `0 2px 4px rgba(0,0,0,0.1)`

#### Variantes
- **Default**: Fondo blanco
- **Elevated**: Shadow más prominente
- **Outlined**: Solo borde, sin shadow

### Tablas

#### Estilos
- **Header**: Fondo `gray-50`, texto `gray-700`, peso `600`
- **Rows**: Alternadas con `gray-50`
- **Hover**: Fondo `purple-light` al 10%
- **Border**: `1px solid gray-300`
- **Padding**: `12px 16px`

---

## 🎭 Estados y Feedback

### Loading States
- **Skeleton loaders**: `gray-200` animado
- **Spinners**: Color `purple-primary`
- **Progress bars**: Fondo `gray-200`, fill `purple-primary`

### Mensajes de Estado
- **Info**: Fondo `info-background`, icono y texto `blue-primary`
- **Success**: Fondo `success-background`, icono y texto `green-success`
- **Warning**: Fondo `warning-background`, icono y texto `orange-warning`
- **Error**: Fondo `danger-background`, icono y texto `red-danger`

### Modales y Overlays
- **Backdrop**: `rgba(0,0,0,0.5)`
- **Modal**: Fondo blanco, `border-radius: 8px`
- **Shadow**: `0 10px 25px rgba(0,0,0,0.3)`

---

## ♿ Accesibilidad

### Contraste de Color
Todos los pares de colores cumplen **WCAG 2.1 AA**:
- Texto normal: **4.5:1** mínimo
- Texto grande: **3:1** mínimo
- Elementos interactivos: **3:1** mínimo

### Focus Management
- **Focus visible**: Siempre presente con `outline` o `box-shadow`
- **Color de focus**: `purple-primary` con transparencia
- **Tab order**: Lógico y predecible

### Responsive Design
- **Mobile first**: Diseño optimizado para móviles
- **Touch targets**: Mínimo `44px x 44px`
- **Legibilidad**: Texto mínimo `16px` en móviles

---

## 🔧 Implementación Técnica

### Variables CSS/SCSS

```scss
// Colores primarios
$purple-primary: #79589f;
$purple-dark: #4f3074;
$purple-light: #9d70d0;

// Colores secundarios
$blue-primary: #006deb;
$green-success: #008700;
$orange-warning: #c74c00;
$red-danger: #de0a0a;

// Neutrales
$gray-900: #1a1a1a;
$gray-700: #475366;
$gray-600: #56667d;
$gray-500: #62738d;
$gray-300: #cfd7e6;
$gray-100: #eef1f6;
$gray-50: #f7f8fb;
$white: #ffffff;

// Espaciado
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
$spacing-3xl: 64px;

// Tipografía
$font-family-base: "Salesforce Sans", -apple-system, BlinkMacSystemFont, sans-serif;
$font-size-base: 14px;
$line-height-base: 1.5;

// Border radius
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 12px;

// Shadows
$shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
$shadow-md: 0 2px 4px rgba(0,0,0,0.1);
$shadow-lg: 0 4px 8px rgba(0,0,0,0.15);
```

### Utilidades de Clase

```scss
// Colores de texto
.text-primary { color: $purple-primary; }
.text-secondary { color: $gray-700; }
.text-muted { color: $gray-600; }
.text-success { color: $green-success; }
.text-warning { color: $orange-warning; }
.text-danger { color: $red-danger; }

// Fondos
.bg-primary { background-color: $purple-primary; }
.bg-light { background-color: $gray-50; }
.bg-white { background-color: $white; }

// Espaciado
.p-xs { padding: $spacing-xs; }
.p-sm { padding: $spacing-sm; }
.p-md { padding: $spacing-md; }
.p-lg { padding: $spacing-lg; }
.p-xl { padding: $spacing-xl; }

.m-xs { margin: $spacing-xs; }
.m-sm { margin: $spacing-sm; }
.m-md { margin: $spacing-md; }
.m-lg { margin: $spacing-lg; }
.m-xl { margin: $spacing-xl; }
```

---

## 📋 Guidelines de Uso

### ✅ Hacer
- Usar la paleta de colores definida
- Mantener consistencia en espaciado (sistema de 4px)
- Aplicar estados de hover/focus en elementos interactivos
- Usar tipografía de la escala establecida
- Verificar contraste de color (WCAG AA)

### ❌ No Hacer
- Crear colores personalizados fuera de la paleta
- Usar espaciado arbitrario
- Omitir estados de interacción
- Mezclar familias tipográficas
- Ignorar directrices de accesibilidad

### 📱 Responsive
- **Mobile first**: Diseñar primero para móvil
- **Breakpoints**: Usar los definidos en el sistema
- **Touch**: Elementos tactiles mínimo 44px
- **Legibilidad**: Texto principal mínimo 16px en móvil

---

## 🔄 Versionado y Mantenimiento

- **Versión actual**: `1.0.0`
- **Última actualización**: Febrero 2025
- **Próxima revisión**: Trimestral
- **Responsable**: Equipo de Design System

### Changelog
- `1.0.0`: Sistema inicial con paleta PurpleLab, componentes base y guidelines de accesibilidad 