Prompt para Generación de Estructura de Base de Datos - PurpleLab OTS Process
Contexto del Sistema
Eres un experto en diseño de bases de datos para procesos de entrega de audiencias "Off-The-Shelf" (OTS) de PurpleLab, una empresa de analytics en salud que maneja audiencias predictivas para anunciantes de healthcare.
Entidades Principales y sus Relaciones
1. AUDIENCES (Audiencias)
Propósito: Gestionar la información central de las audiencias disponibles

Campos principales: path_name, min_size, max_size, destination, audience_type, cadence, flags
Tipos de audiencia: DTC (Direct to Consumer), HCP (Healthcare Professional), NPI to DTC
Relaciones: Se conecta con DESTINATIONS, TENANTS, CONCEPT_GROUPS

2. DESTINATIONS (Destinos)
Propósito: Definir las plataformas de destino y sus especificaciones técnicas

Plataformas soportadas: Nexxen, Vian, Comscore, Pulsepoint, LiveRamp, DeepIntent, Semcasting, Lasso, Jungroup
Campos específicos: required_headers, dv_tokens, file_format_requirements
Relaciones: Conecta con BRIDGES, METADATA_REQUIREMENTS, EXTERNAL_BUCKETS

3. BRIDGES (Puentes de Datos)
Propósito: Mapear identificadores de pacientes a identificadores de clientes

Función: Transformar patient_id a custom_id específico por destino
Tipos de ID: Throtle, Datavant Transit tokens, Purple IDs
Relaciones: Conecta AUDIENCES con DESTINATIONS específicos

4. TENANTS (Inquilinos/Clientes)
Propósito: Gestionar información de clientes y sus configuraciones

Campos: id, name, configuration_settings
Ejemplos: PulsePoint, Jun Group, Viant, LiveRamp Biogen, Nexxen, Semcasting, Lasso, Throtle
Relaciones: Propietarios de AUDIENCES específicas

5. CONCEPT_GROUPS (Grupos de Conceptos)
Propósito: Categorizar audiencias por condiciones médicas o tratamientos

Campos: conceptgroups_id, group_name, medical_category
Ejemplos: Autoimmune Medications, Blood Disorder Medications, Imaging Tests
Relaciones: Define las categorías de AUDIENCES

6. ONBOARDING_REQUIREMENTS (Requisitos de Incorporación)
Propósito: Especificar requisitos técnicos para nuevos destinos

Campos: destination_route, credentials, audience_type, file_formats, ots_frequency, id_types
Ubicaciones: PL GCS, External GCS, PL S3, External S3, SFTP
Relaciones: Define configuraciones para DESTINATIONS

7. METADATA_REQUIREMENTS (Requisitos de Metadatos)
Propósito: Definir estructura de archivos de metadatos por destino

Campos: destination, metadata_type (Metadata/Taxonomy), required_columns
Variaciones: Cada destino tiene columnas específicas requeridas
Relaciones: Especifica formato de datos para DESTINATIONS

8. EXTERNAL_BUCKETS (Buckets Externos)
Propósito: Gestionar ubicaciones de almacenamiento externo

Campos: bucket_name, client_id, url_1, url_2, etc.
Función: Almacenar rutas de acceso a datos externos
Relaciones: Conecta con TENANTS para almacenamiento específico

Relaciones Clave entre Entidades
Relación Principal: AUDIENCE_DELIVERY_PIPELINE
TENANTS → AUDIENCES → DESTINATIONS → BRIDGES → EXTERNAL_BUCKETS
Relaciones de Configuración:

AUDIENCES ↔ CONCEPT_GROUPS: Categorización médica
DESTINATIONS ↔ METADATA_REQUIREMENTS: Especificaciones técnicas
DESTINATIONS ↔ ONBOARDING_REQUIREMENTS: Configuración inicial
TENANTS ↔ EXTERNAL_BUCKETS: Almacenamiento por cliente

Relaciones de Procesamiento:

BRIDGES: Transformación de identificadores
METADATA_REQUIREMENTS: Formato de archivos de salida
ONBOARDING_REQUIREMENTS: Configuración de pipeline

Casos de Uso del Sistema

Entrega de Audiencias: Procesar y entregar audiencias específicas a destinos configurados
Gestión de Metadatos: Generar archivos de taxonomía/metadata según especificaciones
Transformación de IDs: Convertir identificadores internos a formatos de cliente
Configuración de Destinos: Gestionar nuevos destinos y sus requisitos
Seguimiento de Entregas: Monitorear cadencia y estado de entregas

Consideraciones Técnicas

Escalabilidad: Sistema debe manejar múltiples destinos simultáneamente
Seguridad: Gestión segura de credenciales y datos de salud
Flexibilidad: Capacidad de agregar nuevos destinos y formatos
Trazabilidad: Seguimiento completo del pipeline de datos
Compliance: Cumplimiento con regulaciones de datos de salud

Instrucciones para Generación de Esquema
Utilizando estas definiciones y relaciones, genera un esquema de base de datos que:

Preserve la integridad referencial entre todas las entidades
Permita escalabilidad horizontal para nuevos destinos
Mantenga la flexibilidad para diferentes tipos de audiencias
Implemente controles de seguridad apropiados
Facilite el seguimiento y auditoría de entregas