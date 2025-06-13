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
        
        <!-- Collapse button (desktop) -->
        <button 
          class="collapse-button"
          (click)="toggleCollapse()"
          [attr.aria-label]="isCollapsed ? 'Expand menu' : 'Collapse menu'"
        >
          <span class="icon">{{ isCollapsed ? '→' : '←' }}</span>
        </button>
      </div>

      <!-- Navigation -->
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

      <!-- Sidebar Footer -->
      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <div class="footer-info">
          <p class="version">v1.0.0</p>
          <p class="copyright">© 2024 PurpleLab</p>
        </div>
      </div>
    </aside>

    <!-- Mobile overlay -->
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
      description: 'System overview'
    },
    {
      path: '/audiences',
      label: 'Audiences',
      icon: '👥',
      description: 'Predictive audience management'
    },
    {
      path: '/destinations',
      label: 'Destinations',
      icon: '🎯',
      description: 'Delivery platforms'
    },
    {
      path: '/bridges',
      label: 'Data Bridges',
      icon: '🌉',
      description: 'Identifier transformation'
    },
    {
      path: '/tenants',
      label: 'Tenants',
      icon: '🏢',
      description: 'Client management'
    },
    {
      path: '/concept-groups',
      label: 'Concept Groups',
      icon: '🏥',
      description: 'Medical categories'
    },
    {
      path: '/onboarding-requirements',
      label: 'Onboarding Requirements',
      icon: '📋',
      description: 'New destination configuration'
    },
    {
      path: '/metadata-requirements',
      label: 'Metadata Requirements',
      icon: '📄',
      description: 'File specifications'
    },
    {
      path: '/external-buckets',
      label: 'External Buckets',
      icon: '🪣',
      description: 'Client storage'
    },
    {
      path: '/delivery-logs',
      label: 'Delivery Logs',
      icon: '📈',
      description: 'Delivery history'
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
    // Close mobile menu when navigating
    if (this.isMobileOpen) {
      this.closeMobile();
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path || this.router.url.startsWith(path + '/');
  }
} 