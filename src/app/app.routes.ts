import { Routes } from '@angular/router';

/**
 * PurpleLab OTS - Configuración de Rutas
 * Rutas para cada sección del sistema OTS con lazy loading
 */
export const routes: Routes = [
  // Ruta por defecto - Dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  
  // Dashboard principal
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  // 🎯 Gestión de Audiencias
  {
    path: 'audiences',
    loadComponent: () => import('./pages/audiences/audiences.component').then(m => m.AudiencesComponent)
  },

  // 📡 Gestión de Destinos
  {
    path: 'destinations',
    loadComponent: () => import('./pages/destinations/destinations.component').then(m => m.DestinationsComponent)
  },

  // 🌉 Puentes de Datos
  {
    path: 'bridges',
    loadComponent: () => import('./pages/bridges/bridges.component').then(m => m.BridgesComponent)
  },

  // 🏢 Gestión de Inquilinos
  {
    path: 'tenants',
    loadComponent: () => import('./pages/tenants/tenants.component').then(m => m.TenantsComponent)
  },

  // 🏥 Grupos de Conceptos Médicos
  {
    path: 'concept-groups',
    loadComponent: () => import('./pages/concept-groups/concept-groups.component').then(m => m.ConceptGroupsComponent)
  },

  // 📋 Requisitos de Incorporación
  {
    path: 'onboarding-requirements',
    loadComponent: () => import('./pages/onboarding-requirements/onboarding-requirements.component').then(m => m.OnboardingRequirementsComponent)
  },

  // 📄 Requisitos de Metadatos
  {
    path: 'metadata-requirements',
    loadComponent: () => import('./pages/metadata-requirements/metadata-requirements.component').then(m => m.MetadataRequirementsComponent)
  },

  // 🪣 Buckets Externos
  {
    path: 'external-buckets',
    loadComponent: () => import('./pages/external-buckets/external-buckets.component').then(m => m.ExternalBucketsComponent)
  },

  // 📊 Logs de Entrega
  {
    path: 'delivery-logs',
    loadComponent: () => import('./pages/delivery-logs/delivery-logs.component').then(m => m.DeliveryLogsComponent)
  },

  // Ruta para páginas no encontradas
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
