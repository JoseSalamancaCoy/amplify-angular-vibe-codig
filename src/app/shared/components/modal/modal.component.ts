import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

export type ModalSize = 'small' | 'medium' | 'large' | 'extra-large';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() size: ModalSize = 'medium';
  @Input() title?: string;
  @Input() closable: boolean = true;
  @Input() backdrop: boolean = true;
  @Input() closeOnBackdropClick: boolean = true;
  @Input() closeOnEsc: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() showCloseButton: boolean = true;

  @Output() close = new EventEmitter<void>();
  @Output() afterOpen = new EventEmitter<void>();
  @Output() afterClose = new EventEmitter<void>();

  get modalClasses(): string {
    const classes = [
      'modal',
      `modal--${this.size}`,
      this.isOpen ? 'modal--open' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  get overlayClasses(): string {
    const classes = [
      'modal-overlay',
      this.isOpen ? 'modal-overlay--open' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  onClose(): void {
    if (!this.closable) return;
    
    this.isOpen = false;
    this.close.emit();
    
    setTimeout(() => {
      this.afterClose.emit();
    }, 300); // Wait for animation
  }

  onBackdropClick(event: Event): void {
    if (!this.closeOnBackdropClick || !this.closable) return;
    
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKeydown(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEsc && this.closable) {
      event.preventDefault();
      this.onClose();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        this.afterOpen.emit();
      }, 100);
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy(): void {
    // Cleanup: restore body scroll
    document.body.style.overflow = '';
  }

  get hasFooterContent(): boolean {
    // Simple check for footer content
    return true;
  }
}
