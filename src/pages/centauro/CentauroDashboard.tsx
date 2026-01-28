import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import StatusFilterMultiSelect from '../../components/StatusFilterMultiSelect';
import { centauroShipmentsService } from '../../services/centauroShipments';
import { getCentauroStatusInfo } from '../../types/centauro';
import { STATUS_CODES, getStatusCategoryColor } from '../../constants/statusCodes';
import type { CentauroShipmentListItem } from '../../types/centauro';
import type { StatusCode } from '../../types';
import CentauroShipmentDetailsModal from './CentauroShipmentDetailsModal';
import CentauroUpdateStatusModal from './CentauroUpdateStatusModal';

const CentauroDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<CentauroShipmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<StatusCode[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const data = await centauroShipmentsService.getShipments();
      setShipments(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao carregar cargas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const search = searchTerm.toLowerCase();
    const externalId = (shipment.external_id || '').toLowerCase();
    const clientId = (shipment.client_id || '').toLowerCase();
    const originCity = shipment.origin_city?.municipio?.toLowerCase() || '';
    const destCity = shipment.destination_city?.municipio?.toLowerCase() || '';

    const matchesSearch = !searchTerm || 
      externalId.includes(search) ||
      clientId.includes(search) ||
      originCity.includes(search) ||
      destCity.includes(search);

    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.some(s => s.codigo.toString() === shipment.status?.code?.toString());

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (id: string) => {
    setSelectedShipmentId(id);
    setDetailsModalOpen(true);
  };

  const handleUpdateStatus = (shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
    setStatusModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cargas Centauro</h2>
            <p className="text-sm text-gray-500">Gerencie as cargas da integração Centauro</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por ID, cliente ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <StatusFilterMultiSelect
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            statusOptions={STATUS_CODES}
            placeholder="Filtrar por status..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Carregando cargas...</p>
          </div>
        ) : (
          /* Shipments Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Externo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Origem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                          Nenhuma carga encontrada
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredShipments.map((shipment) => (
                      <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {shipment.external_id || shipment.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {shipment.client_id || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{shipment.origin_city?.municipio || '-'}</div>
                          <div className="text-gray-500 text-xs">{shipment.origin_state?.uf || ''}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{shipment.destination_city?.municipio || '-'}</div>
                          <div className="text-gray-500 text-xs">{shipment.destination_state?.uf || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {shipment.status?.code ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusCategoryColor(shipment.status?.type || 'Geral')
                            }`}>
                              {shipment.status.code} - {shipment.status?.message || getCentauroStatusInfo(shipment.status?.code || '10').message}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
                            {shipment.client_ctes?.length || 0} cliente
                          </span>
                          {shipment.subcontracted_ctes && shipment.subcontracted_ctes.length > 0 && (
                            <span className="ml-1 inline-flex items-center px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs">
                              {shipment.subcontracted_ctes.length} sub
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewDetails(shipment.id)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                          >
                            Detalhes
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(shipment.id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Status
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Summary */}
            {filteredShipments.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Exibindo <span className="font-medium">{filteredShipments.length}</span> de{' '}
                  <span className="font-medium">{shipments.length}</span> cargas
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {detailsModalOpen && selectedShipmentId && (
        <CentauroShipmentDetailsModal
          shipmentId={selectedShipmentId}
          onClose={() => setDetailsModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {statusModalOpen && selectedShipmentId && (
        <CentauroUpdateStatusModal
          shipmentId={selectedShipmentId}
          onClose={() => {
            setStatusModalOpen(false);
            loadShipments();
          }}
        />
      )}
    </MainLayout>
  );
};

export default CentauroDashboard;
