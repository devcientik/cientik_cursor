import React from 'react';
import { FaEdit, FaTrash, FaListUl } from 'react-icons/fa';

const cursosMock = [
  {
    id: 1,
    imagem: 'https://static.cientikdemo.com/images/thumbs/robotica.jpg',
    titulo: 'Turma de Robótica',
    visibilidade: 'Público',
    categoria: 'Robótica',
    ano: 2023,
    dataCriacao: '17/03/2025',
    restricoes: 'L',
  },
  // ... outros cursos mockados
];

const AdminCursos = () => {
  return (
    <div className="min-h-screen bg-[#181818] text-white p-6">
      <div className="flex flex-col items-center gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-center w-full gap-4">
          <select className="rounded-md px-3 py-2 bg-[#232323] text-white border border-[#333] focus:outline-none w-56">
            <option>Categoria</option>
            <option>Robótica</option>
            <option>Biografia</option>
            <option>Educação</option>
          </select>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full shadow transition text-lg flex items-center gap-2">
            <span className="text-2xl">+</span> Cadastro de Curso
          </button>
          <input type="text" placeholder="Buscar conteúdo" className="rounded-md px-3 py-2 bg-[#232323] text-white border border-[#333] focus:outline-none w-56" />
        </div>
        <h1 className="text-3xl font-bold text-center mt-2">Cursos <span className="text-orange-500">(96)</span> / Episódios <span className="text-orange-500">(381)</span></h1>
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
            {cursosMock.map((curso, idx) => (
              <tr key={curso.id} className={idx % 2 === 0 ? 'bg-[#232323]' : 'bg-[#1a1a1a]'}>
                <td className="p-3"><img src={curso.imagem} alt={curso.titulo} className="w-24 h-14 object-cover rounded shadow" /></td>
                <td className="p-3 font-semibold">{curso.titulo}</td>
                <td className="p-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                  <span className="text-green-300 font-medium">{curso.visibilidade}</span>
                </td>
                <td className="p-3 text-gray-200">{curso.categoria}</td>
                <td className="p-3 text-gray-200">{curso.ano}</td>
                <td className="p-3 text-gray-400">{curso.dataCriacao}</td>
                <td className="p-3">
                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">{curso.restricoes}</span>
                </td>
                <td className="p-3 flex gap-3 items-center">
                  <button className="hover:text-orange-500 transition" title="Editar"><FaEdit size={18} /></button>
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

export default AdminCursos; 