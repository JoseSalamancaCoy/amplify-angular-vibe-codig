import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-bridges',
  standalone: true,
  imports: [CommonModule],
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
export class BridgesComponent implements OnInit {
  totalBridges = 0;
  throtleIds = 0;
  datavantTokens = 0;
  purpleIds = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    try {
      const bridges = await this.dataService.getBridges();
      this.totalBridges = bridges.length;
      this.throtleIds = bridges.filter((b: any) => b.idType === 'THROTLE_ID').length;
      this.datavantTokens = bridges.filter((b: any) => b.idType === 'DATAVANT_TOKEN').length;
      this.purpleIds = bridges.filter((b: any) => b.idType === 'PURPLE_ID').length;
    } catch (error) {
      console.error('Error loading bridge stats:', error);
    }
  }

  async createSampleBridge() {
    try {
      await this.dataService.createBridge({
        patientId: 'patient_12345',
        customId: 'custom_67890',
        idType: 'THROTLE_ID',
        destinationId: 'dest_sample_001'
      });
      await this.loadStats();
      alert('Puente de ejemplo creado exitosamente');
    } catch (error) {
      console.error('Error creating sample bridge:', error);
      alert('Error al crear puente de ejemplo');
    }
  }
} 