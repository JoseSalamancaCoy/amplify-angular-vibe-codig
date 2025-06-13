import { Component, Input, Output, EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';

export interface CrudColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  sortable?: boolean;
  filterable?: boolean;
  required?: boolean;
  options?: { value: any, label: string }[];
}

export interface CrudConfig {
  entityName: string;
  columns: CrudColumn[];
  actions: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
    export?: boolean;
  };
  pagination: {
    pageSize: number;
    pageSizeOptions: number[];
  };
}

@Component({
  selector: 'app-crud-base',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="crud-container">
      <!-- Header Section -->
      <div class="crud-header">
        <div class="header-left">
          <h2 class="entity-title">{{ config.entityName }}</h2>
          <div class="entity-stats">
            <span class="total-count">{{ totalItems }} registros</span>
            <span class="filtered-count" *ngIf="filteredItems !== totalItems">
              ({{ filteredItems }} filtrados)
            </span>
          </div>
        </div>
        
        <div class="header-actions">
          <button 
            *ngIf="config.actions.export"
            class="btn btn-secondary"
            (click)="exportData()"
            [disabled]="loading"
          >
            📊 Exportar
          </button>
          
          <button 
            *ngIf="config.actions.create"
            class="btn btn-primary"
            (click)="openCreateModal()"
            [disabled]="loading"
          >
            ➕ Crear {{ config.entityName }}
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="crud-filters" *ngIf="hasFilters">
        <div class="filters-row">
          <div class="search-box">
            <input
              type="text"
              placeholder="Buscar..."
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="search-input"
            >
            <span class="search-icon">🔍</span>
          </div>

          <div class="filter-controls">
            <select 
              *ngFor="let column of filterableColumns"
              [(ngModel)]="filters[column.key]"
              (change)="onFilter()"
              class="filter-select"
            >
              <option value="">Todos {{ column.label }}</option>
              <option 
                *ngFor="let option of column.options" 
                [value]="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <button 
            class="btn btn-outline"
            (click)="clearFilters()"
            *ngIf="hasActiveFilters"
          >
            🗑️ Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-overlay" *ngIf="loading">
        <div class="loading-spinner">⏳ Cargando...</div>
      </div>

      <!-- Data Table -->
      <div class="crud-table-container" *ngIf="!loading">
        <table class="crud-table">
          <thead>
            <tr>
              <th 
                *ngFor="let column of config.columns"
                [class.sortable]="column.sortable"
                (click)="onSort(column.key)"
              >
                {{ column.label }}
                <span 
                  *ngIf="column.sortable && sortColumn === column.key"
                  class="sort-indicator"
                >
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of paginatedData; trackBy: trackByFn">
              <td *ngFor="let column of config.columns">
                <ng-container [ngSwitch]="column.type">
                  <span *ngSwitchCase="'boolean'">
                    {{ item[column.key] ? '✅' : '❌' }}
                  </span>
                  <span *ngSwitchCase="'date'">
                    {{ item[column.key] | date:'dd/MM/yyyy' }}
                  </span>
                  <span *ngSwitchDefault>
                    {{ item[column.key] || '-' }}
                  </span>
                </ng-container>
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <button 
                    *ngIf="config.actions.read"
                    class="btn-icon btn-view"
                    (click)="viewItem(item)"
                    title="Ver detalles"
                  >
                    👁️
                  </button>
                  <button 
                    *ngIf="config.actions.update"
                    class="btn-icon btn-edit"
                    (click)="editItem(item)"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button 
                    *ngIf="config.actions.delete"
                    class="btn-icon btn-delete"
                    (click)="deleteItem(item)"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="paginatedData.length === 0">
          <div class="empty-icon">📭</div>
          <h3>No hay datos disponibles</h3>
          <p>{{ hasActiveFilters ? 'No se encontraron resultados con los filtros aplicados' : 'Aún no hay registros creados' }}</p>
          <button 
            *ngIf="config.actions.create && !hasActiveFilters"
            class="btn btn-primary"
            (click)="openCreateModal()"
          >
            Crear primer {{ config.entityName }}
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div class="crud-pagination" *ngIf="totalPages > 1">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ filteredItems }} registros
        </div>
        
        <div class="pagination-controls">
          <button 
            class="btn btn-outline"
            (click)="goToPage(currentPage - 1)"
            [disabled]="currentPage === 1"
          >
            ← Anterior
          </button>
          
          <span class="page-numbers">
            <button 
              *ngFor="let page of visiblePages"
              class="btn"
              [class.btn-primary]="page === currentPage"
              [class.btn-outline]="page !== currentPage"
              (click)="goToPage(page)"
            >
              {{ page }}
            </button>
          </span>
          
          <button 
            class="btn btn-outline"
            (click)="goToPage(currentPage + 1)"
            [disabled]="currentPage === totalPages"
          >
            Siguiente →
          </button>
        </div>

        <div class="page-size-selector">
          <label>Mostrar:</label>
          <select [(ngModel)]="pageSize" (change)="onPageSizeChange()">
            <option *ngFor="let size of config.pagination.pageSizeOptions" [value]="size">
              {{ size }}
            </option>
          </select>
          <span>por página</span>
        </div>
      </div>
    </div>

    <!-- Modal for Create/Edit -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ modalMode === 'create' ? 'Crear' : 'Editar' }} {{ config.entityName }}</h3>
          <button class="modal-close" (click)="closeModal()">✕</button>
        </div>
        
        <form [formGroup]="entityForm" (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-grid">
            <div 
              *ngFor="let column of config.columns"
              class="form-field"
            >
              <label [for]="column.key">
                {{ column.label }}
                <span *ngIf="column.required" class="required">*</span>
              </label>
              
              <ng-container [ngSwitch]="column.type">
                <input 
                  *ngSwitchCase="'text'"
                  type="text"
                  [id]="column.key"
                  [formControlName]="column.key"
                  class="form-input"
                />
                
                <input 
                  *ngSwitchCase="'number'"
                  type="number"
                  [id]="column.key"
                  [formControlName]="column.key"
                  class="form-input"
                />
                
                <input 
                  *ngSwitchCase="'date'"
                  type="date"
                  [id]="column.key"
                  [formControlName]="column.key"
                  class="form-input"
                />
                
                <select 
                  *ngSwitchCase="'select'"
                  [id]="column.key"
                  [formControlName]="column.key"
                  class="form-select"
                >
                  <option value="">Seleccionar...</option>
                  <option 
                    *ngFor="let option of column.options"
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
                
                <label 
                  *ngSwitchCase="'boolean'"
                  class="checkbox-label"
                >
                  <input 
                    type="checkbox"
                    [id]="column.key"
                    [formControlName]="column.key"
                    class="form-checkbox"
                  />
                  <span class="checkbox-text">{{ column.label }}</span>
                </label>
              </ng-container>
              
              <div 
                *ngIf="entityForm.get(column.key)?.errors && entityForm.get(column.key)?.touched"
                class="field-error"
              >
                Campo requerido
              </div>
            </div>
          </div>
        </form>
        
        <div class="modal-footer">
          <button 
            type="button"
            class="btn btn-outline"
            (click)="closeModal()"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            class="btn btn-primary"
            (click)="onSubmit()"
            [disabled]="entityForm.invalid || submitting"
          >
            {{ submitting ? 'Guardando...' : (modalMode === 'create' ? 'Crear' : 'Actualizar') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./crud-base.component.css']
})
export class CrudBaseComponent implements OnInit {
  @Input() config!: CrudConfig;
  @Input() data: any[] = [];
  @Input() loading = false;

  @Output() create = new EventEmitter<any>();
  @Output() update = new EventEmitter<{ id: string, data: any }>();
  @Output() delete = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();

  // Table state
  filteredData: any[] = [];
  paginatedData: any[] = [];
  
  // Search and filters
  searchTerm = '';
  filters: { [key: string]: any } = {};
  
  // Sorting
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  
  // Modal state
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  entityForm!: FormGroup;
  submitting = false;
  currentItem: any = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.pageSize = this.config.pagination.pageSize;
    this.initializeForm();
    this.processData();
  }

  ngOnChanges() {
    this.processData();
  }

  // Computed properties
  get totalItems() { return this.data.length; }
  get filteredItems() { return this.filteredData.length; }
  get hasFilters() { return this.filterableColumns.length > 0; }
  get hasActiveFilters() { 
    return this.searchTerm || Object.values(this.filters).some(v => v);
  }
  get filterableColumns() {
    return this.config.columns.filter(col => col.filterable);
  }
  get startIndex() { return (this.currentPage - 1) * this.pageSize; }
  get endIndex() { 
    return Math.min(this.startIndex + this.pageSize, this.filteredItems);
  }
  get visiblePages() {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Form initialization
  initializeForm() {
    const formControls: { [key: string]: any } = {};
    this.config.columns.forEach(column => {
      formControls[column.key] = [''];
    });
    this.entityForm = this.fb.group(formControls);
  }

  // Data processing
  processData() {
    this.applyFilters();
    this.applySorting();
    this.applyPagination();
  }

  applyFilters() {
    this.filteredData = this.data.filter(item => {
      // Search term filter
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const matchesSearch = this.config.columns.some(column => 
          String(item[column.key] || '').toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Column filters
      for (const [key, value] of Object.entries(this.filters)) {
        if (value && item[key] !== value) return false;
      }

      return true;
    });
  }

  applySorting() {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        
        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  applyPagination() {
    this.totalPages = Math.ceil(this.filteredItems / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    
    const start = this.startIndex;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  // Event handlers
  onSearch() {
    this.currentPage = 1;
    this.processData();
  }

  onFilter() {
    this.currentPage = 1;
    this.processData();
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.processData();
  }

  clearFilters() {
    this.searchTerm = '';
    this.filters = {};
    this.currentPage = 1;
    this.processData();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.applyPagination();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.processData();
  }

  // CRUD operations
  openCreateModal() {
    this.modalMode = 'create';
    this.currentItem = null;
    this.entityForm.reset();
    this.showModal = true;
  }

  editItem(item: any) {
    this.modalMode = 'edit';
    this.currentItem = item;
    this.entityForm.patchValue(item);
    this.showModal = true;
  }

  viewItem(item: any) {
    // Implement view logic or emit event
    console.log('View item:', item);
  }

  deleteItem(item: any) {
    if (confirm(`¿Está seguro de eliminar este ${this.config.entityName}?`)) {
      this.delete.emit(item.id);
    }
  }

  closeModal() {
    this.showModal = false;
    this.entityForm.reset();
    this.currentItem = null;
  }

  onSubmit() {
    if (this.entityForm.valid) {
      this.submitting = true;
      const formData = this.entityForm.value;
      
      if (this.modalMode === 'create') {
        this.create.emit(formData);
      } else {
        this.update.emit({ id: this.currentItem.id, data: formData });
      }
      
      // Reset submitting state after operation
      setTimeout(() => {
        this.submitting = false;
        this.closeModal();
      }, 1000);
    }
  }

  exportData() {
    this.export.emit();
  }

  trackByFn(index: number, item: any) {
    return item.id || index;
  }
} 