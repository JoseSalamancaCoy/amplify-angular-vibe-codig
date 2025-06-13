import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';

/**
 * PurpleLab OTS - Data Service
 * Servicio para interactuar con la base de datos protegida por autenticación
 * Solo usuarios autenticados pueden acceder a los datos
 * @see https://docs.amplify.aws/angular/build-a-backend/data/customize-authz/signed-in-user-data-access/
 */

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Cliente GraphQL autenticado con modo de autorización específico
  private client = generateClient<Schema>({
    authMode: 'userPool'
  });

  constructor() {}

  /**
   * Verificar si el usuario está autenticado antes de cualquier operación
   */
  private async ensureAuthenticated(): Promise<void> {
    try {
      await getCurrentUser();
    } catch (error) {
      throw new Error('Usuario no autenticado. Debe iniciar sesión para acceder a los datos.');
    }
  }

  // ===== AUDIENCES =====
  async getAudiences() {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Audience.list();
      return data;
    } catch (error) {
      console.error('Error al obtener audiencias:', error);
      throw error;
    }
  }

  async createAudience(audience: {
    pathName: string;
    minSize: number;
    maxSize: number;
    destinationName: string;
    audienceType: 'DTC' | 'HCP' | 'NPI_TO_DTC';
    cadence: string;
    flags?: string;
    tenantId?: string;
    conceptGroupId?: string;
  }) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Audience.create(audience);
      return data;
    } catch (error) {
      console.error('Error al crear audiencia:', error);
      throw error;
    }
  }

  async updateAudience(id: string, updates: any) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Audience.update({ id, ...updates });
      return data;
    } catch (error) {
      console.error('Error al actualizar audiencia:', error);
      throw error;
    }
  }

  async deleteAudience(id: string) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Audience.delete({ id });
      return data;
    } catch (error) {
      console.error('Error al eliminar audiencia:', error);
      throw error;
    }
  }

  // ===== DESTINATIONS =====
  async getDestinations() {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Destination.list();
      return data;
    } catch (error) {
      console.error('Error al obtener destinos:', error);
      throw error;
    }
  }

  async createDestination(destination: {
    name: string;
    platform: 'NEXXEN' | 'VIANT' | 'COMSCORE' | 'PULSEPOINT' | 'LIVERAMP' | 'DEEPINTENT' | 'SEMCASTING' | 'LASSO' | 'JUNGROUP';
    requiredHeaders?: string;
    dvTokens?: string;
    fileFormatRequirements?: string;
  }) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Destination.create(destination);
      return data;
    } catch (error) {
      console.error('Error al crear destino:', error);
      throw error;
    }
  }

  // ===== TENANTS =====
  async getTenants() {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Tenant.list();
      return data;
    } catch (error) {
      console.error('Error al obtener inquilinos:', error);
      throw error;
    }
  }

  async createTenant(tenant: {
    name: string;
    clientId: string;
    configurationSettings?: string;
  }) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Tenant.create(tenant);
      return data;
    } catch (error) {
      console.error('Error al crear inquilino:', error);
      throw error;
    }
  }

  // ===== CONCEPT GROUPS =====
  async getConceptGroups() {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.ConceptGroup.list();
      return data;
    } catch (error) {
      console.error('Error al obtener grupos de conceptos:', error);
      throw error;
    }
  }

  async createConceptGroup(conceptGroup: {
    groupName: string;
    medicalCategory: string;
    description?: string;
  }) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.ConceptGroup.create(conceptGroup);
      return data;
    } catch (error) {
      console.error('Error al crear grupo de conceptos:', error);
      throw error;
    }
  }

  // ===== BRIDGES =====
  async getBridges() {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Bridge.list();
      return data;
    } catch (error) {
      console.error('Error al obtener puentes:', error);
      throw error;
    }
  }

  async createBridge(bridge: {
    patientId: string;
    customId: string;
    idType: 'THROTLE_ID' | 'DATAVANT_TOKEN' | 'PURPLE_ID';
    destinationId: string;
  }) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Bridge.create(bridge);
      return data;
    } catch (error) {
      console.error('Error al crear puente:', error);
      throw error;
    }
  }

  // ===== DELIVERY LOGS =====
  async getDeliveryLogs() {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.DeliveryLog.list();
      return data;
    } catch (error) {
      console.error('Error al obtener logs de entrega:', error);
      throw error;
    }
  }

  async createDeliveryLog(log: {
    audienceId: string;
    destinationName: string;
    deliveryDate: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    recordCount?: number;
    errorMessage?: string;
    executedBy?: string;
  }) {
    await this.ensureAuthenticated();
    try {
      // Agregar información del usuario actual
      const user = await getCurrentUser();
      const logWithUser = {
        ...log,
        executedBy: log.executedBy || user.username
      };
      
      const { data } = await this.client.models.DeliveryLog.create(logWithUser);
      return data;
    } catch (error) {
      console.error('Error al crear log de entrega:', error);
      throw error;
    }
  }

  // ===== MÉTODOS DE UTILIDAD =====
  
  /**
   * Obtener estadísticas del dashboard
   */
  async getDashboardStats() {
    await this.ensureAuthenticated();
    try {
      const [audiences, destinations, tenants, logs] = await Promise.all([
        this.client.models.Audience.list(),
        this.client.models.Destination.list(),
        this.client.models.Tenant.list(),
        this.client.models.DeliveryLog.list()
      ]);

      return {
        totalAudiences: audiences.data?.length || 0,
        activeAudiences: audiences.data?.filter(a => a.active).length || 0,
        totalDestinations: destinations.data?.length || 0,
        totalTenants: tenants.data?.length || 0,
        totalDeliveries: logs.data?.length || 0,
        successfulDeliveries: logs.data?.filter(l => l.status === 'SUCCESS').length || 0,
        failedDeliveries: logs.data?.filter(l => l.status === 'FAILED').length || 0,
        pendingDeliveries: logs.data?.filter(l => l.status === 'PENDING').length || 0,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }

  /**
   * Búsqueda de audiencias con filtros
   */
  async searchAudiences(filters: {
    audienceType?: 'DTC' | 'HCP' | 'NPI_TO_DTC';
    destinationName?: string;
    active?: boolean;
  }) {
    await this.ensureAuthenticated();
    try {
      const { data } = await this.client.models.Audience.list();
      
      let filteredData = data || [];
      
      if (filters.audienceType) {
        filteredData = filteredData.filter(a => a.audienceType === filters.audienceType);
      }
      
      if (filters.destinationName) {
        filteredData = filteredData.filter(a => a.destinationName === filters.destinationName);
      }
      
      if (filters.active !== undefined) {
        filteredData = filteredData.filter(a => a.active === filters.active);
      }
      
      return filteredData;
    } catch (error) {
      console.error('Error al buscar audiencias:', error);
      throw error;
    }
  }
} 