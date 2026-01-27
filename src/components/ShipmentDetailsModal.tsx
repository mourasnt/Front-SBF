import React, { useState, useEffect } from 'react';
import { shipmentsService } from '../services/shipments';
import type { Shipment } from '../types';

interface ShipmentDetailsModalProps {
  shipmentId: string;
  onClose: () => void;
  onUpdateStatus: (shipmentId: string) => void;
  onUploadXml: (invoiceId: string) => void;
}

const ShipmentDetailsModal: React.FC<ShipmentDetailsModalProps> = ({
  shipmentId,
  onClose,
  onUpdateStatus,
  onUploadXml,
}) => {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadShipment = async () => {
      try {
        const data = await shipmentsService.getShipmentById(shipmentId);
        setShipment(data);
      } catch (err: any) {
        setError(err.response?.data?.msg || 'Erro ao carregar detalhes');
      } finally {
        setLoading(false);
      }
    };

    loadShipment();
  }, [shipmentId]);

  const formatCurrency = (value?: number) => {
    if (value == null) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                    <span className="text-sm text-gray-600">Referência:</span>
                    <p className="font-semibold">{shipment.external_ref || shipment.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Valor Total:</span>
                    <p className="font-semibold">{formatCurrency(shipment.total_value)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Peso Total:</span>
                    <p className="font-semibold">{shipment.total_weight ?? '-'} kg</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Volumes:</span>
                    <p className="font-semibold">{shipment.volumes_qty ?? '-'}</p>
                  </div>
                </div>
              </div>

              {/* Actors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Remetente */}
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-md mb-3 text-blue-700">Remetente</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nome:</span> {shipment.rem?.xNome || '-'}</p>
                    <p><span className="font-medium">Doc:</span> {shipment.rem?.nDoc || '-'}</p>
                    <p><span className="font-medium">Endereço:</span> {shipment.rem?.xLgr || '-'} {shipment.rem?.nro || ''}</p>
                    <p><span className="font-medium">Bairro:</span> {shipment.rem?.xBairro || '-'}</p>
                    <p><span className="font-medium">Cidade/UF:</span> {shipment.rem?.municipioNome || '-'} / {shipment.rem?.UF || '-'}</p>
                    {shipment.rem?.CEP && <p><span className="font-medium">CEP:</span> {shipment.rem.CEP}</p>}
                    {shipment.rem?.nFone && <p><span className="font-medium">Telefone:</span> {shipment.rem.nFone}</p>}
                    {shipment.rem?.email && <p><span className="font-medium">Email:</span> {shipment.rem.email}</p>}
                  </div>
                </div>

                {/* Destinatario */}
                <div className="border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-md mb-3 text-green-700">Destinatário</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Nome:</span> {shipment.dest?.xNome || '-'}</p>
                    <p><span className="font-medium">Doc:</span> {shipment.dest?.nDoc || '-'}</p>
                    <p><span className="font-medium">Endereço:</span> {shipment.dest?.xLgr || '-'} {shipment.dest?.nro || ''}</p>
                    <p><span className="font-medium">Bairro:</span> {shipment.dest?.xBairro || '-'}</p>
                    <p><span className="font-medium">Cidade/UF:</span> {shipment.dest?.municipioNome || '-'} / {shipment.dest?.UF || '-'}</p>
                    {shipment.dest?.CEP && <p><span className="font-medium">CEP:</span> {shipment.dest.CEP}</p>}
                    {shipment.dest?.nFone && <p><span className="font-medium">Telefone:</span> {shipment.dest.nFone}</p>}
                    {shipment.dest?.email && <p><span className="font-medium">Email:</span> {shipment.dest.email}</p>}
                  </div>
                </div>

                {/* Tomador - not available in current shipment type */}

                {/* Recebedor */}
                {shipment.recebedor && (
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-semibold text-md mb-3 text-orange-700">Recebedor</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nome:</span> {shipment.recebedor.xNome || '-'}</p>
                      <p><span className="font-medium">Bairro:</span> {shipment.recebedor.xBairro || '-'}</p>
                      <p><span className="font-medium">Cidade/UF:</span> {shipment.recebedor.municipioNome || '-'}/{shipment.recebedor.UF || '-'}</p>
                      <p><span className="font-medium">CEP:</span> {shipment.recebedor.CEP || '-'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Horários - not available in current shipment type */}

              {/* Notas Fiscais */}
              {shipment.invoices && shipment.invoices.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Notas Fiscais</h3>
                  <div className="space-y-3">
                    {shipment.invoices.map((invoice) => (
                      <div key={invoice.id} className="border border-gray-200 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">Documento #{invoice.id}</h4>
                            <p className="text-sm text-gray-600">Access Key: {invoice.access_key || '-'}</p>
                            {invoice.cte_chave && (
                              <p className="text-sm text-gray-600">CT-e: {invoice.cte_chave}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onUpdateStatus(shipmentId)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Atualizar Status
                            </button>
                            <button
                              onClick={() => onUploadXml(invoice.id.toString())}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Upload CTe
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
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

export default ShipmentDetailsModal;
