import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

/**
 * PurpleLab OTS - Dashboard Component
 * Página principal con estadísticas y resumen del sistema
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Panel de Control OTS</h1>
        <p>Sistema de gestión de audiencias predictivas para healthcare</p>
      </div>

      <!-- Stats cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Audiencias Totales</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalAudiences }}</p>
          <span class="stat-subtitle">{{ dashboardStats.activeAudiences }} activas</span>
        </div>
        <div class="stat-card">
          <h3>Destinos Conectados</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalDestinations }}</p>
          <span class="stat-subtitle">Plataformas integradas</span>
        </div>
        <div class="stat-card">
          <h3>Total Entregas</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalDeliveries }}</p>
          <span class="stat-subtitle">Registros procesados</span>
        </div>
        <div class="stat-card">
          <h3>Inquilinos</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalTenants }}</p>
          <span class="stat-subtitle">Clientes activos</span>
        </div>
      </div>

      <!-- Botón para crear datos de ejemplo -->
      <div class="demo-section" *ngIf="dashboardStats.totalAudiences === 0 && !loading">
        <div class="demo-card">
          <h3>🚀 Empezar con Datos de Demo</h3>
          <p>No hay datos aún. ¿Quieres crear algunos datos de ejemplo para explorar el sistema?</p>
          <button 
            class="demo-button" 
            (click)="createSampleData()"
            [disabled]="loading"
          >
            {{ loading ? 'Creando...' : 'Crear Datos de Demo' }}
          </button>
        </div>
      </div>

      <!-- Acciones rápidas -->
      <div class="quick-actions" *ngIf="dashboardStats.totalAudiences > 0">
        <h3>Acciones Rápidas</h3>
        <div class="actions-grid">
          <div class="action-card" routerLink="/audiences">
            <span class="action-icon">👥</span>
            <h4>Ver Audiencias</h4>
            <p>Gestionar audiencias predictivas</p>
          </div>
          <div class="action-card" routerLink="/destinations">
            <span class="action-icon">🎯</span>
            <h4>Configurar Destinos</h4>
            <p>Administrar plataformas de entrega</p>
          </div>
          <div class="action-card" routerLink="/delivery-logs">
            <span class="action-icon">📈</span>
            <h4>Revisar Logs</h4>
            <p>Monitorear entregas recientes</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = false;
  
  dashboardStats = {
    totalAudiences: 0,
    activeAudiences: 0,
    totalDestinations: 0,
    totalDeliveries: 0,
    totalTenants: 0
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    try {
      this.loading = true;
      const stats = await this.dataService.getDashboardStats();
      this.dashboardStats = stats;
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      this.loading = false;
    }
  }

  async createSampleData() {
    try {
      this.loading = true;
      
      // Crear destino de ejemplo
      await this.dataService.createDestination({
        name: 'Comscore Demo',
        platform: 'COMSCORE'
      });

      // Crear tenant de ejemplo
      await this.dataService.createTenant({
        name: 'PurpleLab Demo Client',
        clientId: 'demo-client-001'
      });

      // Crear grupo de conceptos de ejemplo
      await this.dataService.createConceptGroup({
        groupName: 'Diabetes Medications',
        medicalCategory: 'Endocrinology'
      });

      // Crear audiencia de ejemplo
      await this.dataService.createAudience({
        pathName: '/healthcare/diabetes/hcp',
        minSize: 1000,
        maxSize: 50000,
        destinationName: 'Comscore Demo',
        audienceType: 'HCP',
        cadence: 'weekly'
      });

      // Recargar estadísticas
      await this.loadDashboardData();
      
      alert('Datos de ejemplo creados exitosamente');
    } catch (error) {
      console.error('Error al crear datos de ejemplo:', error);
      alert('Error al crear datos de ejemplo: ' + error);
    } finally {
      this.loading = false;
    }
  }
} 