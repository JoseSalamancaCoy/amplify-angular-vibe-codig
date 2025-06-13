# 📊 Estructura de Base de Datos - PurpleLab OTS Process

## 🎯 Contexto del Sistema

**PurpleLab** es una empresa de analytics en salud especializada en la entrega de **audiencias predictivas** para anunciantes de healthcare. Este documento define la estructura de base de datos para el proceso **"Off-The-Shelf" (OTS)**, que centraliza la configuración y gestión de audiencias para múltiples destinos y clientes.

---

## 🏗️ Entidades Principales

### 1. 👥 AUDIENCES (Audiencias)

**Propósito**: Gestionar la información central de las audiencias disponibles para entrega

#### Campos Principales:
- `path_name` - Ruta de acceso a la audiencia
- `min_size` - Tamaño mínimo de la audiencia
- `max_size` - Tamaño máximo de la audiencia  
- `destination` - Destino de entrega
- `audience_type` - Tipo de audiencia
- `cadence` - Frecuencia de entrega
- `flags` - Indicadores de estado

#### Tipos de Audiencia:
| Tipo | Descripción |
|------|-------------|
| **DTC** | Direct to Consumer - Dirigidas a consumidores finales |
| **HCP** | Healthcare Professional - Dirigidas a profesionales de salud |
| **NPI to DTC** | National Provider Identifier to Direct to Consumer |

#### Relaciones:
- 🔗 **DESTINATIONS** - Define dónde se entregan
- 🔗 **TENANTS** - Asociadas a clientes específicos
- 🔗 **CONCEPT_GROUPS** - Categorizadas por condiciones médicas

---

### 2. 🎯 DESTINATIONS (Destinos)

**Propósito**: Definir las plataformas de destino y sus especificaciones técnicas

#### Plataformas Soportadas:
- **Nexxen** - Plataforma de advertising programático
- **Viant** - DSP (Demand-Side Platform)
- **Comscore** - Analytics y medición de audiencias
- **Pulsepoint** - Plataforma de healthcare advertising
- **LiveRamp** - Plataforma de gestión de datos
- **DeepIntent** - Healthcare-focused DSP
- **Semcasting** - Targeting y analytics
- **Lasso** - Data management platform
- **Jungroup** - Advertising technology platform

#### Campos Específicos:
- `required_headers` - Headers requeridos para archivos
- `dv_tokens` - Tokens de verificación de datos
- `file_format_requirements` - Especificaciones de formato

#### Relaciones:
- 🔗 **BRIDGES** - Transformación de identificadores
- 🔗 **METADATA_REQUIREMENTS** - Especificaciones de metadatos
- 🔗 **EXTERNAL_BUCKETS** - Ubicaciones de almacenamiento

---

### 3. 🌉 BRIDGES (Puentes de Datos)

**Propósito**: Mapear identificadores de pacientes a identificadores de clientes

#### Función Principal:
Transformar `patient_id` interno a `custom_id` específico por destino

#### Tipos de Identificadores:
- **Throtle IDs** - Identificadores de la plataforma Throtle
- **Datavant Transit Tokens** - Tokens de Datavant para interoperabilidad
- **Purple IDs** - Identificadores internos de PurpleLab

#### Relaciones:
- 🔗 Conecta **AUDIENCES** con **DESTINATIONS** específicos

---

### 4. 🏢 TENANTS (Inquilinos/Clientes)

**Propósito**: Gestionar información de clientes y sus configuraciones específicas

#### Campos:
- `id` - Identificador único del cliente
- `name` - Nombre del cliente
- `configuration_settings` - Configuraciones específicas

#### Ejemplos de Clientes:
| Cliente | Tipo |
|---------|------|
| PulsePoint | Healthcare DSP |
| Jun Group | Advertising Platform |
| Viant | DSP |
| LiveRamp Biogen | Pharma Data Platform |
| Nexxen | Programmatic Platform |
| Semcasting | Analytics Platform |
| Lasso | Data Management |
| Throtle | Identity Resolution |

#### Relaciones:
- 🔗 **AUDIENCES** - Propietarios de audiencias específicas
- 🔗 **EXTERNAL_BUCKETS** - Almacenamiento dedicado

---

### 5. 🏥 CONCEPT_GROUPS (Grupos de Conceptos)

**Propósito**: Categorizar audiencias por condiciones médicas o tratamientos

#### Campos:
- `conceptgroups_id` - Identificador único del grupo
- `group_name` - Nombre del grupo de conceptos
- `medical_category` - Categoría médica

#### Ejemplos de Grupos:
- **Autoimmune Medications** - Medicamentos autoinmunes
- **Blood Disorder Medications** - Medicamentos para trastornos sanguíneos
- **Imaging Tests** - Pruebas de imagen médica
- **Cardiovascular Treatments** - Tratamientos cardiovasculares
- **Diabetes Management** - Gestión de diabetes

#### Relaciones:
- 🔗 **AUDIENCES** - Define las categorías médicas de las audiencias

---

### 6. 📋 ONBOARDING_REQUIREMENTS (Requisitos de Incorporación)

**Propósito**: Especificar requisitos técnicos para la incorporación de nuevos destinos

#### Campos:
- `destination_route` - Ruta de destino
- `credentials` - Credenciales de acceso
- `audience_type` - Tipos de audiencia soportados
- `file_formats` - Formatos de archivo aceptados
- `ots_frequency` - Frecuencia de entrega OTS
- `id_types` - Tipos de identificadores soportados

#### Ubicaciones de Almacenamiento:
| Ubicación | Descripción |
|-----------|-------------|
| **PL GCS** | Google Cloud Storage de PurpleLab |
| **External GCS** | Google Cloud Storage externo |
| **PL S3** | Amazon S3 de PurpleLab |
| **External S3** | Amazon S3 externo |
| **SFTP** | Secure File Transfer Protocol |

#### Relaciones:
- 🔗 **DESTINATIONS** - Define configuraciones iniciales

---

### 7. 📄 METADATA_REQUIREMENTS (Requisitos de Metadatos)

**Propósito**: Definir la estructura de archivos de metadatos requerida por cada destino

#### Campos:
- `destination` - Destino específico
- `metadata_type` - Tipo de metadata (Metadata/Taxonomy)
- `required_columns` - Columnas requeridas en el archivo

#### Variaciones por Destino:
Cada destino tiene columnas específicas requeridas para sus archivos de metadatos y taxonomía.

#### Relaciones:
- 🔗 **DESTINATIONS** - Especifica formato de datos requerido

---

### 8. 🪣 EXTERNAL_BUCKETS (Buckets Externos)

**Propósito**: Gestionar ubicaciones de almacenamiento externo para clientes

#### Campos:
- `bucket_name` - Nombre del bucket
- `client_id` - Identificador del cliente
- `url_1`, `url_2`, etc. - URLs de acceso múltiples

#### Función:
Almacenar rutas de acceso a datos externos y configuraciones de almacenamiento por cliente.

#### Relaciones:
- 🔗 **TENANTS** - Almacenamiento específico por cliente
- 🔗 **DESTINATIONS** - Ubicaciones de entrega

---

## 🔄 Relaciones Clave entre Entidades

### Pipeline Principal de Entrega:
```mermaid
graph LR
    A[TENANTS] --> B[AUDIENCES]
    B --> C[DESTINATIONS]
    C --> D[BRIDGES]
    D --> E[EXTERNAL_BUCKETS]
```

### Relaciones de Configuración:

| Entidad A | Relación | Entidad B | Descripción |
|-----------|----------|-----------|-------------|
| AUDIENCES | ↔ | CONCEPT_GROUPS | Categorización médica |
| DESTINATIONS | ↔ | METADATA_REQUIREMENTS | Especificaciones técnicas |
| DESTINATIONS | ↔ | ONBOARDING_REQUIREMENTS | Configuración inicial |
| TENANTS | ↔ | EXTERNAL_BUCKETS | Almacenamiento por cliente |

### Relaciones de Procesamiento:

- **BRIDGES**: Transformación de identificadores `patient_id` → `custom_id`
- **METADATA_REQUIREMENTS**: Define formato de archivos de salida
- **ONBOARDING_REQUIREMENTS**: Establece configuración del pipeline

---

## 🎯 Casos de Uso del Sistema

### 1. 📤 Entrega de Audiencias
Procesar y entregar audiencias específicas a destinos configurados según la cadencia establecida.

### 2. 📊 Gestión de Metadatos
Generar archivos de taxonomía y metadata según las especificaciones de cada destino.

### 3. 🔄 Transformación de IDs
Convertir identificadores internos (`patient_id`) a formatos específicos de cliente (`custom_id`).

### 4. ⚙️ Configuración de Destinos
Gestionar la incorporación de nuevos destinos y sus requisitos técnicos.

### 5. 📈 Seguimiento de Entregas
Monitorear la cadencia, estado y éxito de las entregas de audiencias.

---

## 🛠️ Consideraciones Técnicas

### 📈 Escalabilidad
- Sistema debe manejar múltiples destinos simultáneamente
- Capacidad de crecimiento horizontal para nuevos clientes
- Optimización para volúmenes altos de datos

### 🔐 Seguridad
- Gestión segura de credenciales y tokens de acceso
- Protección de datos de salud sensibles (HIPAA compliance)
- Auditoría completa de acceso a datos

### 🔧 Flexibilidad
- Capacidad de agregar nuevos destinos dinámicamente
- Soporte para diferentes formatos de archivo
- Configuración personalizable por cliente

### 📝 Trazabilidad
- Seguimiento completo del pipeline de datos
- Logs detallados de cada etapa del proceso
- Historial de entregas y transformaciones

### ⚖️ Compliance
- Cumplimiento con regulaciones de datos de salud
- Gestión de consentimientos y privacidad
- Auditorías regulares de seguridad

---

## 📋 Instrucciones para Generación de Esquema

Utilizando estas definiciones y relaciones, el esquema de base de datos debe:

### ✅ Requisitos Obligatorios:

1. **Integridad Referencial**: Preservar relaciones entre todas las entidades
2. **Escalabilidad Horizontal**: Permitir crecimiento para nuevos destinos y clientes
3. **Flexibilidad**: Mantener adaptabilidad para diferentes tipos de audiencias
4. **Seguridad**: Implementar controles de acceso y encriptación apropiados
5. **Auditoría**: Facilitar seguimiento completo y trazabilidad de entregas

### 🎯 Objetivos de Performance:

- **Consultas eficientes** para reportes y dashboard
- **Escritura optimizada** para actualizaciones frecuentes
- **Índices estratégicos** para búsquedas complejas
- **Particionado inteligente** para manejo de grandes volúmenes

---

## 📚 Referencias

- [Caso de éxito PurpleLab-Comscore](https://www.businesswire.com/news/home/20250612704238/en/PurpleLab-and-Comscore-Partner-to-Deliver-Off-the-Shelf-Healthcare-Predictive-Audiences-in-The-Trade-Desk)
- Documentación técnica de AWS DynamoDB
- Mejores prácticas de HIPAA para healthcare data
- Guías de compliance para advertising de salud