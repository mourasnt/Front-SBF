// Types for Centauro Integration
// Based on the Centauro API schema

export interface CentauroStateInfo {
  cod?: string;
  uf?: string;
}

export interface CentauroCityInfo {
  cod?: string;
  municipio?: string;
}

export interface CentauroShipmentStatus {
  code: string;
  message?: string;
  type?: string;
}

export interface CentauroInvoice {
  key: string;
  status: CentauroShipmentStatus;
}

export interface CentauroClientCte {
  id: string;
  access_key: string;
  invoices?: CentauroInvoice[];
  tracking_events?: CentauroTrackingEvent[];
}

export interface CentauroSubcontractedCte {
  id: string;
  access_key: string;
  carrier_name?: string;
  carrier_cnpj?: string;
}

export interface CentauroTrackingEvent {
  id: string;
  code: string;
  message: string;
  created_at: string;
  invoice_key?: string;
}

export interface CentauroShipment {
  id: string;
  external_id?: string;
  client_id?: string;
  origin_state?: CentauroStateInfo;
  origin_city?: CentauroCityInfo;
  destination_state?: CentauroStateInfo;
  destination_city?: CentauroCityInfo;
  status: CentauroShipmentStatus;
  client_ctes?: CentauroClientCte[];
  subcontracted_ctes?: CentauroSubcontractedCte[];
  created_at?: string;
  updated_at?: string;
}

export interface CentauroShipmentListItem extends CentauroShipment {}

// Status Update Request for Centauro
export interface CentauroStatusUpdateRequest {
  code: string;
  invoice_keys?: string[];
}

// Centauro Status Codes
export const CENTAURO_STATUS_CODES: Record<string, { message: string; type: string }> = {
  "1": { message: "ENTREGA REALIZADA", type: "Finalizada" },
  "3": { message: "ATRASO NA TRANSFERENCIA", type: "Transito" },
  "4": { message: "ATRASO NA TRANSPORTADORA", type: "Transito" },
  "5": { message: "AVARIA TOTAL", type: "Finalizada" },
  "6": { message: "ENDERECO INCORRETO", type: "PENDENCIA" },
  "7": { message: "CLIENTE DESTINO EM GREVE", type: "PENDENCIA" },
  "8": { message: "FERIADO LOCAL", type: "PENDENCIA" },
  "9": { message: "MERCADORIA EM DESACORDO COM O PEDIDO COMPRA", type: "Transito" },
  "10": { message: "ARQUIVO RECEBIDO", type: "Emissao" },
  "11": { message: "COLETA REALIZADA", type: "Transito" },
  "12": { message: "CLIENTE DEVERA RETIRAR PEDIDO EM AGENCIA DOS CORREIOS", type: "PENDENCIA" },
  "13": { message: "PEDIDO FORA DA ABRANGENCIA", type: "PENDENCIA" },
  "14": { message: "CLIENTE FALECEU", type: "PENDENCIA" },
  "16": { message: "DESTINATARIO AUSENTE", type: "PENDENCIA" },
  "17": { message: "RECEBIDO NO CD DA TRANSPORTADORA", type: "Transito" },
  "18": { message: "MERCADORIAS TROCADAS", type: "PENDENCIA" },
  "20": { message: "DESTINATARIO DESCONHECIDO", type: "PENDENCIA" },
  "23": { message: "EM DEVOLUCAO", type: "Transito" },
  "24": { message: "MERCADORIA REENTREGUE AO CLIENTE DESTINO", type: "Finalizada" },
  "25": { message: "EM ROTA DE ENTREGA", type: "Transito" },
  "27": { message: "EMBALAGEM SINISTRADA", type: "Finalizada" },
  "28": { message: "ENTREGA EM TRANSITO ENTRE OS CENTROS DE DISTRIBUICAO", type: "Transito" },
  "30": { message: "ENDERECO INSUFICIENTE", type: "PENDENCIA" },
  "33": { message: "FALTA COM BUSCA/RECONFERENCIA", type: "Conferencia" },
  "34": { message: "ENTREGA CANCELADA PELO REMETENTE", type: "Transito" },
  "48": { message: "ESTABELECIMENTO FECHADO", type: "PENDENCIA" },
  "67": { message: "AGENDAMENTO DE ENTREGA", type: "PENDENCIA" },
  "69": { message: "NOTA FISCAL REMOVIDA", type: "Emissao" },
  "72": { message: "OUTROS TIPOS DE OCORRENCIA", type: "Transito" },
  "74": { message: "FUNCIONARIO NAO AUTORIZADO A RECEBER A MERCADORIA", type: "PENDENCIA" },
  "75": { message: "MERCADORIA EMBARCADA PARA ROTA INDEVIDA", type: "Transito" },
  "76": { message: "ESTRADA/ENTRADA DE ACESSO INTERDITADA", type: "Transito" },
  "80": { message: "EXTRAVIO TOTAL", type: "Finalizada" },
  "82": { message: "RECUSADO PELO CLIENTE FINAL", type: "PENDENCIA" },
  "100": { message: "PEDIDO ENTREGUE PARA A TRANSPORTADORA", type: "Emissao" },
  "103": { message: "SAIDA EFETIVA", type: "Transito" },
  "105": { message: "COMPROVANTE DE ENTREGA - RECEBIDO", type: "Finalizada" },
  "109": { message: "MERCADORIA DEVOLVIDA AO CLIENTE DE ORIGEM", type: "Finalizada" },
  "127": { message: "PERDA DE JANELA DE ENTREGA", type: "PENDENCIA" },
  "131": { message: "MERCADORIA REDESPACHADA (ENTREGUE PARA REDESPACHO)", type: "Transito" },
  "135": { message: "MATERIAL RECUSADO PELO CLIENTE", type: "PENDENCIA" },
  "136": { message: "RETIDA NA SEFAZ", type: "PENDENCIA" },
  "165": { message: "MANIFESTADO", type: "Transito" },
  "170": { message: "ENTREGA REALIZADA PARCIAL", type: "Finalizada" },
  "174": { message: "ENTREGA REALIZADA NO CENTRO DE DISTRIBUICAO", type: "Deposito" },
  "277": { message: "EMBALAGEM EXTRAVIADA", type: "PENDENCIA" },
  "403": { message: "REMESSA REMOVIDA DO MANIFESTO", type: "Emissao" },
  "422": { message: "CONFERENCIA INICIADA", type: "Conferencia" },
  "423": { message: "CONFERENCIA FINALIZADA", type: "Conferencia" },
  "511": { message: "CARRO NO LOCAL DE ENTREGA", type: "Transito" },
  "667": { message: "FALTA DE VOLUMES", type: "Conferencia" },
  "668": { message: "PEDIDO DUPLICADO", type: "Geral" },
  "669": { message: "ALTO ESTOQUE/AUSÊNCIA OTB/QUEDA DE AGENDA", type: "Conferencia" },
  "670": { message: "DIVERGÊNCIA ALÍQUOTA IMPOSTO/ SUFRAMA", type: "PRE-EMISSAO" },
  "671": { message: "DIVERGÊNCIA DE CADASTRO (ENDEREÇO/CNPJ)", type: "PRE-EMISSAO" },
  "672": { message: "VOLUME AVARIADO/VIOLADO", type: "Conferencia" },
  "673": { message: "ANTECIPACAO DE FATURAMENTO", type: "Geral" },
  "674": { message: "CTE EMITIDO", type: "Emissao" },
  "675": { message: "FORA DE ROTA", type: "Transito" },
  "676": { message: "CHEGADA NA FILIAL DE DESTINO", type: "Transito" },
  "677": { message: "REENTREGA AUTORIZADA PELO CLIENTE", type: "PENDENCIA" },
};

export function getCentauroStatusInfo(code: string): { message: string; type: string } {
  return CENTAURO_STATUS_CODES[code] || { message: 'Status Desconhecido', type: 'Geral' };
}

export function getCentauroStatusCategories(): string[] {
  const categories = new Set<string>();
  Object.values(CENTAURO_STATUS_CODES).forEach(status => {
    categories.add(status.type);
  });
  return Array.from(categories).sort();
}
