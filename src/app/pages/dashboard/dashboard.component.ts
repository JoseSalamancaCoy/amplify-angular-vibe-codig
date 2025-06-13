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
        <h1>OTS Dashboard</h1>
        <p>Predictive healthcare audience management system</p>
      </div>

      <!-- Stats cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Audiences</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalAudiences }}</p>
          <span class="stat-subtitle">{{ dashboardStats.activeAudiences }} active</span>
        </div>
        <div class="stat-card">
          <h3>Connected Destinations</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalDestinations }}</p>
          <span class="stat-subtitle">Integrated platforms</span>
        </div>
        <div class="stat-card">
          <h3>Total Deliveries</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalDeliveries }}</p>
          <span class="stat-subtitle">Processed records</span>
        </div>
        <div class="stat-card">
          <h3>Tenants</h3>
          <p class="stat-number">{{ loading ? '...' : dashboardStats.totalTenants }}</p>
          <span class="stat-subtitle">Active clients</span>
        </div>
      </div>

      <!-- Button to create sample data -->
      <div class="demo-section" *ngIf="dashboardStats.totalAudiences === 0 && !loading">
        <div class="demo-card">
          <h3>🚀 Get Started with Demo Data</h3>
          <p>No data yet. Would you like to create some sample data to explore the system?</p>
          <button 
            class="demo-button" 
            (click)="createSampleData()"
            [disabled]="loading"
          >
            {{ loading ? 'Creating...' : 'Create Demo Data' }}
          </button>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="quick-actions" *ngIf="dashboardStats.totalAudiences > 0">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <div class="action-card" routerLink="/audiences">
            <span class="action-icon">👥</span>
            <h4>View Audiences</h4>
            <p>Manage predictive audiences</p>
          </div>
          <div class="action-card" routerLink="/destinations">
            <span class="action-icon">🎯</span>
            <h4>Configure Destinations</h4>
            <p>Manage delivery platforms</p>
          </div>
          <div class="action-card" routerLink="/delivery-logs">
            <span class="action-icon">📈</span>
            <h4>Review Logs</h4>
            <p>Monitor recent deliveries</p>
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
      console.error('Error loading dashboard data:', error);
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

      // Reload statistics
      await this.loadDashboardData();
      
      alert('Sample data created successfully');
    } catch (error) {
      console.error('Error creating sample data:', error);
      alert('Error creating sample data: ' + error);
    } finally {
      this.loading = false;
    }
  }
} 