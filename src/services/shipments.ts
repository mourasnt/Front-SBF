import api from './api';
import type { Shipment, ShipmentListItem, StatusUpdateRequest, XmlUploadResponse } from '../types';

export const shipmentsService = {
  async getShipments(): Promise<ShipmentListItem[]> {
    const response = await api.get<ShipmentListItem[]>('/cargas/');
    const data = response.data;
    // Handle wrapped response (e.g., { data: [...], count: ... })
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as any).data)) {
      return (data as any).data;
    }
    return [];
  },

  async getShipmentById(id: string): Promise<Shipment> {
    const response = await api.get<Shipment>(`/cargas/${id}`);
    return response.data;
  },

  async updateStatus(shipmentId: string, data: StatusUpdateRequest, files?: File[]): Promise<any> {
    // Backend expects a payload with a "code" field (not "novo_status") and the shipment UUID in the path
    const statusPayload = { code: data.status.toString() };

    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('new_status', JSON.stringify(statusPayload));

      // Endpoint currently accepts a single file under the "attachment" field
      const [firstFile] = files;
      if (firstFile) {
        formData.append('attachment', firstFile);
      }

      const response = await api.post(`/cargas/${shipmentId}/status`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    const response = await api.post(`/cargas/${shipmentId}/status`, statusPayload);
    return response.data;
  },

  async uploadXmls(invoiceId: string, files: File[]): Promise<XmlUploadResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('xmls', file);
    });
    
    const response = await api.post<XmlUploadResponse>(`/cargas/${invoiceId}/upload-xml`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
