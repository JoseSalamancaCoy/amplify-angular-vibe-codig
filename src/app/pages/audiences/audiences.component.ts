import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-audiences',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <app-crud-base
        [config]="crudConfig"
        [data]="audiences"
        [loading]="loading"
        (create)="onCreateAudience($event)"
        (update)="onUpdateAudience($event)"
        (delete)="onDeleteAudience($event)"
        (export)="onExportAudiences()"
      ></app-crud-base>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
  `]
})
export class AudiencesComponent implements OnInit {
  audiences: any[] = [];
  loading = false;

  crudConfig: CrudConfig = {
    entityName: 'Audience',
    columns: [
      {
        key: 'pathName',
        label: 'Path',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'audienceType',
        label: 'Type',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'DTC', label: 'Direct to Consumer' },
          { value: 'HCP', label: 'Healthcare Professional' },
          { value: 'NPI_TO_DTC', label: 'NPI to DTC' }
        ]
      },
      {
        key: 'destinationName',
        label: 'Destination',
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
        key: 'minSize',
        label: 'Min Size',
        type: 'number',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'maxSize',
        label: 'Max Size',
        type: 'number',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'cadence',
        label: 'Frequency',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' }
        ]
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
    this.loadAudiences();
  }

  async loadAudiences() {
    this.loading = true;
    try {
      const result = await this.dataService.getAudiences();
      this.audiences = result || [];
      console.log('Audiences loaded:', this.audiences);
    } catch (error) {
      console.error('Error loading audiences:', error);
      this.audiences = [];
      // Show more specific error
      if (error instanceof Error) {
        alert(`Error loading audiences: ${error.message}`);
      } else {
        alert('Error loading audiences. Please check backend connection.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateAudience(audienceData: any) {
    try {
      await this.dataService.createAudience(audienceData);
      await this.loadAudiences();
      alert('Audience created successfully');
    } catch (error) {
      console.error('Error creating audience:', error);
      alert('Error creating audience');
    }
  }

  async onUpdateAudience(event: { id: string, data: any }) {
    try {
      await this.dataService.updateAudience(event.id, event.data);
      await this.loadAudiences();
      alert('Audience updated successfully');
    } catch (error) {
      console.error('Error updating audience:', error);
      alert('Error updating audience');
    }
  }

  async onDeleteAudience(id: string) {
    try {
      await this.dataService.deleteAudience(id);
      await this.loadAudiences();
      alert('Audience deleted successfully');
    } catch (error) {
      console.error('Error deleting audience:', error);
      alert('Error deleting audience');
    }
  }

  onExportAudiences() {
    try {
      const csvContent = this.generateCSV(this.audiences);
      this.downloadCSV(csvContent, 'audiences.csv');
    } catch (error) {
      console.error('Error exporting audiences:', error);
      alert('Error exporting audiences');
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