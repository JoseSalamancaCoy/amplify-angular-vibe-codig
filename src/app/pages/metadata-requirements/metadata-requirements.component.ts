import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metadata-requirements',
  standalone: true,
  imports: [CommonModule],
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
  `]
})
export class MetadataRequirementsComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    // Component initialization
  }
} 