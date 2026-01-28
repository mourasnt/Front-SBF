// Authentication Types
export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  status: 0 | 1;
  message: string;
  data?: {
    message: string;
    access_key: string;
    expire_at: string;
  } | null;
}

// Actor Types (backend fields are snake/camel mixed, keep optional)
export interface Actor {
  nDoc?: string;
  IE?: string;
  cFiscal?: number;
  xNome?: string;
  xFant?: string;
  xLgr?: string;
  nro?: string;
  xCpl?: string;
  xBairro?: string;
  cMun?: string;
  CEP?: string;
  cPais?: number;
  nFone?: string;
  email?: string;
  UF?: string;
  municipioCodigoIbge?: number;
  municipioNome?: string;
}

// Shipment Invoice Types
export interface ShipmentInvoice {
  id: number;
  access_key?: string;
  cte_chave?: string;
  remetente_ndoc?: string;
}

// Shipment Types
export interface Shipment {
  id: number;
  external_ref?: string;
  service_code?: string;
  total_weight?: number;
  total_value?: number;
  volumes_qty?: number;
  rem?: Actor;
  dest?: Actor;
  recebedor?: Actor;
  toma?: Actor;
  horarios?: {
    et_origem?: string;
    chegada_coleta?: string;
    saida_coleta?: string;
    eta_destino?: string;
    chegada_destino?: string;
    finalizacao?: string;
  };
  origem?: { uf?: string; municipio?: string };
  destino?: { uf?: string; municipio?: string };
  invoices?: ShipmentInvoice[];
  status?: {
    codigo: number | string;
    descricao: string;
    categoria: string;
  };
}

export interface ShipmentListItem extends Shipment {}

// Status Update Types
export interface StatusUpdateRequest {
  status: number | string;
  recebedor?: {
    nome: string;
    cnpj_cpf: string;
    data_recebimento: string;
  };
  observacao?: string;
}

// XML Upload Types
export interface XmlUploadResponse {
  sucesso: boolean;
  chave?: string;
  xmls_b64?: string[];
  resposta_upload?: any;
  mensagem?: string;
}

// Status Code Categories
export type StatusCategory = 'Emissao' | 'Transito' | 'Finalizada' | 'PENDENCIA' | 'Conferencia' | 'Deposito' | 'Geral' | 'PRE-EMISSAO';

export interface StatusCode {
  codigo: number;
  descricao: string;
  categoria: StatusCategory;
}

// API Response Types
export interface ApiResponse<T> {
  status: 0 | 1;
  msg: string;
  dados?: T;
}

export interface ApiError {
  status: 0;
  msg: string;
  erros?: string[];
}
