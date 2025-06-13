import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, AmplifyAuthenticatorModule, CommonModule, SidebarComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'PurpleLab OTS Interface';

  // Estado del sidebar
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  currentRoute = '';
  breadcrumbs: { label: string, route?: string }[] = [];

  // Datos del dashboard
  dashboardStats = {
    totalAudiences: 0,
    activeAudiences: 0,
    totalDestinations: 0,
    totalDeliveries: 0
  };

  loading = false;

  // Configuración de campos del formulario de login
  formFields = {
    signIn: {
      username: {
        placeholder: 'Ingrese su email corporativo',
        isRequired: true,
        label: 'Email:'
      },
      password: {
        placeholder: 'Ingrese su contraseña',
        isRequired: true,
        label: 'Contraseña:'
      }
    }
  };

  // Mapeo de rutas a títulos
  private readonly routeLabels: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'audiences': 'Audiencias',
    'destinations': 'Destinos',
    'bridges': 'Puentes de Datos',
    'tenants': 'Inquilinos',
    'concept-groups': 'Grupos de Conceptos',
    'onboarding-requirements': 'Requisitos de Incorporación',
    'metadata-requirements': 'Requisitos de Metadatos',
    'external-buckets': 'Buckets Externos',
    'delivery-logs': 'Logs de Entrega'
  };

  private routerSubscription?: Subscription;

  constructor(
    public authenticator: AuthenticatorService,
    private dataService: DataService,
    private router: Router
  ) {
    Amplify.configure(outputs);
  }

  ngOnInit() {
    // Escuchar cambios de autenticación
    this.authenticator.subscribe((authState) => {
      if (authState.authStatus === 'authenticated') {
        this.loadDashboardData();
      }
    });

         // Subscribe to router events to update current route
     this.routerSubscription = this.router.events
       .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
       .subscribe((event: NavigationEnd) => {
         this.updateCurrentRoute(event.url);
       });

    // Set initial route
    this.updateCurrentRoute(this.router.url);
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Métodos del sidebar
  onSidebarCollapseChange(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  onSidebarMobileToggle(open: boolean): void {
    this.isMobileMenuOpen = open;
  }

  toggleMobileSidebar(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  getCurrentPageTitle(): string {
    return this.routeLabels[this.currentRoute] || 'PurpleLab OTS';
  }

  private updateCurrentRoute(url: string): void {
    this.currentRoute = url.split('/')[1];
    this.breadcrumbs = [
      { label: this.routeLabels[this.currentRoute] || 'PurpleLab OTS', route: this.currentRoute },
    ];
  }

  async loadDashboardData() {
    try {
      this.loading = true;
      const stats = await this.dataService.getDashboardStats();
      this.dashboardStats = {
        totalAudiences: stats.totalAudiences,
        activeAudiences: stats.activeAudiences,
        totalDestinations: stats.totalDestinations,
        totalDeliveries: stats.totalDeliveries
      };
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      // Mantener valores por defecto si hay error
    } finally {
      this.loading = false;
    }
  }

  // Método para crear datos de ejemplo (solo para demostración)
  async createSampleData() {
    try {
      this.loading = true;
      
      // Crear destino de ejemplo
      await this.dataService.createDestination({
        name: 'Comscore Demo',
        platform: 'COMSCORE'
      });

      // Crear tenant de ejemplo
      await this.dataService.createTenant({
        name: 'PurpleLab Demo Client',
        clientId: 'demo-client-001'
      });

      // Crear grupo de conceptos de ejemplo
      await this.dataService.createConceptGroup({
        groupName: 'Diabetes Medications',
        medicalCategory: 'Endocrinology'
      });

      // Crear audiencia de ejemplo
      await this.dataService.createAudience({
        pathName: '/healthcare/diabetes/hcp',
        minSize: 1000,
        maxSize: 50000,
        destination: 'Comscore Demo',
        audienceType: 'HCP',
        cadence: 'weekly'
      });

      // Recargar estadísticas
      await this.loadDashboardData();
      
      alert('Datos de ejemplo creados exitosamente');
    } catch (error) {
      console.error('Error al crear datos de ejemplo:', error);
      alert('Error al crear datos de ejemplo: ' + error);
    } finally {
      this.loading = false;
    }
  }
}
