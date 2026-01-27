import React, { useState } from 'react';
import { centauroShipmentsService } from '../../services/centauroShipments';
import { CENTAURO_STATUS_CODES, getCentauroStatusCategories } from '../../types/centauro';
import type { CentauroStatusUpdateRequest } from '../../types/centauro';

interface CentauroUpdateStatusModalProps {
  shipmentId: string;
  onClose: () => void;
}

const CentauroUpdateStatusModal: React.FC<CentauroUpdateStatusModalProps> = ({
  shipmentId,
  onClose,
}) => {
  const [statusCode, setStatusCode] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [invoiceKeys, setInvoiceKeys] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = getCentauroStatusCategories();

  const filteredStatuses = Object.entries(CENTAURO_STATUS_CODES)
    .filter(([_, info]) => !categoryFilter || info.type === categoryFilter)
    .map(([code, info]) => ({ code, ...info }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!statusCode) {
      setError('Selecione um status');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data: CentauroStatusUpdateRequest = {
        code: statusCode,
      };

      // Parse invoice keys if provided
      if (invoiceKeys.trim()) {
        data.invoice_keys = invoiceKeys
          .split(',')
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
      }

      await centauroShipmentsService.updateStatus(
        shipmentId,
        data,
        attachment || undefined
      );

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Atualizar Status</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Status atualizado com sucesso!
            </div>
          )}

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Categoria
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Todas as categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={statusCode}
              onChange={(e) => setStatusCode(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Selecione um status</option>
              {filteredStatuses.map((status) => (
                <option key={status.code} value={status.code}>
                  {status.code} - {status.message} ({status.type})
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Keys (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chaves das Notas Fiscais (opcional)
            </label>
            <textarea
              value={invoiceKeys}
              onChange={(e) => setInvoiceKeys(e.target.value)}
              rows={2}
              placeholder="Separe múltiplas chaves por vírgula..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Se não informado, o status será aplicado a todas as notas da carga.
            </p>
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anexo (opcional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {attachment && (
              <p className="mt-2 text-sm text-gray-600">
                Arquivo selecionado: {attachment.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !statusCode}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              Atualizar Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CentauroUpdateStatusModal;
