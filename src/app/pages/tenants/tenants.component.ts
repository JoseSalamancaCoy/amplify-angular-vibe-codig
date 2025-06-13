import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestión de Inquilinos</h1>
        <p class="page-description">
          Administra la información de clientes y sus configuraciones específicas
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalTenants }}</div>
          <div class="stat-label">Total Clientes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activeTenants }}</div>
          <div class="stat-label">Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ pharmaClients }}</div>
          <div class="stat-label">Farmacéuticas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ dspClients }}</div>
          <div class="stat-label">DSP Clients</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Próximamente</h2>
          <button class="btn-primary" (click)="createSampleTenant()">
            Crear Cliente Ejemplo
          </button>
        </div>
        <p>La interfaz CRUD completa estará disponible en la siguiente fase del desarrollo.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      color: var(--primary-color);
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
    }

    .page-description {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-left: 4px solid var(--primary-color);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .content-section {
      background: white;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .section-header h2 {
      color: var(--text-primary);
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .btn-primary {
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 12px 24px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary:hover {
      background: var(--primary-dark);
    }
  `]
})
export class TenantsComponent implements OnInit {
  totalTenants = 0;
  activeTenants = 0;
  pharmaClients = 0;
  dspClients = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    try {
      const tenants = await this.dataService.getTenants();
      this.totalTenants = tenants.length;
      this.activeTenants = tenants.filter((t: any) => t.active).length;
      this.pharmaClients = tenants.filter((t: any) => 
        t.name?.toLowerCase().includes('biogen') || 
        t.name?.toLowerCase().includes('pharma')
      ).length;
      this.dspClients = tenants.filter((t: any) => 
        ['viant', 'nexxen', 'jungroup', 'pulsepoint'].some(dsp => 
          t.name?.toLowerCase().includes(dsp)
        )
      ).length;
    } catch (error) {
      console.error('Error loading tenant stats:', error);
    }
  }

  async createSampleTenant() {
    try {
      await this.dataService.createTenant({
        name: 'Sample Healthcare Client',
        clientId: 'client_sample_001',
        configurationSettings: JSON.stringify({
          deliveryFrequency: 'weekly',
          dataFormat: 'csv',
          encryption: true
        })
      });
      await this.loadStats();
      alert('Cliente de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample tenant:', error);
      alert('Error al crear cliente de ejemplo');
    }
  }
} 