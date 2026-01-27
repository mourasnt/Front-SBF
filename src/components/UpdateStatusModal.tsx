import React, { useState } from 'react';
import { shipmentsService } from '../services/shipments';
import { STATUS_CODES, STATUS_CATEGORIES } from '../constants/statusCodes';
import type { StatusUpdateRequest } from '../types';

interface UpdateStatusModalProps {
  shipmentId: string;
  onClose: () => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  shipmentId,
  onClose,
}) => {
  const [status, setStatus] = useState('');
  const [observacao, setObservacao] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [showRecebedor, setShowRecebedor] = useState(false);
  const [recebedor, setRecebedor] = useState({
    nome: '',
    cnpj_cpf: '',
    data_recebimento: new Date().toISOString().slice(0, 16),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const filteredStatuses = categoryFilter
    ? STATUS_CODES.filter(s => s.categoria === categoryFilter)
    : STATUS_CODES;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!status) {
      setError('Selecione um status');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data: StatusUpdateRequest = {
        status: parseInt(status),
        observacao: observacao || undefined,
      };

      if (showRecebedor && recebedor.nome && recebedor.cnpj_cpf) {
        data.recebedor = recebedor;
      }

      await shipmentsService.updateStatus(shipmentId, data, files.length > 0 ? files : undefined);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas as categorias</option>
              {STATUS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um status</option>
              {filteredStatuses.map((statusCode) => (
                <option key={statusCode.codigo} value={statusCode.codigo}>
                  {statusCode.codigo} - {statusCode.descricao} ({statusCode.categoria})
                </option>
              ))}
            </select>
          </div>

          {/* Observação */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observação
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adicione observações sobre o status..."
            />
          </div>

          {/* Anexos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anexos (opcional)
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {files.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                {files.length} arquivo(s) selecionado(s)
              </p>
            )}
          </div>

          {/* Recebedor Toggle */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showRecebedor}
                onChange={(e) => setShowRecebedor(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Informar dados do recebedor
              </span>
            </label>
          </div>

          {/* Recebedor Fields */}
          {showRecebedor && (
            <div className="border border-gray-200 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-gray-800">Dados do Recebedor</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={recebedor.nome}
                  onChange={(e) => setRecebedor({ ...recebedor, nome: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNPJ/CPF
                </label>
                <input
                  type="text"
                  value={recebedor.cnpj_cpf}
                  onChange={(e) => setRecebedor({ ...recebedor, cnpj_cpf: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Somente números"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data/Hora Recebimento
                </label>
                <input
                  type="datetime-local"
                  value={recebedor.data_recebimento}
                  onChange={(e) => setRecebedor({ ...recebedor, data_recebimento: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Atualizar Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
