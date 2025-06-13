import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-concept-groups',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Grupos de Conceptos</h1>
        <p class="page-description">
          Gestiona la categorización de audiencias por condiciones médicas y tratamientos
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalConceptGroups }}</div>
          <div class="stat-label">Total Grupos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activeGroups }}</div>
          <div class="stat-label">Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ medicationGroups }}</div>
          <div class="stat-label">Medicamentos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ diagnosticGroups }}</div>
          <div class="stat-label">Diagnósticos</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Próximamente</h2>
          <button class="btn-primary" (click)="createSampleConceptGroup()">
            Crear Grupo Ejemplo
          </button>
        </div>
        <p>La interfaz CRUD completa estará disponible en la siguiente fase del desarrollo.</p>
      </div>

      <app-crud-base
        [config]="crudConfig"
        [data]="conceptGroups"
        [loading]="loading"
        (create)="onCreateConceptGroup($event)"
        (update)="onUpdateConceptGroup($event)"
        (delete)="onDeleteConceptGroup($event)"
        (export)="onExportConceptGroups()"
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
export class ConceptGroupsComponent implements OnInit {
  totalConceptGroups = 0;
  activeGroups = 0;
  medicationGroups = 0;
  diagnosticGroups = 0;
  conceptGroups: any[] = [];
  loading = false;

  crudConfig: CrudConfig = {
    entityName: 'Concept Group',
    columns: [
      {
        key: 'groupName',
        label: 'Group Name',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'medicalCategory',
        label: 'Medical Category',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'Endocrinology', label: 'Endocrinology' },
          { value: 'Cardiology', label: 'Cardiology' },
          { value: 'Oncology', label: 'Oncology' },
          { value: 'Neurology', label: 'Neurology' },
          { value: 'Immunology', label: 'Immunology' },
          { value: 'Dermatology', label: 'Dermatology' },
          { value: 'Psychiatry', label: 'Psychiatry' },
          { value: 'Gastroenterology', label: 'Gastroenterology' },
          { value: 'Rheumatology', label: 'Rheumatology' },
          { value: 'Hematology', label: 'Hematology' }
        ]
      },
      {
        key: 'description',
        label: 'Description',
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
    this.loadConceptGroups();
  }

  async loadStats() {
    try {
      const conceptGroups = await this.dataService.getConceptGroups();
      this.totalConceptGroups = conceptGroups.length;
      this.activeGroups = conceptGroups.filter((cg: any) => cg.active).length;
      this.medicationGroups = conceptGroups.filter((cg: any) => 
        cg.medicalCategory?.toLowerCase().includes('medication') ||
        cg.groupName?.toLowerCase().includes('medication')
      ).length;
      this.diagnosticGroups = conceptGroups.filter((cg: any) => 
        cg.medicalCategory?.toLowerCase().includes('test') ||
        cg.medicalCategory?.toLowerCase().includes('diagnostic') ||
        cg.groupName?.toLowerCase().includes('imaging')
      ).length;
    } catch (error) {
      console.error('Error loading concept group stats:', error);
    }
  }

  async loadConceptGroups() {
    this.loading = true;
    try {
      const result = await this.dataService.getConceptGroups();
      this.conceptGroups = result || [];
      console.log('Concept groups loaded:', this.conceptGroups);
    } catch (error) {
      console.error('Error loading concept groups:', error);
      this.conceptGroups = [];
      if (error instanceof Error) {
        alert(`Error loading concept groups: ${error.message}`);
      } else {
        alert('Error loading concept groups. Please check backend connection.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateConceptGroup(conceptGroupData: any) {
    try {
      await this.dataService.createConceptGroup(conceptGroupData);
      await this.loadConceptGroups();
      alert('Concept group created successfully');
    } catch (error) {
      console.error('Error creating concept group:', error);
      alert('Error creating concept group');
    }
  }

  async onUpdateConceptGroup(event: { id: string, data: any }) {
    try {
      await this.dataService.updateConceptGroup(event.id, event.data);
      await this.loadConceptGroups();
      alert('Concept group updated successfully');
    } catch (error) {
      console.error('Error updating concept group:', error);
      alert('Error updating concept group');
    }
  }

  async onDeleteConceptGroup(id: string) {
    try {
      await this.dataService.deleteConceptGroup(id);
      await this.loadConceptGroups();
      alert('Concept group deleted successfully');
    } catch (error) {
      console.error('Error deleting concept group:', error);
      alert('Error deleting concept group');
    }
  }

  onExportConceptGroups() {
    try {
      const csvContent = this.generateCSV(this.conceptGroups);
      this.downloadCSV(csvContent, 'concept-groups.csv');
    } catch (error) {
      console.error('Error exporting concept groups:', error);
      alert('Error exporting concept groups');
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

  async createSampleConceptGroup() {
    try {
      await this.dataService.createConceptGroup({
        groupName: 'Diabetes Management',
        medicalCategory: 'Endocrinology',
        description: 'Audiencias relacionadas con el manejo de la diabetes'
      });
      await this.loadConceptGroups();
      alert('Grupo de conceptos de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample concept group:', error);
      alert('Error al crear grupo de conceptos de ejemplo');
    }
  }
} 