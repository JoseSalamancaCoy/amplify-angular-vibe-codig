import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

/**
 * PurpleLab OTS - Sidebar Navigation Component
 * Componente de menú lateral con navegación responsive
 */

export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  description: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed" [class.mobile-open]="isMobileOpen">
      <!-- Header del Sidebar -->
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo">PL</div>
          <div class="brand-info" *ngIf="!isCollapsed">
            <h2>PurpleLab OTS</h2>
            <span>Healthcare Analytics</span>
          </div>
        </div>
        
        <!-- Botón de colapso (desktop) -->
        <button 
          class="collapse-button"
          (click)="toggleCollapse()"
          [attr.aria-label]="isCollapsed ? 'Expandir menú' : 'Contraer menú'"
        >
          <span class="icon">{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <!-- Navegación -->
      <nav class="sidebar-nav">
        <ul class="nav-list">
          <li 
            *ngFor="let item of menuItems" 
            class="nav-item"
            [class.active]="isActive(item.path)"
          >
            <a 
              [routerLink]="item.path"
              class="nav-link"
              (click)="onNavigate(item)"
              [attr.title]="isCollapsed ? item.label : ''"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <div class="nav-content" *ngIf="!isCollapsed">
                <span class="nav-label">{{ item.label }}</span>
                <span class="nav-description">{{ item.description }}</span>
              </div>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Footer del Sidebar -->
      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <div class="footer-info">
          <p class="version">v1.0.0</p>
          <p class="copyright">© 2024 PurpleLab</p>
        </div>
      </div>
    </aside>

    <!-- Overlay para móvil -->
    <div 
      class="sidebar-overlay" 
      *ngIf="isMobileOpen"
      (click)="closeMobile()"
    ></div>
  `,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() isMobileOpen = false;
  @Output() collapseChange = new EventEmitter<boolean>();
  @Output() mobileToggle = new EventEmitter<boolean>();

  menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Vista general del sistema'
    },
    {
      path: '/audiences',
      label: 'Audiencias',
      icon: '👥',
      description: 'Gestión de audiencias predictivas'
    },
    {
      path: '/destinations',
      label: 'Destinos',
      icon: '🎯',
      description: 'Plataformas de entrega'
    },
    {
      path: '/bridges',
      label: 'Puentes de Datos',
      icon: '🌉',
      description: 'Transformación de identificadores'
    },
    {
      path: '/tenants',
      label: 'Inquilinos',
      icon: '🏢',
      description: 'Gestión de clientes'
    },
    {
      path: '/concept-groups',
      label: 'Grupos de Conceptos',
      icon: '🏥',
      description: 'Categorías médicas'
    },
    {
      path: '/onboarding-requirements',
      label: 'Requisitos de Incorporación',
      icon: '📋',
      description: 'Configuración de nuevos destinos'
    },
    {
      path: '/metadata-requirements',
      label: 'Requisitos de Metadatos',
      icon: '📄',
      description: 'Especificaciones de archivos'
    },
    {
      path: '/external-buckets',
      label: 'Buckets Externos',
      icon: '🪣',
      description: 'Almacenamiento de clientes'
    },
    {
      path: '/delivery-logs',
      label: 'Logs de Entrega',
      icon: '📈',
      description: 'Historial de entregas'
    }
  ];

  constructor(private router: Router) {}

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapseChange.emit(this.isCollapsed);
  }

  closeMobile(): void {
    this.isMobileOpen = false;
    this.mobileToggle.emit(false);
  }

  onNavigate(item: MenuItem): void {
    // Cerrar menú móvil al navegar
    if (this.isMobileOpen) {
      this.closeMobile();
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
} 