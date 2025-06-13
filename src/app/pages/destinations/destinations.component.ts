import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule],
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
export class DestinationsComponent implements OnInit {
  totalDestinations = 0;
  activeDestinations = 0;
  dspDestinations = 0;
  analyticsDestinations = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
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

  async createSampleDestination() {
    try {
      await this.dataService.createDestination({
        name: 'Nexxen Test Destination',
        platform: 'NEXXEN',
        requiredHeaders: 'audience_id,user_id',
        dvTokens: 'sample_token_123',
        fileFormatRequirements: 'CSV format with header row'
      });
      await this.loadStats();
      alert('Destino de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample destination:', error);
      alert('Error al crear destino de ejemplo');
    }
  }
} 