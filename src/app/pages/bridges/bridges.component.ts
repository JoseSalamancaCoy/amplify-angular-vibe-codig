import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-bridges',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Puentes de Datos</h1>
        <p class="page-description">
          Gestiona la transformación de identificadores de pacientes a identificadores de clientes
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalBridges }}</div>
          <div class="stat-label">Total Puentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ throtleIds }}</div>
          <div class="stat-label">Throtle IDs</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ datavantTokens }}</div>
          <div class="stat-label">Datavant Tokens</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ purpleIds }}</div>
          <div class="stat-label">Purple IDs</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Próximamente</h2>
          <button class="btn-primary" (click)="createSampleBridge()">
            Crear Puente Ejemplo
          </button>
        </div>
        <p>La interfaz CRUD completa estará disponible en la siguiente fase del desarrollo.</p>
      </div>

      <app-crud-base
        [config]="crudConfig"
        [data]="bridges"
        [loading]="loading"
        (create)="onCreateBridge($event)"
        (update)="onUpdateBridge($event)"
        (delete)="onDeleteBridge($event)"
        (export)="onExportBridges()"
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
export class BridgesComponent implements OnInit {
  totalBridges = 0;
  throtleIds = 0;
  datavantTokens = 0;
  purpleIds = 0;
  bridges: any[] = [];
  loading = false;

  crudConfig: CrudConfig = {
    entityName: 'Data Bridge',
    columns: [
      {
        key: 'patientId',
        label: 'Patient ID',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'customId',
        label: 'Custom ID',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'idType',
        label: 'ID Type',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'THROTLE_ID', label: 'Throtle ID' },
          { value: 'DATAVANT_TOKEN', label: 'Datavant Token' },
          { value: 'PURPLE_ID', label: 'Purple ID' }
        ]
      },
      {
        key: 'destinationId',
        label: 'Destination ID',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
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
    this.loadBridges();
  }

  async loadBridges() {
    this.loading = true;
    try {
      const result = await this.dataService.getBridges();
      this.bridges = result || [];
            console.log('Data bridges loaded:', this.bridges);
       this.totalBridges = this.bridges.length;
       this.throtleIds = this.bridges.filter((b: any) => b.idType === 'THROTLE_ID').length;
       this.datavantTokens = this.bridges.filter((b: any) => b.idType === 'DATAVANT_TOKEN').length;
       this.purpleIds = this.bridges.filter((b: any) => b.idType === 'PURPLE_ID').length;
     } catch (error) {
       console.error('Error loading bridges:', error);
       this.bridges = [];
       if (error instanceof Error) {
         alert(`Error loading data bridges: ${error.message}`);
       } else {
         alert('Error loading data bridges. Please check backend connection.');
       }
    } finally {
      this.loading = false;
    }
  }

  async onCreateBridge(bridgeData: any) {
    try {
      await this.dataService.createBridge(bridgeData);
      await this.loadBridges();
      alert('Data bridge created successfully');
    } catch (error) {
      console.error('Error creating bridge:', error);
      alert('Error creating data bridge');
    }
  }

  async onUpdateBridge(event: { id: string, data: any }) {
    try {
      await this.dataService.updateBridge(event.id, event.data);
      await this.loadBridges();
      alert('Data bridge updated successfully');
    } catch (error) {
      console.error('Error updating bridge:', error);
      alert('Error updating data bridge');
    }
  }

  async onDeleteBridge(id: string) {
    try {
      await this.dataService.deleteBridge(id);
      await this.loadBridges();
      alert('Data bridge deleted successfully');
    } catch (error) {
      console.error('Error deleting bridge:', error);
      alert('Error deleting data bridge');
    }
  }

  onExportBridges() {
    try {
      const csvContent = this.generateCSV(this.bridges);
      this.downloadCSV(csvContent, 'data-bridges.csv');
    } catch (error) {
      console.error('Error exporting bridges:', error);
      alert('Error exporting data bridges');
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

  async createSampleBridge() {
    try {
      await this.dataService.createBridge({
        patientId: 'patient_12345',
        customId: 'custom_67890',
        idType: 'THROTLE_ID',
        destinationId: 'dest_sample_001'
      });
      await this.loadBridges();
      alert('Puente de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample bridge:', error);
      alert('Error al crear puente de ejemplo');
    }
  }
} 