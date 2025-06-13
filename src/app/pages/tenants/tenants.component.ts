import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-tenants',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
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

      <app-crud-base
        [config]="crudConfig"
        [data]="tenants"
        [loading]="loading"
        (create)="onCreateTenant($event)"
        (update)="onUpdateTenant($event)"
        (delete)="onDeleteTenant($event)"
        (export)="onExportTenants()"
      ></app-crud-base>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
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
  tenants: any[] = [];
  loading = false;
  totalTenants = 0;
  activeTenants = 0;
  pharmaClients = 0;
  dspClients = 0;

  crudConfig: CrudConfig = {
    entityName: 'Inquilino',
    columns: [
      {
        key: 'name',
        label: 'Nombre',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'clientId',
        label: 'ID Cliente',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'configurationSettings',
        label: 'Configuración',
        type: 'text',
        sortable: false,
        filterable: false,
        required: false
      },
      {
        key: 'active',
        label: 'Activo',
        type: 'boolean',
        sortable: true,
        filterable: true,
        required: false
      }
    ],
    actions: {
      create: true,
      read: true,
      update: true,
      delete: true,
      export: true
    },
    pagination: {
      pageSize: 10,
      pageSizeOptions: [5, 10, 25, 50, 100]
    }
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTenants();
  }

  async loadTenants() {
    this.loading = true;
    try {
      const result = await this.dataService.getTenants();
      this.tenants = result || [];
      this.totalTenants = this.tenants.length;
      this.activeTenants = this.tenants.filter((t: any) => t.active).length;
      this.pharmaClients = this.tenants.filter((t: any) => 
        t.name?.toLowerCase().includes('biogen') || 
        t.name?.toLowerCase().includes('pharma')
      ).length;
      this.dspClients = this.tenants.filter((t: any) => 
        ['viant', 'nexxen', 'jungroup', 'pulsepoint'].some(dsp => 
          t.name?.toLowerCase().includes(dsp)
        )
      ).length;
      console.log('Inquilinos cargados:', this.tenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
      this.tenants = [];
      if (error instanceof Error) {
        alert(`Error al cargar los inquilinos: ${error.message}`);
      } else {
        alert('Error al cargar los inquilinos. Verifique la conexión con el backend.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateTenant(tenantData: any) {
    try {
      await this.dataService.createTenant(tenantData);
      await this.loadTenants();
      alert('Inquilino creado exitosamente');
    } catch (error) {
      console.error('Error creating tenant:', error);
      alert('Error al crear el inquilino');
    }
  }

  async onUpdateTenant(event: { id: string, data: any }) {
    try {
      await this.dataService.updateTenant(event.id, event.data);
      await this.loadTenants();
      alert('Inquilino actualizado exitosamente');
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Error al actualizar el inquilino');
    }
  }

  async onDeleteTenant(id: string) {
    try {
      await this.dataService.deleteTenant(id);
      await this.loadTenants();
      alert('Inquilino eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Error al eliminar el inquilino');
    }
  }

  onExportTenants() {
    try {
      const csvContent = this.generateCSV(this.tenants);
      this.downloadCSV(csvContent, 'inquilinos.csv');
    } catch (error) {
      console.error('Error exporting tenants:', error);
      alert('Error al exportar los inquilinos');
    }
  }

  private generateCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = this.crudConfig.columns.map(col => col.label).join(',');
    const rows = data.map(item => 
      this.crudConfig.columns.map(col => {
        const value = item[col.key];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value || '';
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }

  private downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      await this.loadTenants();
      alert('Cliente de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample tenant:', error);
      alert('Error al crear cliente de ejemplo');
    }
  }
} 