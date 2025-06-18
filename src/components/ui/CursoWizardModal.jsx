import React, { useState } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';

const etapas = [
  'Dados do Curso',
  'Imagens e Trailer',
  'Temporadas',
  'Episódios',
  'Material Complementar',
];

const categoriasMock = [
  'Cursos Tecnológicos', 'Programação', 'Robótica', 'Educação', 'Biologia', 'Matemática',
];
const clientesMock = [
  'Cidade Desenvolvimento', 'Cidade Staging', 'Cidade 1', 'Mato Grosso', 'Rio Grande do Norte', 'Mato Grosso do Sul', 'Vitória', 'Escola 42', 'Piauí', 'Trinity',
];
const faixasMock = [
  { label: 'L', cor: 'bg-green-500' },
  { label: '10', cor: 'bg-cyan-500' },
  { label: '12', cor: 'bg-yellow-400' },
  { label: '14', cor: 'bg-orange-400' },
  { label: '16', cor: 'bg-red-500' },
  { label: '18', cor: 'bg-black text-white border border-gray-400' },
];

const CursoWizardModal = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    inscricao: false,
    titulo: '',
    ano: '',
    descricao: '',
    categorias: [],
    dataDe: '',
    dataAte: '',
    clientes: [],
    faixa: '',
  });

  if (!open) return null;

  // Funções auxiliares
  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheckbox = e => setForm({ ...form, inscricao: e.target.checked });
  const handleCategoria = cat => setForm({ ...form, categorias: form.categorias.includes(cat) ? form.categorias.filter(c => c !== cat) : [...form.categorias, cat] });
  const handleCliente = cli => setForm({ ...form, clientes: form.clientes.includes(cli) ? form.clientes.filter(c => c !== cli) : [...form.clientes, cli] });
  const handleFaixa = f => setForm({ ...form, faixa: f });

  // Validação simples para o botão Próximo
  const podeAvancar = form.titulo && form.ano && form.descricao && form.categorias.length && form.faixa;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-3xl bg-[#181818] rounded-2xl shadow-2xl p-0 relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Novo Curso</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-orange-500 text-2xl"><FaTimes /></button>
        </div>
        {/* Etapas */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
          {etapas.map((etapa, idx) => (
            <div key={etapa} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step === idx ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-600 bg-[#232323] text-gray-400'} font-bold mb-1`}>{idx + 1}</div>
              <span className={`text-xs min-h-[32px] flex items-center justify-center ${step === idx ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>{etapa}</span>
            </div>
          ))}
        </div>
        {/* Conteúdo da etapa 1 */}
        <form className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="inscricao" checked={form.inscricao} onChange={handleCheckbox} className="accent-orange-500 w-5 h-5" />
            <label htmlFor="inscricao" className="text-white font-medium select-none">Pode haver inscrição</label>
          </div>
          <div className="flex flex-row gap-4 items-end">
            <div className="flex-1 flex flex-col">
              <label className="text-white font-semibold mb-1">Título do conteúdo <span className="text-orange-500">(Obrigatório)</span></label>
              <input name="titulo" maxLength={100} value={form.titulo} onChange={handleInput} className="w-full p-3 h-14 rounded bg-[#232323] text-white border border-gray-700 focus:border-orange-500 outline-none" placeholder="Robótica em Ação" />
              <div className="text-xs text-gray-400 text-right mt-1">{form.titulo.length}/100</div>
            </div>
            <div className="w-48 flex flex-col">
              <label className="text-white font-semibold mb-1">Ano de lançamento <span className="text-orange-500">(Obrigatório)</span></label>
              <input name="ano" value={form.ano} onChange={handleInput} className="w-full p-3 h-14 rounded bg-[#232323] text-white border border-gray-700 focus:border-orange-500 outline-none" placeholder="2023" />
              <div className="text-xs text-gray-400 text-right mt-1 invisible">0/100</div>
            </div>
          </div>
          <div>
            <label className="text-white font-semibold">Descrição <span className="text-orange-500">(Obrigatório)</span></label>
            <textarea name="descricao" value={form.descricao} onChange={handleInput} rows={3} className="w-full mt-1 p-3 rounded bg-[#232323] text-white border border-gray-700 focus:border-orange-500 outline-none resize-none" placeholder="Descreva o curso..." />
          </div>
          <div>
            <label className="text-white font-semibold">Seção | Categoria <span className="text-orange-500">(Obrigatório)</span></label>
            <div className="flex flex-wrap gap-2 mt-1">
              {categoriasMock.map(cat => (
                <button type="button" key={cat} onClick={() => handleCategoria(cat)} className={`px-3 py-1 rounded-full border text-sm ${form.categorias.includes(cat) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#232323] border-gray-600 text-gray-300'} transition`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-white font-semibold">Período que estará no carrossel: Lançamento <span className="text-orange-500">(Obrigatório)</span></label>
              <div className="flex gap-2 mt-1">
                <input name="dataDe" type="datetime-local" value={form.dataDe} onChange={handleInput} className="w-full p-3 rounded bg-[#232323] text-white border border-gray-700 focus:border-orange-500 outline-none" placeholder="De" />
                <input name="dataAte" type="datetime-local" value={form.dataAte} onChange={handleInput} className="w-full p-3 rounded bg-[#232323] text-white border border-gray-700 focus:border-orange-500 outline-none" placeholder="Até" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-white font-semibold">Clientes</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {clientesMock.map(cli => (
                <button type="button" key={cli} onClick={() => handleCliente(cli)} className={`px-3 py-1 rounded-full border text-sm ${form.clientes.includes(cli) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-[#232323] border-gray-600 text-gray-300'} transition`}>
                  {cli}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-white font-semibold">Faixa etária <span className="text-orange-500">(Obrigatório)</span></label>
            <div className="flex gap-2 mt-1 justify-center">
              {faixasMock.map(f => (
                <button type="button" key={f.label} onClick={() => handleFaixa(f.label)} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 ${form.faixa === f.label ? 'border-orange-500 scale-110' : 'border-transparent'} ${f.cor} transition`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" className={`px-8 py-2 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-50`} disabled={!podeAvancar} onClick={() => setStep(step + 1)}>
              Próximo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoWizardModal; 