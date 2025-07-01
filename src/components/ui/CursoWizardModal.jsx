import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaTrash, FaEdit, FaGripVertical } from 'react-icons/fa';
import { db } from '../../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

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

const getEtapas = (videoUnico) =>
  videoUnico
    ? [
        'Dados do Curso',
        'Imagens e Trailer',
        'Vídeo',
        'Material Complementar',
      ]
    : [
        'Dados do Curso',
        'Imagens e Trailer',
        'Temporadas',
        'Episódios',
        'Material Complementar',
      ];

const CursoWizardModal = ({ open, onClose, curso }) => {
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
    liberadoPara: 'Todos',
  });
  const [temporadas, setTemporadas] = useState(["Temporada 01"]);
  const [videoUnico, setVideoUnico] = useState(false);
  const [episodiosPorTemporada, setEpisodiosPorTemporada] = useState({ "Temporada 01": [] });
  const [temporadaSelecionada, setTemporadaSelecionada] = useState("Temporada 01");
  const [editandoEpisodio, setEditandoEpisodio] = useState({ temporada: null, indice: null });
  const [episodioDraft, setEpisodioDraft] = useState({ titulo: '', descricao: '', thumbnail: null, video: null });
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [materiaisUnico, setMateriaisUnico] = useState([]);
  const [materiaisPorEpisodio, setMateriaisPorEpisodio] = useState({});
  const [editandoMaterial, setEditandoMaterial] = useState({ modo: null, idx: null, temporada: null, episodio: null });
  const [materialDraft, setMaterialDraft] = useState({ nome: '', arquivo: null, publico: 'todos' });
  const [episodioSelecionado, setEpisodioSelecionado] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [cartazPreview, setCartazPreview] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [thumbSrc, setThumbSrc] = useState(null);
  const [thumbTentativas, setThumbTentativas] = useState(0);

  useEffect(() => {
    if (open) {
      setStep(0);
    }
  }, [open]);

  useEffect(() => {
    if (curso && open) {
      setForm({
        inscricao: !!curso.inscricao,
        titulo: curso.titulo || '',
        ano: curso.ano || '',
        descricao: curso.descricao || '',
        categorias: Array.isArray(curso.categoria) ? curso.categoria : (curso.categoria ? curso.categoria.split(',').map(c => c.trim()) : []),
        dataDe: curso.dataDe || '',
        dataAte: curso.dataAte || '',
        clientes: Array.isArray(curso.clientes) ? curso.clientes : (curso.clientes ? curso.clientes.split(',').map(c => c.trim()) : []),
        faixa: curso.faixa || '',
        liberadoPara: curso.liberadoPara || 'Todos',
      });
      // Temporadas e episódios (se existirem)
      if (curso.temporadas) setTemporadas([...curso.temporadas]);
      if (curso.episodiosPorTemporada) setEpisodiosPorTemporada({ ...curso.episodiosPorTemporada });
      if (curso.materiaisUnico) setMateriaisUnico([...curso.materiaisUnico]);
      if (curso.materiaisPorEpisodio) setMateriaisPorEpisodio({ ...curso.materiaisPorEpisodio });
      if (curso.faixa) setForm(f => ({ ...f, faixa: curso.faixa }));
      if (curso.videoUnico !== undefined) setVideoUnico(!!curso.videoUnico);
    } else if (open && !curso) {
      // Limpar formulário ao abrir para novo curso
      setForm({
        inscricao: false,
        titulo: '',
        ano: '',
        descricao: '',
        categorias: [],
        dataDe: '',
        dataAte: '',
        clientes: [],
        faixa: '',
        liberadoPara: 'Todos',
      });
      setTemporadas(["Temporada 01"]);
      setEpisodiosPorTemporada({ "Temporada 01": [] });
      setMateriaisUnico([]);
      setMateriaisPorEpisodio({});
      setVideoUnico(false);
    }
  }, [curso, open]);

  useEffect(() => {
    if (!open) return;
    async function fetchCategorias() {
      const querySnapshot = await getDocs(collection(db, 'cursos'));
      const todasCategorias = [];
      querySnapshot.forEach((doc) => {
        const cat = doc.data().categoria;
        if (Array.isArray(cat)) {
          todasCategorias.push(...cat);
        } else if (typeof cat === 'string') {
          cat.split(',').forEach(c => todasCategorias.push(c.trim()));
        }
      });
      // Remover duplicatas e ordenar
      const unicas = Array.from(new Set(todasCategorias.filter(Boolean))).sort((a, b) => a.localeCompare(b));
      setCategorias(unicas);
    }
    fetchCategorias();
  }, [open]);

  useEffect(() => {
    if (curso && open && step === 1) {
      // Cartaz
      if (curso.imagens && curso.imagens.cartaz) {
        setCartazPreview(curso.imagens.cartaz);
      } else if (curso.imagemSlug) {
        setCartazPreview(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${curso.imagemSlug}-cartaz.png`);
      } else {
        setCartazPreview(null);
      }
      // Thumb (corrigido: só busca -thumb)
      if (curso.imagens && curso.imagens.thumb) {
        setThumbPreview(curso.imagens.thumb);
        setThumbSrc(curso.imagens.thumb);
        setThumbTentativas(0);
      } else if (curso.imagemSlug) {
        setThumbPreview(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${curso.imagemSlug}-thumb.png`);
        setThumbSrc(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${curso.imagemSlug}-thumb.png`);
        setThumbTentativas(0);
      } else {
        setThumbPreview(null);
        setThumbSrc(null);
        setThumbTentativas(0);
      }
    } else if (open && step === 1 && !curso) {
      setCartazPreview(null);
      setThumbPreview(null);
      setThumbSrc(null);
      setThumbTentativas(0);
    }
  }, [curso, open, step]);

  if (!open) return null;

  // Funções auxiliares
  const handleInput = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCheckbox = e => setForm({ ...form, inscricao: e.target.checked });
  const handleCategoria = cat => setForm({ ...form, categorias: form.categorias.includes(cat) ? form.categorias.filter(c => c !== cat) : [...form.categorias, cat] });
  const handleCliente = cli => setForm({ ...form, clientes: form.clientes.includes(cli) ? form.clientes.filter(c => c !== cli) : [...form.clientes, cli] });
  const handleFaixa = f => setForm({ ...form, faixa: f });

  // Validação simples para o botão Próximo
  const podeAvancar = form.titulo && form.ano && form.descricao && form.categorias.length && form.faixa;

  // Função para adicionar episódio
  const handleAddEpisodio = () => {
    const novaLista = episodiosPorTemporada[temporadaSelecionada] ? [...episodiosPorTemporada[temporadaSelecionada]] : [];
    novaLista.push({ titulo: '', descricao: '', thumbnail: null, video: null });
    setEpisodiosPorTemporada({ ...episodiosPorTemporada, [temporadaSelecionada]: novaLista });
    setEditandoEpisodio({ temporada: temporadaSelecionada, indice: novaLista.length - 1 });
    setEpisodioDraft({ titulo: '', descricao: '', thumbnail: null, video: null });
  };

  // Função para editar episódio
  const handleEditEpisodio = (idx) => {
    const ep = episodiosPorTemporada[temporadaSelecionada][idx];
    setEditandoEpisodio({ temporada: temporadaSelecionada, indice: idx });
    setEpisodioDraft({ ...ep, video: ep.video || null });
  };

  // Função para salvar edição
  const handleSaveEpisodio = () => {
    const novaLista = [...episodiosPorTemporada[editandoEpisodio.temporada]];
    novaLista[editandoEpisodio.indice] = { ...episodioDraft };
    setEpisodiosPorTemporada({ ...episodiosPorTemporada, [editandoEpisodio.temporada]: novaLista });
    setEditandoEpisodio({ temporada: null, indice: null });
    setEpisodioDraft({ titulo: '', descricao: '', thumbnail: null, video: null });
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditandoEpisodio({ temporada: null, indice: null });
    setEpisodioDraft({ titulo: '', descricao: '', thumbnail: null, video: null });
  };

  // Função para drag-and-drop
  const handleDragStart = (idx) => { dragItem.current = idx; };
  const handleDragEnter = (idx) => { dragOverItem.current = idx; };
  const handleDrop = () => {
    const lista = [...episodiosPorTemporada[temporadaSelecionada]];
    const dragged = lista[dragItem.current];
    lista.splice(dragItem.current, 1);
    lista.splice(dragOverItem.current, 0, dragged);
    setEpisodiosPorTemporada({ ...episodiosPorTemporada, [temporadaSelecionada]: lista });
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Funções para Material Complementar
  const handleAddMaterial = () => {
    setEditandoMaterial(videoUnico
      ? { modo: 'add', idx: null }
      : { modo: 'add', idx: null, temporada: temporadaSelecionada, episodio: episodioSelecionado });
    setMaterialDraft({ nome: '', arquivo: null, publico: 'todos' });
  };
  const handleEditMaterial = (idx, temporada, episodio) => {
    let mat;
    if (videoUnico) {
      mat = materiaisUnico[idx];
      setEditandoMaterial({ modo: 'edit', idx });
    } else {
      mat = (materiaisPorEpisodio[temporada]?.[episodio] || [])[idx];
      setEditandoMaterial({ modo: 'edit', idx, temporada, episodio });
    }
    setMaterialDraft({ ...mat });
  };
  const handleSaveMaterial = () => {
    if (videoUnico) {
      let novaLista = [...materiaisUnico];
      if (editandoMaterial.modo === 'add') novaLista.push({ ...materialDraft });
      else novaLista[editandoMaterial.idx] = { ...materialDraft };
      setMateriaisUnico(novaLista);
    } else {
      const t = editandoMaterial.temporada;
      const e = editandoMaterial.episodio;
      let porEp = { ...materiaisPorEpisodio };
      if (!porEp[t]) porEp[t] = {};
      if (!porEp[t][e]) porEp[t][e] = [];
      if (editandoMaterial.modo === 'add') porEp[t][e].push({ ...materialDraft });
      else porEp[t][e][editandoMaterial.idx] = { ...materialDraft };
      setMateriaisPorEpisodio(porEp);
    }
    setEditandoMaterial({ modo: null, idx: null, temporada: null, episodio: null });
    setMaterialDraft({ nome: '', arquivo: null, publico: 'todos' });
  };
  const handleDeleteMaterial = (idx, temporada, episodio) => {
    if (videoUnico) {
      let novaLista = [...materiaisUnico];
      novaLista.splice(idx, 1);
      setMateriaisUnico(novaLista);
    } else {
      let porEp = { ...materiaisPorEpisodio };
      porEp[temporada][episodio].splice(idx, 1);
      setMateriaisPorEpisodio(porEp);
    }
  };
  const handleCancelMaterial = () => {
    setEditandoMaterial({ modo: null, idx: null, temporada: null, episodio: null });
    setMaterialDraft({ nome: '', arquivo: null, publico: 'todos' });
  };

  // Função mock para finalizar cadastro
  const handleFinalizarCadastro = () => {
    setShowConfirm(false);
    // TODO: Substituir por ação real de cadastro
    console.log('Cadastro finalizado!');
    onClose && onClose();
  };

  // Funções para upload/troca de imagem
  function handleCartazChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Formato inválido. Use JPG ou PNG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Tamanho máximo: 2MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setCartazPreview(url);
    // TODO: salvar file/cartaz para upload posterior
  }

  function handleThumbError() {
    if (!curso || !curso.imagemSlug) return;
    if (thumbTentativas === 0) {
      setThumbSrc(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${curso.imagemSlug}-thumb.jpg`);
      setThumbTentativas(1);
    } else if (thumbTentativas === 1) {
      setThumbSrc(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${curso.imagemSlug}-thumb.jpeg`);
      setThumbTentativas(2);
    } else {
      setThumbSrc(null);
    }
  }

  function handleThumbChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Formato inválido. Use JPG ou PNG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Tamanho máximo: 2MB');
      return;
    }
    const url = URL.createObjectURL(file);
    setThumbPreview(url);
    setThumbSrc(url);
    // TODO: salvar file/thumb para upload posterior
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="w-full max-w-3xl bg-[#181818] rounded-2xl shadow-2xl p-0 relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">{curso ? curso.titulo : 'Novo Curso'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-orange-500 text-2xl"><FaTimes /></button>
        </div>
        {/* Etapas */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
          {getEtapas(videoUnico).map((etapa, idx) => (
            <div key={etapa} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step === idx ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-600 bg-[#232323] text-gray-400'} font-bold mb-1`}>{idx + 1}</div>
              <span className={`text-xs min-h-[32px] flex items-center justify-center ${step === idx ? 'text-orange-500 font-semibold' : 'text-gray-400'}`}>{etapa}</span>
            </div>
          ))}
        </div>
        {/* Conteúdo da etapa 1 */}
        {step === 0 && (
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
                {categorias.map(cat => (
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
                  <button
                    type="button"
                    key={f.label}
                    onClick={() => handleFaixa(f.label)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition
                      ${form.faixa === f.label
                        ? 'border-4 border-orange-500 scale-125 shadow-lg shadow-orange-500/40 font-extrabold text-white z-10'
                        : 'border-transparent font-bold opacity-80'}
                      ${f.cor}
                    `}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-white font-semibold">Conteúdo liberado para:</label>
              <select
                name="liberadoPara"
                value={form.liberadoPara}
                onChange={handleInput}
                className="rounded-md px-3 py-2 bg-[#181818] text-white border border-[#333] focus:outline-none ml-2 w-full"
              >
                <option>Todos</option>
                <option>Estudantes</option>
                <option>Professores</option>
              </select>
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" className={`px-8 py-2 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition disabled:opacity-50`} disabled={!podeAvancar} onClick={() => setStep(step + 1)}>
                Próximo
              </button>
            </div>
          </form>
        )}
        {/* Etapa 2: Imagens e Trailer */}
        {step === 1 && (
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Imagens do Curso</h3>
            <div className="flex flex-col md:flex-row gap-6 justify-center mb-10">
              {/* Thumbnail */}
              <div className="flex-1 bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col items-center min-w-[220px]">
                <span className="text-orange-500 font-bold mb-2">Thumbnail</span>
                <span className="text-gray-400 text-xs mb-1">1050 x 1500 px</span>
                <span className="text-gray-400 text-xs mb-2">Formatos: JPG ou PNG</span>
                <label className="w-32 h-44 bg-[#181818] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 transition mb-2 cursor-pointer overflow-hidden">
                  {thumbSrc ? (
                    <img key={thumbSrc} src={thumbSrc} alt="Thumbnail" className="w-full h-full object-cover" onError={handleThumbError} />
                  ) : (
                    <span>Clique para adicionar</span>
                  )}
                  <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleThumbChange} />
                </label>
              </div>
              {/* Cartaz */}
              <div className="flex-1 bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col items-center min-w-[220px]">
                <span className="text-orange-500 font-bold mb-2">Cartaz</span>
                <span className="text-gray-400 text-xs mb-1">1920 x 1080 px</span>
                <span className="text-gray-400 text-xs mb-2">Formatos: JPG ou PNG</span>
                <label className="w-44 h-28 bg-[#181818] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 transition mb-2 cursor-pointer overflow-hidden">
                  {cartazPreview ? (
                    <img src={cartazPreview} alt="Cartaz" className="w-full h-full object-cover" />
                  ) : (
                    <span>Clique para adicionar</span>
                  )}
                  <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleCartazChange} />
                </label>
              </div>
            </div>
            <h3 className="text-white text-xl font-bold mb-6 text-center">Trailer</h3>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              {/* Vídeo */}
              <div className="flex-1 bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col items-center min-w-[220px]">
                <span className="text-orange-500 font-bold mb-2">Vídeo</span>
                <span className="text-gray-400 text-xs mb-2">Formatos: .mp4 ou .mov</span>
                <button className="w-44 h-28 bg-[#181818] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 transition mb-2">
                  <span>Clique para adicionar</span>
                </button>
              </div>
              {/* Imagem do Trailer */}
              <div className="flex-1 bg-[#232323] rounded-xl shadow-lg p-6 flex flex-col items-center min-w-[220px]">
                <span className="text-orange-500 font-bold mb-2">Cartaz</span>
                <span className="text-gray-400 text-xs mb-1">270 x 153 px</span>
                <span className="text-gray-400 text-xs mb-2">Formatos: JPG ou PNG</span>
                <button className="w-44 h-28 bg-[#181818] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 transition mb-2">
                  <span>Clique para adicionar</span>
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-8">
              <button type="button" className="px-8 py-2 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition" onClick={() => setStep(step - 1)}>
                Anterior
              </button>
              <button type="button" className="px-8 py-2 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition" onClick={() => setStep(step + 1)}>
                Próximo
              </button>
            </div>
          </div>
        )}
        {/* Etapa 3: Temporadas ou Vídeo Único */}
        {step === 2 && (
          videoUnico ? (
            // Formulário do vídeo único
            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              <h3 className="text-white text-xl font-bold mb-6 text-center">Vídeo</h3>
              <div className="flex justify-center mb-8">
                <label className="flex items-center gap-2 text-white font-medium select-none">
                  <input
                    type="checkbox"
                    checked={videoUnico}
                    onChange={e => setVideoUnico(e.target.checked)}
                    className="accent-orange-500 w-5 h-5"
                  />
                  Este curso é de vídeo único
                </label>
              </div>
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-xl bg-[#232323] rounded-lg shadow p-6 flex flex-col gap-4 items-center">
                  <span className="text-orange-500 font-bold mb-2">Vídeo do Curso</span>
                  <div className="w-full max-w-md flex flex-col items-center">
                    <span className="text-white font-semibold">Legendas</span>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="checkbox" className="accent-orange-500 w-5 h-5" />
                      <span className="text-gray-300">Carregar legendas automaticamente</span>
                      <button className="ml-4 px-4 py-1 rounded bg-[#181818] border border-gray-600 text-white hover:border-orange-500 transition">Upload (.srt, .vtt, .ass)</button>
                    </div>
                  </div>
                  <div className="w-full max-w-md flex flex-col items-center">
                    <span className="text-white font-semibold">Upload do Vídeo</span>
                    <button className="w-full h-20 bg-[#181818] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center text-gray-500 hover:border-orange-500 transition mt-2">
                      <span>Clique para adicionar vídeo</span>
                    </button>
                    {/* Mock do thumbnail após upload */}
                    <div className="mt-2 flex flex-col items-center gap-2 w-full">
                      <div className="w-20 h-12 bg-gray-700 rounded"></div>
                      <button className="text-orange-500 hover:underline">Alterar vídeo</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-8">
                <button type="button" className="px-8 py-2 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition" onClick={() => setStep(step - 1)}>
                  Anterior
                </button>
                <button type="button" className="px-8 py-2 rounded-full font-bold text-white bg-orange-500 hover:bg-orange-600 transition" onClick={() => setStep(step + 1)}>
                  Próximo
                </button>
              </div>
            </div>
          ) : (
            // Temporadas
            <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
              <h3 className="text-white text-xl font-bold mb-6 text-center">Temporadas</h3>
              <div className="flex justify-center mb-8">
                <label className="flex items-center gap-2 text-white font-medium select-none">
                  <input
                    type="checkbox"
                    checked={videoUnico}
                    onChange={e => setVideoUnico(e.target.checked)}
                    className="accent-orange-500 w-5 h-5"
                  />
                  Este curso é de vídeo único
                </label>
              </div>
              <div className="flex justify-center mb-8">
                <button
                  type="button"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow transition text-lg flex items-center gap-2"
                  onClick={() => setTemporadas(prev => [...prev, `Temporada ${String(prev.length + 1).padStart(2, '0')}`])}
                >
                  + Temporada
                </button>
              </div>
              <div className="flex justify-center">
                <select
                  value={temporadaSelecionada}
                  onChange={(e) => setTemporadaSelecionada(e.target.value)}
                  className="rounded-md px-3 py-2 bg-[#181818] text-white border border-[#333] focus:outline-none ml-2 w-full"
                >
                  {temporadas.map((temporada) => (
                    <option key={temporada} value={temporada}>
                      {temporada}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )
        )}
        {/* Etapa 4: Material Complementar */}
        {step === 3 && (
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
            <h3 className="text-white text-xl font-bold mb-6 text-center">Material Complementar</h3>
            {/* Rest of the component */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CursoWizardModal;