export interface Venda {
  id: string;
  data: string;
  cliente: string;
  valor: number;
  comissao: number;
  status: 'pendente' | 'pago';
}

export interface Meta {
  valor: number;
  periodo: string;
}
