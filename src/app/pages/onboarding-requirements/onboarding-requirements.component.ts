import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CrudBaseComponent, CrudConfig } from '../../shared/components/crud-base/crud-base.component';

@Component({
  selector: 'app-onboarding-requirements',
  standalone: true,
  imports: [CommonModule, CrudBaseComponent],
  template: `
    <div class="page-container">
      <app-crud-base
        [config]="crudConfig"
        [data]="onboardingRequirements"
        [loading]="loading"
        (create)="onCreateOnboardingRequirement($event)"
        (update)="onUpdateOnboardingRequirement($event)"
        (delete)="onDeleteOnboardingRequirement($event)"
        (export)="onExportOnboardingRequirements()"
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
export class OnboardingRequirementsComponent implements OnInit {
  onboardingRequirements: any[] = [];
  loading = false;

  crudConfig: CrudConfig = {
    entityName: 'Onboarding Requirement',
    columns: [
      {
        key: 'destinationRoute',
        label: 'Destination Route',
        type: 'text',
        sortable: true,
        filterable: false,
        required: true
      },
      {
        key: 'credentials',
        label: 'Credentials',
        type: 'text',
        sortable: false,
        filterable: false,
        required: true
      },
      {
        key: 'audienceType',
        label: 'Audience Type',
        type: 'select',
        sortable: true,
        filterable: true,
        required: true,
        options: [
          { value: 'DTC', label: 'DTC' },
          { value: 'HCP', label: 'HCP' },
          { value: 'NPI_TO_DTC', label: 'NPI to DTC' }
        ]
      },
      {
        key: 'fileFormats',
        label: 'File Formats',
        type: 'text',
        sortable: false,
        filterable: false,
        required: true
      },
      {
        key: 'otsFrequency',
        label: 'OTS Frequency',
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
        key: 'idTypes',
        label: 'ID Types',
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
    this.loadOnboardingRequirements();
  }

  async loadOnboardingRequirements() {
    this.loading = true;
    try {
      const result = await this.dataService.getOnboardingRequirements();
      this.onboardingRequirements = result || [];
      console.log('Onboarding requirements loaded:', this.onboardingRequirements);
    } catch (error) {
      console.error('Error loading onboarding requirements:', error);
      this.onboardingRequirements = [];
      if (error instanceof Error) {
        alert(`Error loading onboarding requirements: ${error.message}`);
      } else {
        alert('Error loading onboarding requirements. Please check backend connection.');
      }
    } finally {
      this.loading = false;
    }
  }

  async onCreateOnboardingRequirement(requirementData: any) {
    try {
      await this.dataService.createOnboardingRequirement(requirementData);
      await this.loadOnboardingRequirements();
      alert('Onboarding requirement created successfully');
    } catch (error) {
      console.error('Error creating onboarding requirement:', error);
      alert('Error creating onboarding requirement');
    }
  }

  async onUpdateOnboardingRequirement(event: { id: string, data: any }) {
    try {
      await this.dataService.updateOnboardingRequirement(event.id, event.data);
      await this.loadOnboardingRequirements();
      alert('Onboarding requirement updated successfully');
    } catch (error) {
      console.error('Error updating onboarding requirement:', error);
      alert('Error updating onboarding requirement');
    }
  }

  async onDeleteOnboardingRequirement(id: string) {
    try {
      await this.dataService.deleteOnboardingRequirement(id);
      await this.loadOnboardingRequirements();
      alert('Onboarding requirement deleted successfully');
    } catch (error) {
      console.error('Error deleting onboarding requirement:', error);
      alert('Error deleting onboarding requirement');
    }
  }

  onExportOnboardingRequirements() {
    try {
      const csvContent = this.generateCSV(this.onboardingRequirements);
      this.downloadCSV(csvContent, 'onboarding-requirements.csv');
    } catch (error) {
      console.error('Error exporting onboarding requirements:', error);
      alert('Error exporting onboarding requirements');
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