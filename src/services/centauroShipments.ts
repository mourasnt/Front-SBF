import { createApiInstance } from './apiFactory';
import { getIntegration } from '../config/integrations';
import type { 
  CentauroShipment, 
  CentauroShipmentListItem, 
  CentauroStatusUpdateRequest 
} from '../types/centauro';

const config = getIntegration('centauro');

export const centauroShipmentsService = {
  getApi() {
    return createApiInstance(config);
  },

  async getShipments(): Promise<CentauroShipmentListItem[]> {
    const api = this.getApi();
    const response = await api.get<CentauroShipmentListItem[]>('/shipments/');
    return response.data;
  },

  async getShipmentById(id: string): Promise<CentauroShipment> {
    const api = this.getApi();
    const response = await api.get<CentauroShipment>(`/shipments/${id}`);
    return response.data;
  },

  async updateStatus(shipmentId: string, data: CentauroStatusUpdateRequest, attachment?: File): Promise<any> {
    const api = this.getApi();
    
    if (attachment) {
      const formData = new FormData();
      formData.append('status_data', JSON.stringify(data));
      formData.append('attachment', attachment);

      const response = await api.post(`/shipments/${shipmentId}/status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    const response = await api.post(`/shipments/${shipmentId}/status`, data);
    return response.data;
  },

  async uploadClientCte(shipmentId: string, xmlFile: File): Promise<any> {
    const api = this.getApi();
    const formData = new FormData();
    formData.append('xml', xmlFile);

    const response = await api.post(`/shipments/${shipmentId}/client-ctes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getTrackingEvents(shipmentId: string): Promise<any[]> {
    const api = this.getApi();
    const response = await api.get(`/shipments/${shipmentId}/tracking`);
    return response.data;
  },

  async createShipment(data: Partial<CentauroShipment>): Promise<CentauroShipment> {
    const api = this.getApi();
    const response = await api.post<CentauroShipment>('/shipments/', data);
    return response.data;
  },

  async deleteShipment(id: string): Promise<void> {
    const api = this.getApi();
    await api.delete(`/shipments/${id}`);
  },
};
