import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'actions';
}

export interface TableData {
  [key: string]: any;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc' | null;
}

export interface SelectionEvent {
  selected: any[];
  item?: any;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: TableData[] = [];
  @Input() loading: boolean = false;
  @Input() selectable: boolean = false;
  @Input() multiSelect: boolean = false;
  @Input() responsive: boolean = true;
  @Input() striped: boolean = true;
  @Input() hover: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() emptyMessage: string = 'No data available';
  @Input() selectedItems: any[] = [];

  @Output() sort = new EventEmitter<SortEvent>();
  @Output() selectionChange = new EventEmitter<SelectionEvent>();
  @Output() rowClick = new EventEmitter<TableData>();

  private sortColumn: string | null = null;
  private sortDirection: 'asc' | 'desc' | null = null;

  get tableClasses(): string {
    const classes = [
      'table',
      `table--${this.size}`,
      this.striped ? 'table--striped' : '',
      this.hover ? 'table--hover' : '',
      this.responsive ? 'table--responsive' : '',
      this.loading ? 'table--loading' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  get allSelected(): boolean {
    return this.data.length > 0 && this.selectedItems.length === this.data.length;
  }

  get someSelected(): boolean {
    return this.selectedItems.length > 0 && this.selectedItems.length < this.data.length;
  }

  onSort(column: TableColumn): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? null : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.sort.emit({
      column: this.sortColumn || '',
      direction: this.sortDirection
    });
  }

  getSortIcon(column: TableColumn): string {
    if (!column.sortable || this.sortColumn !== column.key) return '';
    
    switch (this.sortDirection) {
      case 'asc': return 'sort-asc';
      case 'desc': return 'sort-desc';
      default: return '';
    }
  }

  onSelectAll(): void {
    if (!this.multiSelect) return;

    const newSelection = this.allSelected ? [] : [...this.data];
    this.selectedItems = newSelection;
    this.selectionChange.emit({ selected: newSelection });
  }

  onSelectItem(item: TableData): void {
    if (!this.selectable) return;

    let newSelection: any[];

    if (this.multiSelect) {
      const index = this.selectedItems.findIndex(selected => selected === item);
      if (index > -1) {
        newSelection = this.selectedItems.filter(selected => selected !== item);
      } else {
        newSelection = [...this.selectedItems, item];
      }
    } else {
      newSelection = this.selectedItems.includes(item) ? [] : [item];
    }

    this.selectedItems = newSelection;
    this.selectionChange.emit({ selected: newSelection, item });
  }

  isSelected(item: TableData): boolean {
    return this.selectedItems.includes(item);
  }

  onRowClick(item: TableData): void {
    this.rowClick.emit(item);
  }

  formatCellValue(value: any, column: TableColumn): string {
    if (value === null || value === undefined) return '';

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'number':
        return new Intl.NumberFormat().format(value);
      default:
        return String(value);
    }
  }
}
