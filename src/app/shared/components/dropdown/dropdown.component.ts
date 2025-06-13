import { Component, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface SelectionEvent {
  value: any;
  option: DropdownOption;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() searchable: boolean = false;
  @Input() multiple: boolean = false;
  @Input() disabled: boolean = false;
  @Input() clearable: boolean = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() maxHeight: string = '200px';
  @Input() selectedValue: any = null;
  @Input() selectedValues: any[] = [];
  @Input() noOptionsText: string = 'No options available';
  @Input() searchPlaceholder: string = 'Search...';

  @Output() selectionChange = new EventEmitter<SelectionEvent>();
  @Output() multiSelectionChange = new EventEmitter<any[]>();
  @Output() searchChange = new EventEmitter<string>();

  isOpen: boolean = false;
  searchText: string = '';
  focusedIndex: number = -1;

  constructor(private elementRef: ElementRef) {}

  get dropdownClasses(): string {
    const classes = [
      'dropdown',
      `dropdown--${this.size}`,
      this.disabled ? 'dropdown--disabled' : '',
      this.isOpen ? 'dropdown--open' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  get filteredOptions(): DropdownOption[] {
    if (!this.searchable || !this.searchText) {
      return this.options;
    }

    return this.options.filter(option => 
      option.label.toLowerCase().includes(this.searchText.toLowerCase()) ||
      option.value.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get selectedLabel(): string {
    if (this.multiple) {
      if (this.selectedValues.length === 0) return this.placeholder;
      if (this.selectedValues.length === 1) {
        const option = this.options.find(opt => opt.value === this.selectedValues[0]);
        return option ? option.label : this.placeholder;
      }
      return `${this.selectedValues.length} items selected`;
    }

    const option = this.options.find(opt => opt.value === this.selectedValue);
    return option ? option.label : this.placeholder;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      this.focusedIndex = -1;
      if (this.searchable) {
        setTimeout(() => {
          const searchInput = this.elementRef.nativeElement.querySelector('.dropdown__search-input');
          if (searchInput) searchInput.focus();
        });
      }
    } else {
      this.searchText = '';
    }
  }

  selectOption(option: DropdownOption): void {
    if (option.disabled) return;

    if (this.multiple) {
      const index = this.selectedValues.findIndex(value => value === option.value);
      let newValues: any[];

      if (index > -1) {
        newValues = this.selectedValues.filter(value => value !== option.value);
      } else {
        newValues = [...this.selectedValues, option.value];
      }

      this.selectedValues = newValues;
      this.multiSelectionChange.emit(newValues);
    } else {
      this.selectedValue = option.value;
      this.selectionChange.emit({ value: option.value, option });
      this.isOpen = false;
    }
  }

  isSelected(option: DropdownOption): boolean {
    if (this.multiple) {
      return this.selectedValues.includes(option.value);
    }
    return this.selectedValue === option.value;
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchText = target.value;
    this.searchChange.emit(this.searchText);
    this.focusedIndex = -1;
  }

  clearSelection(): void {
    if (this.multiple) {
      this.selectedValues = [];
      this.multiSelectionChange.emit([]);
    } else {
      this.selectedValue = null;
      this.selectionChange.emit({ value: null, option: { value: null, label: '' } });
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.toggleDropdown();
      }
      return;
    }

    const filteredOptions = this.filteredOptions.filter(opt => !opt.disabled);

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, filteredOptions.length - 1);
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        break;
      
      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < filteredOptions.length) {
          this.selectOption(filteredOptions[this.focusedIndex]);
        }
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.searchText = '';
    }
  }
}
