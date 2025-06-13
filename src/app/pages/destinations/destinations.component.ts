import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestión de Destinos</h1>
        <p class="page-description">
          Administra las plataformas de destino y sus especificaciones técnicas
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalDestinations }}</div>
          <div class="stat-label">Total Destinos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activeDestinations }}</div>
          <div class="stat-label">Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ dspDestinations }}</div>
          <div class="stat-label">DSP</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ analyticsDestinations }}</div>
          <div class="stat-label">Analytics</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Próximamente</h2>
          <button class="btn-primary" (click)="createSampleDestination()">
            Crear Destino Ejemplo
          </button>
        </div>
        <p>La interfaz CRUD completa estará disponible en la siguiente fase del desarrollo.</p>
      </div>

      <app-crud-base
        [config]="crudConfig"
        [data]="destinations"
        [loading]="loading"
        (create)="onCreateDestination($event)"
        (update)="onUpdateDestination($event)"
        (delete)="onDeleteDestination($event)"
        (export)="onExportDestinations()"
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
export class DestinationsComponent implements OnInit {
  destinations: any[] = [];
  loading = false;
  totalDestinations = 0;
  activeDestinations = 0;
  dspDestinations = 0;
  analyticsDestinations = 0;

  crudConfig: CrudConfig = {
    entityName: 'Destination',
    columns: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'platform',
        label: 'Platform',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'NEXXEN', label: 'Nexxen' },
          { value: 'VIANT', label: 'Viant' },
          { value: 'COMSCORE', label: 'Comscore' },
          { value: 'PULSEPOINT', label: 'PulsePoint' },
          { value: 'LIVERAMP', label: 'LiveRamp' },
          { value: 'DEEPINTENT', label: 'DeepIntent' },
          { value: 'SEMCASTING', label: 'Semcasting' },
          { value: 'LASSO', label: 'Lasso' },
          { value: 'JUNGROUP', label: 'Jun Group' }
        ]
      },
      {
        key: 'requiredHeaders',
        label: 'Required Headers',
        type: 'text',
        sortable: false,
        filterable: false,
        required: false
      },
      {
        key: 'dvTokens',
        label: 'DV Tokens',
        type: 'text',
        sortable: false,
        filterable: false,
        required: false
      },
      {
        key: 'fileFormatRequirements',
        label: 'File Format Requirements',
        type: 'text',
        sortable: false,
        filterable: false,
        required: false
      },
      {
        key: 'active',
        label: 'Active',
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
    this.loadStats();
    this.loadDestinations();
  }

  async loadStats() {
    try {
      const destinations = await this.dataService.getDestinations();
      this.totalDestinations = destinations.length;
      this.activeDestinations = destinations.filter((d: any) => d.active).length;
      this.dspDestinations = destinations.filter((d: any) => 
        ['NEXXEN', 'VIANT', 'PULSEPOINT', 'DEEPINTENT', 'JUNGROUP'].includes(d.platform)
      ).length;
      this.analyticsDestinations = destinations.filter((d: any) => 
        ['COMSCORE', 'SEMCASTING'].includes(d.platform)
      ).length;
    } catch (error) {
      console.error('Error loading destination stats:', error);
    }
  }

  async loadDestinations() {
    this.loading = true;
    try {
      const result = await this.dataService.getDestinations();
      this.destinations = result || [];
      console.log('Destinations loaded:', this.destinations);
    } catch (error) {
      console.error('Error loading destinations:', error);
      this.destinations = [];
      if (error instanceof Error) {
        alert(`Error loading destinations: ${error.message}`);
      } else {
        alert('Error loading destinations. Please check backend connection.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateDestination(destinationData: any) {
    try {
      await this.dataService.createDestination(destinationData);
      await this.loadDestinations();
      alert('Destination created successfully');
    } catch (error) {
      console.error('Error creating destination:', error);
      alert('Error creating destination');
    }
  }

  async onUpdateDestination(event: { id: string, data: any }) {
    try {
      await this.dataService.updateDestination(event.id, event.data);
      await this.loadDestinations();
      alert('Destination updated successfully');
    } catch (error) {
      console.error('Error updating destination:', error);
      alert('Error updating destination');
    }
  }

  async onDeleteDestination(id: string) {
    try {
      await this.dataService.deleteDestination(id);
      await this.loadDestinations();
      alert('Destination deleted successfully');
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Error deleting destination');
    }
  }

  onExportDestinations() {
    try {
      const csvContent = this.generateCSV(this.destinations);
      this.downloadCSV(csvContent, 'destinations.csv');
    } catch (error) {
      console.error('Error exporting destinations:', error);
      alert('Error exporting destinations');
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

  async createSampleDestination() {
    try {
      await this.dataService.createDestination({
        name: 'Nexxen Test Destination',
        platform: 'NEXXEN',
        requiredHeaders: 'audience_id,user_id',
        dvTokens: 'sample_token_123',
        fileFormatRequirements: 'CSV format with header row'
      });
      await this.loadDestinations();
      alert('Destino de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample destination:', error);
      alert('Error al crear destino de ejemplo');
    }
  }
} 