import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaListUl, FaSearch } from 'react-icons/fa';
import CursoWizardModal from '../components/ui/CursoWizardModal';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import turmaCartaz from '../components/images/turma_da_robotica_cartaz.jpeg';

// Função auxiliar para fallback de imagem
function getCartazUrl(imagemSlug) {
  return `https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${imagemSlug}-cartaz.png`;
}

const AdminCursos = () => {
  const [showModal, setShowModal] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    async function fetchCursos() {
      const querySnapshot = await getDocs(collection(db, 'cursos'));
      const lista = [];
      let todasCategorias = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lista.push({ id: doc.id, ...data });
        // Extrair categorias (string separada por vírgula ou array)
        let cat = data.categoria;
        if (Array.isArray(cat)) {
          todasCategorias.push(...cat);
        } else if (typeof cat === 'string') {
          cat.split(',').forEach(c => todasCategorias.push(c.trim()));
        }
      });
      setCursos(lista);
      // Remover duplicatas e ordenar
      const unicas = Array.from(new Set(todasCategorias.filter(Boolean))).sort((a, b) => a.localeCompare(b));
      setCategorias(unicas);
    }
    fetchCursos();
  }, []);

  const handleEditar = (curso) => {
    setCursoSelecionado(curso);
    setShowModal(true);
  };

  // Filtro de cursos por categoria e busca
  const cursosFiltrados = cursos.filter(curso => {
    // Filtro de categoria
    let categoriaOk = true;
    if (categoriaSelecionada) {
      if (Array.isArray(curso.categoria)) {
        categoriaOk = curso.categoria.includes(categoriaSelecionada);
      } else if (typeof curso.categoria === 'string') {
        categoriaOk = curso.categoria.split(',').map(c => c.trim()).includes(categoriaSelecionada);
      } else {
        categoriaOk = false;
      }
    }
    // Filtro de busca (case-insensitive, busca em título, categoria, descrição)
    let buscaOk = true;
    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      const titulo = (curso.titulo || '').toLowerCase();
      const descricao = (curso.descricao || '').toLowerCase();
      const categoriasStr = Array.isArray(curso.categoria)
        ? curso.categoria.join(', ').toLowerCase()
        : (curso.categoria || '').toLowerCase();
      buscaOk = titulo.includes(termo) || descricao.includes(termo) || categoriasStr.includes(termo);
    }
    return categoriaOk && buscaOk;
  });

  // Contagem dinâmica
  const totalCursos = cursosFiltrados.length;
  const totalEpisodios = cursosFiltrados.reduce((acc, curso) => acc + (Array.isArray(curso.episodios) ? curso.episodios.length : 0), 0);

  return (
    <div className="min-h-screen bg-[#181818] text-white p-6">
      <CursoWizardModal open={showModal} onClose={() => { setShowModal(false); setCursoSelecionado(null); }} curso={cursoSelecionado} />
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center w-full gap-4">
          <select
            className="rounded-md px-3 py-2 bg-[#232323] text-white border border-[#333] focus:outline-none w-56"
            value={categoriaSelecionada}
            onChange={e => setCategoriaSelecionada(e.target.value)}
          >
            <option value="">Categoria</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow transition text-lg flex items-center gap-2" onClick={() => { setCursoSelecionado(null); setShowModal(true); }}>
            <span className="text-2xl">+</span> Cadastro de Curso
          </button>
          <div className="relative w-56">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar conteúdo"
              className="rounded-md pl-10 pr-3 py-2 bg-[#232323] text-white border border-[#333] focus:outline-none w-full"
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mt-2">Cursos <span className="text-orange-500">({totalCursos})</span> / Episódios <span className="text-orange-500">({totalEpisodios})</span></h1>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg bg-[#232323]">
        <table className="min-w-full rounded-lg">
          <thead>
            <tr className="text-left text-gray-300 border-b border-[#333] text-sm">
              <th className="p-3 font-semibold">CURSO</th>
              <th className="p-3 font-semibold">TÍTULO DO CURSO</th>
              <th className="p-3 font-semibold">VISIBILIDADE</th>
              <th className="p-3 font-semibold">CATEGORIAS</th>
              <th className="p-3 font-semibold">ANO DE LANÇAMENTO</th>
              <th className="p-3 font-semibold">DATA DE CRIAÇÃO</th>
              <th className="p-3 font-semibold">RESTRIÇÕES</th>
              <th className="p-3 font-semibold">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {cursosFiltrados.map((curso) => (
              <tr key={curso.id} className="border-b border-gray-700 hover:bg-[#222] transition">
                <td className="p-3">
                  {curso.imagens && curso.imagens.cartaz ? (
                    <img src={curso.imagens.cartaz} alt={curso.titulo} className="w-24 h-14 object-cover rounded shadow" />
                  ) : curso.imagemSlug ? (
                    <CartazComFallback imagemSlug={curso.imagemSlug} titulo={curso.titulo} />
                  ) : (
                    <div className="w-24 h-14 bg-gray-800 rounded flex items-center justify-center text-gray-500">-</div>
                  )}
                </td>
                <td className="p-3 font-semibold">{curso.titulo || '-'}</td>
                <td className="p-3 align-middle"><div className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span><span className="text-green-300 font-medium">{curso.visibilidade || '-'}</span></div></td>
                <td className="p-3 text-gray-200 align-middle">{curso.categoria || '-'}</td>
                <td className="p-3 text-gray-200 align-middle">{curso.ano || '-'}</td>
                <td className="p-3 text-gray-400 align-middle">{curso.dataCriacao || '-'}</td>
                <td className="p-3 align-middle"><span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">{curso.restricoes || '-'}</span></td>
                <td className="p-3 flex gap-2">
                  <button className="text-orange-500 hover:text-orange-700" onClick={() => handleEditar(curso)}><FaEdit /></button>
                  <button className="hover:text-red-500 transition" title="Excluir"><FaTrash size={18} /></button>
                  <button className="hover:text-gray-400 transition" title="Episódios"><FaListUl size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function CartazComFallback({ imagemSlug, titulo }) {
  const [src, setSrc] = React.useState(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${imagemSlug}-cartaz.png`);
  const [tentativas, setTentativas] = React.useState(0);

  function handleError() {
    if (tentativas === 0) {
      setSrc(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${imagemSlug}-cartaz.jpg`);
      setTentativas(1);
    } else if (tentativas === 1) {
      setSrc(`https://cientik-cursos-imagens.s3.sa-east-1.amazonaws.com/${imagemSlug}-cartaz.jpeg`);
      setTentativas(2);
    } else {
      setSrc(''); // Não encontrou nenhuma
    }
  }

  if (!src) {
    return <div className="w-24 h-14 bg-gray-800 rounded flex items-center justify-center text-gray-500">-</div>;
  }

  return (
    <img
      src={src}
      alt={titulo}
      className="w-24 h-14 object-cover rounded shadow"
      onError={handleError}
    />
  );
}

export default AdminCursos; 