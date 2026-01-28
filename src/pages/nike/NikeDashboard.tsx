import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/MainLayout';
import StatusFilterMultiSelect from '../../components/StatusFilterMultiSelect';
import { shipmentsService } from '../../services/shipments';
import { STATUS_CODES, getStatusCategoryColor } from '../../constants/statusCodes';
import type { ShipmentListItem, StatusCode } from '../../types';
import ShipmentDetailsModal from '../../components/ShipmentDetailsModal';
import UpdateStatusModal from '../../components/UpdateStatusModal';
import UploadXmlModal from '../../components/UploadXmlModal';

const NikeDashboard: React.FC = () => {
  const [shipments, setShipments] = useState<ShipmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<StatusCode[]>([]);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const loadShipments = async () => {
    try {
      setLoading(true);
      const data = await shipmentsService.getShipments();
      setShipments(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao carregar cargas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = shipments.filter((shipment) => {
    const search = searchTerm.toLowerCase();
    const externalRef = (shipment.external_ref || '').toLowerCase();
    const remetenteNome = shipment.rem?.xNome?.toLowerCase() || '';
    const destinatarioNome = shipment.dest?.xNome?.toLowerCase() || '';
    const remetenteDoc = shipment.rem?.nDoc || '';
    const destinatarioDoc = shipment.dest?.nDoc || '';

    const matchesSearch = 
      externalRef.includes(search) ||
      remetenteDoc.includes(search) ||
      destinatarioDoc.includes(search) ||
      remetenteNome.includes(search) ||
      destinatarioNome.includes(search);

    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.some(s => s.codigo.toString() === shipment.status?.codigo?.toString());

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

  const handleUploadXml = (invoiceId: string) => {
    setSelectedInvoiceId(invoiceId);
    setXmlModalOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cargas Nike</h2>
            <p className="text-sm text-gray-500">Gerencie as cargas da integração Nike</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Buscar por minuta, CNPJ ou nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <StatusFilterMultiSelect
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
            statusOptions={STATUS_CODES}
            placeholder="Filtrar por status..."
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando cargas...</p>
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volumes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remetente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
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
                          {shipment.external_ref || shipment.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.total_value != null ? formatCurrency(shipment.total_value) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.total_weight ?? '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {shipment.volumes_qty ?? '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{shipment.rem?.xNome || '-'}</div>
                          <div className="text-gray-500">{shipment.rem?.nDoc || '-'}</div>
                          <div className="text-gray-500">{shipment.rem?.municipioNome || ''} - {shipment.rem?.UF || ''}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium">{shipment.dest?.xNome || '-'}</div>
                          <div className="text-gray-500">{shipment.dest?.nDoc || '-'}</div>
                          <div className="text-gray-500">{shipment.dest?.municipioNome || ''} - {shipment.dest?.UF || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {shipment.status ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusCategoryColor(shipment.status.categoria)
                            }`}>
                              {shipment.status.descricao}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleViewDetails(String(shipment.id))}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Detalhes
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary */}
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
        <ShipmentDetailsModal
          shipmentId={selectedShipmentId}
          onClose={() => setDetailsModalOpen(false)}
          onUpdateStatus={handleUpdateStatus}
          onUploadXml={handleUploadXml}
        />
      )}

      {statusModalOpen && selectedShipmentId && (
        <UpdateStatusModal
          shipmentId={selectedShipmentId}
          onClose={() => {
            setStatusModalOpen(false);
            loadShipments();
          }}
        />
      )}

      {xmlModalOpen && selectedInvoiceId && (
        <UploadXmlModal
          invoiceId={selectedInvoiceId}
          onClose={() => {
            setXmlModalOpen(false);
            loadShipments();
          }}
        />
      )}
    </MainLayout>
  );
};

export default NikeDashboard;
