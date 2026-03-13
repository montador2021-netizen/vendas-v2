import React, { useState, useEffect } from 'react';
import { Plus, Wallet, TrendingUp, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { Venda, Meta } from './tipos';
import { PERCENTUAL_COMISSAO, STORAGE_KEY_VENDAS, STORAGE_KEY_METAS } from './constants';

function App() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [meta, setMeta] = useState<Meta>({ valor: 5000, periodo: 'Março 2024' });
  const [cliente, setCliente] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    const savedVendas = localStorage.getItem(STORAGE_KEY_VENDAS);
    const savedMeta = localStorage.getItem(STORAGE_KEY_METAS);
    if (savedVendas) setVendas(JSON.parse(savedVendas));
    if (savedMeta) setMeta(JSON.parse(savedMeta));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VENDAS, JSON.stringify(vendas));
    localStorage.setItem(STORAGE_KEY_METAS, JSON.stringify(meta));
  }, [vendas, meta]);

  const adicionarVenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !valor) return;

    const novaVenda: Venda = {
      id: crypto.randomUUID(),
      data: new Date().toLocaleDateString('pt-BR'),
      cliente,
      valor: parseFloat(valor),
      comissao: parseFloat(valor) * PERCENTUAL_COMISSAO,
      status: 'pendente'
    };

    setVendas([novaVenda, ...vendas]);
    setCliente('');
    setValor('');
  };

  const alternarStatus = (id: string) => {
    setVendas(vendas.map(v => 
      v.id === id ? { ...v, status: v.status === 'pendente' ? 'pago' : 'pendente' } : v
    ));
  };

  const excluirVenda = (id: string) => {
    setVendas(vendas.filter(v => v.id !== id));
  };

  const totalVendas = vendas.reduce((acc, v) => acc + v.valor, 0);
  const totalComissao = vendas.reduce((acc, v) => acc + v.comissao, 0);
  const comissaoPaga = vendas.filter(v => v.status === 'pago').reduce((acc, v) => acc + v.comissao, 0);
  const progressoMeta = (totalVendas / meta.valor) * 100;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">V&C Hub</h1>
            <p className="text-slate-500">Gestão de Vendas e Comissões</p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <Wallet className="text-emerald-600" size={24} />
            <div>
              <p className="text-xs text-emerald-600 font-medium uppercase">Comissão Total</p>
              <p className="text-xl font-bold text-emerald-700">R$ {totalComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus size={20} className="text-blue-600" /> Nova Venda
              </h2>
              <form onSubmit={adicionarVenda} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nome do Cliente"
                  className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Valor da Venda (R$)"
                  className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition-colors">
                  Registrar Venda
                </button>
              </form>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold">Histórico de Vendas</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Data</th>
                      <th className="px-6 py-4 font-medium">Cliente</th>
                      <th className="px-6 py-4 font-medium">Valor</th>
                      <th className="px-6 py-4 font-medium">Comissão</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {vendas.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600">{v.data}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{v.cliente}</td>
                        <td className="px-6 py-4 text-slate-700 font-medium">R$ {v.valor.toFixed(2)}</td>
                        <td className="px-6 py-4 text-emerald-600 font-bold">R$ {v.comissao.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => alternarStatus(v.id)}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              v.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {v.status === 'pago' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {v.status}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => excluirVenda(v.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" /> Meta Mensal
                </h2>
                <span className="text-sm text-slate-500">{meta.periodo}</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Progresso</span>
                  <span className="text-blue-600 font-bold">{progressoMeta.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(progressoMeta, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Vendido</p>
                    <p className="text-lg font-bold text-slate-900">R$ {totalVendas.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold">Meta</p>
                    <p className="text-lg font-bold text-slate-900">R$ {meta.valor.toLocaleString('pt-BR')}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
              <h2 className="text-lg font-semibold mb-4">Resumo Financeiro</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-3">
                  <span className="text-blue-100">Comissão Pendente</span>
                  <span className="text-xl font-bold">R$ {(totalComissao - comissaoPaga).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-blue-100">Comissão Recebida</span>
                  <span className="text-xl font-bold">R$ {comissaoPaga.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
