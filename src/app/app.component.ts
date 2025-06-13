import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AmplifyAuthenticatorModule, AuthenticatorService } from '@aws-amplify/ui-angular';
import { DataService } from './services/data.service';
import { CommonModule } from '@angular/common';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, AmplifyAuthenticatorModule, CommonModule],
})
export class AppComponent implements OnInit {
  title = 'amplify-angular-template';

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

  constructor(
    public authenticator: AuthenticatorService,
    private dataService: DataService
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
