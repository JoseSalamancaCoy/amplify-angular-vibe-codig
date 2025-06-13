import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-metadata-requirements',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Requisitos de Metadatos</h1>
        <p class="page-description">
          Define la estructura de archivos de metadatos requerida por cada destino
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">9</div>
          <div class="stat-label">Destinos Configurados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">2</div>
          <div class="stat-label">Tipos Metadata</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">15</div>
          <div class="stat-label">Columnas Requeridas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">5</div>
          <div class="stat-label">Formatos Archivo</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Próximamente</h2>
        </div>
        <p>La interfaz CRUD completa estará disponible en la siguiente fase del desarrollo.</p>
      </div>

      <app-crud-base
        [config]="crudConfig"
        [data]="metadataRequirements"
        [loading]="loading"
        (create)="onCreateMetadataRequirement($event)"
        (update)="onUpdateMetadataRequirement($event)"
        (delete)="onDeleteMetadataRequirement($event)"
        (export)="onExportMetadataRequirements()"
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
  `]
})
export class MetadataRequirementsComponent implements OnInit {
  metadataRequirements: any[] = [];
  loading = false;

  crudConfig: CrudConfig = {
    entityName: 'Requisito de Metadatos',
    columns: [
      {
        key: 'destinationId',
        label: 'ID Destino',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'metadataType',
        label: 'Tipo de Metadatos',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'METADATA', label: 'Metadata' },
          { value: 'TAXONOMY', label: 'Taxonomy' }
        ]
      },
      {
        key: 'requiredColumns',
        label: 'Columnas Requeridas',
        type: 'text',
        sortable: false,
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
    this.loadMetadataRequirements();
  }

  async loadMetadataRequirements() {
    this.loading = true;
    try {
      const result = await this.dataService.getMetadataRequirements();
      this.metadataRequirements = result || [];
      console.log('Requisitos de metadatos cargados:', this.metadataRequirements);
    } catch (error) {
      console.error('Error loading metadata requirements:', error);
      this.metadataRequirements = [];
      if (error instanceof Error) {
        alert(`Error al cargar los requisitos de metadatos: ${error.message}`);
      } else {
        alert('Error al cargar los requisitos de metadatos. Verifique la conexión con el backend.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateMetadataRequirement(requirementData: any) {
    try {
      await this.dataService.createMetadataRequirement(requirementData);
      await this.loadMetadataRequirements();
      alert('Requisito de metadatos creado exitosamente');
    } catch (error) {
      console.error('Error creating metadata requirement:', error);
      alert('Error al crear el requisito de metadatos');
    }
  }

  async onUpdateMetadataRequirement(event: { id: string, data: any }) {
    try {
      await this.dataService.updateMetadataRequirement(event.id, event.data);
      await this.loadMetadataRequirements();
      alert('Requisito de metadatos actualizado exitosamente');
    } catch (error) {
      console.error('Error updating metadata requirement:', error);
      alert('Error al actualizar el requisito de metadatos');
    }
  }

  async onDeleteMetadataRequirement(id: string) {
    try {
      await this.dataService.deleteMetadataRequirement(id);
      await this.loadMetadataRequirements();
      alert('Requisito de metadatos eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting metadata requirement:', error);
      alert('Error al eliminar el requisito de metadatos');
    }
  }

  onExportMetadataRequirements() {
    try {
      const csvContent = this.generateCSV(this.metadataRequirements);
      this.downloadCSV(csvContent, 'requisitos-metadatos.csv');
    } catch (error) {
      console.error('Error exporting metadata requirements:', error);
      alert('Error al exportar los requisitos de metadatos');
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
} 