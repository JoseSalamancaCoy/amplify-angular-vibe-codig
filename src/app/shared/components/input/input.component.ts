import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type InputSize = 'small' | 'medium' | 'large';
export type InputState = 'default' | 'error' | 'success' | 'warning';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() size: InputSize = 'medium';
  @Input() state: InputState = 'default';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() helpText: string = '';
  @Input() errorMessage: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;
  @Input() autocomplete?: string;
  @Input() ariaLabel?: string;
  
  @Output() inputChange = new EventEmitter<string>();
  @Output() inputBlur = new EventEmitter<Event>();
  @Output() inputFocus = new EventEmitter<Event>();

  private _value: string = '';
  private _touched = false;
  private _focused = false;

  // ControlValueAccessor methods
  private onChange = (value: string) => {};
  private onTouched = () => {};

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
    this.inputChange.emit(val);
  }

  get inputClasses(): string {
    const classes = [
      'input',
      `input--${this.size}`,
      `input--${this.state}`,
      this.disabled ? 'input--disabled' : '',
      this.readonly ? 'input--readonly' : '',
      this._focused ? 'input--focused' : '',
      this._touched ? 'input--touched' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  get containerClasses(): string {
    const classes = [
      'input-container',
      this.label ? 'input-container--with-label' : '',
      this.helpText || this.errorMessage ? 'input-container--with-help' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  get showError(): boolean {
    return this.state === 'error' && !!this.errorMessage;
  }

  get showHelp(): boolean {
    return !this.showError && !!this.helpText;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  onBlur(event: Event): void {
    this._touched = true;
    this._focused = false;
    this.onTouched();
    this.inputBlur.emit(event);
  }

  onFocus(event: Event): void {
    this._focused = true;
    this.inputFocus.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Helper methods for template
  get inputId(): string {
    return 'input-' + (this.label || this.placeholder).replace(/\s+/g, '-').toLowerCase();
  }

  get helpId(): string {
    return 'help-' + (this.label || this.placeholder).replace(/\s+/g, '-').toLowerCase();
  }

  get errorId(): string {
    return 'error-' + (this.label || this.placeholder).replace(/\s+/g, '-').toLowerCase();
  }

  get ariaDescribedBy(): string {
    if (this.showError) return this.errorId;
    if (this.showHelp) return this.helpId;
    return '';
  }
}
