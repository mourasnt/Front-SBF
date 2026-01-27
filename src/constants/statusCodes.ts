import type { StatusCode } from '../types';

export const STATUS_CODES: StatusCode[] = [
  // Emissao
  { codigo: 10, descricao: 'MINUTA EMITIDA', categoria: 'Emissao' },
  { codigo: 69, descricao: 'MINUTA NÃO EMITIDA', categoria: 'Emissao' },
  { codigo: 100, descricao: 'AGUARDANDO COLETA', categoria: 'Emissao' },
  { codigo: 403, descricao: 'COLETA NÃO REALIZADA', categoria: 'Emissao' },
  { codigo: 674, descricao: 'CHEGADA NA ORIGEM', categoria: 'Emissao' },
  
  // Transito
  { codigo: 3, descricao: 'SAÍDA PARA ENTREGA', categoria: 'Transito' },
  { codigo: 4, descricao: 'CHEGADA NO DESTINO', categoria: 'Transito' },
  { codigo: 9, descricao: 'TRANSFERÊNCIA REALIZADA', categoria: 'Transito' },
  { codigo: 11, descricao: 'COLETA REALIZADA', categoria: 'Transito' },
  { codigo: 17, descricao: 'COLETA CONFIRMADA', categoria: 'Transito' },
  { codigo: 23, descricao: 'EM ROTA DE TRANSBORDO', categoria: 'Transito' },
  { codigo: 25, descricao: 'EM ROTA DE ENTREGA', categoria: 'Transito' },
  { codigo: 28, descricao: 'ENTREGA/COLETA AGENDADA', categoria: 'Transito' },
  { codigo: 72, descricao: 'CHEGADA NA FILIAL DESTINO', categoria: 'Transito' },
  { codigo: 75, descricao: 'RETIRADO PELO CLIENTE', categoria: 'Transito' },
  { codigo: 76, descricao: 'ENTREGA INTERNA/REDESPACHO', categoria: 'Transito' },
  { codigo: 103, descricao: 'CARGA EM VIAGEM DESTINO', categoria: 'Transito' },
  { codigo: 131, descricao: 'SAIU PARA ENTREGA INTERNA', categoria: 'Transito' },
  { codigo: 165, descricao: 'SAIU DA FILIAL ORIGEM', categoria: 'Transito' },
  { codigo: 511, descricao: 'EM ROTA DE TRANSBORDO CROSS', categoria: 'Transito' },
  { codigo: 675, descricao: 'CHEGADA NO TRANSBORDO', categoria: 'Transito' },
  { codigo: 676, descricao: 'SAÍDA DO TRANSBORDO', categoria: 'Transito' },
  
  // Finalizada
  { codigo: 1, descricao: 'ENTREGA REALIZADA', categoria: 'Finalizada' },
  { codigo: 5, descricao: 'DEVOLUÇÃO/RETORNO FILIAL ORIGEM', categoria: 'Finalizada' },
  { codigo: 24, descricao: 'SINISTRO', categoria: 'Finalizada' },
  { codigo: 27, descricao: 'DEVOLVIDA/RETORNO', categoria: 'Finalizada' },
  { codigo: 80, descricao: 'ENTREGA REALIZADA AO FAVORECIDO', categoria: 'Finalizada' },
  { codigo: 105, descricao: 'CANCELAMENTO', categoria: 'Finalizada' },
  { codigo: 109, descricao: 'DESTRUÍDA', categoria: 'Finalizada' },
  { codigo: 170, descricao: 'COLETA CANCELADA', categoria: 'Finalizada' },
  { codigo: 174, descricao: 'DEVOLUÇÃO REALIZADA', categoria: 'Finalizada' },
  
  // PENDENCIA
  { codigo: 6, descricao: 'ENTREGA NÃO REALIZADA', categoria: 'PENDENCIA' },
  { codigo: 7, descricao: 'DESTINATÁRIO RECUSOU RECEBER', categoria: 'PENDENCIA' },
  { codigo: 8, descricao: 'AGUARDANDO RETIRADA', categoria: 'PENDENCIA' },
  { codigo: 12, descricao: 'MERCADORIA RETIDA', categoria: 'PENDENCIA' },
  { codigo: 13, descricao: 'AGUARDANDO PAGAMENTO', categoria: 'PENDENCIA' },
  { codigo: 14, descricao: 'DADOS DIVERGENTES', categoria: 'PENDENCIA' },
  { codigo: 16, descricao: 'MERCADORIA ROUBADA', categoria: 'PENDENCIA' },
  { codigo: 18, descricao: 'ROUBO DE CARGA', categoria: 'PENDENCIA' },
  { codigo: 20, descricao: 'EXTRAVIO DE CARGA', categoria: 'PENDENCIA' },
  { codigo: 30, descricao: 'AGUARDANDO LIBERAÇÃO FISCAL', categoria: 'PENDENCIA' },
  { codigo: 48, descricao: 'AGUARDANDO REENTREGA', categoria: 'PENDENCIA' },
  { codigo: 67, descricao: 'DESTINATÁRIO AUSENTE', categoria: 'PENDENCIA' },
  { codigo: 74, descricao: 'ENDEREÇO INCORRETO', categoria: 'PENDENCIA' },
  { codigo: 82, descricao: 'RECUSADO PELO CLIENTE FINAL', categoria: 'PENDENCIA' },
  { codigo: 127, descricao: 'RETORNO A CD', categoria: 'PENDENCIA' },
  { codigo: 135, descricao: 'CLIENTE NÃO LOCALIZADO', categoria: 'PENDENCIA' },
  { codigo: 136, descricao: 'FORA DA ROTA', categoria: 'PENDENCIA' },
  { codigo: 277, descricao: 'REAGENDAMENTO SOLICITADO', categoria: 'PENDENCIA' },
  { codigo: 677, descricao: 'PENDÊNCIA DOCUMENTAÇÃO', categoria: 'PENDENCIA' },
  
  // Conferencia
  { codigo: 33, descricao: 'CONFERENCIA DE CARGA', categoria: 'Conferencia' },
  { codigo: 422, descricao: 'REMETENTE CANCELOU A COLETA', categoria: 'Conferencia' },
  { codigo: 423, descricao: 'CHEGADA NO PARCEIRO CD', categoria: 'Conferencia' },
  { codigo: 667, descricao: 'SEPARAÇÃO DE VOLUMES', categoria: 'Conferencia' },
  { codigo: 669, descricao: 'AGUARDANDO DOCUMENTAÇÃO', categoria: 'Conferencia' },
  { codigo: 672, descricao: 'EXCESSO DE PESO', categoria: 'Conferencia' },
];

export const STATUS_CATEGORIES = [
  'Emissao',
  'Transito',
  'Finalizada',
  'PENDENCIA',
  'Conferencia',
] as const;

export function getStatusByCode(code: number): StatusCode | undefined {
  return STATUS_CODES.find(s => s.codigo === code);
}

export function getStatusesByCategory(category: string): StatusCode[] {
  return STATUS_CODES.filter(s => s.categoria === category);
}
