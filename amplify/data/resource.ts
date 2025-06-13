import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * PurpleLab OTS - Data Schema con Autorización
 * Define el esquema de datos para el sistema OTS con protección de acceso
 * @see https://docs.amplify.aws/angular/build-a-backend/data/customize-authz/signed-in-user-data-access/
 */

const schema = a.schema({
  // 1. AUDIENCES - Gestión de audiencias predictivas
  Audience: a.model({
    pathName: a.string().required(),
    minSize: a.integer().required(),
    maxSize: a.integer().required(),
    destination: a.string().required(),
    audienceType: a.enum(['DTC', 'HCP', 'NPI_TO_DTC']),
    cadence: a.string().required(),
    flags: a.string(),
    active: a.boolean().default(true),
    // Relaciones
    tenantId: a.id(),
    tenant: a.belongsTo('Tenant', 'tenantId'),
    conceptGroupId: a.id(),
    conceptGroup: a.belongsTo('ConceptGroup', 'conceptGroupId'),
  })
  .authorization((allow) => [
    allow.authenticated() // Solo usuarios autenticados pueden acceder
  ]),

  // 2. DESTINATIONS - Plataformas de destino
  Destination: a.model({
    name: a.string().required(),
    platform: a.enum(['NEXXEN', 'VIANT', 'COMSCORE', 'PULSEPOINT', 'LIVERAMP', 'DEEPINTENT', 'SEMCASTING', 'LASSO', 'JUNGROUP']),
    requiredHeaders: a.string(),
    dvTokens: a.string(),
    fileFormatRequirements: a.string(),
    active: a.boolean().default(true),
    // Relaciones
    audiences: a.hasMany('Audience', 'destination'),
    bridges: a.hasMany('Bridge', 'destinationId'),
    metadataRequirements: a.hasMany('MetadataRequirement', 'destinationId'),
    externalBuckets: a.hasMany('ExternalBucket', 'destinationId'),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 3. BRIDGES - Transformación de identificadores
  Bridge: a.model({
    patientId: a.string().required(),
    customId: a.string().required(),
    idType: a.enum(['THROTLE_ID', 'DATAVANT_TOKEN', 'PURPLE_ID']),
    // Relaciones
    destinationId: a.id().required(),
    destination: a.belongsTo('Destination', 'destinationId'),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 4. TENANTS - Clientes del sistema
  Tenant: a.model({
    name: a.string().required(),
    clientId: a.string().required(),
    configurationSettings: a.string(),
    active: a.boolean().default(true),
    // Relaciones
    audiences: a.hasMany('Audience', 'tenantId'),
    externalBuckets: a.hasMany('ExternalBucket', 'tenantId'),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 5. CONCEPT_GROUPS - Grupos de conceptos médicos
  ConceptGroup: a.model({
    groupName: a.string().required(),
    medicalCategory: a.string().required(),
    description: a.string(),
    active: a.boolean().default(true),
    // Relaciones
    audiences: a.hasMany('Audience', 'conceptGroupId'),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 6. ONBOARDING_REQUIREMENTS - Requisitos de incorporación
  OnboardingRequirement: a.model({
    destinationRoute: a.string().required(),
    credentials: a.string(),
    audienceTypes: a.string(),
    fileFormats: a.string(),
    otsFrequency: a.string(),
    idTypes: a.string(),
    storageLocation: a.enum(['PL_GCS', 'EXTERNAL_GCS', 'PL_S3', 'EXTERNAL_S3', 'SFTP']),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 7. METADATA_REQUIREMENTS - Requisitos de metadatos
  MetadataRequirement: a.model({
    metadataType: a.enum(['METADATA', 'TAXONOMY']),
    requiredColumns: a.string().required(),
    // Relaciones
    destinationId: a.id().required(),
    destination: a.belongsTo('Destination', 'destinationId'),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 8. EXTERNAL_BUCKETS - Buckets externos
  ExternalBucket: a.model({
    bucketName: a.string().required(),
    url1: a.string(),
    url2: a.string(),
    url3: a.string(),
    // Relaciones
    tenantId: a.id().required(),
    tenant: a.belongsTo('Tenant', 'tenantId'),
    destinationId: a.id(),
    destination: a.belongsTo('Destination', 'destinationId'),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),

  // 9. DELIVERY_LOG - Log de entregas (para auditoría)
  DeliveryLog: a.model({
    audienceId: a.id().required(),
    destinationName: a.string().required(),
    deliveryDate: a.datetime().required(),
    status: a.enum(['SUCCESS', 'FAILED', 'PENDING']),
    recordCount: a.integer(),
    errorMessage: a.string(),
    // Metadatos del usuario que ejecutó la entrega
    executedBy: a.string(),
  })
  .authorization((allow) => [
    allow.authenticated()
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // Modo de autorización por defecto para usuarios autenticados
    defaultAuthorizationMode: 'userPool',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
