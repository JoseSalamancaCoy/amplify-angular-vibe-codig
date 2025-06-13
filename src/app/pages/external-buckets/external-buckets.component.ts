import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-external-buckets',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>External Buckets</h1>
        <p class="page-description">
          Manage external storage locations for clients
        </p>
      </div>

              <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">15</div>
          <div class="stat-label">Total Buckets</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">8</div>
          <div class="stat-label">S3 Buckets</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">5</div>
          <div class="stat-label">GCS Buckets</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">2</div>
          <div class="stat-label">SFTP Servers</div>
        </div>
      </div>

      <app-crud-base
        [config]="crudConfig"
        [data]="externalBuckets"
        [loading]="loading"
        (create)="onCreateExternalBucket($event)"
        (update)="onUpdateExternalBucket($event)"
        (delete)="onDeleteExternalBucket($event)"
        (export)="onExportExternalBuckets()"
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
export class ExternalBucketsComponent implements OnInit {
  externalBuckets: any[] = [];
  loading = false;

  crudConfig: CrudConfig = {
    entityName: 'External Bucket',
    columns: [
      {
        key: 'bucketName',
        label: 'Bucket Name',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'tenantId',
        label: 'Tenant ID',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'url1',
        label: 'Primary URL',
        type: 'text',
        sortable: false,
        filterable: false,
        required: true
      },
      {
        key: 'url2',
        label: 'Secondary URL',
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
    this.loadExternalBuckets();
  }

  async loadExternalBuckets() {
    this.loading = true;
    try {
      const result = await this.dataService.getExternalBuckets();
      this.externalBuckets = result || [];
      console.log('External buckets loaded:', this.externalBuckets);
    } catch (error) {
      console.error('Error loading external buckets:', error);
      this.externalBuckets = [];
      if (error instanceof Error) {
        alert(`Error loading external buckets: ${error.message}`);
      } else {
        alert('Error loading external buckets. Please check backend connection.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateExternalBucket(bucketData: any) {
    try {
      await this.dataService.createExternalBucket(bucketData);
      await this.loadExternalBuckets();
      alert('External bucket created successfully');
    } catch (error) {
      console.error('Error creating external bucket:', error);
      alert('Error creating external bucket');
    }
  }

  async onUpdateExternalBucket(event: { id: string, data: any }) {
    try {
      await this.dataService.updateExternalBucket(event.id, event.data);
      await this.loadExternalBuckets();
      alert('External bucket updated successfully');
    } catch (error) {
      console.error('Error updating external bucket:', error);
      alert('Error updating external bucket');
    }
  }

  async onDeleteExternalBucket(id: string) {
    try {
      await this.dataService.deleteExternalBucket(id);
      await this.loadExternalBuckets();
      alert('External bucket deleted successfully');
    } catch (error) {
      console.error('Error deleting external bucket:', error);
      alert('Error deleting external bucket');
    }
  }

  onExportExternalBuckets() {
    try {
      const csvContent = this.generateCSV(this.externalBuckets);
      this.downloadCSV(csvContent, 'external-buckets.csv');
    } catch (error) {
      console.error('Error exporting external buckets:', error);
      alert('Error exporting external buckets');
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