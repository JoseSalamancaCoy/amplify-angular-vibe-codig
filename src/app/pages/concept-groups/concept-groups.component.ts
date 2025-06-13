import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-concept-groups',
  standalone: true,
  imports: [CommonModule],
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
export class ConceptGroupsComponent implements OnInit {
  totalConceptGroups = 0;
  activeGroups = 0;
  medicationGroups = 0;
  diagnosticGroups = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
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

  async createSampleConceptGroup() {
    try {
      await this.dataService.createConceptGroup({
        groupName: 'Diabetes Management',
        medicalCategory: 'Endocrinology',
        description: 'Audiencias relacionadas con el manejo de la diabetes'
      });
      await this.loadStats();
      alert('Grupo de conceptos de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample concept group:', error);
      alert('Error al crear grupo de conceptos de ejemplo');
    }
  }
} 