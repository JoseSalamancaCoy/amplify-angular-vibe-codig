import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-audiences',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Gestión de Audiencias</h1>
        <p class="page-description">
          Administra las audiencias predictivas disponibles para entrega a múltiples destinos
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalAudiences }}</div>
          <div class="stat-label">Total Audiencias</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ activeAudiences }}</div>
          <div class="stat-label">Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ dtcAudiences }}</div>
          <div class="stat-label">DTC</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ hcpAudiences }}</div>
          <div class="stat-label">HCP</div>
        </div>
      </div>

      <div class="content-section">
                 <div class="section-header">
           <h2>Próximamente</h2>
           <button class="btn-primary" (click)="createSampleAudience()">
             Crear Audiencia Ejemplo
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
export class AudiencesComponent implements OnInit {
  totalAudiences = 0;
  activeAudiences = 0;
  dtcAudiences = 0;
  hcpAudiences = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    try {
      const audiences = await this.dataService.getAudiences();
      this.totalAudiences = audiences.length;
      this.activeAudiences = audiences.filter((a: any) => a.flags?.includes('active')).length;
      this.dtcAudiences = audiences.filter((a: any) => a.audienceType === 'DTC').length;
      this.hcpAudiences = audiences.filter((a: any) => a.audienceType === 'HCP').length;
    } catch (error) {
      console.error('Error loading audience stats:', error);
    }
  }

  async createSampleAudience() {
    try {
      await this.dataService.createAudience({
        pathName: '/sample/dtc-diabetes',
        minSize: 1000,
        maxSize: 50000,
        destination: 'NEXXEN',
        audienceType: 'DTC',
        cadence: 'weekly',
        flags: 'active'
      });
      await this.loadStats();
      alert('Audiencia de ejemplo creada exitosamente');
    } catch (error) {
      console.error('Error creating sample audience:', error);
      alert('Error al crear audiencia de ejemplo');
    }
  }
} 