import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import all shared components
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import { TableComponent } from './components/table/table.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { CardComponent } from './components/card/card.component';
import { ModalComponent } from './components/modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Import standalone components
    ButtonComponent,
    InputComponent,
    TableComponent,
    DropdownComponent,
    CardComponent,
    ModalComponent
  ],
  exports: [
    // Export all components for use in other modules
    ButtonComponent,
    InputComponent,
    TableComponent,
    DropdownComponent,
    CardComponent,
    ModalComponent,
    
    // Export common modules that components might need
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
