const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin/firestore');

// Inicializa o Firebase Admin
const serviceAccount = require(path.resolve(__dirname, '../firebase-admin.json'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Carrega o CSV
const csvPath = path.resolve(__dirname, 'cursos.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const cursos = parse(csvContent, { columns: true, skip_empty_lines: true });

// Carrega o JSON das imagens
const imagens = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../imagens_s3.json'), 'utf8'));

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w.-]+/g, '-') // Troca tudo que não for letra, número, hífen ou ponto por hífen
    .replace(/-+/g, '-') // Reduz múltiplos hífens para um só
    .replace(/^-+|-+$/g, '') // Remove hífens do início/fim
    .toLowerCase();
}

function encontrarImagem(titulo, tipo, slugManual) {
  if (slugManual) {
    let img = imagens.find(img =>
      normalizarTexto(img.nomeS3).includes(normalizarTexto(slugManual)) &&
      (!tipo || img.tipo === tipo)
    );
    if (img) {
      console.log('Buscando imagem (slug manual):', slugManual, tipo, img.url);
      return img.url;
    }
  }
  const slug = normalizarTexto(titulo);
  let img = imagens.find(img =>
    normalizarTexto(img.nomeS3).includes(slug) &&
    (!tipo || img.tipo === tipo)
  );
  if (!img) {
    const palavras = slug.split(/\s+/).filter(Boolean);
    img = imagens.find(img =>
      palavras.every(palavra => normalizarTexto(img.nomeS3).includes(palavra)) &&
      (!tipo || img.tipo === tipo)
    );
  }
  console.log('Buscando imagem:', slug, tipo, img ? img.url : 'NÃO ENCONTRADO');
  return img ? img.url : '';
}

function parseDataParaTimestamp(dataStr) {
  if (!dataStr) return null;
  const d = new Date(dataStr.trim());
  return isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
}

function gerarImagemSlug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais, mas mantém hífen e espaço
    .replace(/\s+/g, '-') // Troca espaços por hífen
    .replace(/-cartaz|-thumb/gi, '') // Remove sufixos cartaz/thumb
    .replace(/\.(jpg|jpeg|png)$/i, '') // Remove extensão
    .replace(/-+/g, '-') // Reduz múltiplos hífens
    .replace(/^-+|-+$/g, '') // Remove hífens do início/fim
    .toLowerCase();
}

async function importar() {
  for (const curso of cursos) {
    console.log('Importando curso:', curso);
    // Ajuste os campos conforme o seu CSV
    const titulo = curso['Título do conteúdo'] || '';
    const categoria = curso['Categorias'] || '';
    const ano = curso['Ano de Lançamento'] || '';
    const faixa = curso['Faixa Etária'] || '';
    const descricao = curso['Descrição'] || '';
    const clientes = curso['Clientes'] ? curso['Clientes'].split(',').map(c => c.trim()) : [];
    const inscricao = (curso['Pode Haver Inscrição'] || '').toLowerCase() === 'sim';
    const visibilidade = (curso['Mostar Curso na Home'] || '').toLowerCase() === 'sim' ? 'Público' : 'Privado';
    const classificacaoAno = curso['Classificação Ano'] || '';
    let dataDe = null;
    let dataAte = null;
    if (curso['Período de destaque']) {
      const partes = curso['Período de destaque'].split(/\s*[-\/]\s*/);
      dataDe = parseDataParaTimestamp(partes[0]);
      dataAte = parseDataParaTimestamp(partes[1]);
    }
    if (!dataDe) {
      const hoje = new Date();
      dataDe = Timestamp.fromDate(hoje);
    }
    if (!dataAte) {
      const daquiUmAno = new Date();
      daquiUmAno.setDate(daquiUmAno.getDate() + 365);
      dataAte = Timestamp.fromDate(daquiUmAno);
    }
    const slugManual = curso['slugImagem'] || '';
    const cartaz = encontrarImagem(titulo, 'cartaz', slugManual);
    const thumb = encontrarImagem(titulo, 'thumb', slugManual);
    const imagemSlug = gerarImagemSlug(titulo);

    const doc = {
      titulo,
      categoria,
      ano,
      faixa,
      descricao,
      clientes,
      inscricao,
      visibilidade,
      classificacaoAno,
      dataDe,
      dataAte,
      imagens: {
        cartaz,
        thumb
      },
      trailer: {
        video: '',
        cartaz: cartaz
      },
      tipo: '', // único ou serie, preencher depois
      imagemSlug,
      // episódios: [] (adicionar depois)
    };

    // Salva no Firestore
    await db.collection('cursos').add(doc);
    console.log(`Curso importado: ${titulo}`);
  }
  console.log('Importação finalizada!');
  process.exit(0);
}

importar().catch(err => {
  console.error('Erro na importação:', err);
  process.exit(1);
}); 