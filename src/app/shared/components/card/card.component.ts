import { Component, Input } from '@angular/core';

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'filled';
export type CardSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() variant: CardVariant = 'default';
  @Input() size: CardSize = 'medium';
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() clickable: boolean = false;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  get cardClasses(): string {
    const classes = [
      'card',
      `card--${this.variant}`,
      `card--${this.size}`,
      this.clickable ? 'card--clickable' : '',
      this.disabled ? 'card--disabled' : '',
      this.loading ? 'card--loading' : ''
    ];
    
    return classes.filter(c => c !== '').join(' ');
  }

  get hasFooterContent(): boolean {
    // This is a simple check - in a real implementation, you might want to use ViewChild
    // to check if there's actual content projected
    return true;
  }
}
