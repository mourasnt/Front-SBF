import React, { useState, useEffect } from 'react';
import { centauroShipmentsService } from '../../services/centauroShipments';
import { getCentauroStatusInfo } from '../../types/centauro';
import type { CentauroShipment } from '../../types/centauro';

interface CentauroShipmentDetailsModalProps {
  shipmentId: string;
  onClose: () => void;
  onUpdateStatus: (shipmentId: string) => void;
}

const CentauroShipmentDetailsModal: React.FC<CentauroShipmentDetailsModalProps> = ({
  shipmentId,
  onClose,
  onUpdateStatus,
}) => {
  const [shipment, setShipment] = useState<CentauroShipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShipment = async () => {
      try {
        const data = await centauroShipmentsService.getShipmentById(shipmentId);
        setShipment(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Erro ao carregar detalhes');
      } finally {
        setLoading(false);
      }
    };

    loadShipment();
  }, [shipmentId]);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusBadgeColor = (type?: string) => {
    const colors: Record<string, string> = {
      'Emissao': 'bg-blue-100 text-blue-800',
      'Transito': 'bg-yellow-100 text-yellow-800',
      'Finalizada': 'bg-green-100 text-green-800',
      'PENDENCIA': 'bg-red-100 text-red-800',
      'Conferencia': 'bg-purple-100 text-purple-800',
      'Deposito': 'bg-indigo-100 text-indigo-800',
      'Geral': 'bg-gray-100 text-gray-800',
      'PRE-EMISSAO': 'bg-orange-100 text-orange-800',
    };
    return colors[type || ''] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Detalhes da Carga</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : shipment ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Informações Básicas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">ID Externo:</span>
                    <p className="font-semibold">{shipment.external_id || '-'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Cliente:</span>
                    <p className="font-semibold">{shipment.client_id || '-'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">UUID:</span>
                    <p className="font-mono text-xs break-all">{shipment.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status:</span>
                    <p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(shipment.status?.type)}`}>
                        {shipment.status?.message || getCentauroStatusInfo(shipment.status?.code || '10').message}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Route Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Origin */}
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-md mb-3 text-orange-700">Origem</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Cidade:</span>{' '}
                      {shipment.origin_city?.municipio || '-'}
                    </p>
                    <p>
                      <span className="font-medium">UF:</span>{' '}
                      {shipment.origin_state?.uf || '-'}
                    </p>
                    <p>
                      <span className="font-medium">Código IBGE:</span>{' '}
                      {shipment.origin_city?.cod || '-'}
                    </p>
                  </div>
                </div>

                {/* Destination */}
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-md mb-3 text-green-700">Destino</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Cidade:</span>{' '}
                      {shipment.destination_city?.municipio || '-'}
                    </p>
                    <p>
                      <span className="font-medium">UF:</span>{' '}
                      {shipment.destination_state?.uf || '-'}
                    </p>
                    <p>
                      <span className="font-medium">Código IBGE:</span>{' '}
                      {shipment.destination_city?.cod || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Client CTes */}
              {shipment.client_ctes && shipment.client_ctes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">CT-es do Cliente</h3>
                  <div className="space-y-3">
                    {shipment.client_ctes.map((cte) => (
                      <div key={cte.id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">Chave de Acesso:</p>
                            <p className="font-mono text-xs break-all text-gray-600">{cte.access_key}</p>
                          </div>
                        </div>

                        {/* Invoices */}
                        {cte.invoices && cte.invoices.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Notas Fiscais:</p>
                            <div className="space-y-2">
                              {cte.invoices.map((inv, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
                                  <span className="font-mono">{inv.key}</span>
                                  <span className={`px-2 py-0.5 rounded ${getStatusBadgeColor(inv.status.type)}`}>
                                    {inv.status.message || inv.status.code}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tracking Events */}
                        {cte.tracking_events && cte.tracking_events.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Eventos de Tracking:</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {cte.tracking_events.map((event) => (
                                <div key={event.id} className="flex items-start gap-2 text-xs">
                                  <span className="text-gray-400 whitespace-nowrap">
                                    {formatDateTime(event.created_at)}
                                  </span>
                                  <span className="font-medium text-gray-600">[{event.code}]</span>
                                  <span className="text-gray-800">{event.message}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Subcontracted CTes */}
              {shipment.subcontracted_ctes && shipment.subcontracted_ctes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">CT-es de Subcontratação</h3>
                  <div className="space-y-3">
                    {shipment.subcontracted_ctes.map((cte) => (
                      <div key={cte.id} className="border border-orange-200 bg-orange-50 p-4 rounded-lg">
                        <div>
                          <p className="font-semibold">Chave de Acesso:</p>
                          <p className="font-mono text-xs break-all text-gray-600">{cte.access_key}</p>
                        </div>
                        {cte.carrier_name && (
                          <p className="mt-2 text-sm">
                            <span className="font-medium">Transportadora:</span> {cte.carrier_name}
                          </p>
                        )}
                        {cte.carrier_cnpj && (
                          <p className="text-sm">
                            <span className="font-medium">CNPJ:</span> {cte.carrier_cnpj}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">Datas</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Criado em:</span>
                    <p className="font-medium">{formatDateTime(shipment.created_at)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Atualizado em:</span>
                    <p className="font-medium">{formatDateTime(shipment.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          {shipment && (
            <button
              onClick={() => onUpdateStatus(shipmentId)}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Atualizar Status
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CentauroShipmentDetailsModal;
