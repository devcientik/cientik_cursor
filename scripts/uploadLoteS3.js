require('dotenv').config({ path: '.env.local' });
// Salve como uploadLoteS3.js
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const slugify = require('slugify');

// Configurações
const pastaImagens = 'C:\\_trabalho\\Cientik\\Plataforma\\cientik_imagens_cartaz_thumb'; // Caminho da pasta local
const bucketName = 'cientik-cursos-imagens'; // Nome do bucket S3
const region = 'sa-east-1'; // Região do bucket

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region,
});

const s3 = new AWS.S3();

function getTipoFromNome(nome) {
  // Exemplo: robotica-em-acao-cartaz.jpg
  if (nome.toLowerCase().includes('cartaz')) return 'cartaz';
  if (nome.toLowerCase().includes('thumb') || nome.toLowerCase().includes('thumbnail')) return 'thumb';
  // Adicione outros padrões conforme necessário
  return 'outro';
}

async function uploadArquivo(arquivo) {
  const ext = path.extname(arquivo);
  const nomeBase = path.basename(arquivo, ext);
  const tipo = getTipoFromNome(nomeBase);
  const nomePadrao = `${slugify(nomeBase, { lower: true })}${ext}`;
  const filePath = path.join(pastaImagens, arquivo);

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: nomePadrao,
    Body: fileContent,
    ContentType: ext === '.png' ? 'image/png' : 'image/jpeg',
    // ACL: 'public-read', // Removido para compatibilidade com buckets que bloqueiam ACLs
  };

  await s3.putObject(params).promise();
  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${nomePadrao}`;
  return { nomeOriginal: arquivo, nomeS3: nomePadrao, url, tipo };
}

async function main() {
  const arquivos = fs.readdirSync(pastaImagens).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`Arquivos encontrados na pasta: ${arquivos.length}`);
  if (arquivos.length === 0) {
    console.warn('Nenhum arquivo de imagem (.jpg, .jpeg, .png) encontrado na pasta:', pastaImagens);
    return;
  }
  const resultados = [];
  for (const arquivo of arquivos) {
    try {
      const res = await uploadArquivo(arquivo);
      resultados.push(res);
      console.log(`Enviado: ${arquivo} -> ${res.url}`);
    } catch (err) {
      console.error(`Erro ao enviar ${arquivo}:`, err);
    }
  }
  fs.writeFileSync('imagens_s3.json', JSON.stringify(resultados, null, 2));
  console.log('Upload em lote finalizado. Veja imagens_s3.json para os links.');
}

main();