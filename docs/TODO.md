# PROMPT PARA AGENTE DE IA - DESARROLLO PURPLELAB OTS INTERFACE

## CONTEXTO DEL PROYECTO
- **Aplicación**: Angular 17 con AWS Amplify
- **Dominio**: Healthcare Analytics - Sistema de gestión de audiencias predictivas
- **Arquitectura**: SPA con DynamoDB, autenticación Amplify, UI responsive
- **Referencias**:
  - [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
  - [Caso de éxito PurpleLab-Comscore](https://www.businesswire.com/news/home/20250612704238/en/PurpleLab-and-Comscore-Partner-to-Deliver-Off-the-Shelf-Healthcare-Predictive-Audiences-in-The-Trade-Desk)
  - Documentación estructura: `docs/EstructDB-OTS Process.md`

---

## INSTRUCCIONES GENERALES PARA EL AGENTE

### FLUJO DE TRABAJO GIT
1. **Rama principal**: `main`
2. **Patrón de ramas**: `feature/[scope]-[description]` (ej: `feature/design-system`, `feature/auth-protection`)
3. **Commits**: Seguir estrictamente [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
4. **Estructura de commit**:
   ```
   <type>[optional scope]: <description>
   
   [optional body]
   
   [optional footer]
   ```
5. **Tipos principales**: `feat`, `fix`, `docs`, `style`, `refactor`, `chore`

### PROCESO POR FEATURE
1. Crear rama desde `develop`
2. Investigar y planificar implementación
3. Desarrollar con commits atómicos
4. Probar funcionamiento con `npm run start`
5. Documentar cambios importantes
6. Preparar para merge (NO hacer merge automático)

---

## FEATURES A DESARROLLAR (EN ORDEN DE DEPENDENCIA)

## 🎨 FEATURE 1: SISTEMA DE DISEÑO PURPLELAB
**Rama**: `feature/design-system-foundation`
**Prioridad**: CRÍTICA - Debe completarse antes que cualquier UI

### TAREAS:
1. **Investigación del Sistema de Diseño**
   - Analizar [purplelab.com](https://purplelab.com/) para extraer:
     - Paleta de colores (primarios, secundarios, neutros)
     - Tipografías (familias, pesos, tamaños)
     - Espaciados y grids
     - Estilos de botones, inputs, cards
     - Patrones de navegación y layout

2. **Documentación del Sistema**
   - Crear `docs/SystemDesign.md` con:
     - Guía completa de colores (códigos hex/rgb)
     - Especificaciones tipográficas
     - Componentes base y sus variantes
     - Guidelines de uso y buenas prácticas

3. **Implementación de Estilos Base**
   - Crear `src/styles/` con:
     - `_variables.scss` (colores, tipografías, espaciados)
     - `_mixins.scss` (utilidades reutilizables)
     - `_components.scss` (estilos base de componentes)
   - Actualizar `src/styles.css` para importar nuevos estilos

4. **Componentes Reutilizables**
   - Crear en `src/app/shared/components/`:
     - `button/` - Componente de botones con variantes
     - `input/` - Inputs con validaciones y estados
     - `table/` - Tablas responsivas con paginación
     - `dropdown/` - Selectores y dropdowns
     - `card/` - Contenedores de información
     - `modal/` - Modales reutilizables

### COMMITS ESPERADOS:
```
docs: add PurpleLab design system documentation

feat(design): implement base SCSS variables and mixins

feat(components): add reusable button component with variants

feat(components): add form input component with validation states

feat(components): add responsive table component

feat(components): add dropdown component with search

feat(components): add card and modal components

style: apply PurpleLab design system to existing components
```

---

## 🔐 FEATURE 2: AUTENTICACIÓN Y SEGURIDAD
**Rama**: `feature/auth-security-enhancement`
**Depende de**: Feature 1 (para estilos del login)

### TAREAS:
1. **Deshabilitación de Registro Público**
   - Deshabilitar campos de sign up en el authenticator con `[hideSignUp]="true"`
   - Solo permitir login para usuarios pre-existentes en Cognito
   - Configurar mensajes corporativos en español

2. **Configuración de Autorización de Datos con Amplify**
   - Configurar esquema de datos con `allow.authenticated()` en todas las entidades
   - Implementar `defaultAuthorizationMode: 'userPool'` en data resource
   - Crear servicio de datos que verifica autenticación antes de cada operación
   - Seguir [documentación oficial](https://docs.amplify.aws/angular/build-a-backend/data/customize-authz/signed-in-user-data-access/)

3. **Personalización del Login**
   - Aplicar tema de PurpleLab al authenticator usando slots
   - Integrar logo y colores corporativos (#79589f)
   - Customizar headers, footers y textos según SystemDesign.md
   - Implementar dashboard integrado post-autenticación

4. ~~Testing de Seguridad~~ (OMITIDO)
   - ~~Verificar que rutas protegidas no sean accesibles sin auth~~
   - ~~Probar flujo completo de login con MFA~~
   - ~~Validar persistencia de sesión~~

### IMPLEMENTACIÓN COMPLETADA:
- ✅ **Schema de Datos Protegido**: Implementado en `amplify/data/resource.ts` con autorización `allow.authenticated()`
- ✅ **Servicio de Datos**: Creado `DataService` que verifica autenticación en cada operación
- ✅ **Authenticator Personalizado**: Deshabilitado registro, aplicado tema PurpleLab
- ✅ **Dashboard Integrado**: Estadísticas en tiempo real con datos protegidos

### COMMITS ESPERADOS:
```
feat(auth): disable public sign up in authenticator

feat(data): implement authenticated-only data schema with all OTS entities

feat(auth): customize login theme with PurpleLab branding

feat(auth): integrate protected dashboard with real-time stats

feat(data): add comprehensive data service with authentication checks

style(auth): apply PurpleLab design system to authenticator

docs: update authentication and data protection documentation
```

### PROTECCIÓN IMPLEMENTADA:
- **Nivel de Datos**: Todos los modelos requieren `allow.authenticated()`
- **Nivel de Servicio**: `DataService.ensureAuthenticated()` en cada operación
- **Nivel de UI**: Authenticator controla acceso a funcionalidades
- **Auditoría**: Logs de entrega incluyen `executedBy` del usuario autenticado

---

## 💾 FEATURE 3: ESTRUCTURA DE BASE DE DATOS
**Rama**: `feature/database-schema-implementation`
**Depende de**: Feature 2 (autenticación requerida para acceso a datos)

### TAREAS:
1. **Análisis de Estructura de Datos**
   - Revisar completamente `docs/EstructDB-OTS Process.md`
   - Mapear entidades y relaciones:
     - AUDIENCES, DESTINATIONS, BRIDGES, TENANTS
     - CONCEPT_GROUPS, ONBOARDING_REQUIREMENTS
     - METADATA_REQUIREMENTS, EXTERNAL_BUCKETS

2. **Diseño de Esquema DynamoDB**
   - Definir claves primarias y secundarias para cada tabla
   - Establecer índices GSI (Global Secondary Index) necesarios
   - Planificar estrategias de consulta eficientes
   - Documentar relaciones entre tablas

3. **Implementación con Amplify**
   - Crear recursos de DynamoDB en `amplify/data/`
   - Configurar esquemas GraphQL
   - Implementar resolvers personalizados si es necesario
   - Configurar permisos y políticas de acceso

4. **Modelos de Datos TypeScript**
   - Generar interfaces TypeScript para cada entidad
   - Crear servicios para operaciones CRUD
   - Implementar validaciones de datos

### COMMITS ESPERADOS:
```
docs: analyze and document database structure requirements

feat(data): define DynamoDB schema for OTS process entities

feat(data): implement Amplify data resources for all tables

feat(data): create TypeScript interfaces for data models

feat(data): add CRUD services for database operations

feat(data): configure GSI indexes for efficient queries

feat(data): implement data validation and error handling

chore(data): add database migration and seed scripts
```

---

## 🧭 FEATURE 4: NAVEGACIÓN Y MENÚ LATERAL
**Rama**: `feature/sidebar-navigation`
**Depende de**: Features 1, 2, 3 (diseño, auth y estructura de datos)

### TAREAS:
1. **Componente de Menú Lateral**
   - Crear `src/app/shared/components/sidebar/`
   - Implementar navegación responsive (desktop/mobile)
   - Aplicar estilos del sistema de diseño PurpleLab

2. **Opciones de Menú**
   - Configurar rutas para cada sección:
     - `audiences` - Gestión de audiencias
     - `destinations` - Configuración de destinos
     - `bridges` - Puentes de datos
     - `tenants` - Gestión de inquilinos
     - `concept_groups` - Grupos de conceptos médicos
     - `onboarding_requirements` - Requisitos de incorporación
     - `metadata_requirements` - Requisitos de metadatos
     - `external_buckets` - Buckets externos

3. **Estado y Navegación Activa**
   - Implementar highlight de sección activa
   - Configurar breadcrumbs
   - Gestionar estado de menú colapsado/expandido

### COMMITS ESPERADOS:
```
feat(navigation): implement responsive sidebar component

feat(navigation): add routing configuration for all sections

feat(navigation): implement active state and breadcrumbs

style(navigation): apply PurpleLab design system to sidebar

feat(navigation): add mobile navigation and responsive behavior
```

---

## 🎛️ FEATURE 5: INTERFAZ CRUD GENÉRICA
**Rama**: `feature/generic-crud-interface`
**Depende de**: Todas las features anteriores

### TAREAS:
1. **Componente CRUD Base**
   - Crear `src/app/shared/components/crud-base/`
   - Implementar interfaz genérica para:
     - Listar recursos (con paginación y filtros)
     - Crear nuevo recurso
     - Visualizar detalles
     - Editar recurso existente
     - Eliminar recurso (con confirmación)

2. **Módulos Específicos por Entidad**
   - Crear módulos en `src/app/modules/` para cada entidad:
     - `audiences/`, `destinations/`, `bridges/`, `tenants/`
     - `concept-groups/`, `onboarding-requirements/`
     - `metadata-requirements/`, `external-buckets/`

3. **Funcionalidades Avanzadas**
   - Implementar búsqueda y filtrado
   - Paginación server-side
   - Ordenamiento por columnas
   - Exportación de datos
   - Bulk operations (selección múltiple)

4. **Validaciones y Estados**
   - Formularios reactivos con validación
   - Estados de carga, éxito y error
   - Mensajes de confirmación
   - Manejo de errores de API

### COMMITS ESPERADOS:
```
feat(crud): implement generic CRUD base component

feat(crud): add pagination, filtering and search functionality

feat(audiences): create audiences management module with CRUD

feat(destinations): create destinations management module with CRUD

feat(bridges): create bridges management module with CRUD

feat(tenants): create tenants management module with CRUD

feat(concept-groups): create concept groups management module with CRUD

feat(onboarding): create onboarding requirements management module

feat(metadata): create metadata requirements management module

feat(buckets): create external buckets management module with CRUD

feat(crud): add bulk operations and data export functionality

feat(crud): implement advanced form validation and error handling

style(crud): ensure all CRUD interfaces follow PurpleLab design system
```

---

## VALIDACIÓN POR FEATURE

### DESPUÉS DE CADA FEATURE:
1. **Ejecutar aplicación**: `ng serve`
2. **Verificar funcionalidad** en navegador
3. **Confirmar estilos** según diseño PurpleLab
4. **Validar responsive design** (móvil/desktop)
5. **Comprobar accesibilidad** básica
6. **Documentar** cambios importantes

### CRITERIOS DE ACEPTACIÓN:
- ✅ Aplicación compila sin errores
- ✅ Funcionalidad implementada funciona correctamente
- ✅ Estilos consistentes con sistema de diseño
- ✅ Responsive design funcional
- ✅ Commits siguen Conventional Commits
- ✅ Código documentado apropiadamente

---

## NOTAS IMPORTANTES PARA EL AGENTE

1. **INVESTIGACIÓN REQUERIDA**: Antes de implementar cada feature, investiga la documentación oficial de Angular, Amplify y las mejores prácticas.

2. **ARQUITECTURA MODULAR**: Mantén una estructura modular y reutilizable. Los componentes deben ser independientes y testeable.

3. **PERFORMANCE**: Considera lazy loading para módulos y optimización de imágenes.

4. **SEGURIDAD**: Todos los endpoints deben estar protegidos. Nunca exponer datos sensibles en el frontend.

5. **LOGS Y DEBUGGING**: Implementa logging adecuado para debugging y monitoreo.

6. **DOCUMENTACIÓN**: Actualiza README.md y crea documentación técnica cuando sea necesario.

7. **NO HACER MERGE**: Prepara las ramas para revisión, pero NO hagas merge a main automáticamente.

---

## COMANDOS ÚTILES
```bash
# Iniciar desarrollo
ng serve

# Generar componente
ng generate component shared/components/[component-name]

# Generar módulo
ng generate module modules/[module-name] --routing

# Deploy Amplify backend
npx amplify push

# Generar tipos GraphQL
npx amplify codegen
```

**¿TIENES ALGUNA DUDA O NECESITAS CLARIFICACIÓN SOBRE ALGUNA FEATURE?**
