import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-delivery-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Delivery Logs</h1>
        <p class="page-description">
          Monitor status and history of audience deliveries
        </p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalLogs }}</div>
          <div class="stat-label">Total Deliveries</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ successfulLogs }}</div>
          <div class="stat-label">Successful</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ failedLogs }}</div>
          <div class="stat-label">Failed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ pendingLogs }}</div>
          <div class="stat-label">Pending</div>
        </div>
      </div>

      <div class="content-section">
        <div class="section-header">
          <h2>Coming Soon</h2>
          <button class="btn-primary" (click)="createSampleLog()">
            Create Sample Log
          </button>
        </div>
        <p>Complete CRUD interface will be available in the next development phase.</p>
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
export class DeliveryLogsComponent implements OnInit {
  totalLogs = 0;
  successfulLogs = 0;
  failedLogs = 0;
  pendingLogs = 0;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadStats();
  }

  async loadStats() {
    try {
      const logs = await this.dataService.getDeliveryLogs();
      this.totalLogs = logs.length;
      this.successfulLogs = logs.filter((l: any) => l.status === 'SUCCESS').length;
      this.failedLogs = logs.filter((l: any) => l.status === 'FAILED').length;
      this.pendingLogs = logs.filter((l: any) => l.status === 'PENDING').length;
    } catch (error) {
      console.error('Error loading delivery log stats:', error);
    }
  }

  async createSampleLog() {
    try {
      await this.dataService.createDeliveryLog({
        audienceId: 'aud_sample_001',
        destinationName: 'Nexxen Test',
        deliveryDate: new Date().toISOString().split('T')[0],
        status: 'SUCCESS',
        recordCount: 25000,
        errorMessage: undefined
      });
      await this.loadStats();
      alert('Sample delivery log created successfully');
    } catch (error) {
      console.error('Error creating sample delivery log:', error);
      alert('Error creating sample delivery log');
    }
  }
} 